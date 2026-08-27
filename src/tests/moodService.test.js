import { describe, it, expect } from 'vitest';
import { MoodService } from '../services/moodService.js';

class MockMoodProvider {
  constructor() {
    this.logs = [];
  }
  async saveMoodLog(log) {
    const record = { id: `m_${Date.now()}`, ...log };
    this.logs.push(record);
    return record;
  }
  async getMoodLogs() { return [...this.logs]; }
}

describe('moodService — Mood Logging', () => {
  it('saves mood log and returns record', async () => {
    const provider = new MockMoodProvider();
    const service = new MoodService(provider);

    const saved = await service.logMood('very_good');
    expect(saved.moodValue).toBe('very_good');
    expect(saved.label).toBe('Very Good');
    expect(saved.emoji).toBe('😊');

    const history = await service.getMoodHistory();
    expect(history.length).toBe(1);
  });
});
