import React, { useState } from 'react';
import { i18nService } from '../../services/i18nService';
import { AccessibilitySettings } from './AccessibilitySettings';
import { AvatarLibrary, AvatarSvg } from './AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { User, Globe, ShieldAlert, Heart, Save } from 'lucide-react';

export function PatientProfile({ profile, onUpdateProfile, onTriggerToast }) {
  const [name, setName] = useState(profile?.name || '');
  const [avatar, setAvatar] = useState(profile?.avatar || 'male_1');
  const [photoDataUrl, setPhotoDataUrl] = useState(profile?.photoDataUrl || null);
  const [currentLang, setCurrentLang] = useState(profile?.language || i18nService.getLanguage());

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateProfile({
      ...profile,
      name: name.trim(),
      avatar,
      photoDataUrl,
      language: currentLang
    });

    if (onTriggerToast) {
      onTriggerToast("Profile saved successfully.", 'success');
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-5">
      {/* Brand & Profile Header */}
      <div className="card-product p-6 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {photoDataUrl ? (
            <img
              src={photoDataUrl}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E8825F]"
            />
          ) : (
            <AvatarSvg avatarId={avatar} size={64} />
          )}
          <div>
            <h2 className="text-2xl font-serif-fraunces text-[#1B3A3A]">
              {name || 'SmritiSetu User'}
            </h2>
            <p className="text-xs font-semibold text-[#5B6461] mt-0.5">
              Personal Profile & Preferences
            </p>
            <span className="text-[11px] text-[#7FA593] font-bold block mt-1">
              Every Day, Remembered.
            </span>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSaveProfile} className="card-product p-6 bg-white shadow-xs space-y-5">
        <h3 className="text-base font-bold text-[#1B3A3A]">Edit Profile Details</h3>

        <div>
          <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Your Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1B3A3A] mb-2">Avatar or Photo Selection</label>
          <AvatarLibrary
            selectedAvatar={avatar}
            selectedPhoto={photoDataUrl}
            onSelectAvatar={(avId) => {
              setAvatar(avId);
              setPhotoDataUrl(null);
            }}
            onUploadPhoto={(url) => setPhotoDataUrl(url)}
            onRemovePhoto={() => setPhotoDataUrl(null)}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold py-3 px-6 rounded-xl shadow-xs flex items-center gap-2 transition-all text-xs min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Language Switcher */}
      <div className="card-product p-5 bg-white shadow-xs space-y-3">
        <h3 className="text-base font-bold text-[#1B3A3A] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#E8825F]" />
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
              type="button"
              onClick={() => handleLanguageChange(l.id)}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-all min-h-[42px] ${
                currentLang === l.id
                  ? 'bg-[#1B3A3A] border-[#1B3A3A] text-white'
                  : 'bg-[#F6F3EC] border-[#1B3A3A]/12 text-[#5B6461]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Settings Component */}
      <AccessibilitySettings />

      {/* Family Memories Privacy Boundary */}
      <div className="card-product p-5 bg-white shadow-xs space-y-2">
        <div className="flex items-center gap-2.5">
          <Heart className="w-5 h-5 text-[#E8825F]" />
          <div>
            <h3 className="text-base font-bold text-[#1B3A3A]">Family Memories & Privacy</h3>
            <p className="text-xs text-[#5B6461]">Local privacy foundation</p>
          </div>
        </div>
        <p className="text-xs text-[#5B6461] leading-relaxed">
          Your personal routine and activity data remain safely stored on this device.
        </p>
      </div>

      {/* Medical Disclaimer Box */}
      <div className="card-product p-4 bg-[#F6F3EC] flex items-start gap-3 border border-[#1B3A3A]/12">
        <ShieldAlert className="w-4 h-4 text-[#5B6461] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5B6461] leading-relaxed font-medium">
          {i18nService.t('medicalDisclaimer')}
        </p>
      </div>
    </div>
  );
}
