import React from 'react';
import { ASSETS } from '../constants/assets';
import { X, CheckCircle, Calendar, ArrowRight, Shield } from 'lucide-react';

interface BenefitsModalProps {
  benefitId: 'alimento' | 'farmacia' | 'bano' | 'consulta' | null;
  onClose: () => void;
  onGoToRegister: () => void;
}

export const BenefitsModal: React.FC<BenefitsModalProps> = ({
  benefitId,
  onClose,
  onGoToRegister
}) => {
  if (!benefitId) return null;

  const contentMap = {
    alimento: {
      title: 'Nutrición Premium & Plan 5+1',
      icon: ASSETS.iconAlimento,
      subtitle: 'Las mejores marcas con recompensa en cada compra para tu perro o gato.',
      highlights: [
        'Aplica en marcas líderes: Royal Canin, Hill’s Science Diet, Pro Plan, Taste of the Wild y Monge.',
        'Por cada 5 compras del mismo peso y marca, tu sexta bolsa es 100% gratuita.',
        'Asesoría nutricional personalizada según raza, edad y condición médica.',
        'Entrega a domicilio sin costo adicional en zonas de cobertura Silveragro.'
      ]
    },
    farmacia: {
      title: '15% Descuento Permanente en Farmacia',
      icon: ASSETS.iconFarmacia,
      subtitle: 'Salud preventiva accesible durante los 365 días del año.',
      highlights: [
        'Descuento directo e ilimitado en antiparasitarios internos y externos (Bravecto, NexGard, etc.).',
        'Suplementos articulares, vitaminas y ácidos grasos Omega 3 y 6 con precio preferencial.',
        'Medicamentos bajo prescripción médica veterinaria garantizados y sellados.',
        'Shampoos terapéuticos, productos dermatológicos y de higiene dental.'
      ]
    },
    bano: {
      title: 'Sesión de Baño Especializado Gratis',
      icon: ASSETS.iconBano,
      subtitle: 'Consentimiento y frescura con productos hipoalergénicos.',
      highlights: [
        'Incluye corte de uñas, limpieza de oídos y cepillado deslanador.',
        'Cosmética veterinaria especializada según el tipo de manto o pelaje.',
        'Personal capacitado en manejo libre de estrés (Fear Free Certified).',
        'Válido para agendar en cualquier momento durante la vigencia de tu membresía.'
      ]
    },
    consulta: {
      title: 'Consulta Médica Veterinaria Integral',
      icon: ASSETS.iconConsulta,
      subtitle: 'Atención profesional dedicada al cuidado holístico de tu compañero.',
      highlights: [
        'Examen clínico general: auscultación cardiopulmonar, revisión dental y ocular.',
        'Revisión y actualización de esquema vacunal y desparasitación.',
        'Historial médico digital sincronizado con tu carnet Petus Go.',
        'Orientación en medicina preventiva, control de peso y recomendaciones de estilo de vida.'
      ]
    }
  };

  const active = contentMap[benefitId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#eaf6fd]/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm border border-[#a1dcf5] flex items-center justify-center">
              <img src={active.icon} alt={active.title} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#486377]">
                {active.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Beneficio Petus Go</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">{active.subtitle}</p>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#486377] uppercase tracking-wider">
              ¿Qué incluye este beneficio?
            </h4>
            <div className="space-y-2.5">
              {active.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-[#73c3e8] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-[#486377] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#73c3e8] shrink-0" />
            <span>Todos los beneficios se activan inmediatamente al registrar a tu mascota.</span>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
            >
              Volver
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToRegister();
              }}
              className="px-6 py-2.5 bg-[#73c3e8] hover:bg-[#5db8e2] text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Quiero este beneficio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
