import React, { useState } from 'react';
import { PHARMACY_PRODUCTS } from '../constants/data';
import { X, Percent, Check, Plus, Minus, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCOP } from '../lib/money';

interface PharmacyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToRegister: () => void;
}

export const PharmacyCalculatorModal: React.FC<PharmacyCalculatorModalProps> = ({
  isOpen,
  onClose,
  onGoToRegister
}) => {
  // Cart-like state for calculating total pharmacy discount
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({
    bravecto: 2, // 2 per year (6 months)
    nexgard: 0,
    condrovet: 1,
    omega3: 2,
    shampoo: 1,
    colirio: 0
  });

  if (!isOpen) return null;

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const totalRegular = PHARMACY_PRODUCTS.reduce((acc, p) => {
    const qty = quantities[p.id] || 0;
    return acc + p.normalPrice * qty;
  }, 0);

  const totalDiscount = totalRegular * 0.15;
  const totalPetusGo = totalRegular - totalDiscount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#eaf6fd]/80">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#4196c2]" />
            <h3 className="font-heading font-bold text-lg text-[#486377]">
              Calculadora de Ahorro en Farmacia (15% OFF)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs sm:text-sm text-slate-600">
            Selecciona los medicamentos y suplementos habituales que consume tu mascota para calcular tu ahorro anual garantizado:
          </p>

          {/* Products selection list */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {PHARMACY_PRODUCTS.map((prod) => {
              const qty = quantities[prod.id] || 0;
              const unitDiscounted = formatCOP(Math.round(prod.normalPrice * 0.85));
              return (
                <div
                  key={prod.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    qty > 0
                      ? 'bg-[#eaf6fd]/50 border-[#a1dcf5]'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#486377] truncate">{prod.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span className="text-slate-400 line-through">{formatCOP(prod.normalPrice)}</span>
                      <span className="font-extrabold text-[#73c3e8]">{unitDiscounted} c/u</span>
                      <span className="text-[10px] text-slate-400">({prod.category})</span>
                    </div>
                  </div>

                  {/* Quantity buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(prod.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-extrabold text-[#486377]">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(prod.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#73c3e8] text-white hover:bg-[#5db8e2] flex items-center justify-center text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#eaf6fd] to-slate-50 border border-[#a1dcf5] space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Gasto regular sin membresía:</span>
              <span className="line-through">{formatCOP(totalRegular)}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-600 font-bold">
              <span>Tu Ahorro 15% con Petus Go:</span>
              <span>-{formatCOP(totalDiscount)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-[#486377]">Total anual estimado con Petus Go:</span>
              <span className="text-2xl font-black text-[#73c3e8]">{formatCOP(totalPetusGo)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Válido por 12 meses en cualquier farmacia Silveragro del país.</span>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToRegister();
              }}
              className="px-6 py-2.5 bg-[#73c3e8] hover:bg-[#5db8e2] text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Quiero ser parte ahora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
