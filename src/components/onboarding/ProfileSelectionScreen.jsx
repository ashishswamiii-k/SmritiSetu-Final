import React, { useState } from 'react';
import { i18nService } from '../../services/i18nService';
import { AvatarSvg } from '../profile/AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { CaretakerPasswordModal } from './CaretakerPasswordModal';
import { UserPlus, ChevronRight, Stethoscope, HeartHandshake, Lock } from 'lucide-react';

export function ProfileSelectionScreen({ profiles, onSelectProfile, onCreateNewProfile }) {
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);

  const patientProfiles = profiles.filter(p => p.role !== 'caretaker');
  const caretakerProfiles = profiles.filter(p => p.role === 'caretaker');

  const handleCardClick = (profile) => {
    if (profile.role === 'caretaker') {
      setSelectedCaretaker(profile);
    } else {
      onSelectProfile(profile.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] flex flex-col justify-center px-4 py-8 max-w-5xl mx-auto text-center">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <img
          src={logoImg}
          alt="SmritiSetu Logo"
          className="w-36 h-auto object-contain mb-2 drop-shadow-sm"
        />
        <h1 className="text-3xl sm:text-4xl font-serif-fraunces text-[#1B3A3A] tracking-tight">
          {i18nService.t('welcomeTitle')}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#7FA593] tracking-wide mt-0.5">
          {i18nService.t('welcomeSubtitle')}
        </p>
      </div>

      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-serif-fraunces text-[#1B3A3A]">
          {i18nService.t('whoIsUsingToday')}
        </h2>
        <p className="text-xs sm:text-sm text-[#5B6461] max-w-lg mx-auto font-medium">
          {i18nService.t('selectProfileSubtitle')}
        </p>
      </div>

      {/* Two Column Side-by-Side Layout: Left Patient Login | Right Caretaker Login */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* LEFT SIDE: PATIENT LOGIN */}
        <div className="card-product p-6 bg-white shadow-md space-y-4 border-t-4 border-t-[#1B3A3A] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1B3A3A]/10">
              <div className="w-10 h-10 rounded-xl bg-[#1B3A3A]/10 text-[#1B3A3A] flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif-fraunces text-[#1B3A3A]">
                  {i18nService.t('patientLoginTitle')}
                </h3>
                <p className="text-[11px] text-[#5B6461] font-medium">
                  {i18nService.t('patientLoginSubtitle')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {patientProfiles.length === 0 ? (
                <div className="p-4 bg-[#F6F3EC]/50 rounded-xl text-center text-xs text-[#5B6461]">
                  No patient profiles created yet.
                </div>
              ) : (
                patientProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleCardClick(p)}
                    className="w-full card-product p-3.5 flex items-center justify-between bg-[#F6F3EC]/50 hover:bg-[#F6F3EC] hover:border-[#1B3A3A] transition-all group min-h-[68px] cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      {p.photoDataUrl ? (
                        <img
                          src={p.photoDataUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#1B3A3A]"
                        />
                      ) : (
                        <AvatarSvg avatarId={p.avatar || 'male_1'} size={48} />
                      )}
                      <div>
                        <h4 className="text-base font-bold text-[#1B3A3A] group-hover:text-[#E8825F] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-xs text-[#5B6461] block">
                          {i18nService.t('patientTapToOpen')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#5B6461] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onCreateNewProfile}
              className="w-full card-product p-3.5 flex items-center justify-center gap-2 border-2 border-dashed border-[#1B3A3A]/20 hover:border-[#1B3A3A] bg-[#F6F3EC]/30 hover:bg-white text-[#1B3A3A] font-bold text-xs transition-all min-h-[50px] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#1B3A3A]" />
              <span>{i18nService.t('addPatientProfile')}</span>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: CARETAKER LOGIN */}
        <div className="card-product p-6 bg-white shadow-md space-y-4 border-t-4 border-t-[#E8825F] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1B3A3A]/10">
              <div className="w-10 h-10 rounded-xl bg-[#E8825F]/15 text-[#D05C38] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif-fraunces text-[#1B3A3A]">
                  {i18nService.t('caretakerLoginTitle')}
                </h3>
                <p className="text-[11px] text-[#5B6461] font-medium">
                  {i18nService.t('caretakerLoginSubtitle')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {caretakerProfiles.length === 0 ? (
                <div className="p-4 bg-[#F6F3EC]/50 rounded-xl text-center text-xs text-[#5B6461]">
                  No caretaker profiles created yet.
                </div>
              ) : (
                caretakerProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleCardClick(p)}
                    className="w-full card-product p-3.5 flex items-center justify-between bg-[#F6F3EC]/50 hover:bg-[#F6F3EC] hover:border-[#E8825F] transition-all group min-h-[68px] cursor-pointer"
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
                      <div>
                        <h4 className="text-base font-bold text-[#1B3A3A] group-hover:text-[#E8825F] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-xs text-[#5B6461] block">
                          {i18nService.t('caretakerRequiresPassword')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#D05C38]" />
                      <ChevronRight className="w-5 h-5 text-[#5B6461] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onCreateNewProfile}
              className="w-full card-product p-3.5 flex items-center justify-center gap-2 border-2 border-dashed border-[#E8825F]/30 hover:border-[#E8825F] bg-[#F6F3EC]/30 hover:bg-white text-[#D05C38] font-bold text-xs transition-all min-h-[50px] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#E8825F]" />
              <span>{i18nService.t('addCaretakerProfile')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caretaker Password Verification Modal */}
      <CaretakerPasswordModal
        isOpen={Boolean(selectedCaretaker)}
        profile={selectedCaretaker}
        onClose={() => setSelectedCaretaker(null)}
        onSuccess={(profileId) => {
          setSelectedCaretaker(null);
          onSelectProfile(profileId);
        }}
      />
    </div>
  );
}

