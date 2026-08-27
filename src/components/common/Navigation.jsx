import React from 'react';
import { Home, Gamepad2, Clock, Smile, User } from 'lucide-react';
import { i18nService } from '../../services/i18nService';

export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: i18nService.t('navHome'), icon: Home },
    { id: 'games', label: i18nService.t('navGames'), icon: Gamepad2 },
    { id: 'reminders', label: i18nService.t('navReminders'), icon: Clock },
    { id: 'mood', label: i18nService.t('navMood'), icon: Smile },
    { id: 'profile', label: i18nService.t('navProfile'), icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9] border-t border-[#F3EFE6] px-2 py-2 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl min-w-[56px] min-h-[56px] transition-all ${
                isActive
                  ? 'bg-[#D97706] text-white font-bold shadow-xs scale-105'
                  : 'text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1E1B4B]'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-xs tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
