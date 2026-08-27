import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { voiceService } from '../../services/voiceService';
import { Clock, CheckCircle2, Plus, Volume2, Pill, Droplet, Footprints, Stethoscope, Utensils, Moon, Coffee } from 'lucide-react';

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

  const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'medicine': return <Pill className="w-4 h-4 text-[#E8825F]" />;
      case 'hydration': return <Droplet className="w-4 h-4 text-[#1B3A3A]" />;
      case 'meal': return <Utensils className="w-4 h-4 text-[#E8825F]" />;
      case 'exercise': return <Footprints className="w-4 h-4 text-[#7FA593]" />;
      case 'rest': return <Moon className="w-4 h-4 text-[#1B3A3A]" />;
      default: return <Coffee className="w-4 h-4 text-[#E8825F]" />;
    }
  };

  const filteredList = reminders.filter(r => {
    if (filter === 'pending') return r.status !== 'done';
    if (filter === 'completed') return r.status === 'done';
    return true;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="card-product p-6 bg-white shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Daily Schedule</span>
          <h2 className="text-3xl font-serif-fraunces text-[#1B3A3A]">My Reminders</h2>
          <p className="text-sm font-medium text-[#5B6461] mt-1">
            Stay on track with medicine, hydration, and walking.
          </p>
        </div>

        <button
          onClick={handleReadAloud}
          className="bg-[#1B3A3A] hover:bg-[#254f4f] text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs text-xs min-h-[42px]"
          title="Read reminders aloud"
        >
          <Volume2 className="w-4 h-4 text-[#7FA593]" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Filter Tabs & Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 bg-[#F6F3EC] p-1 rounded-xl border border-[#1B3A3A]/12">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs capitalize transition-all min-h-[34px] ${
                filter === f
                  ? 'bg-[#1B3A3A] text-white shadow-xs'
                  : 'text-[#5B6461] hover:text-[#1B3A3A]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 shadow-xs transition-colors min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="card-product p-8 text-center text-[#5B6461] bg-white">
            <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No reminders found in this view.</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isDone = item.status === 'done';
            return (
              <div
                key={item.id}
                className={`card-product p-4 flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-stone-50/60 opacity-80'
                    : 'bg-white hover:border-[#1B3A3A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F6F3EC] border border-[#1B3A3A]/10 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.type)}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${isDone ? 'line-through text-stone-400' : 'text-[#1B3A3A]'}`}>
                      {item.label}
                    </h3>
                    <p className="text-xs font-semibold text-[#5B6461] mt-0.5">{item.time}</p>
                  </div>
                </div>

                <div>
                  {isDone ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#7FA593]/20 text-[#1B3A3A] font-bold rounded-lg text-xs border border-[#7FA593]/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7FA593]" />
                      <span>✓ Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkDone(item.id, item.label)}
                      className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors min-h-[38px] active:scale-95"
                    >
                      Mark Done
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
          <div className="bg-white border border-[#1B3A3A]/20 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-scale-up">
            <h3 className="text-xl font-serif-fraunces text-[#1B3A3A]">Add Reminder</h3>
            
            <form onSubmit={handleAddReminderSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Reminder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Tea, Eye Drops"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="04:00 PM"
                    className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="hydration">Hydration</option>
                    <option value="activity">Activity</option>
                    <option value="appointment">Appointment</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-[#1B3A3A]/12 rounded-xl font-bold text-xs text-[#5B6461]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#E8825F] text-white rounded-xl font-bold text-xs shadow-xs"
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
