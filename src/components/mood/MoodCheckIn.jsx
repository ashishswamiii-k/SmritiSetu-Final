import React, { useState, useEffect } from 'react';
import { moodService, MOOD_OPTIONS } from '../../services/moodService';
import { voiceService } from '../../services/voiceService';
import { Calendar, CheckCircle2, Smile } from 'lucide-react';

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
      onTriggerToast("Saved on this device.", 'success');
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedMood(null);
    }, 3500);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="card-product p-6 bg-white shadow-xs">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Self Expression</span>
        <h2 className="text-3xl font-serif-fraunces text-[#1B3A3A] mt-0.5">How are you feeling today?</h2>
        <p className="text-sm font-medium text-[#5B6461] mt-1">
          Take a moment to check in with yourself.
        </p>
      </div>

      {/* Mood Options Grid */}
      <div className="card-product p-6 bg-white shadow-xs space-y-4">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-3 animate-scale-up">
            <div className="w-14 h-14 bg-[#7FA593]/20 text-[#1B3A3A] rounded-full flex items-center justify-center mx-auto border border-[#7FA593]/30">
              <CheckCircle2 className="w-8 h-8 text-[#7FA593]" />
            </div>
            <h3 className="text-2xl font-serif-fraunces text-[#1B3A3A]">Thank you for telling us.</h3>
            <p className="text-sm text-[#5B6461]">Your response has been saved comfortably.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOOD_OPTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectMood(item.id)}
                className="card-product p-5 flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[120px] hover:border-[#1B3A3A] bg-[#F6F3EC]/50 hover:bg-[#F6F3EC]"
              >
                <span className="text-4xl mb-2">{item.emoji}</span>
                <span className="text-sm font-bold text-[#1B3A3A]">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="card-product p-5 bg-white shadow-xs space-y-3">
        <h3 className="text-base font-bold text-[#1B3A3A] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1B3A3A]" />
          <span>Recent Mood Check-ins</span>
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-6 text-[#5B6461] text-xs">
            Your mood check-ins will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F6F3EC]/50 border border-[#1B3A3A]/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{log.emoji || '🙂'}</span>
                  <span className="text-sm font-bold text-[#1B3A3A]">{log.label}</span>
                </div>
                <span className="text-xs text-[#5B6461] font-medium">
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
