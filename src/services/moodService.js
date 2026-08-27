import { localDataProvider } from './data/LocalDataProvider.js';

export const MOOD_OPTIONS = [
  { id: 'very_good', label: 'Very Good', emoji: '😊', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'good', label: 'Good', emoji: '🙂', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'not_good', label: 'Not Good', emoji: '🙁', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' }
];

export class MoodService {
  constructor(dataProvider = localDataProvider) {
    this.provider = dataProvider;
  }

  async logMood(moodOptionId) {
    const option = MOOD_OPTIONS.find(m => m.id === moodOptionId) || MOOD_OPTIONS[1];
    const record = {
      moodValue: option.id,
      label: option.label,
      emoji: option.emoji,
      timestamp: new Date().toISOString()
    };
    return await this.provider.saveMoodLog(record);
  }

  async getMoodHistory() {
    return await this.provider.getMoodLogs();
  }
}

export const moodService = new MoodService();
