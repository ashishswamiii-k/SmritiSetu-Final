import React from 'react';
import { voiceService } from '../../services/voiceService';
import { Volume2, CheckCircle2, Pill, Droplet, Utensils, Footprints, Moon, Coffee, Sparkles } from 'lucide-react';

export function WhatsNextCard({ nextActivity, onMarkDone }) {
  if (!nextActivity) {
    return (
      <div className="card-product p-5 flex items-center justify-between bg-white shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#7FA593]/20 text-[#1B3A3A] flex items-center justify-center text-lg font-bold">
            ✓
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7FA593]">Up Next</span>
            <h3 className="text-base font-serif-fraunces text-[#1B3A3A] leading-tight">All Tasks Completed!</h3>
            <p className="text-xs text-[#5B6461] font-medium">Great job sticking to your routine today.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSpeakWhatsNext = () => {
    voiceService.speak(`Your next activity is ${nextActivity.label} scheduled for ${nextActivity.time}.`);
  };

  const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'medicine': return <Pill className="w-5 h-5 text-[#E8825F]" />;
      case 'hydration': return <Droplet className="w-5 h-5 text-[#1B3A3A]" />;
      case 'meal': return <Utensils className="w-5 h-5 text-[#E8825F]" />;
      case 'exercise': return <Footprints className="w-5 h-5 text-[#7FA593]" />;
      case 'rest': return <Moon className="w-5 h-5 text-[#1B3A3A]" />;
      default: return <Coffee className="w-5 h-5 text-[#E8825F]" />;
    }
  };

  return (
    <div className="card-product p-5 space-y-3 bg-white shadow-xs relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E8825F]" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E8825F]">Up Next</span>
        </div>

        <button
          onClick={handleSpeakWhatsNext}
          className="flex items-center gap-1 text-xs font-bold text-[#1B3A3A] hover:text-[#E8825F] bg-[#F6F3EC] px-2.5 py-1 rounded-full border border-[#1B3A3A]/12"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#E8825F]" />
          <span>Hear This</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Tinted Rounded Icon Chip */}
          <div className="w-12 h-12 rounded-xl bg-[#F6F3EC] border border-[#1B3A3A]/10 flex items-center justify-center shrink-0">
            {getCategoryIcon(nextActivity.type)}
          </div>

          <div>
            <h3 className="text-lg font-serif-fraunces text-[#1B3A3A] leading-tight">
              {nextActivity.label}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#1B3A3A] text-white">
                {nextActivity.time}
              </span>
              <span className="text-xs text-[#5B6461] font-semibold">{nextActivity.category || nextActivity.type}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onMarkDone(nextActivity.id, nextActivity.label)}
          className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 min-h-[44px] shrink-0"
        >
          Mark Done
        </button>
      </div>
    </div>
  );
}
