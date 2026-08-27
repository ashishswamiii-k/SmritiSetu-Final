import { localDataProvider } from './data/LocalDataProvider.js';
import { difficultyService } from './difficultyService.js';

export class GameService {
  constructor(dataProvider = localDataProvider) {
    this.provider = dataProvider;
  }

  async recordGameCompletion({ gameType, score, accuracy, difficulty, attempts, completionTimeSeconds }) {
    const session = {
      gameType,
      score,
      accuracy,
      difficulty,
      attempts,
      completionTimeSeconds,
      timestamp: new Date().toISOString()
    };
    const saved = await this.provider.saveGameSession(session);

    // Fetch updated history for this gameType to calculate adaptive difficulty
    const history = await this.provider.getGameSessions(gameType);
    const adaptation = difficultyService.calculateNextDifficulty(history, difficulty);

    return {
      session: saved,
      adaptation
    };
  }

  async getGameHistory(gameType = null) {
    return await this.provider.getGameSessions(gameType);
  }

  async getRecommendedDifficulty(gameType) {
    const history = await this.getGameHistory(gameType);
    if (!history || history.length === 0) return 'easy';
    const lastSession = history[history.length - 1];
    const adaptation = difficultyService.calculateNextDifficulty(history, lastSession.difficulty || 'easy');
    return adaptation.nextDifficulty;
  }
}

export const gameService = new GameService();
