import { openDB } from 'idb';

const DB_NAME = 'smritisetu_db';
const DB_VERSION = 2;

export async function initDB() {
  if (typeof indexedDB === 'undefined') {
    // Node.js / Vitest test environment fallback
    return {
      get: async () => null,
      getAll: async () => [],
      put: async () => {},
      delete: async () => {},
      transaction: () => ({ store: { put: async () => {} }, done: Promise.resolve() })
    };
  }

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('game_sessions')) {
        const gameStore = db.createObjectStore('game_sessions', { keyPath: 'id' });
        gameStore.createIndex('gameType', 'gameType', { unique: false });
        gameStore.createIndex('patientId', 'patientId', { unique: false });
        gameStore.createIndex('timestamp', 'timestamp', { unique: false });
      } else {
        const gameStore = transaction.objectStore('game_sessions');
        if (!gameStore.indexNames.contains('patientId')) {
          gameStore.createIndex('patientId', 'patientId', { unique: false });
        }
      }

      if (!db.objectStoreNames.contains('reminders')) {
        const remStore = db.createObjectStore('reminders', { keyPath: 'id' });
        remStore.createIndex('status', 'status', { unique: false });
        remStore.createIndex('patientId', 'patientId', { unique: false });
        remStore.createIndex('time', 'time', { unique: false });
      } else {
        const remStore = transaction.objectStore('reminders');
        if (!remStore.indexNames.contains('patientId')) {
          remStore.createIndex('patientId', 'patientId', { unique: false });
        }
      }

      if (!db.objectStoreNames.contains('mood_checkins')) {
        const moodStore = db.createObjectStore('mood_checkins', { keyPath: 'id' });
        moodStore.createIndex('patientId', 'patientId', { unique: false });
        moodStore.createIndex('timestamp', 'timestamp', { unique: false });
      } else {
        const moodStore = transaction.objectStore('mood_checkins');
        if (!moodStore.indexNames.contains('patientId')) {
          moodStore.createIndex('patientId', 'patientId', { unique: false });
        }
      }

      if (!db.objectStoreNames.contains('sync_queue')) {
        const syncStore = db.createObjectStore('sync_queue', { keyPath: 'eventId' });
        syncStore.createIndex('status', 'status', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
}
