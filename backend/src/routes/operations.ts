import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { HttpError, wrap } from '../lib/errors';
import { loadCard } from './members';
import { requireStaff } from '../middleware/auth';
import { foodPurchaseSchema, pharmacyPurchaseSchema, redeemSchema, statusSchema } from '../schemas/member';

export const operationsRouter = Router();
operationsRouter.use(requireStaff('cajero', 'admin')); // escáner de carnet en sede

operationsRouter.get('/me', wrap(async (req, res) => {
  res.json({ role: req.staff!.role, siteId: req.staff!.siteId });
}));

// Lista con búsqueda (nombre, mascota, código, cédula, correo) y filtro de estado
operationsRouter.get('/members', wrap(async (req, res) => {
  const q = String(req.query.q ?? '').replace(/[^\p{L}\p{N}@.\- ]/gu, '').trim();
  const status = String(req.query.status ?? '');
  let query = supabase.from('member_card')
    .select('code,status,registered_at,valid_until,full_name,email,phone,national_id,pet_name,species,stamps')
    .order('registered_at', { ascending: false }).limit(200);
  if (['pendiente', 'activa', 'vencida', 'cancelada'].includes(status)) query = query.eq('status', status);
  if (q) {
    const f = ['full_name', 'pet_name', 'code', 'national_id', 'email'].map((c) => `${c}.ilike.%${q}%`).join(',');
    query = query.or(f);
  }
  const { data, error } = await query;
  if (error) throw error;
  res.json(data);
}));

// Historial de una membresía
operationsRouter.get('/members/:code/history', wrap(async (req, res) => {
  const id = await membershipId(req.params.code);
  const [food, pharm, red] = await Promise.all([
    supabase.from('food_purchases')
      .select('id,unit_price,purchased_at,food_presentations(label,food_brands(name))')
      .eq('membership_id', id).order('purchased_at', { ascending: false }),
    supabase.from('pharmacy_purchases').select('id,subtotal,discount,total,purchased_at')
      .eq('membership_id', id).order('purchased_at', { ascending: false }),
    supabase.from('benefit_redemptions').select('id,benefit,redeemed_at')
      .eq('membership_id', id).order('redeemed_at', { ascending: false })
  ]);
  for (const r of [food, pharm, red]) if (r.error) throw r.error;
  res.json({ food: food.data, pharmacy: pharm.data, redemptions: red.data });
}));

// Cambiar estado (solo admin). No se puede activar sin haber tenido 1ª compra.
operationsRouter.patch('/members/:code/status', requireStaff('admin'), wrap(async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  const id = await membershipId(req.params.code);
  const { data: m } = await supabase.from('memberships').select('valid_until').eq('id', id).single();
  if (status === 'activa' && !m?.valid_until) throw new HttpError(409, 'Aún no tiene 1ª compra de alimento: se activa sola al registrarla');
  const { error } = await supabase.from('memberships').update({ status }).eq('id', id);
  if (error) throw error;
  res.json({ ok: true });
}));

// Métricas (solo admin)
operationsRouter.get('/stats', requireStaff('admin'), wrap(async (_req, res) => {
  const count = async (t: string, f?: (q: any) => any) => {
    let q: any = supabase.from(t).select('*', { count: 'exact', head: true });
    if (f) q = f(q);
    const { count: c, error } = await q;
    if (error) throw error;
    return c ?? 0;
  };
  const since = new Date(Date.now() - 29 * 864e5).toISOString();
  const [pend, act, venc, canc, foodN, freeBags, bagsRed, banos, consultas, regs, pharm] = await Promise.all([
    count('memberships', (q) => q.eq('status', 'pendiente')),
    count('memberships', (q) => q.eq('status', 'activa')),
    count('memberships', (q) => q.eq('status', 'vencida')),
    count('memberships', (q) => q.eq('status', 'cancelada')),
    count('food_purchases'),
    count('stamp_cycles', (q) => q.eq('is_open', true).eq('stamps', 5)),
    count('benefit_redemptions', (q) => q.eq('benefit', 'bolsa_gratis')),
    count('benefit_redemptions', (q) => q.eq('benefit', 'bano')),
    count('benefit_redemptions', (q) => q.eq('benefit', 'consulta')),
    supabase.from('memberships').select('registered_at').gte('registered_at', since),
    supabase.from('pharmacy_purchases').select('discount,total')
  ]);
  const perDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) perDay[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;
  for (const r of regs.data ?? []) {
    const d = r.registered_at.slice(0, 10);
    if (d in perDay) perDay[d]++;
  }
  const ph = pharm.data ?? [];
  res.json({
    memberships: { pendiente: pend, activa: act, vencida: venc, cancelada: canc, total: pend + act + venc + canc },
    foodPurchases: foodN,
    freeBagsPending: freeBags,
    redemptions: { bolsa_gratis: bagsRed, bano: banos, consulta: consultas },
    pharmacy: {
      purchases: ph.length,
      revenue: ph.reduce((s, r) => s + Number(r.total), 0),
      discountGiven: ph.reduce((s, r) => s + Number(r.discount), 0)
    },
    registrationsPerDay: Object.entries(perDay).map(([date, n]) => ({ date, n }))
  });
}));

// Consulta de carnet por código (escáner en sede)
operationsRouter.get('/members/:code', wrap(async (req, res) => {
  res.json(await loadCard(req.params.code));
}));

const DISCOUNT = 0.15;

async function membershipId(code: string) {
  const { data } = await supabase.from('memberships').select('id').eq('code', code).maybeSingle();
  if (!data) throw new HttpError(404, 'Membresía no encontrada');
  return data.id as string;
}

// Compra de alimento → suma sello 5+1
operationsRouter.post('/purchases/food', wrap(async (req, res) => {
  const b = foodPurchaseSchema.parse(req.body);
  const { data, error } = await supabase.rpc('record_food_purchase', {
    p_membership: await membershipId(b.membershipCode),
    p_presentation: b.presentationId,
    p_site: req.staff!.siteId,
    p_staff: req.staff!.userId
  });
  if (error) throw error;
  res.status(201).json(data);
}));

// Compra de farmacia → 15% OFF (precios desde BD, no del cliente)
operationsRouter.post('/purchases/pharmacy', wrap(async (req, res) => {
  const b = pharmacyPurchaseSchema.parse(req.body);
  const id = await membershipId(b.membershipCode);

  const { data: m } = await supabase.from('memberships').select('status,valid_until').eq('id', id).single();
  if (m?.status !== 'activa' || new Date(m.valid_until) < new Date()) throw new Error('membership_not_active');

  const { data: products, error } = await supabase.from('pharmacy_products')
    .select('id,normal_price').in('id', b.items.map((i) => i.productId));
  if (error) throw error;
  const price = new Map(products.map((p) => [p.id, Number(p.normal_price)]));
  const subtotal = b.items.reduce((s, i) => {
    const p = price.get(i.productId);
    if (p === undefined) throw new HttpError(400, `Producto inválido: ${i.productId}`);
    return s + p * i.qty;
  }, 0);
  const discount = +(subtotal * DISCOUNT).toFixed(2);

  const { data, error: e2 } = await supabase.from('pharmacy_purchases').insert({
    membership_id: id, subtotal, discount, total: subtotal - discount,
    site_id: req.staff!.siteId, staff_id: req.staff!.userId
  }).select().single();
  if (e2) throw e2;
  res.status(201).json(data);
}));

// Canje: bolsa gratis / baño / consulta
operationsRouter.post('/redemptions', wrap(async (req, res) => {
  const b = redeemSchema.parse(req.body);
  const { data, error } = await supabase.rpc('redeem_benefit', {
    p_membership: await membershipId(b.membershipCode),
    p_benefit: b.benefit,
    p_site: req.staff!.siteId,
    p_staff: req.staff!.userId
  });
  if (error) throw error;
  res.status(201).json({ id: data });
}));
