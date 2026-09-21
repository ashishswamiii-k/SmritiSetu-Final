import React, { useState } from 'react';
import { localDataProvider } from '../../services/data/LocalDataProvider';
import { Lock, KeyRound, ShieldCheck, ShieldAlert, CheckCircle2, Save } from 'lucide-react';

export function CaretakerSecuritySettings({ profile, onTriggerToast }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error', text: '' }
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!oldPassword.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (!newPassword.trim() || newPassword.trim().length < 3) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 3 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    const result = await localDataProvider.changeCaretakerPassword(profile.id, oldPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage({ type: 'success', text: 'Caretaker password updated successfully!' });
      if (onTriggerToast) {
        onTriggerToast('Password updated successfully.', 'success');
      }
    } else {
      setStatusMessage({ type: 'error', text: result.message || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="card-product p-6 bg-white shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#E8825F]/15 text-[#E8825F] rounded-2xl flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-serif-fraunces text-[#1B3A3A]">
              Caretaker Security & Password Settings
            </h3>
            <p className="text-xs text-[#5B6461] mt-0.5">
              Change your login password to secure caretaker administrative controls.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1B3A3A] mb-1">
              Current Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Enter current password (default: 1234)"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/15 rounded-xl pl-9 pr-3 py-2.5 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1B3A3A] mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                placeholder="At least 3 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/15 rounded-xl px-3 py-2.5 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B3A3A] mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/15 rounded-xl px-3 py-2.5 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold py-3 px-6 rounded-xl shadow-xs flex items-center gap-2 transition-all text-xs min-h-[44px] cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Update Caretaker Password'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="card-product p-4 bg-[#F6F3EC] border border-[#1B3A3A]/10 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#7FA593] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5B6461] leading-relaxed">
          Updating your password will require entering the new password next time you log in to the Caretaker Dashboard from the login screen.
        </p>
      </div>
    </div>
  );
}
