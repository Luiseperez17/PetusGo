import { MemberProfile, RegistroForm } from '../types';

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const fmt = (s?: string | null) => (s ? new Date(s).toLocaleDateString('es-CO') : '');

// Respuesta de member_card (snake_case) → MemberProfile del frontend
function toProfile(c: any, form: RegistroForm): MemberProfile {
  return {
    id: c.code,
    fechaRegistro: fmt(c.registered_at),
    vigenciaHasta: fmt(c.valid_until) || 'Se activa con tu 1ª compra',
    tutor: form.tutor,
    mascota: { ...form.mascota, fotoUrl: c.photo_url ?? form.mascota.fotoUrl },
    plan5mas1Compras: c.stamps,
    descuentoFarmaciaActivo: c.pharmacy_discount_active,
    banoGratisDisponible: c.bath_available,
    consultaMedicaDisponible: c.consult_available
  };
}

export async function registerMember(form: RegistroForm): Promise<MemberProfile> {
  const { fotoUrl, ...mascota } = form.mascota;
  const body = {
    tutor: form.tutor,
    mascota: {
      ...mascota,
      // solo se sube si es archivo local (data URL), no las fotos demo
      ...(fotoUrl?.startsWith('data:') ? { foto: fotoUrl } : {}),
      // el backend rechaza strings vacíos en campos opcionales tipados
      sexo: mascota.sexo || undefined,
      tamano: mascota.tamano || undefined,
      esterilizado: mascota.esterilizado || undefined,
      peso: mascota.peso || undefined
    },
    aceptaTerminos: form.aceptaTerminos
  };

  let res: Response;
  try {
    res = await fetch(`${API}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error('No hay conexión con el servidor. Intenta de nuevo.');
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 400 && Array.isArray(json.details)) {
      const campo = json.details[0]?.path?.slice(-1)[0];
      throw new Error(`Revisa el campo "${campo}": ${json.details[0]?.message ?? 'valor inválido'}`);
    }
    throw new Error(json.error ?? 'No se pudo completar el registro');
  }
  return toProfile(json, form);
}

// ───────── Sesión de cliente (código por correo) ─────────
const TOKEN_KEY = 'petusgo_token';
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const clearSession = () => sessionStorage.removeItem(TOKEN_KEY);

async function call(path: string, init?: RequestInit) {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, init);
  } catch {
    throw new Error('No hay conexión con el servidor. Intenta de nuevo.');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(json.error ?? 'Error inesperado');
    err.status = res.status;
    throw err;
  }
  return json;
}

const post = (path: string, body: unknown) =>
  call(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export const requestCode = (email: string) => post('/auth/request-code', { email });

export async function verifyCode(email: string, code: string) {
  const { accessToken } = await post('/auth/verify', { email, code });
  sessionStorage.setItem(TOKEN_KEY, accessToken);
}

// member_card (snake_case) → MemberProfile
function cardToProfile(c: any): MemberProfile {
  return {
    id: c.code,
    fechaRegistro: fmt(c.registered_at),
    vigenciaHasta: fmt(c.valid_until) || 'Se activa con tu 1ª compra',
    tutor: {
      nombreCompleto: c.full_name,
      correo: c.email,
      telefono: c.phone,
      direccion: c.address,
      cedula: c.national_id
    },
    mascota: {
      nombre: c.pet_name,
      peso: c.weight_kg ? String(c.weight_kg) : '',
      edad: c.age_text ?? '',
      tamano: c.size ?? '',
      especie: c.species,
      sexo: c.sex ?? '',
      fechaDesparasitacion: fmt(c.last_deworming),
      fechaVacuna: fmt(c.last_vaccine),
      esterilizado: c.sterilized === null ? '' : c.sterilized ? 'si' : 'no',
      fotoUrl: c.photo_url ?? undefined
    },
    plan5mas1Compras: c.stamps,
    descuentoFarmaciaActivo: c.pharmacy_discount_active,
    banoGratisDisponible: c.bath_available,
    consultaMedicaDisponible: c.consult_available
  };
}

export async function fetchMyMembers(): Promise<MemberProfile[]> {
  const token = getToken();
  if (!token) throw Object.assign(new Error('No autenticado'), { status: 401 });
  try {
    const cards = await call('/me', { headers: { Authorization: `Bearer ${token}` } });
    return cards.map(cardToProfile);
  } catch (e: any) {
    if (e.status === 401) clearSession();
    throw e;
  }
}
