import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { IdCard, Sparkles, Menu, X, Calculator } from 'lucide-react';
import { ScreenMode } from '../types';

interface HeaderProps {
  currentScreen: ScreenMode;
  onNavigateScreen: (screen: ScreenMode) => void;
  onOpenTerms: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateScreen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-30 w-full pt-4 pb-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Petus Go Main Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              onNavigateScreen('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group transition-transform duration-200 hover:scale-[1.03]"
          >
            <img
              src={ASSETS.logoPetusGo}
              alt="Petus Go - By Silveragro"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-sm"
              loading="eager"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-white/95 font-semibold text-sm">
            <a
              href="#beneficios"
              onClick={() => onNavigateScreen('landing')}
              className="hover:text-white transition-colors duration-150 relative py-1 hover:underline underline-offset-4 decoration-2"
            >
              ¿Qué es Petus Go?
            </a>
            <a
              href="#plan5mas1"
              onClick={() => onNavigateScreen('landing')}
              className="hover:text-white transition-colors duration-150 relative py-1 hover:underline underline-offset-4 decoration-2"
            >
              Plan 5+1
            </a>
            <a
              href="#farmacia"
              onClick={() => onNavigateScreen('landing')}
              className="hover:text-white transition-colors duration-150 relative py-1 hover:underline underline-offset-4 decoration-2"
            >
              Farmacia 15%
            </a>
            <a
              href="#registro"
              onClick={() => onNavigateScreen('landing')}
              className="hover:text-white transition-colors duration-150 relative py-1 hover:underline underline-offset-4 decoration-2"
            >
              Registro
            </a>
          </div>

          {/* Interactive Screen Navigation Controls & Silveragro Logo */}
          <div className="flex items-center gap-3">
            {/* Mi Carnet Digital Shortcut Button */}
            <button
              onClick={() => onNavigateScreen('carnet')}
              className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                currentScreen === 'carnet'
                  ? 'bg-white text-[#486377] ring-2 ring-white/60 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
              }`}
              title="Ver carnet digital de miembro Petus Go"
            >
              <IdCard className="w-4 h-4 text-white group-hover:text-white" />
              <span>Mi Carnet Digital</span>
            </button>

            {/* Simulador Plan 5+1 button */}
            <button
              onClick={() => onNavigateScreen('simulador')}
              className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                currentScreen === 'simulador'
                  ? 'bg-white text-[#486377] ring-2 ring-white/60 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
              }`}
              title="Probar simulador de compras 5+1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulador 5+1</span>
            </button>

            {/* Silveragro Brand Logo */}
            <div className="flex items-center pl-1 sm:pl-2">
              <img
                src={ASSETS.logoSilveragro}
                alt="By Silveragro"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain drop-shadow-sm brightness-105"
              />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-[#364958] shadow-xl border border-white/40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2 font-bold text-sm">
              <a
                href="#beneficios"
                onClick={() => {
                  onNavigateScreen('landing');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-[#eaf6fd] text-[#486377]"
              >
                ¿Qué es Petus Go?
              </a>
              <a
                href="#plan5mas1"
                onClick={() => {
                  onNavigateScreen('landing');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-[#eaf6fd] text-[#486377]"
              >
                Plan 5+1
              </a>
              <a
                href="#farmacia"
                onClick={() => {
                  onNavigateScreen('landing');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-[#eaf6fd] text-[#486377]"
              >
                Farmacia 15% Descuento
              </a>
              <a
                href="#registro"
                onClick={() => {
                  onNavigateScreen('landing');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-[#eaf6fd] text-[#486377]"
              >
                Formulario de Registro
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigateScreen('carnet');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#73c3e8] text-white rounded-xl text-xs font-bold"
              >
                <IdCard className="w-4 h-4" />
                <span>Mi Carnet</span>
              </button>
              <button
                onClick={() => {
                  onNavigateScreen('simulador');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#faeed2] text-[#486377] rounded-xl text-xs font-bold"
              >
                <Calculator className="w-4 h-4" />
                <span>Simulador</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
