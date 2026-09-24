import React, { useCallback, useEffect, useState } from 'react';
import { LogOut, Search, LayoutDashboard, Users, X, Loader2, RefreshCw } from 'lucide-react';
import {
  api, getStaff, staffLogin, staffLogout,
  type Catalog, type History, type MemberDetail, type MemberRow, type StaffSession, type Stats
} from './adminApi';

const STATUS_STYLE: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700',
  activa: 'bg-emerald-100 text-emerald-700',
  vencida: 'bg-slate-200 text-slate-600',
  cancelada: 'bg-rose-100 text-rose-700'
};
const BENEFIT_LABEL = { bolsa_gratis: 'Bolsa gratis', bano: 'Baño', consulta: 'Consulta' } as const;
const money = (n: number) => `$${n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (s?: string | null) => (s ? new Date(s).toLocaleDateString('es-CO') : '—');
const msg = (e: unknown) => (e instanceof Error ? e.message : 'Error inesperado');

const Badge = ({ s }: { s: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${STATUS_STYLE[s]}`}>{s}</span>
);

// ───────── Login ─────────
function Login({ onLogin }: { onLogin: (s: StaffSession) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { onLogin(await staffLogin(email, password)); } catch (err) { setError(msg(err)); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf6fd] p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-4">
        <h1 className="font-heading font-extrabold text-2xl text-[#486377]">Panel Petus Go</h1>
        <p className="text-xs text-slate-500">Acceso para personal de Silveragro.</p>
        <input type="email" required placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-slate-300 py-2 text-sm focus:outline-none focus:border-[#73c3e8]" />
        <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b border-slate-300 py-2 text-sm focus:outline-none focus:border-[#73c3e8]" />
        {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
        <button disabled={loading} className="w-full py-3 bg-[#73c3e8] hover:bg-[#5db8e2] text-white font-bold rounded-xl disabled:opacity-50 flex justify-center gap-2 cursor-pointer">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Entrar
        </button>
      </form>
    </div>
  );
}

// ───────── Métricas ─────────
function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.stats().then(setS).catch((e) => setError(msg(e))); }, []);
  if (error) return <p className="text-sm text-rose-600 font-bold">{error}</p>;
  if (!s) return <Loader2 className="w-5 h-5 animate-spin text-slate-400" />;

  const tiles: [string, string | number][] = [
    ['Inscritos', s.memberships.total],
    ['Pendientes', s.memberships.pendiente],
    ['Activas', s.memberships.activa],
    ['Compras de alimento', s.foodPurchases],
    ['Bolsas gratis por canjear', s.freeBagsPending],
    ['Bolsas / baños / consultas canjeados', `${s.redemptions.bolsa_gratis} / ${s.redemptions.bano} / ${s.redemptions.consulta}`],
    ['Ventas farmacia', money(s.pharmacy.revenue)],
    ['Descuento otorgado (15%)', money(s.pharmacy.discountGiven)]
  ];
  const max = Math.max(1, ...s.registrationsPerDay.map((d) => d.n));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map(([label, v]) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-[11px] text-slate-500">{label}</p>
            <p className="font-heading font-extrabold text-2xl text-[#486377] mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-xs font-bold text-[#486377] mb-3">Inscripciones, últimos 30 días</p>
        <div className="flex items-end gap-1 h-28">
          {s.registrationsPerDay.map((d) => (
            <div key={d.date} title={`${d.date}: ${d.n}`} className="flex-1 bg-[#73c3e8] rounded-t"
              style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 4 : 1, opacity: d.n ? 1 : 0.25 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────── Detalle de miembro ─────────
function MemberPanel({ code, role, catalog, onClose, onChanged }: {
  code: string; role: string; catalog: Catalog | null; onClose: () => void; onChanged: () => void;
}) {
  const [m, setM] = useState<MemberDetail | null>(null);
  const [h, setH] = useState<History | null>(null);
  const [brandId, setBrandId] = useState('');
  const [presId, setPresId] = useState('');
  const [qty, setQty] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const [mm, hh] = await Promise.all([api.member(code), api.history(code)]);
    setM(mm); setH(hh);
  }, [code]);
  useEffect(() => { load().catch((e) => setNote({ ok: false, text: msg(e) })); }, [load]);

  const act = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(true); setNote(null);
    try { await fn(); await load(); onChanged(); setNote({ ok: true, text: `${label}: listo` }); }
    catch (e) { setNote({ ok: false, text: msg(e) }); }
    finally { setBusy(false); }
  };

  const items = Object.entries(qty).filter(([, q]) => q > 0).map(([productId, q]) => ({ productId, qty: q }));
  const subtotal = items.reduce((s, i) => s + (catalog?.pharmacyProducts.find((p) => p.id === i.productId)?.normal_price ?? 0) * i.qty, 0);
  const brand = catalog?.brands.find((b) => b.id === brandId);
  const canOperate = m && (m.status === 'activa' || m.status === 'pendiente');

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40">
      <aside className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-slate-400">{code}</p>
            <h2 className="font-heading font-extrabold text-xl text-[#486377]">{m ? `${m.pet_name} · ${m.full_name}` : 'Cargando…'}</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {note && <p className={`text-xs font-bold ${note.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{note.text}</p>}

        {m && h && (
          <>
            <section className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2 flex items-center gap-3">
                {m.photo_url && <img src={m.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                <div className="space-y-1"><Badge s={m.status} /><p className="text-slate-500">Vigencia: {date(m.valid_until)}</p></div>
              </div>
              <p><b>Correo:</b> {m.email}</p><p><b>Tel:</b> {m.phone}</p>
              <p><b>Cédula:</b> {m.national_id}</p><p><b>Dirección:</b> {m.address}</p>
              <p><b>Mascota:</b> {m.species}, {m.sex ?? '—'}, {m.size ?? '—'}</p>
              <p><b>Peso/edad:</b> {m.weight_kg ?? '—'} kg · {m.age_text ?? '—'}</p>
              <p><b>Desparasitación:</b> {date(m.last_deworming)}</p><p><b>Vacuna:</b> {date(m.last_vaccine)}</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#486377]">Plan 5+1 · sellos {m.stamps}/5</h3>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => <div key={n} className={`h-2 flex-1 rounded ${n <= m.stamps ? 'bg-[#73c3e8]' : 'bg-slate-200'}`} />)}
              </div>
              {canOperate && (
                <div className="flex flex-wrap gap-2 items-center">
                  <select value={brandId} onChange={(e) => { setBrandId(e.target.value); setPresId(''); }} className="border rounded-lg px-2 py-1.5 text-xs">
                    <option value="">Marca…</option>
                    {catalog?.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <select value={presId} onChange={(e) => setPresId(e.target.value)} className="border rounded-lg px-2 py-1.5 text-xs" disabled={!brand}>
                    <option value="">Presentación…</option>
                    {brand?.food_presentations.map((p) => <option key={p.id} value={p.id}>{p.label} · {money(Number(p.base_price))}</option>)}
                  </select>
                  <button disabled={busy || !presId} onClick={() => act('Compra de alimento', () => api.foodPurchase(code, presId))}
                    className="px-3 py-1.5 bg-[#73c3e8] text-white text-xs font-bold rounded-lg disabled:opacity-40 cursor-pointer">Registrar compra</button>
                </div>
              )}
            </section>

            {m.status === 'activa' && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#486377]">Farmacia (15% OFF)</h3>
                <div className="space-y-1 max-h-44 overflow-y-auto">
                  {catalog?.pharmacyProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs gap-2">
                      <span className="truncate">{p.name} <span className="text-slate-400">{money(Number(p.normal_price))}</span></span>
                      <input type="number" min={0} value={qty[p.id] ?? 0} onChange={(e) => setQty({ ...qty, [p.id]: Math.max(0, Number(e.target.value)) })}
                        className="w-14 border rounded px-1 py-0.5 text-right" />
                    </div>
                  ))}
                </div>
                {items.length > 0 && (
                  <p className="text-xs text-slate-600">Subtotal {money(subtotal)} · descuento {money(subtotal * 0.15)} · <b>Total {money(subtotal * 0.85)}</b></p>
                )}
                <button disabled={busy || !items.length} onClick={() => act('Compra de farmacia', async () => { await api.pharmacyPurchase(code, items); setQty({}); })}
                  className="px-3 py-1.5 bg-[#73c3e8] text-white text-xs font-bold rounded-lg disabled:opacity-40 cursor-pointer">Registrar compra farmacia</button>
              </section>
            )}

            {m.status === 'activa' && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#486377]">Canjear beneficio</h3>
                <div className="flex flex-wrap gap-2">
                  {([['bolsa_gratis', m.stamps === 5], ['bano', m.bath_available], ['consulta', m.consult_available]] as const).map(([b, ok]) => (
                    <button key={b} disabled={busy || !ok} onClick={() => act(BENEFIT_LABEL[b], () => api.redeem(code, b))}
                      className="px-3 py-1.5 border border-[#486377] text-[#486377] text-xs font-bold rounded-lg disabled:opacity-30 hover:bg-[#486377] hover:text-white cursor-pointer">
                      {BENEFIT_LABEL[b]}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {role === 'admin' && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#486377]">Estado (admin)</h3>
                <select value={m.status} disabled={busy} onChange={(e) => act('Estado', () => api.setStatus(code, e.target.value))} className="border rounded-lg px-2 py-1.5 text-xs">
                  {['pendiente', 'activa', 'vencida', 'cancelada'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </section>
            )}

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#486377]">Historial</h3>
              <ul className="text-xs space-y-1 text-slate-600">
                {[
                  ...h.food.map((f) => ({ t: f.purchased_at, x: `Alimento · ${f.food_presentations.food_brands.name} ${f.food_presentations.label} · ${money(Number(f.unit_price))}` })),
                  ...h.pharmacy.map((p) => ({ t: p.purchased_at, x: `Farmacia · total ${money(Number(p.total))} (desc. ${money(Number(p.discount))})` })),
                  ...h.redemptions.map((r) => ({ t: r.redeemed_at, x: `Canje · ${BENEFIT_LABEL[r.benefit]}` }))
                ].sort((a, b) => b.t.localeCompare(a.t)).map((e, i) => (
                  <li key={i}><span className="text-slate-400">{new Date(e.t).toLocaleString('es-CO')}</span> — {e.x}</li>
                ))}
                {!h.food.length && !h.pharmacy.length && !h.redemptions.length && <li className="text-slate-400">Sin movimientos.</li>}
              </ul>
            </section>
          </>
        )}
      </aside>
    </div>
  );
}

// ───────── Inscripciones ─────────
function Members({ role, catalog }: { role: string; catalog: Catalog | null }) {
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true); setError('');
    api.members(q, status).then(setRows).catch((e) => setError(msg(e))).finally(() => setLoading(false));
  }, [q, status]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre, mascota, código, cédula, correo…" className="w-full text-sm focus:outline-none" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="">Todos</option>
          {['pendiente', 'activa', 'vencida', 'cancelada'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={load} aria-label="Recargar" className="p-2 border border-slate-200 rounded-xl bg-white cursor-pointer"><RefreshCw className="w-4 h-4 text-slate-500" /></button>
      </div>

      {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-left text-slate-400 border-b">
            <tr>{['Código', 'Tutor', 'Mascota', 'Contacto', 'Estado', 'Sellos', 'Registro'].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} onClick={() => setSelected(r.code)} className="border-b last:border-0 hover:bg-[#eaf6fd]/50 cursor-pointer">
                <td className="px-3 py-2 font-mono">{r.code}</td>
                <td className="px-3 py-2">{r.full_name}<br /><span className="text-slate-400">{r.national_id}</span></td>
                <td className="px-3 py-2">{r.pet_name} <span className="text-slate-400">({r.species})</span></td>
                <td className="px-3 py-2">{r.email}<br /><span className="text-slate-400">{r.phone}</span></td>
                <td className="px-3 py-2"><Badge s={r.status} /></td>
                <td className="px-3 py-2">{r.stamps}/5</td>
                <td className="px-3 py-2">{date(r.registered_at)}</td>
              </tr>
            ))}
            {!loading && !rows.length && <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400">Sin resultados.</td></tr>}
          </tbody>
        </table>
        {loading && <div className="p-3"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>}
      </div>

      {selected && <MemberPanel code={selected} role={role} catalog={catalog} onClose={() => setSelected(null)} onChanged={load} />}
    </div>
  );
}

// ───────── Shell ─────────
export default function AdminApp() {
  const [session, setSession] = useState<StaffSession | null>(getStaff());
  const [tab, setTab] = useState<'members' | 'stats'>('members');
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => { if (session) api.catalog().then(setCatalog).catch(() => {}); }, [session]);
  // Si un request devuelve 401 la sesión se borra; al volver a enfocar la pestaña se revalida
  useEffect(() => {
    const check = () => setSession(getStaff());
    window.addEventListener('focus', check);
    return () => window.removeEventListener('focus', check);
  }, []);

  if (!session) return <Login onLogin={setSession} />;

  return (
    <div className="min-h-screen bg-slate-50 text-[#364958]">
      <header className="bg-[#364958] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="font-heading font-extrabold">Panel Petus Go</span>
          <nav className="flex gap-1">
            <button onClick={() => setTab('members')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${tab === 'members' ? 'bg-[#73c3e8]' : 'hover:bg-white/10'}`}><Users className="w-3.5 h-3.5" />Inscripciones</button>
            {session.role === 'admin' && (
              <button onClick={() => setTab('stats')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${tab === 'stats' ? 'bg-[#73c3e8]' : 'hover:bg-white/10'}`}><LayoutDashboard className="w-3.5 h-3.5" />Métricas</button>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-300">{session.email} · {session.role}</span>
          <button onClick={() => { staffLogout(); setSession(null); }} className="flex items-center gap-1 hover:text-[#faeed2] cursor-pointer"><LogOut className="w-3.5 h-3.5" />Salir</button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {tab === 'members' || session.role !== 'admin' ? <Members role={session.role} catalog={catalog} /> : <Dashboard />}
      </main>
    </div>
  );
}
