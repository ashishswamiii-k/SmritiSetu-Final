import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { voiceService } from '../../services/voiceService';
import { Calendar, CheckCircle2, Volume2, Plus, Clock, Sparkles } from 'lucide-react';

export function MyDaySchedule({ onTriggerToast }) {
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('04:00 PM');
  const [newCategory, setNewCategory] = useState('Activity');

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
      icon
    });

    setNewTitle('');
    setIsModalOpen(false);
    await loadSchedule();
    if (onTriggerToast) {
      onTriggerToast(`Added "${newTitle}" to My Day schedule.`, 'success');
    }
  };

  const filteredItems = schedule.filter(item => {
    if (filter === 'pending') return item.status !== 'done';
    if (filter === 'completed') return item.status === 'done';
    return true;
  });

  const completedCount = schedule.filter(s => s.status === 'done').length;
  const progressPercent = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Chronological Timeline</span>
          <h2 className="text-3xl font-extrabold text-[#78350F] tracking-tight">My Day Schedule</h2>
          <p className="text-sm font-medium text-[#92400E] mt-1">
            Your full daily routine from morning to evening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Widget */}
          <div className="bg-white/90 border border-[#FDE68A] px-4 py-2.5 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-[#78350F] uppercase block">Progress</span>
            <span className="text-lg font-extrabold text-[#D97706]">{completedCount} of {schedule.length}</span>
          </div>

          <button
            onClick={handleReadSchedule}
            className="bg-white hover:bg-[#FEF3C7] text-[#B45309] font-bold py-3 px-4 rounded-2xl border border-[#FDE68A] flex items-center gap-2 transition-colors min-h-[48px] shadow-xs text-sm"
          >
            <Volume2 className="w-5 h-5 text-[#D97706]" />
            <span>Read Schedule</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Add Action */}
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
          <span>Add Activity</span>
        </button>
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#E7E5E4] rounded-3xl p-8 text-center text-[#78716C]">
            <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-base font-semibold">No activities found in this view.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isDone = item.status === 'done';
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl border-2 flex items-center justify-between gap-3 transition-all ${
                  isDone
                    ? 'bg-stone-50 border-stone-200 opacity-75'
                    : 'bg-white border-[#E7E5E4] hover:border-[#D97706] shadow-xs'
                }`}
              >
                {/* Time & Icon */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="min-w-[65px] text-center font-bold text-sm text-[#D97706] bg-[#FEF3C7] py-2 px-2.5 rounded-2xl border border-[#FDE68A]">
                    {item.time}
                  </div>

                  <span className="text-2xl sm:text-3xl">{item.icon || '📌'}</span>

                  <div>
                    <h3 className={`text-base sm:text-lg font-bold ${isDone ? 'line-through text-stone-500' : 'text-[#1E1B4B]'}`}>
                      {item.label}
                    </h3>
                    <span className="inline-block text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#78716C] border border-[#E7E5E4] mt-0.5">
                      {item.category || item.type}
                    </span>
                  </div>
                </div>

                {/* Status / Action Button */}
                <div>
                  {isDone ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-2xl text-xs border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✓ Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkDone(item.id, item.label)}
                      className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-xs transition-colors min-h-[44px] active:scale-95 shrink-0"
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
          <div className="bg-white border-2 border-[#D97706] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-2xl font-bold text-[#1E1B4B]">Add Schedule Activity</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Tea, Light Yoga"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#E7E5E4] rounded-2xl p-3.5 text-base font-medium outline-hidden focus:border-[#D97706]"
                  >
                    <option value="Activity">😊 Activity</option>
                    <option value="Medicine">💊 Medicine</option>
                    <option value="Hydration">💧 Hydration</option>
                    <option value="Meal">🥣 Meal</option>
                    <option value="Exercise">🚶 Exercise</option>
                    <option value="Rest">🌙 Rest</option>
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
