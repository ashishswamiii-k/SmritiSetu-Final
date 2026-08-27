import { localDataProvider } from './data/LocalDataProvider.js';

export class SyncService {
  constructor(dataProvider = localDataProvider) {
    this.provider = dataProvider;
    this.listeners = new Set();
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.isSyncing = false;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnlineChange(true));
      window.addEventListener('offline', () => this.handleOnlineChange(false));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.getStatus());
    }
  }

  async handleOnlineChange(onlineStatus) {
    this.isOnline = onlineStatus;
    this.notify();
    if (onlineStatus) {
      await this.processSyncQueue();
    }
  }

  async getStatus() {
    const pending = await this.provider.getPendingSyncEvents();
    if (!this.isOnline) {
      return { state: 'OFFLINE', label: 'Offline', icon: '🔴', pendingCount: pending.length };
    }
    if (pending.length > 0) {
      return { state: 'SYNC_PENDING', label: 'Sync Pending', icon: '🟠', pendingCount: pending.length };
    }
    return { state: 'ONLINE', label: 'Online', icon: '🟢', pendingCount: 0 };
  }

  async processSyncQueue() {
    if (!this.isOnline || this.isSyncing) return;
    this.isSyncing = true;
    this.notify();

    try {
      const pendingEvents = await this.provider.getPendingSyncEvents();
      for (const event of pendingEvents) {
        // Simulating idempotent synchronization to backend ledger
        await new Promise(res => setTimeout(res, 200));
        await this.provider.markEventSynced(event.eventId);
      }
    } catch (err) {
      console.warn("Sync queue processing error:", err);
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }
}

export const syncService = new SyncService();
