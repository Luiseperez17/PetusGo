import type { RequestHandler } from 'express';
import { supabase } from '../lib/supabase';
import { HttpError } from '../lib/errors';

declare global {
  namespace Express {
    interface Request {
      customer?: { email: string };
      staff?: { userId: string; role: 'cajero' | 'admin'; siteId: string | null };
    }
  }
}

// Valida JWT de Supabase Auth y carga el perfil de staff.
export const requireStaff =
  (...roles: Array<'cajero' | 'admin'>): RequestHandler =>
  async (req, _res, next) => {
    try {
      const token = req.headers.authorization?.replace(/^Bearer /, '');
      if (!token) throw new HttpError(401, 'No autenticado');
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) throw new HttpError(401, 'Token inválido');

      const { data: prof } = await supabase
        .from('staff_profiles')
        .select('role, site_id')
        .eq('user_id', data.user.id)
        .single();
      if (!prof || (roles.length && !roles.includes(prof.role))) throw new HttpError(403, 'Sin permisos');

      req.staff = { userId: data.user.id, role: prof.role, siteId: prof.site_id };
      next();
    } catch (e) {
      next(e);
    }
  };

// Cliente autenticado por código de correo (Supabase Auth OTP)
export const requireCustomer: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token) throw new HttpError(401, 'No autenticado');
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user?.email) throw new HttpError(401, 'Sesión inválida o vencida');
    req.customer = { email: data.user.email.toLowerCase() };
    next();
  } catch (e) {
    next(e);
  }
};
