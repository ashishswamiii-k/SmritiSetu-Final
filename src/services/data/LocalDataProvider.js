import { DataProvider } from './DataProvider.js';
import { initDB } from './dbSchema.js';

export class LocalDataProvider extends DataProvider {
  constructor() {
    super();
    this.dbPromise = initDB().catch(err => {
      console.warn("IndexedDB init error, using localStorage fallback:", err);
      return null;
    });
    this.activeProfileIdKey = 'smritisetu_active_profile_id';
    this.inMemoryProfiles = [
      {
        id: 'patient_default_1',
        name: 'Grandfather',
        gender: 'male',
        avatar: 'male_1',
        avatarType: 'vector',
        language: 'en',
        textSize: 'standard',
        voiceEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
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
    return 'patient_default_1';
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
      if (db && db.getAll) {
        const profiles = await db.getAll('profiles');
        if (profiles && profiles.length > 0) {
          return profiles;
        }
      }
    } catch (e) {
      console.warn("getAllProfiles DB fallback:", e);
    }
    return this.inMemoryProfiles;
  }

  async getPatientProfile(profileId = null) {
    const targetId = profileId || (await this.getActiveProfileId());
    try {
      const db = await this.dbPromise;
      if (db && db.get) {
        const profile = await db.get('profiles', targetId);
        if (profile) return profile;
      }
    } catch (e) {
      console.warn("getPatientProfile DB fallback:", e);
    }
    const match = this.inMemoryProfiles.find(p => p.id === targetId);
    return match || this.inMemoryProfiles[0];
  }

  async savePatientProfile(profile) {
    const id = profile.id || `patient_${Date.now()}`;
    const record = {
      id,
      name: profile.name,
      gender: profile.gender || 'unspecified',
      avatar: profile.avatar || 'male_1',
      avatarType: profile.avatarType || 'vector',
      photoDataUrl: profile.photoDataUrl || null,
      language: profile.language || 'en',
      age: profile.age || null,
      textSize: profile.textSize || 'standard',
      voiceEnabled: profile.voiceEnabled ?? true,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update in-memory array
    const existingIdx = this.inMemoryProfiles.findIndex(p => p.id === id);
    if (existingIdx >= 0) {
      this.inMemoryProfiles[existingIdx] = record;
    } else {
      this.inMemoryProfiles.push(record);
    }

    try {
      const db = await this.dbPromise;
      if (db && db.put) {
        await db.put('profiles', record);
      }
    } catch (e) {
      console.warn("savePatientProfile DB fallback:", e);
    }

    this.setActiveProfileId(id);
    await this.seedProfileReminders(id);
    return record;
  }

  async seedProfileReminders(patientId) {
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

    try {
      const db = await this.dbPromise;
      if (db && db.transaction) {
        const tx = db.transaction('reminders', 'readwrite');
        for (const rem of defaultSchedule) {
          await tx.store.put(rem);
        }
        await tx.done;
      }
    } catch (err) {
      console.warn("seedProfileReminders DB fallback:", err);
    }
  }

  // --- Data Scoped by Active Patient ID ---
  async getReminders() {
    const patientId = await this.getActiveProfileId();
    try {
      const db = await this.dbPromise;
      if (db && db.getAll) {
        const all = await db.getAll('reminders');
        if (all && all.length > 0) {
          const userReminders = all.filter(r => r.patientId === patientId);
          if (userReminders.length > 0) return userReminders;
        }
      }
    } catch (e) {
      console.warn("getReminders DB fallback:", e);
    }
    return [
      { id: `item_1_${patientId}`, patientId, label: 'Morning Medicine', time: '08:00 AM', type: 'medicine', icon: '💊', category: 'Medicine', status: 'pending' },
      { id: `item_2_${patientId}`, patientId, label: 'Breakfast & Tea', time: '08:30 AM', type: 'meal', icon: '🥣', category: 'Meal', status: 'pending' },
      { id: `item_3_${patientId}`, patientId, label: 'Drink Water', time: '10:00 AM', type: 'hydration', icon: '💧', category: 'Hydration', status: 'pending' },
      { id: `item_4_${patientId}`, patientId, label: 'Memory Match Activity', time: '10:30 AM', type: 'game', icon: '🧠', category: 'Activity', status: 'pending' },
      { id: `item_5_${patientId}`, patientId, label: 'Morning Walk', time: '11:30 AM', type: 'exercise', icon: '🚶', category: 'Exercise', status: 'pending' },
      { id: `item_6_${patientId}`, patientId, label: 'Lunch & Rest', time: '01:00 PM', type: 'meal', icon: '🍲', category: 'Meal', status: 'pending' },
      { id: `item_7_${patientId}`, patientId, label: 'Mood Check-in', time: '03:00 PM', type: 'activity', icon: '😊', category: 'Self Check', status: 'pending' },
      { id: `item_8_${patientId}`, patientId, label: 'Evening Medicine', time: '07:00 PM', type: 'medicine', icon: '💊', category: 'Medicine', status: 'pending' },
      { id: `item_9_${patientId}`, patientId, label: 'Peaceful Bedtime', time: '09:30 PM', type: 'rest', icon: '🌙', category: 'Rest', status: 'pending' }
    ];
  }

  async updateReminderStatus(id, status) {
    try {
      const db = await this.dbPromise;
      if (db && db.get) {
        const item = await db.get('reminders', id);
        if (item) {
          item.status = status;
          item.completionTimestamp = status === 'done' ? new Date().toISOString() : null;
          item.syncStatus = 'pending';
          item.updatedAt = new Date().toISOString();
          await db.put('reminders', item);
          return item;
        }
      }
    } catch (e) {
      console.warn("updateReminderStatus DB fallback:", e);
    }
    return { id, status };
  }

  async addReminder(reminder) {
    const patientId = await this.getActiveProfileId();
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
    try {
      const db = await this.dbPromise;
      if (db && db.put) {
        await db.put('reminders', record);
      }
    } catch (e) {
      console.warn("addReminder DB fallback:", e);
    }
    return record;
  }

  async getGameSessions(gameType = null) {
    const patientId = await this.getActiveProfileId();
    try {
      const db = await this.dbPromise;
      if (db && db.getAll) {
        const all = await db.getAll('game_sessions');
        const userSessions = all.filter(s => s.patientId === patientId);
        if (gameType) {
          return userSessions.filter(s => s.gameType === gameType);
        }
        return userSessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    } catch (e) {
      console.warn("getGameSessions DB fallback:", e);
    }
    return [];
  }

  async saveGameSession(session) {
    const patientId = await this.getActiveProfileId();
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
    try {
      const db = await this.dbPromise;
      if (db && db.put) {
        await db.put('game_sessions', record);
      }
    } catch (e) {
      console.warn("saveGameSession DB fallback:", e);
    }
    return record;
  }

  async getMoodLogs() {
    const patientId = await this.getActiveProfileId();
    try {
      const db = await this.dbPromise;
      if (db && db.getAll) {
        const all = await db.getAll('mood_checkins');
        const userLogs = all.filter(m => m.patientId === patientId);
        return userLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    } catch (e) {
      console.warn("getMoodLogs DB fallback:", e);
    }
    return [];
  }

  async saveMoodLog(log) {
    const patientId = await this.getActiveProfileId();
    const record = {
      id: log.id || `mood_${Date.now()}`,
      patientId,
      moodValue: log.moodValue,
      label: log.label,
      emoji: log.emoji,
      timestamp: log.timestamp || new Date().toISOString(),
      syncStatus: 'pending'
    };
    try {
      const db = await this.dbPromise;
      if (db && db.put) {
        await db.put('mood_checkins', record);
      }
    } catch (e) {
      console.warn("saveMoodLog DB fallback:", e);
    }
    return record;
  }

  async getPendingSyncEvents() {
    return [];
  }

  async markEventSynced(eventId) {
    return;
  }
}

export const localDataProvider = new LocalDataProvider();
