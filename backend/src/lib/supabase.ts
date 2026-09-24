import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Service role: solo backend. Nunca exponer al frontend.
export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false }
});
