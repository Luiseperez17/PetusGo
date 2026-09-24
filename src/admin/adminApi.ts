const API = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';
const KEY = 'petusgo_staff';

export interface StaffSession { accessToken: string; role: 'cajero' | 'admin'; email: string }

export const getStaff = (): StaffSession | null => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); } catch { return null; }
};
export const staffLogout = () => sessionStorage.removeItem(KEY);

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function req<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${getStaff()?.accessToken ?? ''}`;
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('No hay conexión con el servidor', 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) staffLogout();
    throw new ApiError(json.error ?? 'Error inesperado', res.status);
  }
  return json as T;
}

export async function staffLogin(email: string, password: string) {
  const s = await req<StaffSession>('/auth/staff-login', { method: 'POST', body: JSON.stringify({ email, password }) }, false);
  sessionStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

export interface MemberRow {
  code: string; status: 'pendiente' | 'activa' | 'vencida' | 'cancelada';
  registered_at: string; valid_until: string | null;
  full_name: string; email: string; phone: string; national_id: string;
  pet_name: string; species: 'canino' | 'felino'; stamps: number;
}
export interface MemberDetail extends MemberRow {
  address: string; sex: string | null; size: string | null; weight_kg: number | null; age_text: string | null;
  last_deworming: string | null; last_vaccine: string | null; sterilized: boolean | null; photo_url: string | null;
  pharmacy_discount_active: boolean; bath_available: boolean; consult_available: boolean;
}
export interface History {
  food: { id: string; unit_price: number; purchased_at: string; food_presentations: { label: string; food_brands: { name: string } } }[];
  pharmacy: { id: string; subtotal: number; discount: number; total: number; purchased_at: string }[];
  redemptions: { id: string; benefit: 'bolsa_gratis' | 'bano' | 'consulta'; redeemed_at: string }[];
}
export interface Stats {
  memberships: Record<'pendiente' | 'activa' | 'vencida' | 'cancelada' | 'total', number>;
  foodPurchases: number; freeBagsPending: number;
  redemptions: Record<'bolsa_gratis' | 'bano' | 'consulta', number>;
  pharmacy: { purchases: number; revenue: number; discountGiven: number };
  registrationsPerDay: { date: string; n: number }[];
}
export interface Catalog {
  brands: { id: string; name: string; food_presentations: { id: string; label: string; base_price: number }[] }[];
  pharmacyProducts: { id: string; name: string; category: string; normal_price: number }[];
}

export const api = {
  members: (q: string, status: string) =>
    req<MemberRow[]>(`/staff/members?q=${encodeURIComponent(q)}&status=${status}`),
  member: (code: string) => req<MemberDetail>(`/staff/members/${code}`),
  history: (code: string) => req<History>(`/staff/members/${code}/history`),
  stats: () => req<Stats>('/staff/stats'),
  catalog: () => req<Catalog>('/catalog', {}, false),
  foodPurchase: (membershipCode: string, presentationId: string) =>
    req('/staff/purchases/food', { method: 'POST', body: JSON.stringify({ membershipCode, presentationId }) }),
  pharmacyPurchase: (membershipCode: string, items: { productId: string; qty: number }[]) =>
    req('/staff/purchases/pharmacy', { method: 'POST', body: JSON.stringify({ membershipCode, items }) }),
  redeem: (membershipCode: string, benefit: string) =>
    req('/staff/redemptions', { method: 'POST', body: JSON.stringify({ membershipCode, benefit }) }),
  setStatus: (code: string, status: string) =>
    req(`/staff/members/${code}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};
