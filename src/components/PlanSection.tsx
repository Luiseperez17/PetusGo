import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { PET_FOOD_BRANDS } from '../constants/data';
import { Gift, Check, Sparkles, RefreshCw, Award } from 'lucide-react';

interface PlanSectionProps {
  onOpenSimulador: () => void;
}

export const PlanSection: React.FC<PlanSectionProps> = ({ onOpenSimulador }) => {
  // Mini interactive stamp tracker state
  const [selectedBrand, setSelectedBrand] = useState(PET_FOOD_BRANDS[0]);
  const [selectedSize, setSelectedSize] = useState(PET_FOOD_BRANDS[0].presentations[0]);
  const [stampCount, setStampCount] = useState(3);

  const handleAddStamp = () => {
    setStampCount((prev) => (prev < 5 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setStampCount(0);
  };

  return (
    <section id="plan5mas1" className="py-14 md:py-24 bg-slate-50/70 overflow-hidden relative border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Owner hugging Beagle dog */}
          <div className="md:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[440px] group">
              {/* Soft decorative backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#73c3e8]/30 to-[#faeed2]/60 rounded-[36px] blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-[32px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.015] border-4 border-white">
                <img
                  src={ASSETS.plan51Beagle}
                  alt="Dueño abrazando cariñosamente a su perro Beagle"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Plan Badge */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#73c3e8] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                  5+1
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase leading-none">Tu sexta bolsa</p>
                  <p className="text-sm font-extrabold text-[#486377]">100% GRATIS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Plan Description & Timeline Steps */}
          <div className="md:col-span-6 space-y-6">
            <header className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faeed2] text-[#486377] rounded-full text-xs font-bold tracking-wide">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Programa de Fidelidad Canina & Felina</span>
              </div>

              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#486377] tracking-tight">
                PLAN 5+1
              </h2>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-lg">
                Cada compra te acerca a tu próximo beneficio. Completa 5 compras de alimento seco y la siguiente va por nuestra cuenta.
              </p>
            </header>

            {/* Timeline Steps (Matching Screenshot Exactly) */}
            <div className="relative pl-7 md:pl-8 border-l-2 border-[#486377]/25 space-y-8 my-6 ml-3">
              {/* Step 1 */}
              <div className="relative group">
                <span className="absolute -left-[35px] md:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#486377] border-4 border-white shadow-sm ring-2 ring-[#486377]/20" />
                <p className="text-[11px] font-extrabold tracking-wider text-[#6f8391] uppercase mb-0.5">
                  PASO 1
                </p>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#486377]">
                  ELIGE
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Compra alimento seco de la misma marca y peso para tu mascota.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <span className="absolute -left-[35px] md:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#486377] border-4 border-white shadow-sm ring-2 ring-[#486377]/20" />
                <p className="text-[11px] font-extrabold tracking-wider text-[#6f8391] uppercase mb-0.5">
                  PASO 2
                </p>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#486377]">
                  ACUMULA
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Cada compra cuenta para completar tus 5 compras y avanzar hacia tu beneficio.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <span className="absolute -left-[35px] md:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#486377] border-4 border-white shadow-sm ring-2 ring-[#486377]/20" />
                <p className="text-[11px] font-extrabold tracking-wider text-[#6f8391] uppercase mb-0.5">
                  PASO 3
                </p>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#486377]">
                  DISFRUTA
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Al completar las 5 compras, recibe tu beneficio 5+1.
                </p>
              </div>
            </div>

            {/* Interactive Mini Stamp Tester */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#486377] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#73c3e8]" />
                  Simula tu progreso de compras:
                </span>
                <span className="text-xs font-extrabold text-[#73c3e8]">
                  {stampCount}/5 Compras
                </span>
              </div>

              {/* 5 Stamp Circles + 1 Free Reward Circle */}
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isChecked = num <= stampCount;
                  return (
                    <div
                      key={num}
                      className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#73c3e8] text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-400 border border-dashed border-slate-200'
                      }`}
                    >
                      {isChecked ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="text-xs font-bold">{num}</span>
                      )}
                    </div>
                  );
                })}

                {/* 6th Free bag */}
                <div
                  className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
                    stampCount === 5
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md animate-bounce font-bold'
                      : 'bg-amber-50 text-amber-600/60 border border-dashed border-amber-300'
                  }`}
                  title="¡Tu bolsa gratis número 6!"
                >
                  <Gift className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase">¡Gratis!</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleAddStamp}
                  className="px-3.5 py-1.5 bg-[#486377] hover:bg-[#364958] text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {stampCount < 5 ? '+ Registrar compra' : '¡Beneficio Listo! Reiniciar'}
                </button>

                <button
                  type="button"
                  onClick={onOpenSimulador}
                  className="text-[#4196c2] hover:underline font-bold"
                >
                  Abrir simulador completo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
