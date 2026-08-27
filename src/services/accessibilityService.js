/**
 * Accessibility Preference Management Service
 * Controls Text Size scaling, High Contrast mode, and Voice preferences.
 */

export class AccessibilityService {
  constructor() {
    this.defaults = {
      textSize: 'standard', // 'standard' | 'large' | 'extralarge'
      highContrast: false,
      voiceEnabled: true,
      speechRate: 0.9
    };
    this.listeners = new Set();
  }

  getSettings() {
    if (typeof localStorage === 'undefined') return this.defaults;
    const stored = localStorage.getItem('smritisetu_accessibility');
    if (!stored) return this.defaults;
    try {
      return { ...this.defaults, ...JSON.parse(stored) };
    } catch (e) {
      return this.defaults;
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smritisetu_accessibility', JSON.stringify(updated));
    }
    this.applyToDOM(updated);
    this.notify(updated);
    return updated;
  }

  applyToDOM(settings = this.getSettings()) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply text size class
    root.classList.remove('text-size-standard', 'text-size-large', 'text-size-extralarge');
    root.classList.add(`text-size-${settings.textSize || 'standard'}`);

    // Apply high contrast class
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(settings) {
    for (const listener of this.listeners) {
      listener(settings);
    }
  }
}

export const accessibilityService = new AccessibilityService();
