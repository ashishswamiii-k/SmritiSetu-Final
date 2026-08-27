import React, { useState, useEffect } from 'react';
import { reminderService } from '../../services/reminderService';
import { voiceService } from '../../services/voiceService';
import { i18nService } from '../../services/i18nService';
import { Gamepad2, Smile, Clock, Volume2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export function TodayHome({ patientName, onNavigate, onTriggerToast }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodayReminders() {
      setLoading(true);
      const data = await reminderService.getReminders();
      setReminders(data);
      setLoading(false);
    }
    loadTodayReminders();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return i18nService.t('goodMorning');
    if (hour < 17) return i18nService.t('goodAfternoon');
    return i18nService.t('goodEvening');
  };

  const handleMarkDone = async (id, label) => {
    await reminderService.markAsDone(id);
    const updated = await reminderService.getReminders();
    setReminders(updated);
    if (onTriggerToast) {
      onTriggerToast(`✓ Completed "${label}"`, 'success');
    }
    voiceService.speak(`Completed ${label}`);
  };

  const handleVoiceHelp = () => {
    const greetingText = `${getGreeting()}, ${patientName || 'friend'}. ${i18nService.t('voiceHelpGreeting')}`;
    voiceService.speak(greetingText);
    if (onTriggerToast) {
      onTriggerToast("Voice assistance active. Reading today's summary...", 'info');
    }
  };

  const pendingReminders = reminders.filter(r => r.status !== 'done');

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-[#B45309]" />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Today</span>
          <h2 className="text-3xl font-extrabold text-[#78350F] tracking-tight mt-1">
            {getGreeting()}{patientName ? `, ${patientName}` : ''}!
          </h2>
          <p className="text-sm font-medium text-[#92400E] mt-1">
            {pendingReminders.length > 0
              ? `You have ${pendingReminders.length} activities scheduled for today.`
              : 'All scheduled activities for today are completed!'}
          </p>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Play a Game */}
        <button
          onClick={() => onNavigate('games')}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex flex-col justify-between text-left transition-all active:scale-95 min-h-[140px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E1B4B] leading-tight">
              {i18nService.t('playAGame')}
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">Fun memory puzzles</p>
          </div>
        </button>

        {/* How Am I Feeling? */}
        <button
          onClick={() => onNavigate('mood')}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex flex-col justify-between text-left transition-all active:scale-95 min-h-[140px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Smile className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E1B4B] leading-tight">
              {i18nService.t('howAmIFeeling')}
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">Check in today</p>
          </div>
        </button>

        {/* My Reminders */}
        <button
          onClick={() => onNavigate('reminders')}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex flex-col justify-between text-left transition-all active:scale-95 min-h-[140px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E1B4B] leading-tight">
              {i18nService.t('myReminders')}
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">Medicine & routines</p>
          </div>
        </button>

        {/* Voice Help */}
        <button
          onClick={handleVoiceHelp}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex flex-col justify-between text-left transition-all active:scale-95 min-h-[140px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FAE8FF] text-[#86198F] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Volume2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E1B4B] leading-tight">
              {i18nService.t('voiceHelp')}
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">Listen & speak</p>
          </div>
        </button>
      </div>

      {/* Today's Reminders Card Section */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
            <span>💊</span>
            <span>{i18nService.t('todaysReminders')}</span>
          </h3>
          <button
            onClick={() => onNavigate('reminders')}
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 min-h-[40px] px-2"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6 text-stone-400">Loading your activities...</div>
        ) : pendingReminders.length === 0 ? (
          <div className="text-center py-8 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#E7E5E4]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1E1B4B]">
              {i18nService.t('noRemindersToday')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReminders.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#F3EFE6] hover:border-[#D97706] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon || '📌'}</span>
                  <div>
                    <h4 className="text-base font-bold text-[#1E1B4B]">{item.label}</h4>
                    <p className="text-xs text-[#78716C] font-semibold">{item.time}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkDone(item.id, item.label)}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
                >
                  {i18nService.t('markDone')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gentle Daily Reflection Box */}
      <div className="bg-[#FAF9F6] border border-[#E7E5E4] p-5 rounded-3xl text-center">
        <p className="text-sm italic text-[#57534E]">
          "Every moment is a fresh beginning. Take your time and enjoy your day."
        </p>
      </div>
    </div>
  );
}
