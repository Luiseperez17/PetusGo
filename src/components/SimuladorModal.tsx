import React, { useState } from 'react';
import { PET_FOOD_BRANDS } from '../constants/data';
import { X, Check, Gift, Sparkles, RefreshCw, Award, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCOP } from '../lib/money';

interface SimuladorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToRegister: () => void;
}

export const SimuladorModal: React.FC<SimuladorModalProps> = ({
  isOpen,
  onClose,
  onGoToRegister
}) => {
  const [selectedBrand, setSelectedBrand] = useState(PET_FOOD_BRANDS[0]);
  const [selectedSize, setSelectedSize] = useState(PET_FOOD_BRANDS[0].presentations[1]);
  const [bagPrice, setBagPrice] = useState(selectedBrand.basePrice);
  const [purchasedCount, setPurchasedCount] = useState(3);

  if (!isOpen) return null;

  const handleBrandChange = (brandId: string) => {
    const brand = PET_FOOD_BRANDS.find((b) => b.id === brandId) || PET_FOOD_BRANDS[0];
    setSelectedBrand(brand);
    setSelectedSize(brand.presentations[1] || brand.presentations[0]);
    setBagPrice(brand.basePrice);
  };

  const handleBuyNext = () => {
    if (purchasedCount < 5) {
      setPurchasedCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setPurchasedCount(0);
  };

  const totalSpent = formatCOP(purchasedCount * bagPrice);
  const freeBagValue = formatCOP(bagPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#73c3e8]/20 to-[#faeed2]/30">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-bold text-lg text-[#486377]">
              Simulador Interactivo · Plan 5+1 Petus Go
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
          {/* Controls: Brand, Size, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-[#486377] mb-1">
                Marca de Alimento
              </label>
              <select
                value={selectedBrand.id}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#73c3e8]"
              >
                {PET_FOOD_BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#486377] mb-1">
                Presentación / Peso
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#73c3e8]"
              >
                {selectedBrand.presentations.map((pres) => (
                  <option key={pres} value={pres}>
                    {pres}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#486377] mb-1">
                Precio estimado bolsa ($)
              </label>
              <input
                type="number"
                value={bagPrice}
                onChange={(e) => setBagPrice(Number(e.target.value))}
                min={10}
                max={200}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#73c3e8]"
              />
            </div>
          </div>

          {/* Stamp Board */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#486377]">
                Cartilla de Sellos de Fidelidad:
              </span>
              <span className="text-xs font-extrabold text-[#73c3e8] bg-[#eaf6fd] px-2.5 py-1 rounded-full">
                {purchasedCount} de 5 Compras acumuladas
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((num) => {
                const isStamped = num <= purchasedCount;
                return (
                  <div
                    key={num}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                      isStamped
                        ? 'bg-[#73c3e8] text-white shadow-md scale-102'
                        : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300'
                    }`}
                  >
                    {isStamped ? (
                      <>
                        <Check className="w-6 h-6 stroke-[3] mb-1" />
                        <span className="text-[10px] font-bold">Compra {num}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 mb-1 opacity-40" />
                        <span className="text-[11px] font-bold">{num}</span>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Reward 6th Bag */}
              <div
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                  purchasedCount === 5
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xl scale-105 animate-pulse'
                    : 'bg-amber-50 text-amber-600/70 border-2 border-dashed border-amber-300'
                }`}
              >
                <Gift className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-black uppercase leading-tight">
                  {purchasedCount === 5 ? '¡Tu Regalo!' : 'Bolsa 6 Gratis'}
                </span>
              </div>
            </div>
          </div>

          {/* Savings Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#eaf6fd] to-amber-50/50 border border-[#a1dcf5] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total acumulado</p>
              <p className="text-xl font-extrabold text-[#486377]">{totalSpent}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Ahorro en bolsa 6</p>
              <p className="text-xl font-extrabold text-emerald-600">+{freeBagValue} GRATIS</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Ahorro efectivo</p>
              <p className="text-xl font-extrabold text-[#73c3e8]">16.7% OFF</p>
            </div>
          </div>

          {/* Notification when 5 completed */}
          {purchasedCount === 5 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¡Felicitaciones! Has completado tus 5 compras.</span>
              </div>
              <p className="text-xs">
                Tu próxima bolsa de <strong>{selectedBrand.name} ({selectedSize})</strong> es totalmente gratis. Redímela en cualquiera de nuestras tiendas presentando tu Carnet Digital.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBuyNext}
                disabled={purchasedCount >= 5}
                className="px-4 py-2.5 bg-[#486377] hover:bg-[#364958] text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-40 cursor-pointer"
              >
                + Simular compra siguiente
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToRegister();
              }}
              className="px-5 py-2.5 bg-[#73c3e8] hover:bg-[#5db8e2] text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Activar mi membresía</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
