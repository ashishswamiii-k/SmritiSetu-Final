import React from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { i18nService } from '../../services/i18nService';

export function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-[#F6F3EC] flex flex-col justify-between px-6 py-10 max-w-md mx-auto text-center">
      <div className="pt-6 flex flex-col items-center">
        {/* Official Brand Logo */}
        <img
          src={logoImg}
          alt="SmritiSetu Logo"
          className="w-44 h-auto object-contain mb-4 drop-shadow-sm"
        />

        <h1 className="text-3xl font-serif-fraunces text-[#1B3A3A] tracking-tight mb-1">
          SmritiSetu
        </h1>
        <p className="text-sm font-semibold text-[#7FA593] tracking-wide mb-6">
          Every Day, Remembered.
        </p>

        <p className="text-sm text-[#5B6461] leading-relaxed max-w-xs font-medium">
          A calm and friendly everyday companion for routine support, cognitive puzzles, and daily reminders.
        </p>
      </div>

      <div className="my-6 card-product p-5 text-left space-y-3.5 bg-white border border-[#1B3A3A]/12 shadow-xs">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-[#E8825F] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1B3A3A] font-medium leading-normal">
            Stay comfortably connected with your daily routine, morning medicine, and hydration.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#7FA593] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1B3A3A] font-medium leading-normal">
            Gentle memory games and mood check-ins designed for everyday comfort.
          </p>
        </div>
      </div>

      <div className="pb-4">
        <button
          onClick={onStart}
          className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white text-lg font-bold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 transition-all transform active:scale-95 min-h-[56px]"
        >
          <span>Let's Begin</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
