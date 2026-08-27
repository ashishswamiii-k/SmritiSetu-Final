import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import { MemoryMatch } from './MemoryMatch';
import { RoutineRecall } from './RoutineRecall';
import { PatternRecognition } from './PatternRecognition';
import { GameResultModal } from './GameResultModal';
import { Gamepad2, Sparkles, ChevronRight, Trophy } from 'lucide-react';

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
      <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto">
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
      <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto">
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
      <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto">
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
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="card-product p-6 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Cognitive Activities</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F6F3EC] rounded-full text-xs font-bold text-[#1B3A3A] border border-[#1B3A3A]/12">
            <Sparkles className="w-3.5 h-3.5 text-[#E8825F]" />
            <span>Adaptive Level: {recommendedDifficulty.toUpperCase()}</span>
          </div>
        </div>
        <h2 className="text-3xl font-serif-fraunces text-[#1B3A3A]">Gentle Mind Games</h2>
        <p className="text-sm font-medium text-[#5B6461] mt-1">
          Enjoyable activities designed to support memory, routine sequencing, and visual recall.
        </p>
      </div>

      {/* Game Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Game 1: Memory Match */}
        <div
          onClick={() => setActiveGame('memory')}
          className="card-product p-5 bg-white hover:border-[#1B3A3A] cursor-pointer transition-all active:scale-98 flex flex-col justify-between space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#E8825F]/15 text-[#E8825F] flex items-center justify-center font-extrabold text-2xl group-hover:scale-110 transition-transform">
              ☕
            </div>
            <ChevronRight className="w-5 h-5 text-[#5B6461] group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1B3A3A]">Memory Match</h3>
            <p className="text-xs text-[#5B6461] mt-1 leading-normal">Remember everyday object pairs.</p>
          </div>
          <button className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors min-h-[36px]">
            Start Activity
          </button>
        </div>

        {/* Game 2: Daily Routine Recall */}
        <div
          onClick={() => setActiveGame('routine')}
          className="card-product p-5 bg-white hover:border-[#1B3A3A] cursor-pointer transition-all active:scale-98 flex flex-col justify-between space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#7FA593]/15 text-[#7FA593] flex items-center justify-center font-extrabold text-2xl group-hover:scale-110 transition-transform">
              🌅
            </div>
            <ChevronRight className="w-5 h-5 text-[#5B6461] group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1B3A3A]">Daily Routine Recall</h3>
            <p className="text-xs text-[#5B6461] mt-1 leading-normal">Sequencing everyday steps.</p>
          </div>
          <button className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors min-h-[36px]">
            Start Activity
          </button>
        </div>

        {/* Game 3: Pattern Recognition */}
        <div
          onClick={() => setActiveGame('pattern')}
          className="card-product p-5 bg-white hover:border-[#1B3A3A] cursor-pointer transition-all active:scale-98 flex flex-col justify-between space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#1B3A3A]/15 text-[#1B3A3A] flex items-center justify-center font-extrabold text-2xl group-hover:scale-110 transition-transform">
              🧩
            </div>
            <ChevronRight className="w-5 h-5 text-[#5B6461] group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1B3A3A]">Pattern Game</h3>
            <p className="text-xs text-[#5B6461] mt-1 leading-normal">Visual shape & object matching.</p>
          </div>
          <button className="w-full bg-[#E8825F] hover:bg-[#d97352] text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors min-h-[36px]">
            Start Activity
          </button>
        </div>
      </div>

      {/* Sessions Summary Banner */}
      <div className="card-product p-4 bg-[#F6F3EC] flex items-center justify-between border border-[#1B3A3A]/12">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-[#E8825F]" />
          <div>
            <h4 className="text-xs font-bold text-[#1B3A3A]">Sessions Completed</h4>
            <p className="text-[11px] text-[#5B6461]">Saved locally on your device</p>
          </div>
        </div>
        <span className="text-xl font-extrabold text-[#1B3A3A]">{historyCount}</span>
      </div>
    </div>
  );
}
