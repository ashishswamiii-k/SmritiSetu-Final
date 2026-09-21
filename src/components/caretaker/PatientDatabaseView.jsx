import React, { useState, useEffect } from 'react';
import { localDataProvider } from '../../services/data/LocalDataProvider';
import { AvatarSvg } from '../profile/AvatarLibrary';
import { LinkPatientModal } from './LinkPatientModal';
import { Users, CheckCircle2, Clock, Smile, UserPlus, ArrowUpRight, Activity, Calendar, Plus, KeyRound, Lock, ShieldCheck } from 'lucide-react';

export function PatientDatabaseView({ caretakerId, onSelectPatientToInspect, onCreateNewPatient, onTriggerToast }) {
  const [patientSummaries, setPatientSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = async () => {
    setLoading(true);
    const summaries = await localDataProvider.getMultiPatientDatabaseSummary();
    setPatientSummaries(summaries);
    setLoading(false);
  };

  const totalPatients = patientSummaries.length;
  const avgCompletion = totalPatients > 0
    ? Math.round(patientSummaries.reduce((acc, s) => acc + s.completionRate, 0) / totalPatients)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-product p-5 bg-white shadow-xs flex items-center justify-between border-l-4 border-l-[#1B3A3A]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Database Records</span>
            <div className="text-2xl font-serif-fraunces text-[#1B3A3A] mt-0.5">
              {totalPatients} {totalPatients === 1 ? 'Patient' : 'Patients'}
            </div>
          </div>
          <div className="w-12 h-12 bg-[#1B3A3A]/10 text-[#1B3A3A] rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="card-product p-5 bg-white shadow-xs flex items-center justify-between border-l-4 border-l-[#7FA593]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Avg Routine Completion</span>
            <div className="text-2xl font-serif-fraunces text-[#1B3A3A] mt-0.5">
              {avgCompletion}%
            </div>
          </div>
          <div className="w-12 h-12 bg-[#7FA593]/20 text-[#1B3A3A] rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#7FA593]" />
          </div>
        </div>

        <div className="card-product p-5 bg-white shadow-xs flex items-center justify-between border-l-4 border-l-[#E8825F]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Quick Action</span>
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#E8825F] hover:text-[#d05c38] transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Link Patient by Code</span>
            </button>
          </div>
          <div className="w-12 h-12 bg-[#E8825F]/15 text-[#E8825F] rounded-2xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Multi-Patient Database Grid */}
      <div className="card-product p-6 bg-white shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1B3A3A]/10">
          <div>
            <h3 className="text-xl font-serif-fraunces text-[#1B3A3A] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E8825F]" />
              <span>Multi-Patient Centralized Database</span>
            </h3>
            <p className="text-xs text-[#5B6461] mt-0.5">
              Monitor daily schedule progress, recent mood check-ins, and health routines across all patients.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="bg-[#1B3A3A] hover:bg-[#152e2e] text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#7FA593]" />
              <span>Link Patient Code</span>
            </button>

            <button
              onClick={onCreateNewPatient}
              className="bg-[#F6F3EC] hover:bg-stone-200 text-[#1B3A3A] border border-[#1B3A3A]/20 text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#E8825F]" />
              <span>Register Patient</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-[#5B6461]">
            Loading database records...
          </div>
        ) : patientSummaries.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-[#F6F3EC]/50 rounded-2xl border border-dashed border-[#1B3A3A]/20">
            <Users className="w-10 h-10 text-[#5B6461] mx-auto opacity-50" />
            <div>
              <p className="text-sm font-bold text-[#1B3A3A]">No patient profiles found in database</p>
              <p className="text-xs text-[#5B6461] mt-0.5">Create your first patient profile to begin monitoring.</p>
            </div>
            <button
              onClick={onCreateNewPatient}
              className="bg-[#E8825F] hover:bg-[#d97352] text-white text-xs font-bold py-2 px-4 rounded-xl inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientSummaries.map(({ patient, totalTasks, completedTasks, completionRate, latestMood, pendingCount, nextTask }) => (
              <div
                key={patient.id}
                className="card-product p-5 bg-[#F6F3EC]/40 hover:bg-[#F6F3EC] border border-[#1B3A3A]/12 rounded-2xl transition-all space-y-4"
              >
                {/* Patient Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {patient.photoDataUrl ? (
                      <img
                        src={patient.photoDataUrl}
                        alt={patient.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E8825F]"
                      />
                    ) : (
                      <AvatarSvg avatarId={patient.avatar || 'male_1'} size={48} />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#1B3A3A]">
                          {patient.name}
                        </h4>
                        <span className="text-[11px] font-mono font-bold text-[#1B3A3A] bg-white px-2 py-0.5 rounded-md border border-[#1B3A3A]/15 shadow-2xs">
                          {patient.patientCode || localDataProvider.generatePatientCode(patient.id)}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#5B6461] block mt-0.5">
                        Language: {patient.language?.toUpperCase() || 'EN'} • Registered Patient
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPatientToInspect(patient.id)}
                    className="p-2.5 bg-white hover:bg-[#1B3A3A] text-[#1B3A3A] hover:text-white rounded-xl border border-[#1B3A3A]/20 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Inspect Patient Schedule"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-[#1B3A3A]/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1B3A3A]">
                    <span>Today's Task Progress</span>
                    <span className="text-[#E8825F]">{completedTasks} / {totalTasks} ({completionRate}%)</span>
                  </div>
                  <div className="w-full bg-[#F6F3EC] h-2.5 rounded-full overflow-hidden border border-[#1B3A3A]/10">
                    <div
                      className="bg-[#7FA593] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Status Badges Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Latest Mood */}
                  <div className="p-3 bg-white rounded-xl border border-[#1B3A3A]/10 flex items-center gap-2">
                    <span className="text-2xl shrink-0">{latestMood?.emoji || '🙂'}</span>
                    <div>
                      <span className="text-[10px] font-extrabold text-[#5B6461] uppercase block">Latest Mood</span>
                      <span className="font-bold text-[#1B3A3A]">{latestMood?.label || 'Not logged yet'}</span>
                    </div>
                  </div>

                  {/* Next Routine */}
                  <div className="p-3 bg-white rounded-xl border border-[#1B3A3A]/10 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#E8825F] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-[#5B6461] uppercase block">Next Task</span>
                      <span className="font-bold text-[#1B3A3A] truncate block">
                        {nextTask ? `${nextTask.icon || ''} ${nextTask.label}` : 'All done!'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Patient by Access Code Modal */}
      <LinkPatientModal
        isOpen={isLinkModalOpen}
        caretakerId={caretakerId}
        onClose={() => setIsLinkModalOpen(false)}
        onSuccess={() => {
          setIsLinkModalOpen(false);
          loadDatabase();
        }}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
}
