import { describe, it, expect } from 'vitest';
import { difficultyService } from '../services/difficultyService.js';

describe('difficultyService — Adaptive Difficulty Engine', () => {
  it('increases difficulty from easy to medium when recent accuracy is >= 80%', () => {
    const recentSessions = [
      { accuracy: 85, difficulty: 'easy' },
      { accuracy: 90, difficulty: 'easy' },
      { accuracy: 80, difficulty: 'easy' }
    ];
    const result = difficultyService.calculateNextDifficulty(recentSessions, 'easy');
    expect(result.nextDifficulty).toBe('medium');
    expect(result.feedbackMessage).toContain('slightly more challenging round');
  });

  it('maintains difficulty level when recent accuracy is between 50% and 79%', () => {
    const recentSessions = [
      { accuracy: 70, difficulty: 'medium' },
      { accuracy: 65, difficulty: 'medium' }
    ];
    const result = difficultyService.calculateNextDifficulty(recentSessions, 'medium');
    expect(result.nextDifficulty).toBe('medium');
    expect(result.feedbackMessage).toContain('keep going at this level');
  });

  it('decreases difficulty from hard to medium when recent accuracy is < 50%', () => {
    const recentSessions = [
      { accuracy: 40, difficulty: 'hard' },
      { accuracy: 30, difficulty: 'hard' }
    ];
    const result = difficultyService.calculateNextDifficulty(recentSessions, 'hard');
    expect(result.nextDifficulty).toBe('medium');
    expect(result.feedbackMessage).toContain('make the next round a little easier');
  });

  it('clamps difficulty at upper bound hard when accuracy >= 80%', () => {
    const recentSessions = [{ accuracy: 95, difficulty: 'hard' }];
    const result = difficultyService.calculateNextDifficulty(recentSessions, 'hard');
    expect(result.nextDifficulty).toBe('hard');
    expect(result.feedbackMessage).toContain('top level');
  });

  it('clamps difficulty at lower bound easy when accuracy < 50%', () => {
    const recentSessions = [{ accuracy: 20, difficulty: 'easy' }];
    const result = difficultyService.calculateNextDifficulty(recentSessions, 'easy');
    expect(result.nextDifficulty).toBe('easy');
  });
});
