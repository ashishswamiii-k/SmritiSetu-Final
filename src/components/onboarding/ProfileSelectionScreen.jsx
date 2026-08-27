import React from 'react';
import { AvatarSvg } from '../profile/AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { UserPlus, ChevronRight } from 'lucide-react';

export function ProfileSelectionScreen({ profiles, onSelectProfile, onCreateNewProfile }) {
  return (
    <div className="min-h-screen bg-[#F6F3EC] flex flex-col justify-center px-4 py-8 max-w-lg mx-auto text-center">
      <div className="mb-6 flex flex-col items-center">
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

      <div className="card-product p-6 bg-white shadow-md space-y-5">
        <div>
          <h2 className="text-xl font-serif-fraunces text-[#1B3A3A]">
            Who is using SmritiSetu today?
          </h2>
          <p className="text-xs text-[#5B6461] mt-1 font-medium">
            Select your profile to access your personal schedule and activities.
          </p>
        </div>

        {/* Existing Profile Cards Grid */}
        <div className="space-y-3">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProfile(p.id)}
              className="w-full card-product p-3.5 flex items-center justify-between bg-[#F6F3EC]/50 hover:bg-[#F6F3EC] hover:border-[#1B3A3A] transition-all group min-h-[64px]"
            >
              <div className="flex items-center gap-3.5">
                {p.photoDataUrl ? (
                  <img
                    src={p.photoDataUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#E8825F]"
                  />
                ) : (
                  <AvatarSvg avatarId={p.avatar || 'male_1'} size={48} />
                )}
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#1B3A3A] group-hover:text-[#E8825F] transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-xs text-[#5B6461]">Tap to open dashboard</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#5B6461] group-hover:translate-x-1 transition-transform" />
            </button>
          ))}

          {/* Add Profile Action Card */}
          <button
            onClick={onCreateNewProfile}
            className="w-full card-product p-4 flex items-center justify-center gap-2 border-2 border-dashed border-[#1B3A3A]/20 hover:border-[#1B3A3A] bg-white text-[#1B3A3A] font-bold text-sm transition-all min-h-[56px]"
          >
            <UserPlus className="w-5 h-5 text-[#E8825F]" />
            <span>Add Another Person</span>
          </button>
        </div>
      </div>
    </div>
  );
}
