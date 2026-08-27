import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { moodService } from '../../services/moodService';
import { voiceService } from '../../services/voiceService';
import { i18nService } from '../../services/i18nService';
import { WhatsNextCard } from './WhatsNextCard';
import { DayProgressTimeline } from './DayProgressTimeline';
import { CompanionIllustration } from './CompanionIllustration';
import { Gamepad2, Smile, Clock, Calendar, ChevronRight, CheckCircle2, Trophy, Brain, Pill, Droplet, Utensils, Footprints } from 'lucide-react';

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
    <div className="pb-24 pt-4 px-4 max-w-7xl mx-auto space-y-5">
      {/* Greeting Header */}
      <div className="card-product p-6 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif-fraunces text-[#1B3A3A] tracking-tight">
            {getGreeting()}{patientName ? `, ${patientName}` : ''}
          </h2>
          <p className="text-sm font-medium text-[#5B6461] mt-1">
            Here's your day at a glance.
          </p>
        </div>

        <button
          onClick={() => onNavigate('myday')}
          className="bg-[#1B3A3A] hover:bg-[#254f4f] text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors text-xs min-h-[42px] shrink-0"
        >
          <Calendar className="w-4 h-4 text-[#7FA593]" />
          <span>View My Day Schedule</span>
        </button>
      </div>

      {/* Row 2: Animated Day Progress Timeline */}
      <DayProgressTimeline />

      {/* Row 3 Grid: What's Next Card | Today's Progress | Companion Illustration */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* What's Next Card (6 cols) */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <WhatsNextCard
            nextActivity={nextActivity}
            onMarkDone={handleMarkDone}
          />
        </div>

        {/* Progress & Mood Stack (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          {/* Today's Progress Card */}
          <div className="card-product p-4 bg-white flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Progress</span>
              <Trophy className="w-4 h-4 text-[#E8825F]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B3A3A]">
                {completedCount} <span className="text-sm font-normal text-[#5B6461]">of {totalCount}</span>
              </div>
              <p className="text-xs text-[#5B6461] font-semibold mt-0.5">Tasks Completed</p>
              <div className="w-full bg-[#F6F3EC] rounded-full h-2 mt-2 overflow-hidden border border-[#1B3A3A]/10">
                <div
                  className="bg-[#7FA593] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Companion Illustration Card (3 cols) */}
        <div className="md:col-span-3">
          <CompanionIllustration />
        </div>
      </div>

      {/* Row 4: Quick Cognitive Games Grid */}
      <div className="card-product p-5 space-y-4 bg-white shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif-fraunces text-[#1B3A3A] flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#E8825F]" />
            <span>Quick Mind Activities</span>
          </h3>
          <button
            onClick={() => onNavigate('games')}
            className="text-xs font-bold text-[#E8825F] hover:text-[#d97352] flex items-center gap-1 min-h-[36px] px-2"
          >
            <span>All Games</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Game 1 */}
          <button
            onClick={() => onNavigate('games')}
            className="p-4 rounded-xl border border-[#1B3A3A]/12 hover:border-[#1B3A3A] bg-[#F6F3EC]/50 text-left space-y-2 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8825F]/15 text-[#E8825F] flex items-center justify-center font-bold">
                ☕
              </div>
              <h4 className="text-sm font-bold text-[#1B3A3A]">Memory Match</h4>
            </div>
            <p className="text-xs text-[#5B6461]">Remember familiar everyday pairs.</p>
          </button>

          {/* Game 2 */}
          <button
            onClick={() => onNavigate('games')}
            className="p-4 rounded-xl border border-[#1B3A3A]/12 hover:border-[#1B3A3A] bg-[#F6F3EC]/50 text-left space-y-2 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7FA593]/15 text-[#7FA593] flex items-center justify-center font-bold">
                🌅
              </div>
              <h4 className="text-sm font-bold text-[#1B3A3A]">Routine Recall</h4>
            </div>
            <p className="text-xs text-[#5B6461]">Sequencing everyday steps.</p>
          </button>

          {/* Game 3 */}
          <button
            onClick={() => onNavigate('games')}
            className="p-4 rounded-xl border border-[#1B3A3A]/12 hover:border-[#1B3A3A] bg-[#F6F3EC]/50 text-left space-y-2 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A3A]/15 text-[#1B3A3A] flex items-center justify-center font-bold">
                🧩
              </div>
              <h4 className="text-sm font-bold text-[#1B3A3A]">Pattern Game</h4>
            </div>
            <p className="text-xs text-[#5B6461]">Visual shape & object matching.</p>
          </button>
        </div>
      </div>

      {/* Row 5: Today's Schedule Preview */}
      <div className="card-product p-5 space-y-4 bg-white shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif-fraunces text-[#1B3A3A] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#1B3A3A]" />
            <span>Today's Upcoming Activities</span>
          </h3>
          <button
            onClick={() => onNavigate('myday')}
            className="text-xs font-bold text-[#1B3A3A] hover:text-[#E8825F] flex items-center gap-1 min-h-[36px] px-2"
          >
            <span>Full Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6 text-[#5B6461]">Loading schedule...</div>
        ) : pendingList.length === 0 ? (
          <div className="text-center py-6 bg-[#F6F3EC] rounded-xl border border-dashed border-[#1B3A3A]/12">
            <CheckCircle2 className="w-8 h-8 text-[#7FA593] mx-auto mb-1" />
            <p className="text-sm font-semibold text-[#1B3A3A]">
              All activities for today are completed!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#F6F3EC]/50 border border-[#1B3A3A]/12 hover:border-[#1B3A3A] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 bg-[#1B3A3A] text-white rounded-md">
                    {item.time}
                  </span>
                  <span className="text-xl">{item.icon || '📌'}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B3A3A]">{item.label}</h4>
                    <span className="text-[11px] font-medium text-[#5B6461]">{item.category || item.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkDone(item.id, item.label)}
                  className="bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs transition-colors min-h-[38px]"
                >
                  Mark Done
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
