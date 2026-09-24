import React from 'react';
import { ASSETS } from '../constants/assets';

interface FooterProps {
  onOpenTerms: () => void;
  onNavigateCarnet: () => void;
  onNavigateSimulador: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onNavigateCarnet,
  onNavigateSimulador
}) => {
  return (
    <footer className="bg-gradient-to-r from-[#73c3e8] to-[#a1dcf5] py-8 border-t border-[#73c3e8] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Footer Brand Logo */}
          <div className="flex items-center gap-4">
            <img
              src={ASSETS.footerPetusGo}
              alt="Petus Go"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="hidden md:block h-6 w-px bg-white/40" />
            <span className="hidden md:inline text-xs font-semibold text-white/90">
              Cuidado y bienestar animal por Silveragro
            </span>
          </div>

          {/* Quick Helper Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-bold text-white/90">
            <button
              onClick={onNavigateCarnet}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Mi Carnet Digital
            </button>
            <button
              onClick={onNavigateSimulador}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Simulador 5+1
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Términos y Condiciones
            </button>
          </div>

          {/* Copyright Notice (matching screenshot) */}
          <div className="text-white text-xs sm:text-sm font-medium tracking-wide text-center sm:text-right drop-shadow-sm">
            Copyright © 2025 Todos los derechos reservados P. G1.R
          </div>
        </div>
      </div>
    </footer>
  );
};
