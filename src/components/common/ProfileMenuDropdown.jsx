import React, { useState, useRef, useEffect } from 'react';
import { AvatarSvg } from '../profile/AvatarLibrary';
import { i18nService } from '../../services/i18nService';
import { User, Settings, Eye, LogOut, ChevronDown } from 'lucide-react';

export function ProfileMenuDropdown({ profile, onNavigate, onRequestLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tab) => {
    onNavigate(tab);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onRequestLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#1B3A3A]/12 hover:border-[#1B3A3A] transition-all min-h-[42px]"
        aria-expanded={isOpen}
        aria-label="Profile menu"
      >
        {profile?.photoDataUrl ? (
          <img
            src={profile.photoDataUrl}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover border border-[#E8825F]"
          />
        ) : (
          <AvatarSvg avatarId={profile?.avatar || 'male_1'} size={32} />
        )}
        <span className="text-xs font-bold text-[#1B3A3A] hidden sm:inline max-w-[120px] truncate">
          {profile?.name || 'User'}
        </span>
        <ChevronDown className="w-4 h-4 text-[#5B6461]" />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#1B3A3A]/15 rounded-2xl shadow-xl z-50 overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="p-4 bg-[#F6F3EC] border-b border-[#1B3A3A]/10 flex items-center gap-3">
            {profile?.photoDataUrl ? (
              <img
                src={profile.photoDataUrl}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E8825F]"
              />
            ) : (
              <AvatarSvg avatarId={profile?.avatar || 'male_1'} size={40} />
            )}
            <div>
              <h4 className="text-sm font-bold text-[#1B3A3A] truncate max-w-[140px]">
                {profile?.name || 'SmritiSetu User'}
              </h4>
              <p className="text-[11px] text-[#7FA593] font-semibold">{i18nService.t('welcomeSubtitle')}</p>
            </div>
          </div>

          {/* Nav Items */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => handleSelect('profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B3A3A] hover:bg-[#F6F3EC] transition-colors min-h-[40px]"
            >
              <User className="w-4 h-4 text-[#E8825F]" />
              <span>{i18nService.t('myProfile')}</span>
            </button>

            <button
              onClick={() => handleSelect('profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B3A3A] hover:bg-[#F6F3EC] transition-colors min-h-[40px]"
            >
              <Eye className="w-4 h-4 text-[#7FA593]" />
              <span>{i18nService.t('accessibilityTextSize')}</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="p-2 border-t border-[#1B3A3A]/10">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors min-h-[40px]"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{i18nService.t('logoutSwitchUser')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
