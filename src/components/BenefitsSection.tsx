import React from 'react';
import { ASSETS } from '../constants/assets';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BenefitsSectionProps {
  onSelectBenefit: (benefitId: 'alimento' | 'farmacia' | 'bano' | 'consulta') => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ onSelectBenefit }) => {
  return (
    <section id="beneficios" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eaf6fd] text-[#4196c2] rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beneficios Exclusivos Todo el Año</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#486377] tracking-tight">
            ¿Qué es Petus Go?
          </h2>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto text-balance">
            Una experiencia creada para acompañarte a cuidar de quien siempre está a tu lado. Con tu membresía, además de consentir a tu mascota con su alimento favorito, podrás acceder a beneficios en:
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {/* Card 1: Alimento */}
          <div
            onClick={() => onSelectBenefit('alimento')}
            className="group bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-[0_10px_25px_-5px_rgba(115,195,232,0.18),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_30px_-10px_rgba(72,99,119,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer relative"
          >
            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 mb-5 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={ASSETS.iconAlimento}
                  alt="Icono Alimento Petus Go"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-heading font-bold text-xl text-[#486377] mb-2 group-hover:text-[#4196c2] transition-colors">
                Alimento
              </h3>

              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Las mejores marcas y nutrición para cada etapa de tu mascota con recompensas en cada compra.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#486377] group-hover:text-[#4196c2]">
              <span>Ver Plan 5+1</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Farmacia (Highlighted softly in cyan blue like the original mockup) */}
          <div
            onClick={() => onSelectBenefit('farmacia')}
            className="group bg-[#eaf6fd]/80 rounded-2xl p-6 text-center border-2 border-[#a1dcf5] shadow-[0_12px_28px_-5px_rgba(115,195,232,0.3)] hover:shadow-[0_22px_32px_-10px_rgba(72,99,119,0.25)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer relative"
          >
            {/* Top pill badge */}
            <div className="absolute -top-3 px-2.5 py-0.5 bg-[#73c3e8] text-white rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
              15% OFF Activo
            </div>

            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 mb-5 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={ASSETS.iconFarmacia}
                  alt="Icono Farmacia Petus Go"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-heading font-bold text-xl text-[#486377] mb-2 group-hover:text-[#4196c2] transition-colors">
                Farmacia
              </h3>

              <p className="text-xs sm:text-[13px] text-[#364958]/90 leading-relaxed font-medium">
                Descuento preferencial permanente en medicamentos y suplementos para su salud preventiva.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#a1dcf5]/60 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#4196c2]">
              <span>Calcular ahorro</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Baño gratis */}
          <div
            onClick={() => onSelectBenefit('bano')}
            className="group bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-[0_10px_25px_-5px_rgba(115,195,232,0.18),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_30px_-10px_rgba(72,99,119,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer relative"
          >
            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 mb-5 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={ASSETS.iconBano}
                  alt="Icono Baño gratis Petus Go"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-heading font-bold text-xl text-[#486377] mb-2 group-hover:text-[#4196c2] transition-colors">
                Baño gratis
              </h3>

              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Consiente y mantén limpio y fresco a tu compañero con sesiones de baño especializadas.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#486377] group-hover:text-[#4196c2]">
              <span>Conocer detalles</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 4: Consulta médica */}
          <div
            onClick={() => onSelectBenefit('consulta')}
            className="group bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-[0_10px_25px_-5px_rgba(115,195,232,0.18),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_30px_-10px_rgba(72,99,119,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer relative"
          >
            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 mb-5 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={ASSETS.iconConsulta}
                  alt="Icono Consulta médica Petus Go"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-heading font-bold text-xl text-[#486377] mb-2 group-hover:text-[#4196c2] transition-colors">
                Consulta médica
              </h3>

              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Atención veterinaria con profesionales dedicados para velar por su bienestar integral.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#486377] group-hover:text-[#4196c2]">
              <span>Agendar valoración</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Reassurance strip */}
        <div className="mt-12 p-4 rounded-2xl bg-[#eaf6fd]/60 border border-[#a1dcf5]/50 flex flex-wrap items-center justify-center gap-6 text-xs text-[#486377] font-semibold text-center">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#73c3e8]" />
            Válido en todas las sedes Silveragro
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#73c3e8]" />
            Sin costos ocultos ni mensualidades
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#73c3e8]" />
            Carnet Digital instantáneo para tu mascota
          </span>
        </div>
      </div>
    </section>
  );
};
