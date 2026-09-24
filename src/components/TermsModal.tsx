import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#eaf6fd]/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4196c2]" />
            <h3 className="font-heading font-bold text-lg text-[#486377]">
              Términos y Condiciones Petus Go
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-4 text-xs text-slate-600 leading-relaxed overflow-y-auto flex-1">
          <div>
            <h4 className="font-bold text-[#486377] text-sm mb-1">
              1. Membresía y Vigencia
            </h4>
            <p>
              La membresía Petus Go es un programa de beneficios anual administrado por Silveragro. La vigencia es de 365 días a partir de la fecha de registro y activación de la primera compra de alimento seco.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#486377] text-sm mb-1">
              2. Funcionamiento del Plan 5+1
            </h4>
            <p>
              El tutor acumula sellos digitales con la compra de alimento seco para perros o gatos. Para acceder a la bolsa gratis (sexta bolsa), todas las 5 compras previas deben corresponder a la misma marca, línea y tamaño/peso de empaque. Las compras deben registrarse presentando el Carnet Digital Petus Go en cajas o en compras telefónicas/web autorizadas.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#486377] text-sm mb-1">
              3. Descuento del 15% en Farmacia
            </h4>
            <p>
              El descuento del 15% se activa con la primera compra de alimento y permanece activo durante todo el año de vigencia. Aplica para antiparasitarios internos y externos, suplementos, vitaminas y medicamentos veterinarios seleccionados. No es acumulable con otras promociones de liquidación.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#486377] text-sm mb-1">
              4. Sesión de Baño y Consulta Médica
            </h4>
            <p>
              La sesión de baño especializado y la consulta médico veterinaria de cortesía deben agendarse con al menos 48 horas de anticipación en cualquiera de los centros de atención veterinaria Silveragro. Sujeto a disponibilidad de agenda.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#486377] text-sm mb-1">
              5. Privacidad y Tratamiento de Datos
            </h4>
            <p>
              Los datos personales del tutor y de la mascota son tratados bajo estrictos protocolos de confidencialidad conforme a la ley de protección de datos personales. Se utilizarán únicamente para la gestión de beneficios, recordatorios de salud preventiva y avisos del programa.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#73c3e8] hover:bg-[#5db8e2] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Entendido y Acepto
          </button>
        </div>
      </div>
    </div>
  );
};
