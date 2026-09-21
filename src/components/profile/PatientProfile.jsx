import React, { useState } from 'react';
import { i18nService } from '../../services/i18nService';
import { localDataProvider } from '../../services/data/LocalDataProvider';
import { AccessibilitySettings } from './AccessibilitySettings';
import { AvatarLibrary, AvatarSvg } from './AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { User, Globe, ShieldAlert, Heart, Save, Stethoscope, HeartHandshake, Copy, Key } from 'lucide-react';

export function PatientProfile({ profile, onUpdateProfile, onTriggerToast }) {
  const [name, setName] = useState(profile?.name || '');
  const [role, setRole] = useState(profile?.role || 'patient');
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
      role,
      avatar,
      photoDataUrl,
      language: currentLang
    });

    if (onTriggerToast) {
      onTriggerToast("Profile saved successfully.", 'success');
    }
  };

  const isCaretaker = role === 'caretaker';
  const patientCode = profile?.patientCode || localDataProvider.generatePatientCode(profile?.id || 'p1');

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
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-serif-fraunces text-[#1B3A3A]">
                {name || 'SmritiSetu User'}
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                  isCaretaker
                    ? 'bg-[#E8825F]/15 text-[#D05C38] border-[#E8825F]/40'
                    : 'bg-[#1B3A3A]/10 text-[#1B3A3A] border-[#1B3A3A]/20'
                }`}
              >
                {isCaretaker ? (
                  <>
                    <HeartHandshake className="w-3 h-3 text-[#D05C38]" />
                    Caretaker
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-3 h-3 text-[#1B3A3A]" />
                    Patient
                  </>
                )}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#5B6461] mt-0.5">
              Personal Profile & Preferences
            </p>
            <span className="text-[11px] text-[#7FA593] font-bold block mt-1">
              Every Day, Remembered.
            </span>
          </div>
        </div>
      </div>

      {/* Patient Unique Access Code Card */}
      {!isCaretaker && (
        <div className="card-product p-5 bg-white shadow-xs border-l-4 border-l-[#1B3A3A] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-[#5B6461] uppercase tracking-wider block">
                Unique Patient Access Code
              </span>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-2xl font-mono font-extrabold text-[#1B3A3A] tracking-wider bg-[#F6F3EC] px-3.5 py-1.5 rounded-xl border border-[#1B3A3A]/15 select-all">
                  {patientCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(patientCode);
                    if (onTriggerToast) onTriggerToast("Patient Code copied to clipboard!", "success");
                  }}
                  className="p-2.5 bg-[#1B3A3A] text-white hover:bg-[#152e2e] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-[#5B6461] max-w-xs font-medium leading-relaxed">
              Give this unique code to your caretaker. They will enter it into their Caretaker Portal to monitor your schedule and check-ins.
            </p>
          </div>
        </div>
      )}

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
          <label className="block text-xs font-bold text-[#1B3A3A] mb-1.5">Profile Role (Displays on Login Page)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                role === 'patient'
                  ? 'bg-[#1B3A3A] border-[#1B3A3A] text-white shadow-xs'
                  : 'bg-[#F6F3EC] border-[#1B3A3A]/12 text-[#1B3A3A] hover:bg-white'
              }`}
            >
              <Stethoscope className={`w-5 h-5 shrink-0 ${role === 'patient' ? 'text-white' : 'text-[#1B3A3A]'}`} />
              <div>
                <span className="text-xs font-bold block">Patient / Elder</span>
                <span className={`text-[10px] ${role === 'patient' ? 'text-white/80' : 'text-[#5B6461]'}`}>Primary App User</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('caretaker')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                role === 'caretaker'
                  ? 'bg-[#E8825F] border-[#E8825F] text-white shadow-xs'
                  : 'bg-[#F6F3EC] border-[#1B3A3A]/12 text-[#1B3A3A] hover:bg-white'
              }`}
            >
              <HeartHandshake className={`w-5 h-5 shrink-0 ${role === 'caretaker' ? 'text-white' : 'text-[#E8825F]'}`} />
              <div>
                <span className="text-xs font-bold block">Caretaker / Family</span>
                <span className={`text-[10px] ${role === 'caretaker' ? 'text-white/80' : 'text-[#5B6461]'}`}>Helper & Assistant</span>
              </div>
            </button>
          </div>
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
            className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold py-3 px-6 rounded-xl shadow-xs flex items-center gap-2 transition-all text-xs min-h-[44px] cursor-pointer"
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
