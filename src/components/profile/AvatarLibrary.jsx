import React from 'react';
import { Camera, Check, User } from 'lucide-react';

export const MALE_AVATARS = [
  { id: 'male_1', label: 'Elderly Gentleman with Glasses', bg: '#1B3A3A', shirt: '#7FA593', hair: '#5B6461', glasses: true },
  { id: 'male_2', label: 'Kind Grandpa with Smile', bg: '#7FA593', shirt: '#1B3A3A', hair: '#9CA3AF', glasses: false },
  { id: 'male_3', label: 'Distinguished Grandpa', bg: '#E8825F', shirt: '#F6F3EC', hair: '#D1D5DB', glasses: true },
  { id: 'male_4', label: 'Friendly Senior in Blue', bg: '#2563EB', shirt: '#F6F3EC', hair: '#6B7280', glasses: false },
  { id: 'male_5', label: 'Grandpa with Cap', bg: '#059669', shirt: '#1B3A3A', hair: '#9CA3AF', glasses: true },
  { id: 'male_6', label: 'Warm & Cheerful Senior', bg: '#D97706', shirt: '#F6F3EC', hair: '#E5E7EB', glasses: false },
];

export const FEMALE_AVATARS = [
  { id: 'female_1', label: 'Kind Grandma with Bun', bg: '#E8825F', shirt: '#F6F3EC', hair: '#D1D5DB', bun: true, glasses: false },
  { id: 'female_2', label: 'Graceful Senior with Glasses', bg: '#1B3A3A', shirt: '#7FA593', hair: '#9CA3AF', bun: false, glasses: true },
  { id: 'female_3', label: 'Warm Grandma in Sage', bg: '#7FA593', shirt: '#1B3A3A', hair: '#E5E7EB', bun: true, glasses: false },
  { id: 'female_4', label: 'Smiling Senior Lady', bg: '#DB2777', shirt: '#F6F3EC', hair: '#9CA3AF', bun: false, glasses: true },
  { id: 'female_5', label: 'Gentle Grandma with Shawl', bg: '#7C3AED', shirt: '#F6F3EC', hair: '#D1D5DB', bun: true, glasses: false },
  { id: 'female_6', label: 'Cheerful Grandma', bg: '#0D9488', shirt: '#1B3A3A', hair: '#E5E7EB', bun: false, glasses: false },
];

export function AvatarSvg({ avatarId, size = 56 }) {
  const allAvatars = [...MALE_AVATARS, ...FEMALE_AVATARS];
  const config = allAvatars.find(a => a.id === avatarId) || MALE_AVATARS[0];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="rounded-full shadow-xs shrink-0">
      {/* Background Circle */}
      <circle cx="50" cy="50" r="50" fill={config.bg} />
      
      {/* Body / Shirt */}
      <ellipse cx="50" cy="95" rx="36" ry="24" fill={config.shirt} />
      
      {/* Head */}
      <circle cx="50" cy="45" r="22" fill="#F6F3EC" stroke="#1B3A3A" strokeWidth="2.5" />
      
      {/* Hair Bun if female */}
      {config.bun && (
        <circle cx="50" cy="20" r="8" fill={config.hair} />
      )}

      {/* Hair Top */}
      <path
        d={config.bun ? "M 30 40 Q 50 24 70 40 Q 50 32 30 40 Z" : "M 28 42 Q 50 18 72 42 Q 50 26 28 42 Z"}
        fill={config.hair}
      />

      {/* Glasses if enabled */}
      {config.glasses ? (
        <g>
          <circle cx="42" cy="45" r="6" fill="none" stroke="#1B3A3A" strokeWidth="2" />
          <circle cx="58" cy="45" r="6" fill="none" stroke="#1B3A3A" strokeWidth="2" />
          <line x1="48" y1="45" x2="52" y2="45" stroke="#1B3A3A" strokeWidth="2" />
        </g>
      ) : (
        /* Eyes */
        <g fill="#1B3A3A">
          <circle cx="42" cy="44" r="2.2" />
          <circle cx="58" cy="44" r="2.2" />
        </g>
      )}

      {/* Gentle Smile */}
      <path
        d="M 42 54 Q 50 59 58 54"
        fill="none"
        stroke="#1B3A3A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AvatarLibrary({ selectedAvatar, selectedPhoto, onSelectAvatar, onUploadPhoto, onRemovePhoto }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadPhoto(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload Option */}
      <div className="card-product p-4 bg-[#F6F3EC] flex items-center justify-between border border-[#1B3A3A]/12">
        <div className="flex items-center gap-3">
          {selectedPhoto ? (
            <img
              src={selectedPhoto}
              alt="Uploaded profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#E8825F]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white border border-[#1B3A3A]/20 flex items-center justify-center text-[#5B6461]">
              <Camera className="w-6 h-6 text-[#1B3A3A]" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-[#1B3A3A]">
              {selectedPhoto ? 'Custom Photo Active' : 'Upload Your Photo'}
            </h4>
            <p className="text-xs text-[#5B6461]">Use a photo from your device</p>
          </div>
        </div>

        <div className="flex gap-2">
          <label className="bg-[#1B3A3A] hover:bg-[#254f4f] text-white font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer shadow-xs min-h-[38px] flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#7FA593]" />
            <span>{selectedPhoto ? 'Change Photo' : 'Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {selectedPhoto && (
            <button
              onClick={onRemovePhoto}
              className="border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Gentleman Avatars */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5B6461] mb-2.5">
          Select Avatar (Gentlemen)
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {MALE_AVATARS.map((av) => {
            const isSelected = !selectedPhoto && selectedAvatar === av.id;
            return (
              <button
                key={av.id}
                onClick={() => onSelectAvatar(av.id)}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all relative ${
                  isSelected
                    ? 'bg-[#1B3A3A]/10 border-2 border-[#E8825F] scale-105 shadow-md'
                    : 'bg-white border-[#1B3A3A]/12 hover:border-[#1B3A3A]'
                }`}
                title={av.label}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#E8825F] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <AvatarSvg avatarId={av.id} size={52} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Ladies Avatars */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5B6461] mb-2.5">
          Select Avatar (Ladies)
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {FEMALE_AVATARS.map((av) => {
            const isSelected = !selectedPhoto && selectedAvatar === av.id;
            return (
              <button
                key={av.id}
                onClick={() => onSelectAvatar(av.id)}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all relative ${
                  isSelected
                    ? 'bg-[#1B3A3A]/10 border-2 border-[#E8825F] scale-105 shadow-md'
                    : 'bg-white border-[#1B3A3A]/12 hover:border-[#1B3A3A]'
                }`}
                title={av.label}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#E8825F] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <AvatarSvg avatarId={av.id} size={52} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
