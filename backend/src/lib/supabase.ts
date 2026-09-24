import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { env } from '../config/env';

// Node < 22 no trae WebSocket nativo y el cliente de Supabase lo exige al crearse
// (aunque no usemos realtime). Se le pasa `ws`.
export const newSupabase = (auth: { persistSession: false; autoRefreshToken?: boolean } = { persistSession: false }) =>
  createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth,
    realtime: { transport: WebSocket as any }
  });

// Service role: solo backend. Nunca exponer al frontend.
export const supabase = newSupabase();
