import { localDataProvider } from './data/LocalDataProvider.js';

export class ReminderService {
  constructor(dataProvider = localDataProvider) {
    this.provider = dataProvider;
  }

  async getReminders() {
    return await this.provider.getReminders();
  }

  async markAsDone(reminderId) {
    return await this.provider.updateReminderStatus(reminderId, 'done');
  }

  async addReminder(reminder) {
    return await this.provider.addReminder(reminder);
  }

  async getTodaySummary() {
    const list = await this.getReminders();
    const pending = list.filter(r => r.status !== 'done');
    const completed = list.filter(r => r.status === 'done');
    return {
      total: list.length,
      pendingCount: pending.length,
      completedCount: completed.length,
      pendingReminders: pending,
      completedReminders: completed
    };
  }
}

export const reminderService = new ReminderService();
