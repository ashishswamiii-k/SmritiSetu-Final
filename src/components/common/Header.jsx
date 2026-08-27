import React, { useState, useEffect } from 'react';
import { syncService } from '../../services/syncService';
import { voiceService } from '../../services/voiceService';
import { reminderService } from '../../services/reminderService';
import { Volume2, Wifi, WifiOff, RefreshCw, User } from 'lucide-react';

export function Header({ patientName, activeTab, onTabChange }) {
  const [networkStatus, setNetworkStatus] = useState({ state: 'ONLINE', label: 'Online', icon: '🟢', pendingCount: 0 });

  useEffect(() => {
    async function updateStatus() {
      const s = await syncService.getStatus();
      setNetworkStatus(s);
    }
    updateStatus();
    const unsubscribe = syncService.subscribe(updateStatus);
    return () => unsubscribe();
  }, []);

  const handleWhatsNextVoice = async () => {
    const nextItem = await reminderService.getWhatsNextActivity();
    if (nextItem) {
      voiceService.speak(`Your next activity is ${nextItem.label} at ${nextItem.time}.`);
    } else {
      voiceService.speak("All scheduled activities for today are completed!");
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'myday': return 'My Day Schedule';
      case 'games': return 'Mind Games';
      case 'reminders': return 'Reminders';
      case 'mood': return 'Mood Check-in';
      case 'profile': return 'Profile & Settings';
      case 'home': default: return 'SmritiSetu';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9] border-b border-[#F3EFE6] px-4 py-3 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Branding & Page Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold text-lg md:hidden">
            S
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1E1B4B] leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#78716C] hidden sm:block">A gentle companion for everyday moments</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick "What's Next?" Voice Button */}
          <button
            onClick={handleWhatsNextVoice}
            className="hidden sm:flex items-center gap-1.5 bg-[#FEF3C7] text-[#78350F] hover:bg-[#FDE68A] px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors border border-[#FDE68A] min-h-[40px]"
            title="Read next activity aloud"
          >
            <Volume2 className="w-4 h-4 text-[#D97706]" />
            <span>What's Next?</span>
          </button>

          {/* Network Status Badge */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              networkStatus.state === 'ONLINE' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : networkStatus.state === 'SYNC_PENDING' 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
            title={`Status: ${networkStatus.label} (${networkStatus.pendingCount} pending)`}
          >
            {networkStatus.state === 'ONLINE' && <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            {networkStatus.state === 'SYNC_PENDING' && <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
            {networkStatus.state === 'OFFLINE' && <WifiOff className="w-3.5 h-3.5 text-rose-600" />}
            <span className="hidden xs:inline">{networkStatus.label}</span>
          </div>

          {/* Profile Trigger Button */}
          <button
            onClick={() => onTabChange('profile')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#E7E5E4] hover:border-[#D97706] flex items-center justify-center text-[#1E1B4B] font-bold text-sm transition-colors min-w-[40px] min-h-[40px]"
            aria-label="Profile Settings"
          >
            <User className="w-5 h-5 text-[#D97706]" />
          </button>
        </div>
      </div>
    </header>
  );
}
