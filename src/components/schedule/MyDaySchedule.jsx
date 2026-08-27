import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { voiceService } from '../../services/voiceService';
import { Calendar, CheckCircle2, Volume2, Plus, Clock, Pill, Droplet, Utensils, Footprints, Moon, Coffee } from 'lucide-react';

export function MyDaySchedule({ onTriggerToast }) {
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('04:00 PM');
  const [newCategory, setNewCategory] = useState('Activity');
  const [newRepeat, setNewRepeat] = useState('Every day');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const data = await reminderService.getReminders();
    setSchedule(data);
  };

  const handleMarkDone = async (id, label) => {
    await reminderService.markAsDone(id);
    await loadSchedule();
    if (onTriggerToast) {
      onTriggerToast(`✓ Completed "${label}"`, 'success');
    }
    voiceService.speak(`Completed ${label}`);
  };

  const handleReadSchedule = () => {
    const pending = schedule.filter(s => s.status !== 'done');
    if (pending.length === 0) {
      voiceService.speak("All activities for today are completed!");
      return;
    }
    const readout = `You have ${pending.length} activities remaining today. Next is ${pending[0].label} at ${pending[0].time}.`;
    voiceService.speak(readout);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let icon = '📌';
    if (newCategory === 'Medicine') icon = '💊';
    if (newCategory === 'Hydration') icon = '💧';
    if (newCategory === 'Meal') icon = '🥣';
    if (newCategory === 'Exercise') icon = '🚶';
    if (newCategory === 'Rest') icon = '🌙';

    await reminderService.addReminder({
      label: newTitle.trim(),
      time: newTime,
      type: newCategory.toLowerCase(),
      category: newCategory,
      repeat: newRepeat,
      icon
    });

    setNewTitle('');
    setIsModalOpen(false);
    await loadSchedule();
    if (onTriggerToast) {
      onTriggerToast(`Added "${newTitle}" to My Day schedule.`, 'success');
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

  const filteredItems = schedule.filter(item => {
    if (filter === 'pending') return item.status !== 'done';
    if (filter === 'completed') return item.status === 'done';
    return true;
  });

  const completedCount = schedule.filter(s => s.status === 'done').length;

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="card-product p-6 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Chronological Timeline</span>
          <h2 className="text-3xl font-serif-fraunces text-[#1B3A3A] tracking-tight">My Day Schedule</h2>
          <p className="text-sm font-medium text-[#5B6461] mt-1">
            Your full daily routine from morning to evening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#F6F3EC] border border-[#1B3A3A]/12 px-3.5 py-2 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-[#5B6461] uppercase block">Completed</span>
            <span className="text-base font-extrabold text-[#7FA593]">{completedCount} of {schedule.length}</span>
          </div>

          <button
            onClick={handleReadSchedule}
            className="bg-[#1B3A3A] hover:bg-[#254f4f] text-white font-bold py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors text-xs min-h-[42px] shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-[#7FA593]" />
            <span>Read Schedule</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Add Action */}
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
          <span>Add Activity</span>
        </button>
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="card-product p-8 text-center text-[#5B6461] bg-white">
            <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No activities found in this view.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isDone = item.status === 'done';
            return (
              <div
                key={item.id}
                className={`card-product p-4 flex items-center justify-between gap-3 transition-all ${
                  isDone
                    ? 'bg-stone-50/60 opacity-80'
                    : 'bg-white hover:border-[#1B3A3A]'
                }`}
              >
                {/* Time & Icon */}
                <div className="flex items-center gap-3">
                  <div className="min-w-[65px] text-center font-bold text-xs text-white bg-[#1B3A3A] py-1.5 px-2 rounded-lg">
                    {item.time}
                  </div>

                  <div className="w-9 h-9 rounded-lg bg-[#F6F3EC] border border-[#1B3A3A]/10 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.type)}
                  </div>

                  <div>
                    <h3 className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-stone-400' : 'text-[#1B3A3A]'}`}>
                      {item.label}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#F6F3EC] text-[#5B6461] border border-[#1B3A3A]/10">
                        {item.category || item.type}
                      </span>
                      <span className="text-[10px] text-[#5B6461]">{item.repeat || 'Every day'}</span>
                    </div>
                  </div>
                </div>

                {/* Status / Action Button */}
                <div>
                  {isDone ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#7FA593]/20 text-[#1B3A3A] font-bold rounded-lg text-xs border border-[#7FA593]/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7FA593]" />
                      <span>✓ Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkDone(item.id, item.label)}
                      className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs transition-colors min-h-[38px] active:scale-95 shrink-0"
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

      {/* Add Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#1B3A3A]/20 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-scale-up">
            <h3 className="text-xl font-serif-fraunces text-[#1B3A3A]">Add Schedule Activity</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Tea, Light Yoga"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
                  >
                    <option value="Activity">Activity</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Meal">Meal</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Rest">Rest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B3A3A] mb-1">Repeat</label>
                <select
                  value={newRepeat}
                  onChange={(e) => setNewRepeat(e.target.value)}
                  className="w-full bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-xl p-3 text-sm font-medium outline-hidden focus:border-[#1B3A3A]"
                >
                  <option value="Every day">Every day</option>
                  <option value="One-time">One-time</option>
                  <option value="Mon / Wed / Fri">Mon / Wed / Fri</option>
                  <option value="Tue / Thu / Sat">Tue / Thu / Sat</option>
                </select>
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
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
