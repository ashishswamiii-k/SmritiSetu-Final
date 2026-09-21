import React, { useState, useEffect } from 'react';
import { localDataProvider } from './services/data/LocalDataProvider';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Navigation } from './components/common/Navigation';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { ProfileSelectionScreen } from './components/onboarding/ProfileSelectionScreen';
import { LogoutModal } from './components/common/LogoutModal';
import { LoginMoodModal } from './components/mood/LoginMoodModal';
import { TodayHome } from './components/home/TodayHome';
import { MyDaySchedule } from './components/schedule/MyDaySchedule';
import { GameHub } from './components/games/GameHub';
import { ReminderList } from './components/reminders/ReminderList';
import { MoodCheckIn } from './components/mood/MoodCheckIn';
import { PatientProfile } from './components/profile/PatientProfile';
import { CaretakerDashboard } from './components/caretaker/CaretakerDashboard';
import { accessibilityService } from './services/accessibilityService';

import { i18nService } from './services/i18nService';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tabHistory, setTabHistory] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [currentLang, setCurrentLang] = useState(i18nService.getLanguage());
  const [appState, setAppState] = useState('LOADING'); // 'LOADING' | 'PROFILE_SELECTION' | 'CREATE_PROFILE' | 'MAIN_APP'
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleNavigate = (newTab) => {
    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, -1));
      setActiveTab(prev);
    } else {
      setActiveTab('home');
    }
  };

  useEffect(() => {
    if (accessibilityService.init) accessibilityService.init();
    else if (accessibilityService.applyToDOM) accessibilityService.applyToDOM();
    loadProfilesAndActiveState();

    const unsubscribe = i18nService.subscribe((newLang) => {
      setCurrentLang(newLang);
    });
    return () => unsubscribe();
  }, []);

  const loadProfilesAndActiveState = async () => {
    try {
      setAppState('LOADING');
      const profiles = await localDataProvider.getAllProfiles();
      setAllProfiles(profiles);

      const activeId = await localDataProvider.getActiveProfileId();
      if (activeId) {
        const activeProf = await localDataProvider.getPatientProfile(activeId);
        if (activeProf) {
          setCurrentProfile(activeProf);
          setAppState('MAIN_APP');
          if (activeProf.role !== 'caretaker') {
            setIsMoodModalOpen(true);
          }
          return;
        }
      }

      if (profiles.length > 0) {
        setCurrentProfile(profiles[0]);
        localDataProvider.setActiveProfileId(profiles[0].id);
        setAppState('MAIN_APP');
        if (profiles[0].role !== 'caretaker') {
          setIsMoodModalOpen(true);
        }
      } else {
        setAppState('CREATE_PROFILE');
      }
    } catch (err) {
      console.error("Error loading profiles:", err);
      setAppState('MAIN_APP');
    }
  };

  const handleSelectProfile = async (profileId) => {
    localDataProvider.setActiveProfileId(profileId);
    const prof = await localDataProvider.getPatientProfile(profileId);
    setCurrentProfile(prof);
    setAppState('MAIN_APP');
    if (prof.role !== 'caretaker') {
      setIsMoodModalOpen(true);
    } else {
      setIsMoodModalOpen(false);
    }
    showToast(`Switched to profile "${prof.name}"`, 'info');
  };

  const handleInspectPatient = async (patientId) => {
    localDataProvider.setActiveProfileId(patientId);
    const prof = await localDataProvider.getPatientProfile(patientId);
    setCurrentProfile(prof);
    setIsMoodModalOpen(false);
    showToast(`Opened schedule for ${prof.name}`, 'info');
  };

  const handleSaveNewProfile = async (newProfileData) => {
    const saved = await localDataProvider.savePatientProfile(newProfileData);
    setCurrentProfile(saved);
    const profiles = await localDataProvider.getAllProfiles();
    setAllProfiles(profiles);
    setAppState('MAIN_APP');
    if (saved.role !== 'caretaker') {
      setIsMoodModalOpen(true);
    } else {
      setIsMoodModalOpen(false);
    }
    showToast(`Welcome to SmritiSetu, ${saved.name}!`, 'success');
  };

  const handleUpdateProfile = async (updatedProfileData) => {
    const saved = await localDataProvider.savePatientProfile(updatedProfileData);
    setCurrentProfile(saved);
    const profiles = await localDataProvider.getAllProfiles();
    setAllProfiles(profiles);
    showToast("Profile changes saved.", 'success');
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await localDataProvider.clearActiveProfileId();
    setCurrentProfile(null);
    const profiles = await localDataProvider.getAllProfiles();
    setAllProfiles(profiles);
    if (profiles.length > 0) {
      setAppState('PROFILE_SELECTION');
    } else {
      setAppState('CREATE_PROFILE');
    }
    showToast("Switched user session.", 'info');
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (appState === 'LOADING') {
    return (
      <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center text-[#1B3A3A] font-bold text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-3 border-[#E8825F] border-t-transparent animate-spin" />
          <span>Opening SmritiSetu...</span>
        </div>
      </div>
    );
  }

  if (appState === 'PROFILE_SELECTION') {
    return (
      <ProfileSelectionScreen
        profiles={allProfiles}
        onSelectProfile={handleSelectProfile}
        onCreateNewProfile={() => setAppState('CREATE_PROFILE')}
      />
    );
  }

  if (appState === 'CREATE_PROFILE') {
    return (
      <WelcomeScreen
        onSaveProfile={handleSaveNewProfile}
        onCancel={allProfiles.length > 0 ? () => setAppState(currentProfile ? 'MAIN_APP' : 'PROFILE_SELECTION') : null}
      />
    );
  }

  if (appState === 'MAIN_APP' && currentProfile?.role === 'caretaker') {
    return (
      <>
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 animate-bounce">
            <div className="bg-[#1B3A3A] text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 text-xs font-bold flex items-center gap-2">
              <span>{toastMessage.message}</span>
            </div>
          </div>
        )}

        <CaretakerDashboard
          profile={currentProfile}
          onRequestLogout={() => setIsLogoutModalOpen(true)}
          onInspectPatient={handleInspectPatient}
          onCreateNewPatient={() => setAppState('CREATE_PROFILE')}
          onTriggerToast={showToast}
        />

        {/* Logout Confirmation Modal */}
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirmLogout={handleConfirmLogout}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1B3A3A] flex flex-col md:flex-row antialiased selection:bg-[#E8825F] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-[#1B3A3A] text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 text-xs font-bold flex items-center gap-2">
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleNavigate}
        profile={currentProfile}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          profile={currentProfile}
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onGoBack={handleGoBack}
          canGoBack={tabHistory.length > 0 || activeTab !== 'home'}
          onRequestLogout={() => setIsLogoutModalOpen(true)}
        />

        <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 md:px-8">
          {activeTab === 'home' && (
            <TodayHome
              patientName={currentProfile?.name}
              onNavigate={handleNavigate}
              onTriggerToast={showToast}
            />
          )}

          {activeTab === 'myday' && (
            <MyDaySchedule
              onTriggerToast={showToast}
            />
          )}

          {activeTab === 'games' && (
            <GameHub
              onGoHome={() => setActiveTab('home')}
              onTriggerToast={showToast}
            />
          )}

          {activeTab === 'reminders' && (
            <ReminderList
              onTriggerToast={showToast}
            />
          )}

          {activeTab === 'mood' && (
            <MoodCheckIn
              onTriggerToast={showToast}
            />
          )}

          {activeTab === 'profile' && (
            <PatientProfile
              profile={currentProfile}
              onUpdateProfile={handleUpdateProfile}
              onTriggerToast={showToast}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={handleNavigate}
        />
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      {/* Login / Daily Welcome Mood Check-In Modal */}
      <LoginMoodModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        profileName={currentProfile?.name}
        onTriggerToast={showToast}
      />
    </div>
  );
}

export default App;


