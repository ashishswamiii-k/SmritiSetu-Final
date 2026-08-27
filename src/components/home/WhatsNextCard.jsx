import React from 'react';
import { voiceService } from '../../services/voiceService';
import { Clock, CheckCircle2, Volume2, ChevronRight, Sparkles } from 'lucide-react';

export function WhatsNextCard({ nextActivity, onMarkDone, onNavigate }) {
  if (!nextActivity) {
    return (
      <div className="bg-gradient-to-br from-[#DCFCE7] to-[#F0FDF4] border border-emerald-300 p-5 rounded-3xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">What's Next?</span>
            <h3 className="text-lg font-extrabold text-emerald-900 leading-tight">All Tasks Completed!</h3>
            <p className="text-xs text-emerald-700 font-medium">Great job sticking to your routine today.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSpeakWhatsNext = () => {
    voiceService.speak(`Your next activity is ${nextActivity.label} scheduled for ${nextActivity.time}.`);
  };

  return (
    <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FFFBEB] border-2 border-[#F59E0B] p-5 rounded-3xl shadow-xs relative overflow-hidden space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#B45309]">What's Next?</span>
        </div>

        <button
          onClick={handleSpeakWhatsNext}
          className="flex items-center gap-1 text-xs font-bold text-[#78350F] hover:text-[#D97706] bg-white/80 px-2.5 py-1 rounded-full border border-[#FDE68A]"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Hear This</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <span className="text-4xl">{nextActivity.icon || '📌'}</span>
          <div>
            <h3 className="text-xl font-extrabold text-[#1E1B4B] leading-tight">
              {nextActivity.label}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#D97706] text-white">
                {nextActivity.time}
              </span>
              <span className="text-xs text-[#78716C] font-semibold">{nextActivity.category || nextActivity.type}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onMarkDone(nextActivity.id, nextActivity.label)}
          className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm px-4 py-3 rounded-2xl shadow-xs transition-all active:scale-95 min-h-[48px] shrink-0"
        >
          Mark Done
        </button>
      </div>
    </div>
  );
}
