import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { PHARMACY_PRODUCTS } from '../constants/data';
import { ShieldCheck, ArrowRight, Percent, Sparkles, CheckCircle } from 'lucide-react';

interface PharmacySectionProps {
  onCtaClick: () => void;
  onOpenCalculator: () => void;
}

export const PharmacySection: React.FC<PharmacySectionProps> = ({
  onCtaClick,
  onOpenCalculator
}) => {
  // Quick interactive product price tester
  const [selectedProduct, setSelectedProduct] = useState(PHARMACY_PRODUCTS[0]);
  const discountedPrice = (selectedProduct.normalPrice * 0.85).toFixed(2);
  const savings = (selectedProduct.normalPrice * 0.15).toFixed(2);

  return (
    <section id="farmacia" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Promotional Text & Savings Tester */}
          <div className="md:col-span-6 space-y-6 order-2 md:order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eaf6fd] text-[#4196c2] rounded-full text-xs font-bold tracking-wide">
              <Percent className="w-3.5 h-3.5" />
              <span>Salud Preventiva con Beneficio Permanente</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#486377] leading-[1.08] tracking-tight">
              15 % DE <br />
              <span className="text-[#486377]">DESCUENTO</span> <br />
              EN FARMACIA
            </h2>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-lg">
              Al inscribirte a Petus Go y realizar tu primera compra de alimento se activa un descuento del 15% en farmacia.
            </p>

            {/* Shield Reassurance Badge */}
            <div className="flex items-center gap-3 text-[#486377] font-semibold text-xs sm:text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-[#73c3e8] shrink-0" />
              <span>Tu descuento está vigente durante todo el año.</span>
            </div>

            {/* Interactive Quick Price Calculator Widget */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#eaf6fd]/70 border border-[#a1dcf5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#486377] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#73c3e8]" />
                  Comprueba tu ahorro en medicamentos:
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Ahorras ${savings}
                </span>
              </div>

              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const prod = PHARMACY_PRODUCTS.find((p) => p.id === e.target.value);
                  if (prod) setSelectedProduct(prod);
                }}
                className="w-full bg-white border border-[#a1dcf5] rounded-xl px-3 py-2 text-xs font-bold text-[#486377] focus:outline-none focus:ring-2 focus:ring-[#73c3e8] cursor-pointer"
              >
                {PHARMACY_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div>
                  <span className="text-slate-400 line-through mr-2">${selectedProduct.normalPrice.toFixed(2)}</span>
                  <span className="text-base font-extrabold text-[#486377]">${discountedPrice}</span>
                  <span className="text-[11px] text-slate-500 ml-1.5">precio Petus Go</span>
                </div>

                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="text-xs font-bold text-[#4196c2] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver simulador completo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Primary Action Button (Matching the sky-blue button in original screenshot) */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onCtaClick}
                className="px-7 py-3 bg-[#a1dcf5] hover:bg-[#73c3e8] text-[#486377] font-heading font-extrabold text-xs sm:text-sm tracking-wider rounded-xl shadow-md hover:shadow-lg hover:text-white transition-all duration-200 uppercase cursor-pointer"
              >
                Quiero ser parte
              </button>

              <span className="text-xs text-slate-400 font-medium">
                Aplica en más de 200 referencias
              </span>
            </div>
          </div>

          {/* Right Column: Dog with Health Supplement Bottle */}
          <div className="md:col-span-6 order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-[430px] group">
              {/* Soft decorative glow */}
              <div className="absolute -inset-2 bg-gradient-to-br from-[#a1dcf5]/50 to-[#faeed2]/40 rounded-[36px] blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-[32px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.015] border-4 border-white">
                <img
                  src={ASSETS.pharmacyBorderCollie}
                  alt="Perro Border Collie con suplemento farmacéutico veterinario"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Reassurance Tag */}
              <div className="absolute -bottom-3 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-[#486377] leading-tight">Medicamentos Certificados</p>
                  <p className="text-[10px] text-slate-400">Respaldo Farmacia Silveragro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
