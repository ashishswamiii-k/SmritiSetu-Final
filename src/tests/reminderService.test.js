import { describe, it, expect, beforeEach } from 'vitest';
import { ReminderService } from '../services/reminderService.js';

class MockDataProvider {
  constructor() {
    this.reminders = [
      { id: 'rem_1', label: 'Morning Medicine', status: 'pending' },
      { id: 'rem_2', label: 'Drink Water', status: 'pending' }
    ];
  }
  async getReminders() { return [...this.reminders]; }
  async updateReminderStatus(id, status) {
    const item = this.reminders.find(r => r.id === id);
    if (item) {
      item.status = status;
      item.completionTimestamp = new Date().toISOString();
    }
    return item;
  }
  async addReminder(rem) {
    const record = { id: `rem_${Date.now()}`, ...rem, status: 'pending' };
    this.reminders.push(record);
    return record;
  }
}

describe('reminderService — Reminder Adherence & Status', () => {
  let service;
  let mockProvider;

  beforeEach(() => {
    mockProvider = new MockDataProvider();
    service = new ReminderService(mockProvider);
  });

  it('retrieves reminders list', async () => {
    const list = await service.getReminders();
    expect(list.length).toBe(2);
  });

  it('marks a reminder as done', async () => {
    const updated = await service.markAsDone('rem_1');
    expect(updated.status).toBe('done');
    expect(updated.completionTimestamp).toBeDefined();

    const summary = await service.getTodaySummary();
    expect(summary.completedCount).toBe(1);
    expect(summary.pendingCount).toBe(1);
  });

  it('adds a new reminder', async () => {
    const created = await service.addReminder({ label: 'Evening Walk', time: '05:00 PM', type: 'activity' });
    expect(created.id).toBeDefined();
    expect(created.label).toBe('Evening Walk');
    const list = await service.getReminders();
    expect(list.length).toBe(3);
  });
});
