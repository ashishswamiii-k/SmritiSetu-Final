import React, { useState, useEffect } from 'react';
import { syncService } from '../../services/syncService';
import { voiceService } from '../../services/voiceService';
import { reminderService } from '../../services/reminderService';
import logoImg from '../../assets/logo.png';
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
      case 'home': default: return 'Today';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F6F3EC] border-b border-[#1B3A3A]/12 px-4 py-3 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Mobile Brand & Page Title */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2">
            <img src={logoImg} alt="SmritiSetu" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-serif-fraunces text-[#1B3A3A] leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#5B6461] hidden sm:block">Every Day, Remembered.</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick "What's Next?" Voice Button */}
          <button
            onClick={handleWhatsNextVoice}
            className="hidden sm:flex items-center gap-1.5 bg-[#E8825F] hover:bg-[#d97352] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs min-h-[38px]"
            title="Read next activity aloud"
          >
            <Volume2 className="w-4 h-4 text-white" />
            <span>What's Next?</span>
          </button>

          {/* Network Status Indicator */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              networkStatus.state === 'ONLINE' 
                ? 'bg-[#7FA593]/15 text-[#1B3A3A] border-[#7FA593]/30' 
                : networkStatus.state === 'SYNC_PENDING' 
                ? 'bg-[#E8825F]/15 text-[#E8825F] border-[#E8825F]/30' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
            title={`Status: ${networkStatus.label} (${networkStatus.pendingCount} pending)`}
          >
            {networkStatus.state === 'ONLINE' && <Wifi className="w-3.5 h-3.5 text-[#7FA593]" />}
            {networkStatus.state === 'SYNC_PENDING' && <RefreshCw className="w-3.5 h-3.5 text-[#E8825F] animate-spin" />}
            {networkStatus.state === 'OFFLINE' && <WifiOff className="w-3.5 h-3.5 text-rose-600" />}
            <span className="hidden xs:inline">{networkStatus.label}</span>
          </div>

          {/* Profile Trigger Button */}
          <button
            onClick={() => onTabChange('profile')}
            className="w-9 h-9 rounded-xl bg-white border border-[#1B3A3A]/12 hover:border-[#1B3A3A] flex items-center justify-center text-[#1B3A3A] font-bold text-sm transition-colors min-w-[36px] min-h-[36px]"
            aria-label="Profile Settings"
          >
            <User className="w-4 h-4 text-[#1B3A3A]" />
          </button>
        </div>
      </div>
    </header>
  );
}
