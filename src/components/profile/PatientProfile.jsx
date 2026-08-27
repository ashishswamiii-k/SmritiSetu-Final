import React, { useState, useEffect } from 'react';
import { localDataProvider } from '../../services/data/LocalDataProvider';
import { i18nService } from '../../services/i18nService';
import { AccessibilitySettings } from './AccessibilitySettings';
import { User, Globe, ShieldAlert, Heart, Edit3 } from 'lucide-react';

export function PatientProfile({ profile, onUpdateProfile, onTriggerToast }) {
  const [currentLang, setCurrentLang] = useState(i18nService.getLanguage());

  const handleLanguageChange = (lang) => {
    i18nService.setLanguage(lang);
    setCurrentLang(lang);
    if (onUpdateProfile && profile) {
      onUpdateProfile({ ...profile, language: lang });
    }
    if (onTriggerToast) {
      onTriggerToast("Language updated.", 'info');
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Profile Card Header */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-[#D97706] text-white flex items-center justify-center font-bold text-3xl shadow-md">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#78350F]">
            {profile?.name || 'SmritiSetu User'}
          </h2>
          <p className="text-xs font-semibold text-[#92400E] mt-0.5">
            {profile?.age ? `Age ${profile.age} • ` : ''}Personal Profile
          </p>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 shadow-xs space-y-3">
        <h3 className="text-lg font-bold text-[#1E1B4B] flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#D97706]" />
          <span>App Language</span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिंदी' },
            { id: 'as', label: 'অসমীয়া' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => handleLanguageChange(l.id)}
              className={`py-3 px-3 rounded-2xl border-2 font-bold text-sm transition-all min-h-[48px] ${
                currentLang === l.id
                  ? 'bg-[#FEF3C7] border-[#D97706] text-[#B45309]'
                  : 'bg-white border-[#E7E5E4] text-[#57534E]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Settings Component */}
      <AccessibilitySettings />

      {/* Patient Local Memories Foundation Card */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-[#D97706]" />
          <div>
            <h3 className="text-lg font-bold text-[#1E1B4B]">Family Memories</h3>
            <p className="text-xs text-[#78716C]">Local privacy & memory foundation</p>
          </div>
        </div>
        <p className="text-xs text-[#57534E] leading-relaxed">
          Your personal memories and preferences stay safely stored on this device. Future caregiver features require explicit consent before sharing.
        </p>
      </div>

      {/* Medical Disclaimer Box */}
      <div className="bg-[#FAF9F6] border border-[#E7E5E4] p-5 rounded-3xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#78716C] shrink-0 mt-0.5" />
        <p className="text-xs text-[#78716C] leading-relaxed font-medium">
          {i18nService.t('medicalDisclaimer')}
        </p>
      </div>
    </div>
  );
}
