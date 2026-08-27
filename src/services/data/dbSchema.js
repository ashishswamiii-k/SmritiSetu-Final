import { openDB } from 'idb';

const DB_NAME = 'smritisetu_db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('game_sessions')) {
        const gameStore = db.createObjectStore('game_sessions', { keyPath: 'id' });
        gameStore.createIndex('gameType', 'gameType', { unique: false });
        gameStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('reminders')) {
        const remStore = db.createObjectStore('reminders', { keyPath: 'id' });
        remStore.createIndex('status', 'status', { unique: false });
        remStore.createIndex('time', 'time', { unique: false });
      }
      if (!db.objectStoreNames.contains('mood_checkins')) {
        const moodStore = db.createObjectStore('mood_checkins', { keyPath: 'id' });
        moodStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        const syncStore = db.createObjectStore('sync_queue', { keyPath: 'eventId' });
        syncStore.createIndex('status', 'status', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
}
