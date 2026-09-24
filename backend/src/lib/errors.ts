import type { NextFunction, Request, RequestHandler, Response } from 'express';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => fn(req, res).catch(next);

// Mapea excepciones de las funciones SQL a HTTP
const PG_ERRORS: Record<string, [number, string]> = {
  membership_not_found: [404, 'Membresía no encontrada'],
  membership_not_active: [409, 'Membresía inactiva o vencida'],
  presentation_not_found: [404, 'Presentación no encontrada'],
  free_bag_pending: [409, 'Bolsa gratis pendiente de canje'],
  no_free_bag: [409, 'Aún no hay bolsa gratis disponible']
};

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err?.name === 'ZodError') return res.status(400).json({ error: 'Datos inválidos', details: err.issues });
  const mapped = PG_ERRORS[err?.message];
  if (mapped) return res.status(mapped[0]).json({ error: mapped[1] });
  if (err?.code === '23505') return res.status(409).json({ error: 'Registro duplicado (correo, cédula o beneficio ya usado)' });
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
}
