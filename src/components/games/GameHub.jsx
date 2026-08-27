import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import { MemoryMatch } from './MemoryMatch';
import { RoutineRecall } from './RoutineRecall';
import { PatternRecognition } from './PatternRecognition';
import { GameResultModal } from './GameResultModal';
import { Gamepad2, Brain, Sparkles, ChevronRight, Trophy } from 'lucide-react';

export function GameHub({ onGoHome, onTriggerToast }) {
  const [activeGame, setActiveGame] = useState(null); // null | 'memory' | 'routine' | 'pattern'
  const [recommendedDifficulty, setRecommendedDifficulty] = useState('easy');
  const [resultData, setResultData] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const diff = await gameService.getRecommendedDifficulty('memory_match');
      setRecommendedDifficulty(diff);
      const allSessions = await gameService.getGameHistory();
      setHistoryCount(allSessions.length);
    }
    loadStats();
  }, [activeGame]);

  const handleGameComplete = (result) => {
    setResultData(result);
  };

  const handlePlayAgain = () => {
    setResultData(null);
  };

  const handleAnotherGame = () => {
    setResultData(null);
    setActiveGame(null);
  };

  if (activeGame === 'memory') {
    return (
      <div className="pb-24 pt-4 px-4">
        <MemoryMatch
          difficulty={recommendedDifficulty}
          onComplete={handleGameComplete}
          onBack={() => setActiveGame(null)}
        />
        <GameResultModal
          result={resultData}
          onPlayAgain={handlePlayAgain}
          onAnotherGame={handleAnotherGame}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  if (activeGame === 'routine') {
    return (
      <div className="pb-24 pt-4 px-4">
        <RoutineRecall
          difficulty={recommendedDifficulty}
          onComplete={handleGameComplete}
          onBack={() => setActiveGame(null)}
        />
        <GameResultModal
          result={resultData}
          onPlayAgain={handlePlayAgain}
          onAnotherGame={handleAnotherGame}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  if (activeGame === 'pattern') {
    return (
      <div className="pb-24 pt-4 px-4">
        <PatternRecognition
          difficulty={recommendedDifficulty}
          onComplete={handleGameComplete}
          onBack={() => setActiveGame(null)}
        />
        <GameResultModal
          result={resultData}
          onPlayAgain={handlePlayAgain}
          onAnotherGame={handleAnotherGame}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Cognitive Engagement</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-[#78350F] border border-[#FDE68A]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Adaptive Level: {recommendedDifficulty.toUpperCase()}</span>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-[#78350F]">Gentle Mind Games</h2>
        <p className="text-sm font-medium text-[#92400E] mt-1">
          Enjoyable activities designed to support memory, routine sequencing, and visual recall.
        </p>
      </div>

      {/* Game Selection Cards */}
      <div className="space-y-4">
        {/* Game 1: Memory Match */}
        <div
          onClick={() => setActiveGame('memory')}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-extrabold text-2xl group-hover:scale-110 transition-transform">
              ☕
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1E1B4B]">Memory Match</h3>
              <p className="text-xs text-[#78716C] mt-0.5">Match familiar everyday objects</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#D97706] group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Game 2: Daily Routine Recall */}
        <div
          onClick={() => setActiveGame('routine')}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center font-extrabold text-2xl group-hover:scale-110 transition-transform">
              🌅
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1E1B4B]">Daily Routine Recall</h3>
              <p className="text-xs text-[#78716C] mt-0.5">Sequencing everyday activities</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#D97706] group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Game 3: Pattern & Object Recognition */}
        <div
          onClick={() => setActiveGame('pattern')}
          className="bg-white border-2 border-[#E7E5E4] hover:border-[#D97706] p-5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center font-extrabold text-2xl group-hover:scale-110 transition-transform">
              🧩
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1E1B4B]">Pattern Recognition</h3>
              <p className="text-xs text-[#78716C] mt-0.5">Visual shape & object matching</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#D97706] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Sessions Summary Banner */}
      <div className="bg-[#FAF9F6] border border-[#E7E5E4] p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-[#D97706]" />
          <div>
            <h4 className="text-sm font-bold text-[#1E1B4B]">Sessions Completed</h4>
            <p className="text-xs text-[#78716C]">Your progress is saved locally</p>
          </div>
        </div>
        <span className="text-2xl font-extrabold text-[#D97706]">{historyCount}</span>
      </div>
    </div>
  );
}
