/**
 * Web Speech API Service
 * Encapsulates SpeechSynthesis and SpeechRecognition with reliable capability detection and graceful degradation.
 */

export class VoiceService {
  constructor() {
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;
    this.RecognitionClass = SpeechRecognition;
    this.activeUtterance = null;
  }

  isSpeechSupported() {
    return !!this.synthesis;
  }

  isRecognitionSupported() {
    return !!this.RecognitionClass;
  }

  speak(text, speechRate = 0.9, language = 'en-US') {
    if (!this.isSpeechSupported()) {
      console.warn("Speech Synthesis is not supported on this device.");
      return false;
    }

    try {
      this.synthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.6, Math.min(1.2, speechRate));
      utterance.lang = language;
      this.activeUtterance = utterance;
      this.synthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
      return false;
    }
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  listen(onResult, onError, language = 'en-US') {
    if (!this.isRecognitionSupported()) {
      if (onError) onError("Voice recognition is not supported on this browser.");
      return null;
    }

    try {
      const recognition = new this.RecognitionClass();
      recognition.lang = language;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (event) => {
        if (onError) onError(event.error);
      };

      recognition.start();
      return recognition;
    } catch (err) {
      if (onError) onError(err.message);
      return null;
    }
  }
}

export const voiceService = new VoiceService();
