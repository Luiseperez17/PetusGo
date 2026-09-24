import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { supabase } from '../lib/supabase';
import { HttpError, wrap } from '../lib/errors';
import { requireCustomer } from '../middleware/auth';
import { requestCodeSchema, staffLoginSchema, verifyCodeSchema } from '../schemas/member';
import { withPhoto } from './members';

export const authRouter = Router();

// Cliente desechable: signIn/verify guardan sesión en el cliente y contaminarían el compartido (service_role).
const authClient = () =>
  createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

// 1) Pide código. Siempre 200 (no revela si el correo existe); solo envía si es tutor registrado.
authRouter.post('/auth/request-code', wrap(async (req, res) => {
  const { email } = requestCodeSchema.parse(req.body);
  const { data } = await supabase.from('tutors').select('id').eq('email', email).maybeSingle();
  if (data) {
    const { error } = await authClient().auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) console.error('OTP error:', error.message);
  }
  res.json({ ok: true });
}));

// 2) Verifica código → token de sesión
authRouter.post('/auth/verify', wrap(async (req, res) => {
  const { email, code } = verifyCodeSchema.parse(req.body);
  const { data, error } = await authClient().auth.verifyOtp({ email, token: code, type: 'email' });
  if (error || !data.session) throw new HttpError(401, 'Código inválido o vencido');
  res.json({ accessToken: data.session.access_token, expiresIn: data.session.expires_in });
}));

// Carnets del cliente autenticado (uno por mascota)
authRouter.get('/me', requireCustomer, wrap(async (req, res) => {
  const { data, error } = await supabase.from('member_card').select('*')
    .eq('email', req.customer!.email).order('registered_at');
  if (error) throw error;
  res.json(await Promise.all(data.map(withPhoto)));
}));

// Login de staff (correo + contraseña de Supabase Auth). Exige fila en staff_profiles.
authRouter.post('/auth/staff-login', wrap(async (req, res) => {
  const { email, password } = staffLoginSchema.parse(req.body);
  const { data, error } = await authClient().auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new HttpError(401, 'Credenciales inválidas');
  const { data: prof } = await supabase.from('staff_profiles').select('role').eq('user_id', data.user.id).maybeSingle();
  if (!prof) throw new HttpError(403, 'Este usuario no tiene acceso al panel');
  res.json({ accessToken: data.session.access_token, role: prof.role, email });
}));
