import React, { useState, useEffect } from 'react';
import { accessibilityService } from '../../services/accessibilityService';
import { Type, Eye, Volume2, Sliders } from 'lucide-react';

export function AccessibilitySettings() {
  const [settings, setSettings] = useState(accessibilityService.getSettings());

  const handleUpdate = (updates) => {
    const updated = accessibilityService.updateSettings(updates);
    setSettings(updated);
  };

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 shadow-xs space-y-6">
      <h3 className="text-xl font-bold text-[#1E1B4B]">Accessibility & Comfort</h3>

      {/* Text Size */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
          <Type className="w-5 h-5 text-[#D97706]" />
          <span>Text Size</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'standard', label: 'Standard' },
            { id: 'large', label: 'Large' },
            { id: 'extralarge', label: 'Extra Large' }
          ].map((size) => (
            <button
              key={size.id}
              onClick={() => handleUpdate({ textSize: size.id })}
              className={`py-3 px-2 rounded-2xl border-2 font-bold text-xs transition-all min-h-[48px] ${
                settings.textSize === size.id
                  ? 'bg-[#FEF3C7] border-[#D97706] text-[#B45309]'
                  : 'bg-white border-[#E7E5E4] text-[#57534E]'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* High Contrast */}
      <div className="flex items-center justify-between p-4 bg-[#FFFDF9] border border-[#E7E5E4] rounded-2xl">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-[#D97706]" />
          <div>
            <h4 className="text-sm font-bold text-[#1E1B4B]">High Contrast Mode</h4>
            <p className="text-xs text-[#78716C]">Clearer boundaries & sharp text</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleUpdate({ highContrast: !settings.highContrast })}
          className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
            settings.highContrast ? 'bg-[#D97706]' : 'bg-stone-300'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform ${
              settings.highContrast ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Voice Assistance */}
      <div className="flex items-center justify-between p-4 bg-[#FFFDF9] border border-[#E7E5E4] rounded-2xl">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-[#D97706]" />
          <div>
            <h4 className="text-sm font-bold text-[#1E1B4B]">Voice Announcements</h4>
            <p className="text-xs text-[#78716C]">Speak reminders & greetings</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleUpdate({ voiceEnabled: !settings.voiceEnabled })}
          className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
            settings.voiceEnabled ? 'bg-[#D97706]' : 'bg-stone-300'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform ${
              settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Speech Speed */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1E1B4B] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#D97706]" />
            <span>Voice Speech Speed</span>
          </span>
          <span className="text-xs font-bold text-[#D97706]">{settings.speechRate || 0.9}x</span>
        </label>
        <input
          type="range"
          min="0.6"
          max="1.2"
          step="0.1"
          value={settings.speechRate || 0.9}
          onChange={(e) => handleUpdate({ speechRate: parseFloat(e.target.value) })}
          className="w-full accent-[#D97706]"
        />
      </div>
    </div>
  );
}
