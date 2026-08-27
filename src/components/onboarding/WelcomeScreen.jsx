import React from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { i18nService } from '../../services/i18nService';

export function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between px-6 py-12 max-w-lg mx-auto text-center">
      <div className="pt-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-[#D97706] text-white flex items-center justify-center font-extrabold text-5xl shadow-lg mb-6 ring-8 ring-[#FEF3C7]">
          S
        </div>
        <h1 className="text-4xl font-extrabold text-[#1E1B4B] tracking-tight mb-3">
          {i18nService.t('welcomeTitle')}
        </h1>
        <p className="text-lg text-[#57534E] leading-relaxed max-w-xs font-medium">
          {i18nService.t('welcomeSubtitle')}
        </p>
      </div>

      <div className="my-8 bg-[#FEF3C7]/60 border border-[#FDE68A] p-6 rounded-3xl text-left space-y-4">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-[#B45309] shrink-0 mt-0.5" />
          <p className="text-sm text-[#78350F] font-medium">
            Stay connected with everyday routines, memory games, and daily reminders.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-[#B45309] shrink-0 mt-0.5" />
          <p className="text-sm text-[#78350F] font-medium">
            Simple, calm, and designed specifically for your comfort.
          </p>
        </div>
      </div>

      <div className="pb-6">
        <button
          onClick={onStart}
          className="w-full bg-[#D97706] hover:bg-[#B45309] text-white text-xl font-bold py-5 px-8 rounded-3xl shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 min-h-[64px]"
        >
          <span>{i18nService.t('letsBegin')}</span>
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
