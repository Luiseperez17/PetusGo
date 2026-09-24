import React from 'react';
import { ASSETS } from '../constants/assets';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="md:col-span-7 space-y-6 text-left z-10">
            {/* Quick reassurance tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-white text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#faeed2]" />
              <span>Membresía Anual de Cuidado Integral</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white leading-[1.12] drop-shadow-sm">
              Todo lo que <br className="hidden sm:inline" />
              <span className="text-white">tu mascota necesita</span> <br />
              <span className="text-white drop-shadow-md">en un solo GO!</span>
            </h1>

            <p className="text-white text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl opacity-95 text-balance">
              Una membresía pensada para acompañarte durante todo un año con beneficios exclusivos para el cuidado y bienestar de tu mascota.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onCtaClick}
                className="px-8 py-3.5 bg-white text-[#486377] font-heading font-bold text-sm md:text-base tracking-wider rounded-full shadow-lg hover:bg-opacity-95 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 uppercase flex items-center gap-2 group cursor-pointer"
              >
                <span>Quiero ser parte</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Activación inmediata con tu primera compra</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Dog and Cat cuddled together */}
          <div className="md:col-span-5 relative flex justify-center items-center z-10">
            <div className="relative w-full max-w-[430px] group">
              {/* Soft decorative glow ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-white/40 to-white/10 rounded-[32px] blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/50 bg-white/20 backdrop-blur-xs">
                <img
                  src={ASSETS.heroDogAndCat}
                  alt="Perro golden retriever y gato acurrucados felices en una manta acogedora"
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-103"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating micro pill */}
              <div className="absolute -bottom-3 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#73c3e8]/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold text-[#486377]">100% Bienestar Garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organic Bottom Wave Shape to transition smoothly into the white benefits section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 md:h-14 text-white fill-current"
        >
          <path d="M0,0 C150,90 400,100 600,60 C800,20 1050,80 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};
