import React, { useState, useEffect } from 'react';
import { localDataProvider } from './services/data/LocalDataProvider';
import { accessibilityService } from './services/accessibilityService';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { Toast } from './components/common/Toast';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { TodayHome } from './components/home/TodayHome';
import { GameHub } from './components/games/GameHub';
import { ReminderList } from './components/reminders/ReminderList';
import { MoodCheckIn } from './components/mood/MoodCheckIn';
import { PatientProfile } from './components/profile/PatientProfile';

export default function App() {
  const [currentStep, setCurrentStep] = useState('loading'); // 'welcome' | 'onboarding' | 'app'
  const [activeTab, setActiveTab] = useState('home');
  const [patientProfile, setPatientProfile] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Initialize accessibility DOM settings
    accessibilityService.applyToDOM();

    async function checkProfile() {
      const existing = await localDataProvider.getPatientProfile();
      if (existing && existing.name) {
        setPatientProfile(existing);
        setCurrentStep('app');
      } else {
        setCurrentStep('welcome');
      }
    }
    checkProfile();
  }, []);

  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleStartOnboarding = () => {
    setCurrentStep('onboarding');
  };

  const handleCompleteOnboarding = async (profileData) => {
    const saved = await localDataProvider.savePatientProfile(profileData);
    setPatientProfile(saved);
    setCurrentStep('app');
    triggerToast(`Welcome to SmritiSetu, ${saved.name}!`, 'success');
  };

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center text-[#78716C]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-md animate-bounce">
            S
          </div>
          <p className="text-[#1E1B4B] font-bold text-lg">Getting things ready...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'welcome') {
    return <WelcomeScreen onStart={handleStartOnboarding} />;
  }

  if (currentStep === 'onboarding') {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E1B4B] flex flex-col font-sans">
      <Header
        patientName={patientProfile?.name}
        language={patientProfile?.language}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <TodayHome
            patientName={patientProfile?.name}
            onNavigate={(tab) => setActiveTab(tab)}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'games' && (
          <GameHub
            onGoHome={() => setActiveTab('home')}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderList
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'mood' && (
          <MoodCheckIn
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'profile' && (
          <PatientProfile
            profile={patientProfile}
            onUpdateProfile={(updated) => setPatientProfile(updated)}
            onTriggerToast={triggerToast}
          />
        )}
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
