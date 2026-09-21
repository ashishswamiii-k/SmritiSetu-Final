import React, { useState } from 'react';
import { AvatarLibrary } from '../profile/AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { ArrowRight, ArrowLeft, User, Stethoscope, HeartHandshake, X } from 'lucide-react';

export function WelcomeScreen({ onSaveProfile, onCancel }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [password, setPassword] = useState('1234');
  const [gender, setGender] = useState('male');
  const [avatar, setAvatar] = useState('male_1');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      name: name.trim(),
      role,
      password: role === 'caretaker' ? (password.trim() || '1234') : null,
      gender,
      avatar,
      photoDataUrl,
      language
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] flex flex-col justify-center px-4 py-8 max-w-lg mx-auto text-center relative">
      {/* Optional Top Cancel Header Link */}
      {onCancel && (
        <div className="absolute top-6 left-4 sm:left-6">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#1B3A3A] text-[#1B3A3A] hover:text-white border border-[#1B3A3A]/20 transition-all font-bold text-xs cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profiles</span>
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col items-center">
        <img
          src={logoImg}
          alt="SmritiSetu Logo"
          className="w-36 h-auto object-contain mb-2 drop-shadow-sm"
        />
        <h1 className="text-3xl font-serif-fraunces text-[#1B3A3A] tracking-tight">
          SmritiSetu
        </h1>
        <p className="text-xs font-bold text-[#7FA593] tracking-wide mt-0.5">
          Every Day, Remembered.
        </p>
      </div>

      <div className="card-product p-6 bg-white shadow-md space-y-4 text-left relative">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-fraunces text-[#1B3A3A]">
              Create Profile
            </h2>
            <p className="text-xs text-[#5B6461] mt-0.5">
              Enter details and select whether this profile is for a Patient or Caretaker.
            </p>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-[#1B3A3A] p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Cancel creation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Profile Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Grandfather, Mrs. Sharma, Alex (Caretaker)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1.5">Who is this profile for?</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  role === 'patient'
                    ? 'bg-[#1B3A3A] border-[#1B3A3A] text-white shadow-xs'
                    : 'bg-[#F6F3EC] border-[#1B3A3A]/12 text-[#1B3A3A] hover:bg-white'
                }`}
              >
                <Stethoscope className={`w-4 h-4 shrink-0 ${role === 'patient' ? 'text-white' : 'text-[#1B3A3A]'}`} />
                <div>
                  <span className="text-xs font-bold block">Patient</span>
                  <span className={`text-[10px] ${role === 'patient' ? 'text-white/80' : 'text-[#5B6461]'}`}>Primary User</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('caretaker')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  role === 'caretaker'
                    ? 'bg-[#E8825F] border-[#E8825F] text-white shadow-xs'
                    : 'bg-[#F6F3EC] border-[#1B3A3A]/12 text-[#1B3A3A] hover:bg-white'
                }`}
              >
                <HeartHandshake className={`w-4 h-4 shrink-0 ${role === 'caretaker' ? 'text-white' : 'text-[#E8825F]'}`} />
                <div>
                  <span className="text-xs font-bold block">Caretaker</span>
                  <span className={`text-[10px] ${role === 'caretaker' ? 'text-white/80' : 'text-[#5B6461]'}`}>Family / Helper</span>
                </div>
              </button>
            </div>
          </div>

          {role === 'caretaker' && (
            <div>
              <label className="block text-xs font-bold text-[#1B3A3A] mb-1">
                Caretaker Login Password
              </label>
              <input
                type="password"
                required
                placeholder="Set password (default: 1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
              />
              <p className="text-[10px] text-[#5B6461] mt-1 font-medium">
                Initial password to unlock Caretaker Portal from the login screen.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1.5">Preferred Avatar or Photo</label>
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

          <div className="flex gap-3 pt-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-1/3 py-3.5 border border-[#1B3A3A]/20 rounded-xl font-bold text-xs text-[#5B6461] hover:bg-stone-50 transition-colors min-h-[50px] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}
            <button
              type="submit"
              className={`${onCancel ? 'w-2/3' : 'w-full'} bg-[#E8825F] hover:bg-[#d97352] text-white font-bold py-3.5 px-6 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all min-h-[50px] text-sm cursor-pointer`}
            >
              <span>Create Profile & Begin</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
