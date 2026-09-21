import React, { useState } from 'react';
import { localDataProvider } from '../../services/data/LocalDataProvider';
import { Lock, KeyRound, ShieldAlert, X, ArrowRight } from 'lucide-react';

export function CaretakerPasswordModal({ isOpen, profile, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setErrorMsg('');

    const isValid = await localDataProvider.verifyCaretakerPassword(profile.id, password);
    setLoading(false);

    if (isValid) {
      setPassword('');
      onSuccess(profile.id);
    } else {
      setErrorMsg('Incorrect caretaker password. (Default is 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#1B3A3A]/20 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up text-center relative">
        <button
          onClick={() => {
            setPassword('');
            setErrorMsg('');
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-[#1B3A3A] p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-[#E8825F]/15 text-[#E8825F] rounded-full flex items-center justify-center mx-auto border border-[#E8825F]/30 shadow-xs mb-3">
          <Lock className="w-7 h-7 stroke-[2.2]" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D05C38]">
            Caretaker Security Portal
          </span>
          <h3 className="text-2xl font-serif-fraunces text-[#1B3A3A] mt-0.5">
            Welcome back, {profile.name}
          </h3>
          <p className="text-xs text-[#5B6461] mt-1 font-medium">
            Enter your caretaker password to access management controls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-left">
          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter password (default: 1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/15 rounded-xl pl-9 pr-3 py-2.5 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
              />
            </div>
            <p className="text-[10px] text-[#5B6461] mt-1">
              Initial password for caretakers is <strong>1234</strong>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 border border-[#1B3A3A]/15 rounded-xl font-bold text-xs text-[#5B6461] hover:bg-stone-50 min-h-[46px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[#E8825F] hover:bg-[#d97352] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[46px] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Unlock Caretaker Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
