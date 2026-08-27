/**
 * i18n Translation Service for SmritiSetu
 * Provides structured multilingual support (English, Hindi, Assamese) with automatic default fallback.
 */

const TRANSLATIONS = {
  en: {
    welcomeTitle: "SmritiSetu",
    welcomeSubtitle: "A gentle companion for everyday moments.",
    letsBegin: "Let's Begin",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    todaysReminders: "Today's Reminders",
    playAGame: "Play a Game",
    howAmIFeeling: "How Am I Feeling?",
    myReminders: "My Reminders",
    voiceHelp: "Voice Help",
    navHome: "Home",
    navGames: "Games",
    navReminders: "Reminders",
    navMood: "Mood",
    navProfile: "Profile",
    markDone: "Mark as Done",
    completed: "Done",
    wellDone: "Well Done!",
    score: "Score",
    accuracy: "Accuracy",
    playAgain: "Play Again",
    anotherGame: "Another Game",
    backToHome: "Home",
    saveSuccessOffline: "Saved on this device. It will sync when connected.",
    voiceHelpGreeting: "Hello! I am your SmritiSetu companion. How can I help you today?",
    noRemindersToday: "You have no pending reminders for today.",
    medicalDisclaimer: "SmritiSetu is designed to support everyday routines, cognitive engagement and caregiver communication. It does not diagnose or treat medical conditions."
  },
  hi: {
    welcomeTitle: "स्मृतिसेतु",
    welcomeSubtitle: "आपके हर दिन के पलों का एक सरल और प्यारा साथी।",
    letsBegin: "शुरू करें",
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "नमस्ते",
    goodEvening: "शुभ संध्या",
    todaysReminders: "आज के रिमाइंडर",
    playAGame: "खेल खेलें",
    howAmIFeeling: "मैं कैसा महसूस कर रहा हूँ?",
    myReminders: "मेरे रिमाइंडर",
    voiceHelp: "आवाज़ से मदद",
    navHome: "होम",
    navGames: "खेल",
    navReminders: "रिमाइंडर",
    navMood: "मनोदशा",
    navProfile: "प्रोफ़ाइल",
    markDone: "पूरा चिह्नित करें",
    completed: "पूरा हुआ",
    wellDone: "बहुत बढ़िया!",
    score: "अंक",
    accuracy: "सटीकता",
    playAgain: "फिर से खेलें",
    anotherGame: "दूसरा खेल",
    backToHome: "होम",
    saveSuccessOffline: "इस डिवाइस पर सहेजा गया। कनेक्ट होने पर सिंक हो जाएगा।",
    voiceHelpGreeting: "नमस्ते! मैं आपका स्मृतिसेतु साथी हूँ। मैं आपकी क्या मदद कर सकता हूँ?",
    noRemindersToday: "आज आपके पास कोई लंबित रिमाइंडर नहीं है।",
    medicalDisclaimer: "स्मृतिसेतु दैनिक दिनचर्या और मानसिक गतिविधियों में सहायता के लिए है। यह चिकित्सा स्थितियों का निदान नहीं करता है।"
  },
  as: {
    welcomeTitle: "স্মৃতিসেতু",
    welcomeSubtitle: "দৈনন্দিন মুহূৰ্তবোৰৰ বাবে এক মৰমৰ সংগী।",
    letsBegin: "আৰম্ভ কৰক",
    goodMorning: "সুপ্ৰভাত",
    goodAfternoon: "নমস্কাৰ",
    goodEvening: "শুভ সন্ধ্যা",
    todaysReminders: "আজিৰ সোঁৱৰণী",
    playAGame: "খেল খেলক",
    howAmIFeeling: "মোৰ অনুভৱ কেনেকুৱা?",
    myReminders: "মোৰ সোঁৱৰণীবোৰ",
    voiceHelp: "ভাৱ প্ৰকাশৰ সহায়",
    navHome: "গৃহ",
    navGames: "খেল",
    navReminders: "সোঁৱৰণী",
    navMood: "অনুভৱ",
    navProfile: "প্ৰফাইল",
    markDone: "সম্পূৰ্ণ হ’ল",
    completed: "সম্পূৰ্ণ",
    wellDone: "বৰ ধুনীয়া!",
    score: "স্কোৰ",
    accuracy: "শুদ্ধতা",
    playAgain: "পুনৰ খেলক",
    anotherGame: "আন এটা খেল",
    backToHome: "গৃহ",
    saveSuccessOffline: "এই সঁজুলিত সংৰক্ষণ কৰা হ’ল। ই ইণ্টাৰনেট সংযোজিত হ’লে চিনক্ৰনাইন হ’ব।",
    voiceHelpGreeting: "নমস্কাৰ! মই আপোনাৰ স্মৃতিসেতু সংগী। মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
    noRemindersToday: "আজিৰ বাবে কোনো সোঁৱৰণী বাকী নাই।",
    medicalDisclaimer: "স্মৃতিসেতু দৈনিক কাৰ্যসূচী আৰু স্মৃতি শক্তিৰ সহায়ৰ বাবে প্ৰস্তুত কৰা হৈছে।"
  }
};

export class I18nService {
  constructor() {
    this.currentLanguage = 'en';
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLanguage = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('smritisetu_language', lang);
      }
    }
  }

  getLanguage() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('smritisetu_language');
      if (saved && TRANSLATIONS[saved]) return saved;
    }
    return this.currentLanguage;
  }

  t(key) {
    const lang = this.getLanguage();
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    // Fallback to English
    return TRANSLATIONS.en[key] || key;
  }
}

export const i18nService = new I18nService();
