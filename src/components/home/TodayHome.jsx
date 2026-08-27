import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { moodService } from '../../services/moodService';
import { voiceService } from '../../services/voiceService';
import { i18nService } from '../../services/i18nService';
import { WhatsNextCard } from './WhatsNextCard';
import { Gamepad2, Smile, Clock, Calendar, ChevronRight, CheckCircle2, Trophy, Brain } from 'lucide-react';

export function TodayHome({ patientName, onNavigate, onTriggerToast }) {
  const [reminders, setReminders] = useState([]);
  const [nextActivity, setNextActivity] = useState(null);
  const [recentMood, setRecentMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    const data = await reminderService.getReminders();
    setReminders(data);
    const next = await reminderService.getWhatsNextActivity();
    setNextActivity(next);
    const moods = await moodService.getMoodHistory();
    if (moods && moods.length > 0) setRecentMood(moods[0]);
    setLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return i18nService.t('goodMorning');
    if (hour < 17) return i18nService.t('goodAfternoon');
    return i18nService.t('goodEvening');
  };

  const handleMarkDone = async (id, label) => {
    await reminderService.markAsDone(id);
    await loadHomeData();
    if (onTriggerToast) {
      onTriggerToast(`✓ Completed "${label}"`, 'success');
    }
    voiceService.speak(`Completed ${label}`);
  };

  const completedCount = reminders.filter(r => r.status === 'done').length;
  const totalCount = reminders.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingList = reminders.filter(r => r.status !== 'done');

  return (
    <div className="pb-24 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      {/* Top Greeting Header */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#78350F] tracking-tight">
            {getGreeting()}{patientName ? `, ${patientName}` : ''}
          </h2>
          <p className="text-base font-medium text-[#92400E] mt-1">
            Here's your day at a glance.
          </p>
        </div>

        <button
          onClick={() => onNavigate('myday')}
          className="bg-white hover:bg-[#FEF3C7] text-[#78350F] font-bold py-3 px-5 rounded-2xl border border-[#FDE68A] flex items-center gap-2 transition-colors shadow-xs text-sm min-h-[48px] shrink-0"
        >
          <Calendar className="w-5 h-5 text-[#D97706]" />
          <span>View My Day Schedule</span>
        </button>
      </div>

      {/* Row 1 Grid: What's Next Card | Today's Progress | Mood Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* What's Next Prominent Card (7 cols) */}
        <div className="lg:col-span-7">
          <WhatsNextCard
            nextActivity={nextActivity}
            onMarkDone={handleMarkDone}
            onNavigate={onNavigate}
          />
        </div>

        {/* Progress & Mood Column (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* Today's Progress Card */}
          <div className="bg-white border-2 border-[#E7E5E4] p-4 sm:p-5 rounded-3xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#78716C]">Progress</span>
              <Trophy className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1E1B4B]">
                {completedCount} <span className="text-sm font-normal text-[#78716C]">of {totalCount}</span>
              </div>
              <p className="text-xs text-[#78716C] font-semibold mt-0.5">Activities Done</p>
              {/* Progress Bar */}
              <div className="w-full bg-stone-100 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-[#D97706] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mood Check-in Widget */}
          <button
            onClick={() => onNavigate('mood')}
            className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-4 sm:p-5 rounded-3xl shadow-xs flex flex-col justify-between text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#78716C]">Mood</span>
              <Smile className="w-5 h-5 text-[#3730A3]" />
            </div>
            <div>
              <div className="text-2xl mb-1">{recentMood?.emoji || '🙂'}</div>
              <div className="text-base font-bold text-[#1E1B4B]">
                {recentMood?.label || 'Check In'}
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">Tap to update</p>
            </div>
          </button>
        </div>
      </div>

      {/* Row 2: Quick Cognitive Games Grid */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#D97706]" />
            <span>Quick Mind Puzzles</span>
          </h3>
          <button
            onClick={() => onNavigate('games')}
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 min-h-[40px] px-2"
          >
            <span>All Games</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Game 1 */}
          <button
            onClick={() => onNavigate('games')}
            className="bg-[#FFFDF9] border border-[#E7E5E4] hover:border-[#D97706] p-4 rounded-2xl text-left space-y-2 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☕</span>
              <h4 className="text-base font-bold text-[#1E1B4B]">Memory Match</h4>
            </div>
            <p className="text-xs text-[#78716C]">Match familiar everyday pairs.</p>
          </button>

          {/* Game 2 */}
          <button
            onClick={() => onNavigate('games')}
            className="bg-[#FFFDF9] border border-[#E7E5E4] hover:border-[#D97706] p-4 rounded-2xl text-left space-y-2 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌅</span>
              <h4 className="text-base font-bold text-[#1E1B4B]">Routine Recall</h4>
            </div>
            <p className="text-xs text-[#78716C]">Sequencing everyday steps.</p>
          </button>

          {/* Game 3 */}
          <button
            onClick={() => onNavigate('games')}
            className="bg-[#FFFDF9] border border-[#E7E5E4] hover:border-[#D97706] p-4 rounded-2xl text-left space-y-2 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧩</span>
              <h4 className="text-base font-bold text-[#1E1B4B]">Pattern Game</h4>
            </div>
            <p className="text-xs text-[#78716C]">Shape & visual object matching.</p>
          </button>
        </div>
      </div>

      {/* Row 3: My Day Schedule Preview */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D97706]" />
            <span>Today's Upcoming Schedule</span>
          </h3>
          <button
            onClick={() => onNavigate('myday')}
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 min-h-[40px] px-2"
          >
            <span>Full Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6 text-stone-400">Loading your schedule...</div>
        ) : pendingList.length === 0 ? (
          <div className="text-center py-8 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#E7E5E4]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1E1B4B]">
              {i18nService.t('noRemindersToday')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#F3EFE6] hover:border-[#D97706] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold px-2.5 py-1 bg-[#FEF3C7] text-[#B45309] rounded-xl border border-[#FDE68A]">
                    {item.time}
                  </span>
                  <span className="text-2xl">{item.icon || '📌'}</span>
                  <div>
                    <h4 className="text-base font-bold text-[#1E1B4B]">{item.label}</h4>
                    <span className="text-[11px] font-semibold text-[#78716C]">{item.category || item.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkDone(item.id, item.label)}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
                >
                  {i18nService.t('markDone')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
