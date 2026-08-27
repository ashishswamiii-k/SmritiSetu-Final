import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { voiceService } from '../../services/voiceService';
import { i18nService } from '../../services/i18nService';
import { Clock, CheckCircle2, Plus, Volume2, Pill, Droplet, Footprints, Stethoscope } from 'lucide-react';

export function ReminderList({ onTriggerToast }) {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('12:00 PM');
  const [newType, setNewType] = useState('medicine');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const list = await reminderService.getReminders();
    setReminders(list);
  };

  const handleMarkDone = async (id, label) => {
    await reminderService.markAsDone(id);
    await loadReminders();
    if (onTriggerToast) {
      onTriggerToast(`✓ Completed "${label}"`, 'success');
    }
    voiceService.speak(`Completed ${label}`);
  };

  const handleReadAloud = () => {
    const pending = reminders.filter(r => r.status !== 'done');
    if (pending.length === 0) {
      voiceService.speak("You have no pending reminders today.");
      return;
    }
    const text = `You have ${pending.length} reminders today. ${pending.map(p => `${p.label} at ${p.time}`).join('. ')}`;
    voiceService.speak(text);
  };

  const handleAddReminderSubmit = async (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    let icon = '📌';
    if (newType === 'medicine') icon = '💊';
    if (newType === 'hydration') icon = '💧';
    if (newType === 'activity') icon = '🚶';
    if (newType === 'appointment') icon = '🩺';

    await reminderService.addReminder({
      label: newLabel.trim(),
      time: newTime,
      type: newType,
      icon
    });

    setNewLabel('');
    setIsModalOpen(false);
    await loadReminders();
    if (onTriggerToast) {
      onTriggerToast(`Added new reminder "${newLabel}"`, 'success');
    }
  };

  const filteredList = reminders.filter(r => {
    if (filter === 'pending') return r.status !== 'done';
    if (filter === 'completed') return r.status === 'done';
    return true;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Daily Schedule</span>
          <h2 className="text-3xl font-extrabold text-[#78350F]">My Reminders</h2>
          <p className="text-sm font-medium text-[#92400E] mt-1">
            Stay on track with medicines, hydration, and walking.
          </p>
        </div>

        <button
          onClick={handleReadAloud}
          className="bg-white text-[#B45309] hover:bg-[#FEF3C7] font-bold p-3.5 rounded-2xl shadow-xs border border-[#FDE68A] flex items-center gap-2 transition-colors min-h-[48px]"
          title="Read reminders aloud"
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-xs">Read Aloud</span>
        </button>
      </div>

      {/* Filter Tabs & Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 bg-[#FAF9F6] p-1.5 rounded-2xl border border-[#E7E5E4]">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-all min-h-[38px] ${
                filter === f
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#1E1B4B]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs py-2.5 px-4 rounded-2xl flex items-center gap-1.5 shadow-xs transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#E7E5E4] rounded-3xl p-8 text-center text-[#78716C]">
            <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-base font-semibold">No reminders found in this view.</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isDone = item.status === 'done';
            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-stone-50 border-stone-200 opacity-75'
                    : 'bg-white border-[#E7E5E4] hover:border-[#D97706] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    isDone ? 'bg-stone-200' : 'bg-[#FEF3C7]'
                  }`}>
                    {item.icon || '📌'}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDone ? 'line-through text-stone-500' : 'text-[#1E1B4B]'}`}>
                      {item.label}
                    </h3>
                    <p className="text-xs font-semibold text-[#78716C] mt-0.5">{item.time}</p>
                  </div>
                </div>

                <div>
                  {isDone ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-2xl text-xs border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✓ Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkDone(item.id, item.label)}
                      className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-xs transition-colors min-h-[48px] active:scale-95"
                    >
                      Mark as Done
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#D97706] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-2xl font-bold text-[#1E1B4B]">Add Daily Reminder</h3>
            
            <form onSubmit={handleAddReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Reminder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Tea, Eye Drops"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#E7E5E4] rounded-2xl p-3.5 text-base font-medium outline-hidden focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="04:00 PM"
                    className="w-full bg-[#FFFDF9] border border-[#E7E5E4] rounded-2xl p-3.5 text-base font-medium outline-hidden focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#E7E5E4] rounded-2xl p-3.5 text-base font-medium outline-hidden focus:border-[#D97706]"
                  >
                    <option value="medicine">💊 Medicine</option>
                    <option value="hydration">💧 Hydration</option>
                    <option value="activity">🚶 Activity</option>
                    <option value="appointment">🩺 Appointment</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 border border-[#E7E5E4] rounded-2xl font-bold text-sm text-[#57534E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#D97706] text-white rounded-2xl font-bold text-sm shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
