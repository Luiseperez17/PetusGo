import React, { useState, useRef } from 'react';
import { ASSETS } from '../constants/assets';
import { DEMO_PET_PHOTOS } from '../constants/data';
import { RegistroForm, MemberProfile } from '../types';
import { registerMember } from '../lib/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface RegistrationSectionProps {
  onSuccessRegister: (profile: MemberProfile) => void;
  onOpenTerms: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onSuccessRegister,
  onOpenTerms
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State matching all fields in screenshot
  const [formData, setFormData] = useState<RegistroForm>({
    tutor: {
      nombreCompleto: '',
      correo: '',
      telefono: '',
      direccion: '',
      cedula: ''
    },
    mascota: {
      nombre: '',
      peso: '',
      edad: '',
      tamano: '',
      especie: '',
      sexo: '',
      fechaDesparasitacion: '',
      fechaVacuna: '',
      esterilizado: '',
      fotoUrl: ''
    },
    aceptaTerminos: false
  });

  const [previewPhoto, setPreviewPhoto] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTutorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      tutor: { ...prev.tutor, [name]: value }
    }));
  };

  const handleMascotaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      mascota: { ...prev.mascota, [name]: value }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('La imagen supera el límite de 5MB. Por favor sube una imagen más ligera.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewPhoto(result);
        setFormData((prev) => ({
          ...prev,
          mascota: { ...prev.mascota, fotoUrl: result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectDemoPhoto = (url: string) => {
    setPreviewPhoto(url);
    setFormData((prev) => ({
      ...prev,
      mascota: { ...prev.mascota, fotoUrl: url }
    }));
  };

  // Auto fill demo test button for speedy evaluation
  const handleAutoFillDemo = () => {
    const demo = {
      tutor: {
        nombreCompleto: 'Laura Valencia Gómez',
        correo: 'laura.valencia@ejemplo.com',
        telefono: '+57 314 892 3410',
        direccion: 'Calle 10 #24-50, Apto 402',
        cedula: '1037648291'
      },
      mascota: {
        nombre: 'Kira',
        peso: '14.2',
        edad: '2 años',
        tamano: 'mediano' as const,
        especie: 'canino' as const,
        sexo: 'hembra' as const,
        fechaDesparasitacion: '15/08/2025',
        fechaVacuna: '02/05/2025',
        esterilizado: 'si' as const,
        fotoUrl: DEMO_PET_PHOTOS[1].url
      },
      aceptaTerminos: true
    };
    setFormData(demo);
    setPreviewPhoto(demo.mascota.fotoUrl);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.aceptaTerminos) {
      setErrorMsg('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    if (!formData.tutor.nombreCompleto || !formData.tutor.correo) {
      setErrorMsg('Por favor completa los datos obligatorios del tutor.');
      return;
    }

    if (!formData.mascota.nombre) {
      setErrorMsg('Por favor escribe el nombre de tu mascota.');
      return;
    }

    setIsSubmitting(true);
    try {
      const member = await registerMember(formData);
      onSuccessRegister(member);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo completar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registro" className="py-16 md:py-24 bg-gradient-to-b from-white to-[#eaf6fd]/60 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header Registration Title */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eaf6fd] text-[#4196c2] rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membresía Petus Go</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#486377]">
            ¡Únete a Petus Go!
          </h2>

          <p className="text-sm md:text-base text-slate-500 font-normal">
            Regístrate y empieza a disfrutar.
          </p>

          <div className="flex justify-center pt-1 text-[#486377]">
            <ChevronDown className="w-6 h-6 animate-bounce stroke-[2.5]" />
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-[11px] text-[#4196c2] hover:underline font-bold bg-white/80 px-3 py-1 rounded-full border border-[#a1dcf5] cursor-pointer"
            >
              ✨ Rellenar con datos de prueba
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form Dual-Panel Card */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Registration Card Container */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-12">
            {/* Left Panel: Tutor Information (Blue background) */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#73c3e8] to-[#a1dcf5] p-7 sm:p-9 text-white space-y-6">
              <div className="border-b-2 border-white/60 pb-2">
                <h3 className="font-heading font-bold text-xl md:text-2xl text-white">
                  Información del tutor
                </h3>
              </div>

              {/* Field: Nombre completo */}
              <div className="relative flex items-center border-b border-white/70 py-2 focus-within:border-white transition-colors">
                <User className="w-5 h-5 text-white/90 mr-3 shrink-0" />
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.tutor.nombreCompleto}
                  onChange={handleTutorChange}
                  placeholder="Nombre completo"
                  required
                  className="input-tutor w-full bg-transparent border-none p-0 text-white placeholder-white/80 focus:ring-0 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Field: Correo */}
              <div className="relative flex items-center border-b border-white/70 py-2 focus-within:border-white transition-colors">
                <Mail className="w-5 h-5 text-white/90 mr-3 shrink-0" />
                <input
                  type="email"
                  name="correo"
                  value={formData.tutor.correo}
                  onChange={handleTutorChange}
                  placeholder="Correo"
                  required
                  className="input-tutor w-full bg-transparent border-none p-0 text-white placeholder-white/80 focus:ring-0 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Field: Teléfono */}
              <div className="relative flex items-center border-b border-white/70 py-2 focus-within:border-white transition-colors">
                <Phone className="w-5 h-5 text-white/90 mr-3 shrink-0" />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.tutor.telefono}
                  onChange={handleTutorChange}
                  placeholder="Teléfono"
                  required
                  className="input-tutor w-full bg-transparent border-none p-0 text-white placeholder-white/80 focus:ring-0 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Field: Dirección */}
              <div className="relative flex items-center border-b border-white/70 py-2 focus-within:border-white transition-colors">
                <MapPin className="w-5 h-5 text-white/90 mr-3 shrink-0" />
                <input
                  type="text"
                  name="direccion"
                  value={formData.tutor.direccion}
                  onChange={handleTutorChange}
                  placeholder="Dirección"
                  required
                  className="input-tutor w-full bg-transparent border-none p-0 text-white placeholder-white/80 focus:ring-0 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Field: Cédula */}
              <div className="relative flex items-center border-b border-white/70 py-2 focus-within:border-white transition-colors">
                <CreditCard className="w-5 h-5 text-white/90 mr-3 shrink-0" />
                <input
                  type="text"
                  name="cedula"
                  value={formData.tutor.cedula}
                  onChange={handleTutorChange}
                  placeholder="Cédula"
                  required
                  className="input-tutor w-full bg-transparent border-none p-0 text-white placeholder-white/80 focus:ring-0 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Tutor Badge Info */}
              <div className="pt-4 text-[11px] text-white/90 leading-relaxed bg-white/10 p-3 rounded-xl">
                Tus datos quedan vinculados a tu membresía anual para redimir descuentos en cualquiera de nuestras sedes.
              </div>
            </div>

            {/* Right Panel: Pet History (Light neutral background) */}
            <div className="md:col-span-7 bg-white p-7 sm:p-9 space-y-6">
              <div className="border-b-2 border-[#486377]/25 pb-2">
                <h3 className="font-heading font-bold text-xl md:text-2xl text-[#486377]">
                  Historia de la mascota
                </h3>
              </div>

              {/* Field: Nombre mascota */}
              <div className="relative flex items-center border-b border-slate-300 py-2 focus-within:border-[#73c3e8] transition-colors">
                {/* Pet paw outline icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-slate-400 mr-3 shrink-0"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <input
                  type="text"
                  name="nombre"
                  value={formData.mascota.nombre}
                  onChange={handleMascotaChange}
                  placeholder="Nombre mascota"
                  required
                  className="input-mascota w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Row 3 cols: Peso, Edad, Tamaño */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Peso */}
                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <input
                    type="number"
                    step="0.1"
                    name="peso"
                    value={formData.mascota.peso}
                    onChange={handleMascotaChange}
                    placeholder="Peso(kg)"
                    className="input-mascota w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-medium focus:outline-none"
                  />
                </div>

                {/* Edad */}
                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <input
                    type="text"
                    name="edad"
                    value={formData.mascota.edad}
                    onChange={handleMascotaChange}
                    placeholder="Edad"
                    className="input-mascota w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-medium focus:outline-none"
                  />
                </div>

                {/* Tamaño */}
                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <select
                    name="tamano"
                    value={formData.mascota.tamano}
                    onChange={handleMascotaChange}
                    className="w-full bg-transparent border-none p-0 text-slate-600 focus:ring-0 text-sm font-medium cursor-pointer focus:outline-none"
                  >
                    <option value="" disabled>
                      Tamaño ⌵
                    </option>
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>

              {/* Row 2 cols: Especie, Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Especie */}
                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <select
                    name="especie"
                    value={formData.mascota.especie}
                    onChange={handleMascotaChange}
                    className="w-full bg-transparent border-none p-0 text-slate-600 focus:ring-0 text-sm font-medium cursor-pointer focus:outline-none"
                  >
                    <option value="" disabled>
                      Especie ⌵
                    </option>
                    <option value="canino">Canino (Perro)</option>
                    <option value="felino">Felino (Gato)</option>
                  </select>
                </div>

                {/* Sexo */}
                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <select
                    name="sexo"
                    value={formData.mascota.sexo}
                    onChange={handleMascotaChange}
                    className="w-full bg-transparent border-none p-0 text-slate-600 focus:ring-0 text-sm font-medium cursor-pointer focus:outline-none"
                  >
                    <option value="" disabled>
                      Sexo ⌵
                    </option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
              </div>

              {/* Fechas: Última desparasitación & Última vacuna */}
              <div className="space-y-4 pt-1">
                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <label className="block text-xs text-slate-400 mb-0.5">
                    Fecha de última desparasitación
                  </label>
                  <input
                    type="text"
                    name="fechaDesparasitacion"
                    value={formData.mascota.fechaDesparasitacion}
                    onChange={handleMascotaChange}
                    placeholder="dd/mm/aaaa"
                    className="input-mascota w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm focus:outline-none"
                  />
                </div>

                <div className="border-b border-slate-300 py-1.5 focus-within:border-[#73c3e8] transition-colors">
                  <label className="block text-xs text-slate-400 mb-0.5">
                    Fecha de última vacuna
                  </label>
                  <input
                    type="text"
                    name="fechaVacuna"
                    value={formData.mascota.fechaVacuna}
                    onChange={handleMascotaChange}
                    placeholder="dd/mm/aaaa"
                    className="input-mascota w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Esterilizado: Radio buttons */}
              <div className="pt-2 flex items-center gap-6">
                <span className="text-xs text-slate-600 font-semibold">Esterilizado:</span>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="radio"
                    name="esterilizado"
                    value="si"
                    checked={formData.mascota.esterilizado === 'si'}
                    onChange={handleMascotaChange}
                    className="text-[#73c3e8] focus:ring-[#73c3e8] border-slate-300"
                  />
                  <span>Sí</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="radio"
                    name="esterilizado"
                    value="no"
                    checked={formData.mascota.esterilizado === 'no'}
                    onChange={handleMascotaChange}
                    className="text-[#73c3e8] focus:ring-[#73c3e8] border-slate-300"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lower Section: Photo Upload & Terms/Submit */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            {/* Photo Upload Card */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs bg-gradient-to-b from-[#a1dcf5] to-[#73c3e8] p-5 rounded-3xl shadow-md flex flex-col items-center justify-center text-white cursor-pointer hover:opacity-95 transition-opacity relative group overflow-hidden"
              >
                {previewPhoto ? (
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-inner border-2 border-white mb-2">
                    <img
                      src={previewPhoto}
                      alt="Previsualización de la mascota"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold">
                      Cambiar foto
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={ASSETS.cameraUpload}
                      alt="Icono Cámara"
                      className="w-20 h-auto mb-2 drop-shadow-sm transition-transform group-hover:scale-105"
                    />
                    <p className="font-heading font-bold text-sm text-white drop-shadow-sm leading-snug">
                      Sube una foto <br />
                      de tu mascota
                    </p>
                  </>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                Formatos: JPG, PNG. <br />
                Tamaño máximo: 5MB
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-1.5 border border-[#486377] text-[#486377] rounded-md text-xs font-bold hover:bg-[#486377] hover:text-white transition-colors uppercase cursor-pointer"
                >
                  {previewPhoto ? 'Reemplazar' : 'Subir'}
                </button>
              </div>

              {/* Demo Pet Photo picker shortcuts */}
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>O elige una demo:</span>
                {DEMO_PET_PHOTOS.map((demo) => (
                  <button
                    key={demo.name}
                    type="button"
                    onClick={() => handleSelectDemoPhoto(demo.url)}
                    className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 hover:scale-115 transition-transform cursor-pointer"
                    title={demo.name}
                  >
                    <img src={demo.url} alt={demo.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Terms and Submit Column */}
            <div className="md:col-span-7 space-y-6 flex flex-col justify-center items-start md:pl-6">
              {/* Checkbox Terms */}
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.aceptaTerminos}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, aceptaTerminos: e.target.checked }))
                  }
                  required
                  className="rounded text-[#73c3e8] focus:ring-[#73c3e8] border-[#73c3e8] w-5 h-5 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-[#486377] font-semibold">
                  Estoy de acuerdo con los{' '}
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="underline hover:text-[#364958] font-bold cursor-pointer inline"
                  >
                    términos y condiciones
                  </button>
                </span>
              </label>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 bg-[#73c3e8] hover:bg-[#5db8e2] text-white font-heading font-extrabold text-sm tracking-wider rounded-xl shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all duration-200 uppercase cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generando carnet...</span>
                    </>
                  ) : (
                    <span>Enviar</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Generación instantánea de tu Carnet Digital Petus Go</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
