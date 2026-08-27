import React, { useState } from 'react';
import { AvatarLibrary } from '../profile/AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { ArrowRight, User } from 'lucide-react';

export function WelcomeScreen({ onSaveProfile }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [avatar, setAvatar] = useState('male_1');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      name: name.trim(),
      gender,
      avatar,
      photoDataUrl,
      language
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] flex flex-col justify-center px-4 py-8 max-w-lg mx-auto text-center">
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

      <div className="card-product p-6 bg-white shadow-md space-y-4 text-left">
        <div>
          <h2 className="text-xl font-serif-fraunces text-[#1B3A3A]">
            Create Your Profile
          </h2>
          <p className="text-xs text-[#5B6461] mt-0.5">
            Welcome! Please enter your name and select an avatar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Grandfather, Mrs. Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
            />
          </div>

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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold py-3.5 px-6 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all min-h-[50px] text-sm"
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
