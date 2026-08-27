import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Calendar } from 'lucide-react';
import { i18nService } from '../../services/i18nService';

export function GameResultModal({ result, onPlayAgain, onAnotherGame, onGoHome }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti effect unavailable:", e);
    }
  }, []);

  if (!result) return null;

  const { score, accuracy, adaptation } = result;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#1B3A3A]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center animate-scale-up">
        {/* Header */}
        <div>
          <div className="w-16 h-16 bg-[#7FA593]/20 text-[#1B3A3A] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#7FA593]/40">
            <Trophy className="w-8 h-8 text-[#7FA593]" />
          </div>
          <h2 className="text-2xl font-serif-fraunces text-[#1B3A3A]">
            Well Done!
          </h2>
          <p className="text-xs text-[#5B6461] font-medium mt-0.5">
            Great job completing this activity!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#F6F3EC] p-3.5 rounded-xl border border-[#1B3A3A]/12">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#5B6461] font-bold uppercase">{i18nService.t('score')}</span>
            <span className="text-xl font-extrabold text-[#1B3A3A]">{score || 0}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#5B6461] font-bold uppercase">{i18nService.t('accuracy')}</span>
            <span className="text-xl font-extrabold text-[#7FA593]">{accuracy || 100}%</span>
          </div>
        </div>

        {/* Adaptive Difficulty Feedback Banner */}
        {adaptation && adaptation.feedbackMessage && (
          <div className="bg-[#F6F3EC] border border-[#1B3A3A]/12 p-3.5 rounded-xl text-left flex items-start gap-2.5">
            <span className="text-base">✨</span>
            <div>
              <h4 className="text-[10px] font-bold uppercase text-[#1B3A3A]">Personalized Adaptation</h4>
              <p className="text-xs font-semibold text-[#5B6461] mt-0.5">
                {adaptation.feedbackMessage}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onPlayAgain}
            className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold py-3.5 px-5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all min-h-[48px] text-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onAnotherGame}
              className="w-full bg-white border border-[#1B3A3A]/12 hover:border-[#1B3A3A] text-[#1B3A3A] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[42px] text-xs"
            >
              <span>Another Game</span>
            </button>
            <button
              onClick={onGoHome}
              className="w-full bg-white border border-[#1B3A3A]/12 hover:border-[#1B3A3A] text-[#1B3A3A] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[42px] text-xs"
            >
              <Home className="w-3.5 h-3.5 text-[#1B3A3A]" />
              <span>Today</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
