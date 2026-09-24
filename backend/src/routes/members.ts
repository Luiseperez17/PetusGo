import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { HttpError, wrap } from '../lib/errors';
import { registerSchema } from '../schemas/member';

export const membersRouter = Router();

async function uploadPhoto(dataUrl: string, petId: string) {
  const [, ext, b64] = dataUrl.match(/^data:image\/(png|jpe?g);base64,(.+)$/)!;
  const path = `${petId}.${ext === 'jpeg' ? 'jpg' : ext}`;
  const { error } = await supabase.storage
    .from('pet-photos')
    .upload(path, Buffer.from(b64, 'base64'), { contentType: `image/${ext}`, upsert: true });
  if (error) throw error;
  return path;
}

// POST /api/members — formulario "¡Únete a Petus Go!"
membersRouter.post('/members', wrap(async (req, res) => {
  const { tutor, mascota, aceptaTerminos: _ } = registerSchema.parse(req.body);

  const { data: terms } = await supabase
    .from('terms_versions').select('id').order('id', { ascending: false }).limit(1).single();
  if (!terms) throw new HttpError(500, 'Sin T&C publicados');

  // Reusar tutor si ya existe (segunda mascota)
  const { data: existing } = await supabase.from('tutors').select('id').eq('national_id', tutor.cedula).maybeSingle();
  let tutorId = existing?.id as string | undefined;
  const tutorIsNew = !tutorId;
  if (!tutorId) {
    const { data, error } = await supabase.from('tutors').insert({
      full_name: tutor.nombreCompleto, email: tutor.correo, phone: tutor.telefono,
      address: tutor.direccion, national_id: tutor.cedula
    }).select('id').single();
    if (error) throw error;
    tutorId = data.id;
  }

  const { data: pet, error: petErr } = await supabase.from('pets').insert({
    tutor_id: tutorId, name: mascota.nombre, species: mascota.especie, sex: mascota.sexo,
    size: mascota.tamano, weight_kg: mascota.peso, age_text: mascota.edad,
    last_deworming: mascota.fechaDesparasitacion, last_vaccine: mascota.fechaVacuna,
    sterilized: mascota.esterilizado ? mascota.esterilizado === 'si' : null
  }).select('id').single();
  if (petErr) {
    if (tutorIsNew) await supabase.from('tutors').delete().eq('id', tutorId); // no dejar tutor huérfano
    if (petErr.code === '23505') throw new HttpError(409, 'Esta mascota ya está registrada para este tutor');
    throw petErr;
  }

  if (mascota.foto) {
    const photo_path = await uploadPhoto(mascota.foto, pet.id);
    await supabase.from('pets').update({ photo_path }).eq('id', pet.id);
  }

  const { data: m, error: mErr } = await supabase.from('memberships')
    .insert({ tutor_id: tutorId, pet_id: pet.id, terms_version_id: terms.id })
    .select('code').single();
  if (mErr) {
    await supabase.from('pets').delete().eq('id', pet.id); // rollback manual
    if (tutorIsNew) await supabase.from('tutors').delete().eq('id', tutorId);
    throw mErr;
  }

  res.status(201).json(await loadCard(m.code));
}));

export async function withPhoto<T extends { photo_path: string | null }>(row: T) {
  const photo_url = row.photo_path
    ? (await supabase.storage.from('pet-photos').createSignedUrl(row.photo_path, 3600)).data?.signedUrl ?? null
    : null;
  return { ...row, photo_url };
}

export async function loadCard(code: string) {
  const { data, error } = await supabase.from('member_card').select('*').eq('code', code).maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(404, 'Membresía no encontrada');
  return withPhoto(data);
}
