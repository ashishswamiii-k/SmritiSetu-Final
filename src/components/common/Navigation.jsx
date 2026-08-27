import React from 'react';
import { Home, Calendar, Gamepad2, Clock, Smile, User } from 'lucide-react';

export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Today', icon: Home },
    { id: 'myday', label: 'My Day', icon: Calendar },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'reminders', label: 'Reminders', icon: Clock },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#1B3A3A] border-t border-white/10 px-1 py-1.5 shadow-lg md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[50px] min-h-[50px] transition-all ${
                isActive
                  ? 'bg-[#E8825F] text-white font-bold scale-105 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
