import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-40 max-w-md mx-auto animate-bounce-short">
      <div className="bg-[#1E1B4B] text-white px-4 py-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-[#312E81] gap-3">
        <div className="flex items-center gap-3">
          {type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-6 h-6 text-amber-400 shrink-0" />
          )}
          <p className="text-sm font-medium leading-tight">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
