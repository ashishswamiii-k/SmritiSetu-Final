import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Target, Clock, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { i18nService } from '../../services/i18nService';

export function GameResultModal({ result, onPlayAgain, onAnotherGame, onGoHome }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti effect unavailable:", e);
    }
  }, []);

  if (!result) return null;

  const { score, accuracy, completionTimeSeconds, adaptation } = result;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#D97706] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center animate-scale-up">
        {/* Header */}
        <div>
          <div className="w-20 h-20 bg-[#FEF3C7] text-[#D97706] rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-[#FEF3C7]/50">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E1B4B]">
            {i18nService.t('wellDone')}
          </h2>
          <p className="text-sm text-[#78716C] font-medium mt-1">
            Great job completing this session!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E7E5E4]">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#78716C] font-bold uppercase">{i18nService.t('score')}</span>
            <span className="text-2xl font-extrabold text-[#D97706]">{score || 0}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-[#78716C] font-bold uppercase">{i18nService.t('accuracy')}</span>
            <span className="text-2xl font-extrabold text-[#166534]">{accuracy || 100}%</span>
          </div>
        </div>

        {/* Adaptive Difficulty Feedback Banner */}
        {adaptation && adaptation.feedbackMessage && (
          <div className="bg-[#FEF3C7] border border-[#FDE68A] p-4 rounded-2xl text-left flex items-start gap-3">
            <span className="text-xl">✨</span>
            <div>
              <h4 className="text-xs font-bold uppercase text-[#92400E]">Next Round Recommendation</h4>
              <p className="text-sm font-semibold text-[#78350F] mt-0.5">
                {adaptation.feedbackMessage}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all min-h-[56px] text-lg active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{i18nService.t('playAgain')}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onAnotherGame}
              className="w-full bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] text-[#1E1B4B] font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors min-h-[50px] text-sm"
            >
              <span>{i18nService.t('anotherGame')}</span>
            </button>
            <button
              onClick={onGoHome}
              className="w-full bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] text-[#1E1B4B] font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors min-h-[50px] text-sm"
            >
              <Home className="w-4 h-4 text-[#D97706]" />
              <span>{i18nService.t('backToHome')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
