/**
 * DataProvider Interface Contract for SmritiSetu Saathi
 * Abstract interface for local vs future API data synchronization.
 */
export class DataProvider {
  async getPatientProfile() { throw new Error("Method not implemented"); }
  async savePatientProfile(profile) { throw new Error("Method not implemented"); }
  async getReminders() { throw new Error("Method not implemented"); }
  async updateReminderStatus(id, status) { throw new Error("Method not implemented"); }
  async addReminder(reminder) { throw new Error("Method not implemented"); }
  async getGameSessions(gameType) { throw new Error("Method not implemented"); }
  async saveGameSession(session) { throw new Error("Method not implemented"); }
  async getMoodLogs() { throw new Error("Method not implemented"); }
  async saveMoodLog(log) { throw new Error("Method not implemented"); }
  async getPendingSyncEvents() { throw new Error("Method not implemented"); }
  async markEventSynced(eventId) { throw new Error("Method not implemented"); }
}
