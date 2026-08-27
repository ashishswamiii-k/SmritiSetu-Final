import React from 'react';
import { Home, Calendar, Gamepad2, Clock, Smile, User, Volume2, LogOut } from 'lucide-react';
import { AvatarSvg } from '../profile/AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { voiceService } from '../../services/voiceService';

export function Sidebar({ activeTab, onTabChange, profile, onRequestLogout }) {
  const navItems = [
    { id: 'home', label: 'Today', icon: Home },
    { id: 'myday', label: 'My Day', icon: Calendar },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'reminders', label: 'Reminders', icon: Clock },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleHearSchedule = () => {
    const text = profile?.name 
      ? `Hello ${profile.name}. Select My Day to view your schedule.`
      : "Welcome to SmritiSetu. Select My Day to view your schedule.";
    voiceService.speak(text);
  };

  return (
    <aside className="w-60 bg-[#1B3A3A] text-white flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 h-screen py-5 px-4 border-r border-[#1B3A3A]/20 overflow-y-auto">
      <div className="space-y-5">
        {/* Official Brand Logo & Tagline */}
        <div className="flex flex-col items-center text-center px-2 pb-3 border-b border-white/10">
          <img
            src={logoImg}
            alt="SmritiSetu Logo"
            className="h-14 w-auto object-contain mb-1 drop-shadow-sm"
          />
          <p className="text-[11px] text-[#7FA593] font-semibold tracking-wide">
            Every Day, Remembered.
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] text-left ${
                  isActive
                    ? 'bg-white/10 text-white font-bold border-l-4 border-[#E8825F]'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#E8825F] text-white' : 'bg-white/10 text-stone-300'
                }`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active User Card + Voice Help + Logout */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        {/* Active Profile Card */}
        <div
          onClick={() => onTabChange('profile')}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/15 cursor-pointer transition-colors"
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
          <div className="overflow-hidden text-left flex-1">
            <h4 className="text-xs font-bold text-white truncate">{profile?.name || 'User'}</h4>
            <span className="text-[10px] text-[#7FA593] block">Active Profile</span>
          </div>
        </div>

        {/* Voice Quick Action */}
        <button
          onClick={handleHearSchedule}
          className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors min-h-[36px] flex items-center justify-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5 text-white" />
          <span>Hear Schedule</span>
        </button>

        {/* Logout Action */}
        <button
          onClick={onRequestLogout}
          className="w-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors min-h-[36px] flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5 text-stone-400" />
          <span>Switch User</span>
        </button>
      </div>
    </aside>
  );
}
