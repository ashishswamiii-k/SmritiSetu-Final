import React, { useState } from 'react';
import { localDataProvider } from '../../services/data/LocalDataProvider';
import { AvatarSvg } from '../profile/AvatarLibrary';
import { KeyRound, Search, CheckCircle2, ShieldAlert, X, ArrowRight, UserCheck } from 'lucide-react';

export function LinkPatientModal({ isOpen, caretakerId, onClose, onSuccess, onTriggerToast }) {
  const [patientCode, setPatientCode] = useState('');
  const [fetchedPatient, setFetchedPatient] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCodeChange = async (value) => {
    setPatientCode(value);
    setErrorMsg('');
    if (value.trim().length >= 4) {
      const match = await localDataProvider.getPatientByCode(value);
      if (match) {
        setFetchedPatient(match);
      } else {
        setFetchedPatient(null);
      }
    } else {
      setFetchedPatient(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientCode.trim()) return;

    setLoading(true);
    setErrorMsg('');

    const res = await localDataProvider.linkPatientToCaretaker(caretakerId, patientCode.trim());
    setLoading(false);

    if (res.success) {
      setPatientCode('');
      setFetchedPatient(null);
      if (onTriggerToast) onTriggerToast(res.message, 'success');
      onSuccess();
    } else {
      setErrorMsg(res.message || 'Could not link patient.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#1B3A3A]/20 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl animate-scale-up text-center relative">
        <button
          onClick={() => {
            setPatientCode('');
            setFetchedPatient(null);
            setErrorMsg('');
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-[#1B3A3A] p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-[#1B3A3A]/10 text-[#1B3A3A] rounded-full flex items-center justify-center mx-auto border border-[#1B3A3A]/20 shadow-xs mb-3">
          <KeyRound className="w-7 h-7 stroke-[2]" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7FA593]">
            Caretaker Patient Authorization
          </span>
          <h3 className="text-2xl font-serif-fraunces text-[#1B3A3A] mt-0.5">
            Link Patient by Access Code
          </h3>
          <p className="text-xs text-[#5B6461] mt-1 font-medium">
            Enter the patient's unique code (e.g. PAT-1000) to auto-fetch their records into your database.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1">
              Patient Access Code *
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. PAT-4821"
                value={patientCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/15 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono font-bold uppercase outline-hidden focus:border-[#1B3A3A]"
              />
            </div>
          </div>

          {/* Auto-Fetched Patient Preview */}
          {fetchedPatient && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                {fetchedPatient.photoDataUrl ? (
                  <img
                    src={fetchedPatient.photoDataUrl}
                    alt={fetchedPatient.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-600"
                  />
                ) : (
                  <AvatarSvg avatarId={fetchedPatient.avatar || 'male_1'} size={44} />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-emerald-950">{fetchedPatient.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Patient Found • Access Code Verified
                  </span>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 border border-[#1B3A3A]/15 rounded-xl font-bold text-xs text-[#5B6461] hover:bg-stone-50 min-h-[46px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !fetchedPatient}
              className="w-2/3 bg-[#1B3A3A] hover:bg-[#152e2e] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[46px] cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-[#7FA593]" />
              <span>{loading ? 'Linking...' : 'Add Patient to Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
