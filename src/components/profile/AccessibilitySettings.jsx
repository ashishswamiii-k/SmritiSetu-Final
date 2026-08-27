import React, { useState } from 'react';
import { accessibilityService } from '../../services/accessibilityService';
import { Type, Eye, Volume2, Sliders } from 'lucide-react';

export function AccessibilitySettings() {
  const [settings, setSettings] = useState(accessibilityService.getSettings());

  const handleUpdate = (updates) => {
    const updated = accessibilityService.updateSettings(updates);
    setSettings(updated);
  };

  return (
    <div className="card-product p-5 bg-white shadow-xs space-y-5">
      <h3 className="text-base font-bold text-[#1B3A3A]">Accessibility & Comfort Settings</h3>

      {/* Text Size */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#1B3A3A] flex items-center gap-2">
          <Type className="w-4 h-4 text-[#E8825F]" />
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
              className={`py-2.5 px-2 rounded-xl border font-bold text-xs transition-all min-h-[42px] ${
                settings.textSize === size.id
                  ? 'bg-[#1B3A3A] border-[#1B3A3A] text-white'
                  : 'bg-[#F6F3EC] border-[#1B3A3A]/12 text-[#5B6461]'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* High Contrast */}
      <div className="flex items-center justify-between p-3.5 bg-[#F6F3EC]/50 border border-[#1B3A3A]/12 rounded-xl">
        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-[#E8825F]" />
          <div>
            <h4 className="text-xs font-bold text-[#1B3A3A]">High Contrast Mode</h4>
            <p className="text-[11px] text-[#5B6461]">Sharper contrast boundaries</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleUpdate({ highContrast: !settings.highContrast })}
          className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
            settings.highContrast ? 'bg-[#E8825F]' : 'bg-stone-300'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform ${
              settings.highContrast ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Voice Announcements */}
      <div className="flex items-center justify-between p-3.5 bg-[#F6F3EC]/50 border border-[#1B3A3A]/12 rounded-xl">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-[#E8825F]" />
          <div>
            <h4 className="text-xs font-bold text-[#1B3A3A]">Voice Readouts</h4>
            <p className="text-[11px] text-[#5B6461]">Speak reminders & greetings</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleUpdate({ voiceEnabled: !settings.voiceEnabled })}
          className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
            settings.voiceEnabled ? 'bg-[#E8825F]' : 'bg-stone-300'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform ${
              settings.voiceEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Speech Speed */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#1B3A3A] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#E8825F]" />
            <span>Voice Speech Speed</span>
          </span>
          <span className="text-xs font-bold text-[#E8825F]">{settings.speechRate || 0.9}x</span>
        </label>
        <input
          type="range"
          min="0.6"
          max="1.2"
          step="0.1"
          value={settings.speechRate || 0.9}
          onChange={(e) => handleUpdate({ speechRate: parseFloat(e.target.value) })}
          className="w-full accent-[#E8825F]"
        />
      </div>
    </div>
  );
}
