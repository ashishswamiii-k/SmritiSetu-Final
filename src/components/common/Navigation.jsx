import React from 'react';
import { Home, Calendar, Gamepad2, Clock, Smile, User } from 'lucide-react';
import { i18nService } from '../../services/i18nService';

export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'myday', label: 'My Day', icon: Calendar },
    { id: 'games', label: i18nService.t('navGames'), icon: Gamepad2 },
    { id: 'reminders', label: i18nService.t('navReminders'), icon: Clock },
    { id: 'mood', label: i18nService.t('navMood'), icon: Smile },
    { id: 'profile', label: i18nService.t('navProfile'), icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9] border-t border-[#F3EFE6] px-1 py-1.5 shadow-lg md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl min-w-[50px] min-h-[50px] transition-all ${
                isActive
                  ? 'bg-[#D97706] text-white font-bold shadow-xs scale-105'
                  : 'text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1E1B4B]'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
