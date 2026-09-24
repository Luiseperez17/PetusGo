import React from 'react';
import { ASSETS } from '../constants/assets';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BannerSectionProps {
  onCtaClick: () => void;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="banner-bg-pattern bg-[#73c3e8] py-12 md:py-16 text-white relative shadow-inner overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Column: CTA and Bold Typography */}
          <div className="space-y-5 text-center md:text-left z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-white text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#faeed2]" />
              <span>Cuidado y ahorro garantizado</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.15] drop-shadow-sm">
              1 AÑO DE <br className="hidden sm:inline" />
              <span className="text-white">BENEFICIOS</span> PARA <br />
              TI Y <span className="text-white">TU MASCOTA</span>
            </h2>

            <p className="text-white/95 text-sm sm:text-base font-medium max-w-md">
              Únete hoy y accede a descuentos continuos en farmacia, consulta veterinaria, baño gratis y el exclusivo Plan 5+1.
            </p>

            <div className="pt-2">
              <button
                onClick={onCtaClick}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#486377] font-heading font-extrabold text-xs sm:text-sm tracking-wider rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 uppercase cursor-pointer"
              >
                <span>Quiero ser parte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Petus Go Badge Logo */}
          <div className="flex-shrink-0 z-10">
            <div className="relative group">
              <div className="absolute -inset-3 bg-white/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <img
                src={ASSETS.bannerPetusGoBadge}
                alt="Petus Go Logo Insignia"
                className="relative h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-xl transform transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
