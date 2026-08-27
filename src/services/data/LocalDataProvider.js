import { DataProvider } from './DataProvider.js';
import { initDB } from './dbSchema.js';

export class LocalDataProvider extends DataProvider {
  constructor() {
    super();
    this.dbPromise = initDB();
    this.activeProfileIdKey = 'smritisetu_active_profile_id';
  }

  // --- Multi-User Profile Management ---
  async getActiveProfileId() {
    if (typeof localStorage !== 'undefined') {
      const activeId = localStorage.getItem(this.activeProfileIdKey);
      if (activeId) return activeId;
    }
    const profiles = await this.getAllProfiles();
    if (profiles.length > 0) {
      this.setActiveProfileId(profiles[0].id);
      return profiles[0].id;
    }
    return null;
  }

  setActiveProfileId(id) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.activeProfileIdKey, id);
    }
  }

  async clearActiveProfileId() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.activeProfileIdKey);
    }
  }

  async getAllProfiles() {
    try {
      const db = await this.dbPromise;
      const profiles = await db.getAll('profiles');
      return profiles || [];
    } catch (e) {
      console.warn("getAllProfiles error:", e);
      return [];
    }
  }

  async getPatientProfile(profileId = null) {
    const targetId = profileId || (await this.getActiveProfileId());
    if (!targetId) return null;
    try {
      const db = await this.dbPromise;
      const profile = await db.get('profiles', targetId);
      if (profile) return profile;
    } catch (e) {
      console.warn("getPatientProfile error:", e);
    }
    return null;
  }

  async savePatientProfile(profile) {
    const id = profile.id || `patient_${Date.now()}`;
    const record = {
      id,
      name: profile.name,
      gender: profile.gender || 'unspecified',
      avatar: profile.avatar || 'male_1',
      avatarType: profile.avatarType || 'vector', // 'vector' | 'photo'
      photoDataUrl: profile.photoDataUrl || null,
      language: profile.language || 'en',
      age: profile.age || null,
      textSize: profile.textSize || 'standard',
      voiceEnabled: profile.voiceEnabled ?? true,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const db = await this.dbPromise;
      await db.put('profiles', record);
      this.setActiveProfileId(id);
      await this.seedProfileReminders(id);
    } catch (e) {
      console.warn("savePatientProfile DB error:", e);
    }
    await this.queueSyncEvent('UPDATE_PROFILE', record);
    return record;
  }

  async seedProfileReminders(patientId) {
    try {
      const db = await this.dbPromise;
      const allReminders = await db.getAll('reminders');
      const profileReminders = allReminders.filter(r => r.patientId === patientId);

      if (profileReminders.length === 0) {
        const defaultSchedule = [
          {
            id: `item_1_${patientId}`,
            patientId,
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
            id: `item_2_${patientId}`,
            patientId,
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
            id: `item_3_${patientId}`,
            patientId,
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
            id: `item_4_${patientId}`,
            patientId,
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
            id: `item_5_${patientId}`,
            patientId,
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
            id: `item_6_${patientId}`,
            patientId,
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
            id: `item_7_${patientId}`,
            patientId,
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
            id: `item_8_${patientId}`,
            patientId,
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
            id: `item_9_${patientId}`,
            patientId,
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
      console.warn("seedProfileReminders error:", err);
    }
  }

  // --- Data Scoped by Active Patient ID ---
  async getReminders() {
    const patientId = await this.getActiveProfileId();
    if (!patientId) return [];
    try {
      const db = await this.dbPromise;
      const all = await db.getAll('reminders');
      return all.filter(r => r.patientId === patientId);
    } catch (e) {
      console.warn("getReminders error:", e);
      return [];
    }
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
    const patientId = await this.getActiveProfileId();
    const db = await this.dbPromise;
    const record = {
      id: reminder.id || `item_${Date.now()}`,
      patientId,
      label: reminder.label,
      time: reminder.time || '12:00 PM',
      type: reminder.type || 'activity',
      icon: reminder.icon || '📌',
      category: reminder.category || 'General',
      repeat: reminder.repeat || 'Every day',
      status: 'pending',
      syncStatus: 'pending',
      updatedAt: new Date().toISOString()
    };
    await db.put('reminders', record);
    await this.queueSyncEvent('ADD_REMINDER', record);
    return record;
  }

  async getGameSessions(gameType = null) {
    const patientId = await this.getActiveProfileId();
    if (!patientId) return [];
    const db = await this.dbPromise;
    const all = await db.getAll('game_sessions');
    const userSessions = all.filter(s => s.patientId === patientId);
    if (gameType) {
      return userSessions.filter(s => s.gameType === gameType);
    }
    return userSessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async saveGameSession(session) {
    const patientId = await this.getActiveProfileId();
    const db = await this.dbPromise;
    const record = {
      id: session.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      patientId,
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
    const patientId = await this.getActiveProfileId();
    if (!patientId) return [];
    const db = await this.dbPromise;
    const all = await db.getAll('mood_checkins');
    const userLogs = all.filter(m => m.patientId === patientId);
    return userLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async saveMoodLog(log) {
    const patientId = await this.getActiveProfileId();
    const db = await this.dbPromise;
    const record = {
      id: log.id || `mood_${Date.now()}`,
      patientId,
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
      const patientId = await this.getActiveProfileId();
      const db = await this.dbPromise;
      const eventId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const event = {
        eventId,
        patientId,
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
