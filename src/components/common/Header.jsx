import React, { useState, useEffect } from 'react';
import { syncService } from '../../services/syncService';
import { voiceService } from '../../services/voiceService';
import { Volume2, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function Header({ patientName, language }) {
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

  const handleSpeakWelcome = () => {
    const greeting = patientName ? `Welcome back, ${patientName}.` : "Welcome to SmritiSetu.";
    voiceService.speak(greeting);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9] border-b border-[#F3EFE6] px-4 py-3 shadow-xs transition-colors">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1E1B4B] leading-tight">SmritiSetu</h1>
            <p className="text-xs text-[#78716C]">Everyday Companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <span>{networkStatus.label}</span>
          </div>

          {/* Voice Greeting Trigger */}
          <button
            onClick={handleSpeakWelcome}
            aria-label="Voice greeting"
            className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A] flex items-center justify-center transition-colors min-w-[40px] min-h-[40px]"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
