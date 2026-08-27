import { DataProvider } from './DataProvider.js';
import { initDB } from './dbSchema.js';

export class LocalDataProvider extends DataProvider {
  constructor() {
    super();
    this.dbPromise = initDB();
    this.seedDefaultReminders();
  }

  async seedDefaultReminders() {
    try {
      const db = await this.dbPromise;
      const count = await db.count('reminders');
      if (count === 0) {
        const defaultSchedule = [
          {
            id: 'item_1',
            label: 'Morning Medicine',
            time: '08:00 AM',
            type: 'medicine',
            icon: '💊',
            category: 'Medicine',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_2',
            label: 'Breakfast & Tea',
            time: '08:30 AM',
            type: 'meal',
            icon: '🥣',
            category: 'Meal',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_3',
            label: 'Drink Water',
            time: '10:00 AM',
            type: 'hydration',
            icon: '💧',
            category: 'Hydration',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_4',
            label: 'Memory Match Activity',
            time: '10:30 AM',
            type: 'game',
            icon: '🧠',
            category: 'Activity',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_5',
            label: 'Morning Walk',
            time: '11:30 AM',
            type: 'exercise',
            icon: '🚶',
            category: 'Exercise',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_6',
            label: 'Lunch & Rest',
            time: '01:00 PM',
            type: 'meal',
            icon: '🍲',
            category: 'Meal',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_7',
            label: 'Mood Check-in',
            time: '03:00 PM',
            type: 'activity',
            icon: '😊',
            category: 'Self Check',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_8',
            label: 'Evening Medicine',
            time: '07:00 PM',
            type: 'medicine',
            icon: '💊',
            category: 'Medicine',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'item_9',
            label: 'Peaceful Bedtime',
            time: '09:30 PM',
            type: 'rest',
            icon: '🌙',
            category: 'Rest',
            status: 'pending',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
          }
        ];
        const tx = db.transaction('reminders', 'readwrite');
        for (const rem of defaultSchedule) {
          await tx.store.put(rem);
        }
        await tx.done;
      }
    } catch (err) {
      console.warn("IndexedDB seed warning:", err);
    }
  }

  async getPatientProfile() {
    try {
      const db = await this.dbPromise;
      const profile = await db.get('patients', 'active_patient');
      if (profile) return profile;
    } catch (e) {
      console.warn("Fallback to localStorage profile:", e);
    }
    const local = localStorage.getItem('smritisetu_profile');
    return local ? JSON.parse(local) : null;
  }

  async savePatientProfile(profile) {
    const record = { id: 'active_patient', ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem('smritisetu_profile', JSON.stringify(record));
    try {
      const db = await this.dbPromise;
      await db.put('patients', record);
    } catch (e) {
      console.warn("DB save profile warning:", e);
    }
    await this.queueSyncEvent('UPDATE_PROFILE', record);
    return record;
  }

  async getReminders() {
    try {
      const db = await this.dbPromise;
      const reminders = await db.getAll('reminders');
      if (reminders && reminders.length > 0) return reminders;
    } catch (e) {
      console.warn("DB getReminders warning:", e);
    }
    return [];
  }

  async updateReminderStatus(id, status) {
    const db = await this.dbPromise;
    const item = await db.get('reminders', id);
    if (!item) return null;
    item.status = status;
    item.completionTimestamp = status === 'done' ? new Date().toISOString() : null;
    item.syncStatus = 'pending';
    item.updatedAt = new Date().toISOString();
    await db.put('reminders', item);

    await this.queueSyncEvent('UPDATE_REMINDER_STATUS', { id, status, timestamp: item.completionTimestamp });
    return item;
  }

  async addReminder(reminder) {
    const db = await this.dbPromise;
    const record = {
      id: reminder.id || `item_${Date.now()}`,
      label: reminder.label,
      time: reminder.time || '12:00 PM',
      type: reminder.type || 'activity',
      icon: reminder.icon || '📌',
      category: reminder.category || 'General',
      status: 'pending',
      syncStatus: 'pending',
      updatedAt: new Date().toISOString()
    };
    await db.put('reminders', record);
    await this.queueSyncEvent('ADD_REMINDER', record);
    return record;
  }

  async getGameSessions(gameType = null) {
    const db = await this.dbPromise;
    const all = await db.getAll('game_sessions');
    if (gameType) {
      return all.filter(s => s.gameType === gameType);
    }
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async saveGameSession(session) {
    const db = await this.dbPromise;
    const record = {
      id: session.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      gameType: session.gameType,
      score: session.score,
      accuracy: session.accuracy,
      difficulty: session.difficulty,
      attempts: session.attempts || 0,
      completionTimeSeconds: session.completionTimeSeconds || 0,
      timestamp: session.timestamp || new Date().toISOString(),
      syncStatus: 'pending'
    };
    await db.put('game_sessions', record);
    await this.queueSyncEvent('GAME_SESSION_COMPLETED', record);
    return record;
  }

  async getMoodLogs() {
    const db = await this.dbPromise;
    const logs = await db.getAll('mood_checkins');
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async saveMoodLog(log) {
    const db = await this.dbPromise;
    const record = {
      id: log.id || `mood_${Date.now()}`,
      moodValue: log.moodValue,
      label: log.label,
      emoji: log.emoji,
      timestamp: log.timestamp || new Date().toISOString(),
      syncStatus: 'pending'
    };
    await db.put('mood_checkins', record);
    await this.queueSyncEvent('MOOD_LOGGED', record);
    return record;
  }

  async queueSyncEvent(type, payload) {
    try {
      const db = await this.dbPromise;
      const eventId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const event = {
        eventId,
        type,
        payload,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };
      await db.put('sync_queue', event);
      return event;
    } catch (e) {
      console.warn("Queue sync event error:", e);
    }
  }

  async getPendingSyncEvents() {
    try {
      const db = await this.dbPromise;
      const all = await db.getAll('sync_queue');
      return all.filter(e => e.status === 'PENDING');
    } catch (e) {
      return [];
    }
  }

  async markEventSynced(eventId) {
    try {
      const db = await this.dbPromise;
      const event = await db.get('sync_queue', eventId);
      if (event) {
        event.status = 'SYNCED';
        event.syncedAt = new Date().toISOString();
        await db.put('sync_queue', event);
      }
    } catch (e) {
      console.warn("markEventSynced error:", e);
    }
  }
}

export const localDataProvider = new LocalDataProvider();
