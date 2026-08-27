import React from 'react';
import { Home, Calendar, Gamepad2, Clock, Smile, User, Volume2 } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { voiceService } from '../../services/voiceService';

export function Sidebar({ activeTab, onTabChange, patientName }) {
  const navItems = [
    { id: 'home', label: 'Today', icon: Home },
    { id: 'myday', label: 'My Day', icon: Calendar },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'reminders', label: 'Reminders', icon: Clock },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleHearSchedule = () => {
    const text = patientName 
      ? `Hello ${patientName}. You can view your full day schedule in My Day.`
      : "Welcome to SmritiSetu. Select My Day to view your schedule.";
    voiceService.speak(text);
  };

  return (
    <aside className="w-60 bg-[#1B3A3A] text-white flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 h-screen py-6 px-4 border-r border-[#1B3A3A]/20">
      <div className="space-y-6">
        {/* Official Brand Logo & Tagline */}
        <div className="flex flex-col items-center text-center px-2 pb-2 border-b border-white/10">
          <img
            src={logoImg}
            alt="SmritiSetu Logo"
            className="h-16 w-auto object-contain mb-1 drop-shadow-sm"
          />
          <p className="text-[11px] text-[#7FA593] font-semibold tracking-wide">
            Every Day, Remembered.
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-1" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all min-h-[46px] text-left ${
                  isActive
                    ? 'bg-white/10 text-white font-bold border-l-4 border-[#E8825F]'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#E8825F] text-white' : 'bg-white/10 text-stone-300'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Voice Quick Action Card at bottom of sidebar */}
      <div className="bg-white/10 border border-white/15 p-4 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-[#7FA593] font-bold text-xs">
          <Volume2 className="w-4 h-4 text-[#E8825F]" />
          <span>Voice Help</span>
        </div>
        <p className="text-[11px] text-stone-300">Tap to listen to schedule guidance.</p>
        <button
          onClick={handleHearSchedule}
          className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors min-h-[36px]"
        >
          🔊 Hear Schedule
        </button>
      </div>
    </aside>
  );
}
