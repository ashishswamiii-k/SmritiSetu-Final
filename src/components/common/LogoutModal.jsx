import React from 'react';
import { LogOut, ShieldCheck, X } from 'lucide-react';

export function LogoutModal({ isOpen, onClose, onConfirmLogout }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#1B3A3A]/20 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scale-up text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-[#1B3A3A] p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-[#E8825F]/15 text-[#E8825F] rounded-full flex items-center justify-center mx-auto border border-[#E8825F]/30">
          <LogOut className="w-7 h-7 stroke-[2.2]" />
        </div>

        <div>
          <h3 className="text-2xl font-serif-fraunces text-[#1B3A3A]">Switch User?</h3>
          <p className="text-xs text-[#5B6461] mt-1 font-medium leading-relaxed">
            Your saved activities and history will remain safely stored on this device.
          </p>
        </div>

        <div className="p-3 bg-[#F6F3EC] rounded-xl border border-[#1B3A3A]/10 text-left flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#7FA593] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#5B6461] font-medium leading-tight">
            Logging out returns to the profile selection screen so another person can use SmritiSetu.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-3 border border-[#1B3A3A]/15 rounded-xl font-bold text-xs text-[#5B6461] hover:bg-stone-50 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmLogout}
            className="w-1/2 py-3 bg-[#E8825F] hover:bg-[#d97352] text-white rounded-xl font-bold text-xs shadow-xs transition-colors min-h-[44px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
