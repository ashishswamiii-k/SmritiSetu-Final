/**
 * Explainable Rule-Based Adaptive Difficulty Engine
 * Calculates optimal game difficulty based on rolling performance history.
 */

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export class DifficultyService {
  /**
   * Computes the next suggested difficulty based on recent session history.
   * @param {Array} recentSessions - List of recent game sessions with { accuracy: number, difficulty: string }
   * @param {string} currentDifficulty - Current difficulty level ('easy', 'medium', 'hard')
   * @returns {Object} { nextDifficulty, feedbackMessage, adaptationReason }
   */
  calculateNextDifficulty(recentSessions = [], currentDifficulty = 'easy') {
    const validLevels = ['easy', 'medium', 'hard'];
    const currentIndex = validLevels.indexOf(currentDifficulty.toLowerCase());
    const safeCurrentIndex = currentIndex !== -1 ? currentIndex : 0;

    if (!recentSessions || recentSessions.length === 0) {
      return {
        nextDifficulty: validLevels[safeCurrentIndex],
        feedbackMessage: "Let's keep going at this level.",
        adaptationReason: "No previous sessions found. Starting at selected level."
      };
    }

    // Take last 3-5 sessions
    const recentWindow = recentSessions.slice(-5);
    const totalAccuracy = recentWindow.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);
    const avgAccuracy = Math.round(totalAccuracy / recentWindow.length);

    let nextIndex = safeCurrentIndex;
    let feedbackMessage = "Let's keep going at this level.";
    let adaptationReason = `Recent accuracy is ${avgAccuracy}%. Difficulty maintained.`;

    if (avgAccuracy >= 80) {
      if (safeCurrentIndex < validLevels.length - 1) {
        nextIndex = safeCurrentIndex + 1;
        feedbackMessage = "You did very well! Let's try a slightly more challenging round.";
        adaptationReason = `High accuracy (${avgAccuracy}% >= 80%). Difficulty increased to ${validLevels[nextIndex]}.`;
      } else {
        feedbackMessage = "Wonderful performance! You are doing great at the top level.";
        adaptationReason = `High accuracy (${avgAccuracy}% >= 80%), already at maximum level.`;
      }
    } else if (avgAccuracy < 50) {
      if (safeCurrentIndex > 0) {
        nextIndex = safeCurrentIndex - 1;
        feedbackMessage = "Let's make the next round a little easier so you can enjoy it comfortable.";
        adaptationReason = `Accuracy (${avgAccuracy}% < 50%). Difficulty adjusted to ${validLevels[nextIndex]}.`;
      } else {
        feedbackMessage = "Take your time! Practice makes progress.";
        adaptationReason = `Accuracy (${avgAccuracy}% < 50%), already at gentlest level.`;
      }
    }

    return {
      nextDifficulty: validLevels[nextIndex],
      feedbackMessage,
      adaptationReason,
      avgAccuracy
    };
  }

  /**
   * Helper to format difficulty for UI display
   */
  getLabel(difficulty) {
    switch (difficulty?.toLowerCase()) {
      case 'hard': return 'Challenging';
      case 'medium': return 'Balanced';
      case 'easy': default: return 'Gentle';
    }
  }
}

export const difficultyService = new DifficultyService();
