import React, { useState, useEffect } from 'react';
import { syncService } from '../../services/syncService';
import { voiceService } from '../../services/voiceService';
import { reminderService } from '../../services/reminderService';
import { i18nService } from '../../services/i18nService';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';
import logoImg from '../../assets/logo.png';
import { Volume2, Wifi, WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';

export function Header({ profile, activeTab, onNavigate, onGoBack, canGoBack, onRequestLogout }) {
  const [networkStatus, setNetworkStatus] = useState({ state: 'ONLINE', label: 'Online', pendingCount: 0 });

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
      case 'myday': return i18nService.t('myDaySchedule');
      case 'games': return i18nService.t('mindGames');
      case 'reminders': return i18nService.t('myReminders');
      case 'mood': return i18nService.t('howAmIFeeling');
      case 'profile': return i18nService.t('navProfile');
      case 'home': default: return i18nService.t('navHome');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F6F3EC] border-b border-[#1B3A3A]/12 px-4 md:px-8 py-3 shadow-xs transition-colors">
      <div className="w-full max-w-[1500px] mx-auto flex items-center justify-between">
        {/* Left: Back Button & Page Title */}
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#1B3A3A] text-[#1B3A3A] hover:text-white border border-[#1B3A3A]/20 transition-all font-bold text-xs cursor-pointer shadow-xs"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{i18nService.t('back')}</span>
            </button>
          )}

          <div className="md:hidden flex items-center gap-2">
            <img src={logoImg} alt="SmritiSetu" className="h-8 w-auto object-contain" />
          </div>

          <div>
            <h1 className="text-xl font-serif-fraunces text-[#1B3A3A] leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#5B6461] hidden sm:block font-medium">{i18nService.t('welcomeSubtitle')}</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick "What's Next?" Voice Button */}
          <button
            onClick={handleWhatsNextVoice}
            className="hidden sm:flex items-center gap-1.5 bg-[#E8825F] hover:bg-[#d97352] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs min-h-[38px]"
            title="Read next activity aloud"
          >
            <Volume2 className="w-4 h-4 text-white" />
            <span>{i18nService.t('whatsNext')}</span>
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

          {/* Profile Dropdown Menu */}
          <ProfileMenuDropdown
            profile={profile}
            onNavigate={onNavigate}
            onRequestLogout={onRequestLogout}
          />
        </div>
      </div>
    </header>
  );
}
