import React, { useState } from 'react';
import { PatientDatabaseView } from './PatientDatabaseView';
import { CaretakerSecuritySettings } from './CaretakerSecuritySettings';
import { AvatarSvg } from '../profile/AvatarLibrary';
import logoImg from '../../assets/logo.png';
import { Users, Lock, LogOut, HeartHandshake, PlusCircle, LayoutDashboard, ArrowLeft, Shield } from 'lucide-react';

export function CaretakerDashboard({
  profile,
  onRequestLogout,
  onInspectPatient,
  onCreateNewPatient,
  onTriggerToast
}) {
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'security'

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1B3A3A] flex flex-col antialiased">
      {/* Caretaker Top Navigation Header */}
      <header className="bg-white border-b border-[#1B3A3A]/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="SmritiSetu Logo"
              className="w-10 h-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif-fraunces text-[#1B3A3A] tracking-tight">
                  SmritiSetu
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-[#E8825F]/15 text-[#D05C38] border border-[#E8825F]/40">
                  <HeartHandshake className="w-3 h-3 text-[#D05C38]" />
                  Caretaker Portal
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#5B6461]">
                Logged in as <strong className="text-[#1B3A3A]">{profile?.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRequestLogout}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#1B3A3A] text-[#1B3A3A] hover:text-white border border-[#1B3A3A]/20 text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Return to profile selection screen"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>

            <button
              onClick={onCreateNewPatient}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#1B3A3A] hover:bg-[#152e2e] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#7FA593]" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Sub-bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-[#1B3A3A]/5 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('database')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-[#1B3A3A] text-white shadow-xs'
                : 'text-[#5B6461] hover:bg-[#F6F3EC]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Multi-Patient Database</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#1B3A3A] text-white shadow-xs'
                : 'text-[#5B6461] hover:bg-[#F6F3EC]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Password & Security</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'database' && (
          <PatientDatabaseView
            caretakerId={profile?.id}
            onSelectPatientToInspect={onInspectPatient}
            onCreateNewPatient={onCreateNewPatient}
            onTriggerToast={onTriggerToast}
          />
        )}

        {activeTab === 'security' && (
          <CaretakerSecuritySettings
            profile={profile}
            onTriggerToast={onTriggerToast}
          />
        )}
      </main>
    </div>
  );
}
