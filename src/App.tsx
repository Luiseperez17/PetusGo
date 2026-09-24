/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BenefitsSection } from './components/BenefitsSection';
import { PlanSection } from './components/PlanSection';
import { BannerSection } from './components/BannerSection';
import { PharmacySection } from './components/PharmacySection';
import { RegistrationSection } from './components/RegistrationSection';
import { Footer } from './components/Footer';
import { DigitalCardModal } from './components/DigitalCardModal';
import { SimuladorModal } from './components/SimuladorModal';
import { PharmacyCalculatorModal } from './components/PharmacyCalculatorModal';
import { BenefitsModal } from './components/BenefitsModal';
import { TermsModal } from './components/TermsModal';
import { LoginModal } from './components/LoginModal';
import { getToken, fetchMyMembers } from './lib/api';
import { MemberProfile, ScreenMode } from './types';
import { SAMPLE_MEMBER } from './constants/data';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('landing');
  const [activeMember, setActiveMember] = useState<MemberProfile>(SAMPLE_MEMBER);

  // Modal states
  const [isCarnetOpen, setIsCarnetOpen] = useState(false);
  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<
    'alimento' | 'farmacia' | 'bano' | 'consulta' | null
  >(null);

  // Registration success banner toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const scrollToRegistration = () => {
    setCurrentScreen('landing');
    const elem = document.getElementById('registro');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Carnet real: con sesión lo carga del backend; sin sesión pide login.
  const openCarnet = async () => {
    if (getToken()) {
      try {
        const members = await fetchMyMembers();
        if (members.length) {
          setActiveMember(members[0]);
          setIsCarnetOpen(true);
          return;
        }
      } catch {
        /* sesión vencida → login */
      }
    }
    setIsLoginOpen(true);
  };

  const handleScreenNavigation = (screen: ScreenMode) => {
    setCurrentScreen(screen);
    if (screen === 'carnet') {
      openCarnet();
    } else if (screen === 'simulador') {
      setIsSimuladorOpen(true);
    } else if (screen === 'calculadora') {
      setIsCalculatorOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRegisterSuccess = (newMember: MemberProfile) => {
    setActiveMember(newMember);
    setShowSuccessToast(true);
    setIsCarnetOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#364958] selection:bg-[#73c3e8] selection:text-white relative">
      {/* Toast alert when registered successfully */}
      {showSuccessToast && (
        <aside
          aria-label="Notificación de registro"
          className="fixed top-5 right-5 z-50 bg-white border border-emerald-300 shadow-2xl p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-extrabold text-[#486377]">¡Registro Exitoso!</p>
            <p className="text-slate-500 truncate">
              Membresía activada para {activeMember.mascota.nombre}.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Screen Switcher Sticky Bar for Easy Testing */}
      <div className="bg-[#364958] text-white py-1.5 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#faeed2]" />
            <span className="font-bold">Vistas y Pantallas Petus Go:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => handleScreenNavigation('landing')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                currentScreen === 'landing'
                  ? 'bg-[#73c3e8] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Landing Principal
            </button>
            <button
              onClick={() => handleScreenNavigation('carnet')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                currentScreen === 'carnet'
                  ? 'bg-[#73c3e8] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Pantalla: Carnet Digital
            </button>
            <button
              onClick={() => handleScreenNavigation('simulador')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                currentScreen === 'simulador'
                  ? 'bg-[#73c3e8] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Pantalla: Simulador 5+1
            </button>
            <button
              onClick={() => handleScreenNavigation('calculadora')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                currentScreen === 'calculadora'
                  ? 'bg-[#73c3e8] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Pantalla: Farmacia 15%
            </button>
          </div>
        </div>
      </div>

      {/* Main Header and Hero (curved cyan background matching screenshot) */}
      <header id="inicio" className="curved-hero-bg min-h-[580px] md:min-h-[660px] text-white relative">
        <Header
          currentScreen={currentScreen}
          onNavigateScreen={handleScreenNavigation}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
        <Hero onCtaClick={scrollToRegistration} />
      </header>

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* Section 1: ¿Qué es Petus Go? */}
        <BenefitsSection
          onSelectBenefit={(benefitId) => setSelectedBenefit(benefitId)}
        />

        {/* Section 2: PLAN 5+1 */}
        <PlanSection onOpenSimulador={() => setIsSimuladorOpen(true)} />

        {/* Section 3: Inter-banner 1 Año de Beneficios */}
        <BannerSection onCtaClick={scrollToRegistration} />

        {/* Section 4: 15% de Descuento en Farmacia */}
        <PharmacySection
          onCtaClick={scrollToRegistration}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />

        {/* Section 5: Formulario de Registro "¡Únete a Petus Go!" */}
        <RegistrationSection
          onSuccessRegister={handleRegisterSuccess}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
      </main>

      {/* Main Footer */}
      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onNavigateCarnet={openCarnet}
        onNavigateSimulador={() => setIsSimuladorOpen(true)}
      />

      {/* Interactive Modals & Screens */}
      <DigitalCardModal
        member={activeMember}
        isOpen={isCarnetOpen}
        onClose={() => {
          setIsCarnetOpen(false);
          setCurrentScreen('landing');
        }}
        onOpenSimulador={() => setIsSimuladorOpen(true)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setCurrentScreen('landing');
        }}
        onLoggedIn={(members) => {
          setActiveMember(members[0]);
          setIsLoginOpen(false);
          setIsCarnetOpen(true);
        }}
      />

      <SimuladorModal
        isOpen={isSimuladorOpen}
        onClose={() => {
          setIsSimuladorOpen(false);
          setCurrentScreen('landing');
        }}
        onGoToRegister={scrollToRegistration}
      />

      <PharmacyCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => {
          setIsCalculatorOpen(false);
          setCurrentScreen('landing');
        }}
        onGoToRegister={scrollToRegistration}
      />

      <BenefitsModal
        benefitId={selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
        onGoToRegister={scrollToRegistration}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
}
