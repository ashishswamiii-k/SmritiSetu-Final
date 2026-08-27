import { describe, it, expect, beforeEach } from 'vitest';
import { SyncService } from '../services/syncService.js';

class MockSyncProvider {
  constructor() {
    this.queue = [];
  }
  async queueSyncEvent(type, payload) {
    const event = { eventId: `evt_${Date.now()}_${Math.random()}`, type, payload, status: 'PENDING' };
    this.queue.push(event);
    return event;
  }
  async getPendingSyncEvents() {
    return this.queue.filter(e => e.status === 'PENDING');
  }
  async markEventSynced(eventId) {
    const item = this.queue.find(e => e.eventId === eventId);
    if (item) item.status = 'SYNCED';
  }
}

describe('syncService — Network Status & Sync Queue Processing', () => {
  let sync;
  let mockProvider;

  beforeEach(() => {
    mockProvider = new MockSyncProvider();
    sync = new SyncService(mockProvider);
  });

  it('detects pending sync state when offline actions exist', async () => {
    await mockProvider.queueSyncEvent('GAME_COMPLETED', { score: 100 });
    const status = await sync.getStatus();
    expect(status.pendingCount).toBe(1);
    expect(status.state).toBe('SYNC_PENDING');
  });

  it('processes queue idempotently when connection is available', async () => {
    await mockProvider.queueSyncEvent('GAME_COMPLETED', { score: 100 });
    await mockProvider.queueSyncEvent('MOOD_LOGGED', { mood: 'good' });

    sync.isOnline = true;
    await sync.processSyncQueue();

    const pending = await mockProvider.getPendingSyncEvents();
    expect(pending.length).toBe(0);

    const status = await sync.getStatus();
    expect(status.state).toBe('ONLINE');
  });
});
