import React, { useState } from 'react';
import { MemberProfile } from '../types';
import { ASSETS } from '../constants/assets';
import {
  X,
  Download,
  Share2,
  CheckCircle,
  Sparkles,
  QrCode,
  ShieldCheck,
  Calendar,
  Phone,
  User,
  Heart,
  Scissors,
  Stethoscope,
  Printer
} from 'lucide-react';

interface DigitalCardModalProps {
  member: MemberProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulador: () => void;
}

export const DigitalCardModal: React.FC<DigitalCardModalProps> = ({
  member,
  isOpen,
  onClose,
  onOpenSimulador
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Membresía Petus Go: ${member.id} para ${member.mascota.nombre} (Tutor: ${member.tutor.nombreCompleto})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#eaf6fd]/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-[#486377] uppercase tracking-wider">
              Carnet Digital Petus Go · Miembro Activo
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Printable Digital Card Container */}
          <div
            id="carnet-petusgo-printable"
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#73c3e8] via-[#a1dcf5] to-[#73c3e8] p-6 sm:p-7 text-white shadow-xl border-4 border-white"
          >
            {/* Background Paw Watermark Overlay */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64 text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>

            {/* Card Header: Logos and Member Code */}
            <div className="flex items-center justify-between gap-4 border-b border-white/40 pb-4 relative z-10">
              <img
                src={ASSETS.logoPetusGo}
                alt="Petus Go"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow"
              />

              <div className="text-right">
                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  ID de Membresía
                </div>
                <div className="font-mono text-sm sm:text-base font-black tracking-wider text-white bg-white/20 px-2.5 py-0.5 rounded-lg inline-block shadow-inner">
                  {member.id}
                </div>
              </div>
            </div>

            {/* Card Body: Pet Photo & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center py-5 relative z-10">
              {/* Pet Photo Frame */}
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white/30">
                  <img
                    src={member.mascota.fotoUrl || ASSETS.heroDogAndCat}
                    alt={member.mascota.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-2 text-xs font-extrabold uppercase bg-white/30 px-3 py-0.5 rounded-full text-white">
                  {member.mascota.especie === 'felino' ? '🐱 Felino' : '🐶 Canino'}
                </span>
              </div>

              {/* Pet Information */}
              <div className="sm:col-span-8 space-y-2.5">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white drop-shadow-sm leading-none">
                    {member.mascota.nombre}
                  </h3>
                  <p className="text-xs text-white/90 font-semibold mt-1">
                    {member.mascota.edad || 'Edad no reg.'} · {member.mascota.peso ? `${member.mascota.peso} kg` : 'Peso no reg.'} · Tamaño {member.mascota.tamano || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/30">
                  <div>
                    <span className="text-white/70 block">Tutor Responsable:</span>
                    <span className="font-bold text-white truncate block">
                      {member.tutor.nombreCompleto}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/70 block">Cédula:</span>
                    <span className="font-bold text-white">{member.tutor.cedula || '---'}</span>
                  </div>
                  <div>
                    <span className="text-white/70 block">Última Vacuna:</span>
                    <span className="font-bold text-white">
                      {member.mascota.fechaVacuna || 'Al día'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/70 block">Vigencia Membresía:</span>
                    <span className="font-bold text-white">{member.vigenciaHasta}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer: Active Perks Pills */}
            <div className="pt-3 border-t border-white/40 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white text-[#486377] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-xs text-[11px]">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Plan 5+1 ({member.plan5mas1Compras}/5)
                </span>
                <span className="bg-white text-[#486377] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-xs text-[11px]">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  15% Farmacia Activo
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                <QrCode className="w-4 h-4" />
                <span>Escanear en Sede</span>
              </div>
            </div>
          </div>

          {/* Member Benefits Balance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#73c3e8]/20 flex items-center justify-center text-[#4196c2]">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Baño Gratis</p>
                <p className="text-xs font-extrabold text-[#486377]">1 Sesión Disponible</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Consulta Médica</p>
                <p className="text-xs font-extrabold text-[#486377]">1 Valoración Activa</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Plan 5+1</p>
                <p className="text-xs font-extrabold text-[#486377]">{5 - member.plan5mas1Compras} compras p/ gratis</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Carnet</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? '¡Copiado!' : 'Compartir ID'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSimulador();
                }}
                className="px-4 py-2 bg-[#faeed2] text-[#486377] hover:bg-[#faeed2]/80 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
              >
                Simular Compras 5+1
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#73c3e8] hover:bg-[#5db8e2] text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
