import React, { useState } from 'react';
import { moodService, MOOD_OPTIONS } from '../../services/moodService';
import { voiceService } from '../../services/voiceService';
import { Sparkles, Heart, Sun, Coffee, Check, X, ArrowRight, Smile } from 'lucide-react';

const MOOD_RESPONSES = {
  very_good: {
    title: "Wonderful to hear!",
    message: (name) => `Your bright energy brings joy to today, ${name}! Have an incredible and happy day ahead. 🌟`,
    suggestion: "Perfect time to enjoy a Memory Match game or take a light walk!",
    bgGradient: "bg-emerald-50 border-emerald-200 text-emerald-900",
    accentColor: "bg-emerald-600 text-white"
  },
  good: {
    title: "That's wonderful!",
    message: (name) => `A calm and peaceful heart makes every moment beautiful, ${name}. Enjoy your lovely day! 🍃`,
    suggestion: "Enjoy your morning tea, check your daily routine, or relax with gentle music.",
    bgGradient: "bg-amber-50 border-amber-200 text-amber-900",
    accentColor: "bg-amber-600 text-white"
  },
  okay: {
    title: "Thank you for sharing!",
    message: (name) => `Every day has its own rhythm, ${name}. Take things one gentle step at a time today. 🍵`,
    suggestion: "Remember to stay hydrated and take comfortable breaks whenever you need.",
    bgGradient: "bg-blue-50 border-blue-200 text-blue-900",
    accentColor: "bg-blue-600 text-white"
  },
  not_good: {
    title: "Sending extra warmth!",
    message: (name) => `We are right here with you, ${name}. ❤️ Please take extra rest and take it easy today.`,
    suggestion: "A cozy rest period or speaking with family will help you feel comfortable.",
    bgGradient: "bg-rose-50 border-rose-200 text-rose-900",
    accentColor: "bg-rose-600 text-white"
  }
};

export function LoginMoodModal({ isOpen, onClose, profileName, onTriggerToast }) {
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [activeStep, setActiveStep] = useState('select'); // 'select' | 'response'

  if (!isOpen) return null;

  const handleSelectMood = async (optionId) => {
    setSelectedMoodId(optionId);
    await moodService.logMood(optionId);
    
    const responseObj = MOOD_RESPONSES[optionId] || MOOD_RESPONSES.good;
    const spokenText = `${responseObj.title} ${responseObj.message(profileName || 'friend')}`;
    voiceService.speak(spokenText);

    if (onTriggerToast) {
      onTriggerToast("Mood check-in recorded.", 'success');
    }

    setActiveStep('response');
  };

  const handleFinish = () => {
    setActiveStep('select');
    setSelectedMoodId(null);
    onClose();
  };

  const nameToDisplay = profileName || 'Friend';
  const selectedOption = MOOD_OPTIONS.find(m => m.id === selectedMoodId);
  const moodResponse = selectedMoodId ? MOOD_RESPONSES[selectedMoodId] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#1B3A3A]/20 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-scale-up text-center relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 text-stone-400 hover:text-[#1B3A3A] p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {activeStep === 'select' ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-[#E8825F]/15 text-[#E8825F] rounded-full flex items-center justify-center border border-[#E8825F]/30 shadow-xs">
                <Smile className="w-8 h-8 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7FA593]">
                  Daily Welcome Check-In
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif-fraunces text-[#1B3A3A] mt-0.5">
                  How are you feeling today, {nameToDisplay}?
                </h3>
                <p className="text-xs text-[#5B6461] mt-1 font-medium max-w-sm mx-auto">
                  Take a quick moment to check in so we can tailor your day.
                </p>
              </div>
            </div>

            {/* Mood Options Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {MOOD_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectMood(item.id)}
                  className="card-product p-4 flex flex-col items-center justify-center text-center transition-all active:scale-95 hover:border-[#1B3A3A] bg-[#F6F3EC]/60 hover:bg-[#F6F3EC] border border-[#1B3A3A]/10 group min-h-[105px] cursor-pointer"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>
                  <span className="text-sm font-bold text-[#1B3A3A]">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-[#5B6461] font-medium pt-1">
              Selecting your mood updates your daily companion message.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in py-2">
            <div className="flex flex-col items-center space-y-3">
              <span className="text-6xl animate-bounce">
                {selectedOption?.emoji || '🌟'}
              </span>
              <h3 className="text-2xl font-serif-fraunces text-[#1B3A3A]">
                {moodResponse?.title}
              </h3>
            </div>

            <div className={`p-5 rounded-2xl border text-left space-y-2.5 ${moodResponse?.bgGradient}`}>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                <p className="text-sm font-semibold leading-relaxed">
                  {moodResponse?.message(nameToDisplay)}
                </p>
              </div>
              {moodResponse?.suggestion && (
                <div className="pt-2 border-t border-current/15 flex items-center gap-2 text-xs font-medium">
                  <Coffee className="w-4 h-4 shrink-0 opacity-75" />
                  <span>{moodResponse.suggestion}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-[#1B3A3A] hover:bg-[#152e2e] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all min-h-[48px] cursor-pointer"
            >
              <span>Open My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
