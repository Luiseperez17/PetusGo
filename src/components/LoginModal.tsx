import React, { useState } from 'react';
import { MemberProfile } from '../types';
import { requestCode, verifyCode, fetchMyMembers } from '../lib/api';
import { X, Mail, KeyRound, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoggedIn: (members: MemberProfile[]) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoggedIn }) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const run = async (fn: () => Promise<void>) => {
    setError('');
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await requestCode(email.trim());
      setStep('code');
    });
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await verifyCode(email.trim(), code.trim());
      const members = await fetchMyMembers();
      if (members.length === 0) throw new Error('No encontramos membresías para este correo.');
      setCode('');
      setStep('email');
      onLoggedIn(members);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#eaf6fd]/80">
          <h3 className="font-heading font-bold text-lg text-[#486377]">Ingresa a tu carnet</h3>
          <button onClick={onClose} aria-label="Cerrar" className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={step === 'email' ? sendCode : submitCode} className="p-6 space-y-4">
          {step === 'email' ? (
            <>
              <p className="text-xs text-slate-600">
                Escribe el correo con el que te registraste y te enviaremos un código de acceso.
              </p>
              <div className="flex items-center border-b border-slate-300 py-2 focus-within:border-[#73c3e8]">
                <Mail className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input
                  type="email" required autoFocus value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-600">
                Si <b>{email}</b> está registrado, te enviamos un código. Revisa tu bandeja (y spam).
              </p>
              <div className="flex items-center border-b border-slate-300 py-2 focus-within:border-[#73c3e8]">
                <KeyRound className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input
                  inputMode="numeric" required autoFocus value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="Código"
                  className="w-full bg-transparent text-sm tracking-widest focus:outline-none"
                />
              </div>
              <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-[11px] text-[#4196c2] underline cursor-pointer">
                Usar otro correo
              </button>
            </>
          )}

          {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-[#73c3e8] hover:bg-[#5db8e2] text-white font-heading font-extrabold text-sm rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === 'email' ? 'Enviar código' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
