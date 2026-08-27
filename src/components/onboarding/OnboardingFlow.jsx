import React, { useState } from 'react';
import { accessibilityService } from '../../services/accessibilityService';
import { i18nService } from '../../services/i18nService';
import { User, Globe, Type, Volume2, Check } from 'lucide-react';

export function OnboardingFlow({ onComplete }) {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [age, setAge] = useState('');
  const [textSize, setTextSize] = useState('standard');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Apply accessibility settings
    accessibilityService.updateSettings({
      textSize,
      voiceEnabled
    });

    // Set i18n language
    i18nService.setLanguage(language);

    const profile = {
      name: name.trim(),
      language,
      age: age ? parseInt(age, 10) : null,
      textSize,
      voiceEnabled,
      createdAt: new Date().toISOString()
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] px-6 py-8 max-w-lg mx-auto flex flex-col justify-between">
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#1E1B4B] mb-2">Welcome Friend</h2>
          <p className="text-[#57534E] text-base">Let's set up your profile in just a few simple steps.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
              <User className="w-5 h-5 text-[#D97706]" />
              <span>What should we call you?</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grandma, Aji, Uncle Ashish"
              className="w-full bg-white border-2 border-[#E7E5E4] focus:border-[#D97706] rounded-2xl px-5 py-4 text-lg text-[#1E1B4B] font-medium outline-hidden shadow-xs transition-colors"
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#D97706]" />
              <span>Preferred Language</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिंदी' },
                { id: 'as', label: 'অসমীয়া' }
              ].map((lang) => (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`py-3.5 px-3 rounded-2xl border-2 font-bold text-sm transition-all min-h-[52px] ${
                    language === lang.id
                      ? 'bg-[#FEF3C7] border-[#D97706] text-[#B45309]'
                      : 'bg-white border-[#E7E5E4] text-[#57534E]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Size Preference */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
              <Type className="w-5 h-5 text-[#D97706]" />
              <span>Comfortable Text Size</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'standard', label: 'Standard' },
                { id: 'large', label: 'Large' },
                { id: 'extralarge', label: 'Extra Large' }
              ].map((size) => (
                <button
                  type="button"
                  key={size.id}
                  onClick={() => {
                    setTextSize(size.id);
                    accessibilityService.updateSettings({ textSize: size.id });
                  }}
                  className={`py-3.5 px-2 rounded-2xl border-2 font-bold text-xs transition-all min-h-[52px] ${
                    textSize === size.id
                      ? 'bg-[#FEF3C7] border-[#D97706] text-[#B45309]'
                      : 'bg-white border-[#E7E5E4] text-[#57534E]'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Assistance */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#D97706]" />
              <span>Voice Assistance</span>
            </label>
            <div className="flex items-center justify-between p-4 bg-white border-2 border-[#E7E5E4] rounded-2xl">
              <span className="text-sm font-medium text-[#1E1B4B]">Read text aloud for reminders</span>
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                  voiceEnabled ? 'bg-[#D97706]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Optional Age */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#78716C]">
              Age (Optional)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 68"
              className="w-full bg-white border-2 border-[#E7E5E4] focus:border-[#D97706] rounded-2xl px-5 py-3 text-base text-[#1E1B4B] outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full text-white text-lg font-bold py-4 px-6 rounded-3xl shadow-lg flex items-center justify-center gap-2 transition-all min-h-[56px] ${
              name.trim()
                ? 'bg-[#D97706] hover:bg-[#B45309] active:scale-95'
                : 'bg-stone-300 cursor-not-allowed'
            }`}
          >
            <span>Start Using SmritiSetu</span>
            <Check className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
