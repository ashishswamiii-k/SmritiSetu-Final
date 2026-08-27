import React, { useState, useEffect } from 'react';
import { moodService, MOOD_OPTIONS } from '../../services/moodService';
import { voiceService } from '../../services/voiceService';
import { Heart, Calendar, CheckCircle2 } from 'lucide-react';

export function MoodCheckIn({ onTriggerToast }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    const logs = await moodService.getMoodHistory();
    setHistory(logs);
  };

  const handleSelectMood = async (optionId) => {
    setSelectedMood(optionId);
    await moodService.logMood(optionId);
    setIsSubmitted(true);
    await loadMoodHistory();

    const opt = MOOD_OPTIONS.find(m => m.id === optionId);
    const feedbackText = `Thank you for sharing. You are feeling ${opt ? opt.label : 'good'} today.`;
    voiceService.speak(feedbackText);

    if (onTriggerToast) {
      onTriggerToast("Saved on this device. It will sync when connected.", 'success');
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedMood(null);
    }, 4000);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Self Expression</span>
        <h2 className="text-3xl font-extrabold text-[#78350F] mt-1">How are you feeling today?</h2>
        <p className="text-sm font-medium text-[#92400E] mt-1">
          Take a moment to check in with yourself.
        </p>
      </div>

      {/* Mood Options Grid */}
      <div className="bg-white border-2 border-[#E7E5E4] rounded-3xl p-6 shadow-sm space-y-4">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-3 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#1E1B4B]">Thank you for telling us.</h3>
            <p className="text-sm text-[#78716C]">Your response has been saved comfortably.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {MOOD_OPTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectMood(item.id)}
                className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[130px] hover:border-[#D97706] bg-[#FFFDF9] ${item.color}`}
              >
                <span className="text-5xl mb-2">{item.emoji}</span>
                <span className="text-base font-bold">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#D97706]" />
          <span>Recent Mood Check-ins</span>
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-sm">
            Your mood check-ins will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#F3EFE6]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{log.emoji || '🙂'}</span>
                  <span className="text-base font-bold text-[#1E1B4B]">{log.label}</span>
                </div>
                <span className="text-xs text-[#78716C] font-semibold">
                  {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
