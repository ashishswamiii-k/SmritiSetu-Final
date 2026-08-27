import React from 'react';
import { Home, Calendar, Gamepad2, Clock, Smile, User, Volume2 } from 'lucide-react';
import { i18nService } from '../../services/i18nService';
import { voiceService } from '../../services/voiceService';

export function Sidebar({ activeTab, onTabChange, patientName }) {
  const navItems = [
    { id: 'home', label: 'Home / Today', icon: Home },
    { id: 'myday', label: 'My Day', icon: Calendar },
    { id: 'games', label: i18nService.t('navGames'), icon: Gamepad2 },
    { id: 'reminders', label: i18nService.t('navReminders'), icon: Clock },
    { id: 'mood', label: i18nService.t('navMood'), icon: Smile },
    { id: 'profile', label: i18nService.t('navProfile'), icon: User }
  ];

  const handleHearSchedule = () => {
    const text = patientName 
      ? `Hello ${patientName}. You can view your full day schedule in My Day.`
      : "Welcome to SmritiSetu. Select My Day to view your chronological schedule.";
    voiceService.speak(text);
  };

  return (
    <aside className="w-60 bg-[#FFFDF9] border-r border-[#F3EFE6] flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 h-screen py-6 px-4">
      <div className="space-y-6">
        {/* Logo Branding */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-extrabold text-xl shadow-xs ring-4 ring-[#FEF3C7]">
            S
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1E1B4B] tracking-tight">SMRITISETU</h1>
            <p className="text-xs text-[#78716C] font-semibold">Everyday Companion</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1.5 pt-2" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all min-h-[48px] text-left ${
                  isActive
                    ? 'bg-[#D97706] text-white shadow-sm'
                    : 'text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1E1B4B]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Voice Quick Action Banner at bottom of sidebar */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-[#78350F] font-bold text-xs">
          <Volume2 className="w-4 h-4 text-[#D97706]" />
          <span>Voice Help</span>
        </div>
        <p className="text-xs text-[#92400E]">Tap below to listen to your schedule guidance.</p>
        <button
          onClick={handleHearSchedule}
          className="w-full bg-white hover:bg-[#FDE68A] text-[#78350F] font-bold text-xs py-2 px-3 rounded-xl border border-[#FDE68A] transition-colors min-h-[36px]"
        >
          🔊 Hear Schedule
        </button>
      </div>
    </aside>
  );
}
