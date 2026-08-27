import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import { voiceService } from '../../services/voiceService';
import { RotateCcw, ArrowLeft } from 'lucide-react';

const EVERYDAY_ITEMS = [
  { id: 'cup', emoji: '☕', name: 'Tea Cup' },
  { id: 'jug', emoji: '🥛', name: 'Milk Jug' },
  { id: 'teapot', emoji: '🫖', name: 'Tea Pot' },
  { id: 'flower', emoji: '🌺', name: 'Flower' },
  { id: 'fruit', emoji: '🍎', name: 'Apple' },
  { id: 'basket', emoji: '🧺', name: 'Handloom Basket' },
  { id: 'sun', emoji: '☀️', name: 'Morning Sun' },
  { id: 'book', emoji: '📖', name: 'Book' }
];

export function MemoryMatch({ difficulty = 'easy', onComplete, onBack }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isProcessing, setIsProcessing] = useState(false);

  const getPairCount = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'hard': return 6;
      case 'medium': return 4;
      case 'easy': default: return 2;
    }
  };

  const setupGame = () => {
    const pairCount = getPairCount(difficulty);
    const selected = EVERYDAY_ITEMS.slice(0, pairCount);
    const deck = [...selected, ...selected]
      .map((item, index) => ({
        instanceId: `card_${index}_${Math.random()}`,
        itemId: item.id,
        emoji: item.emoji,
        name: item.name
      }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setAttempts(0);
    setStartTime(Date.now());
    setIsProcessing(false);
  };

  useEffect(() => {
    setupGame();
  }, [difficulty]);

  const handleCardClick = (index) => {
    if (isProcessing) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].itemId)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      setIsProcessing(true);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.itemId === secondCard.itemId) {
        // Matched!
        const updatedMatched = [...matchedIds, firstCard.itemId];
        setMatchedIds(updatedMatched);
        setFlippedIndices([]);
        setIsProcessing(false);
        voiceService.speak(`Matched ${firstCard.name}`);

        // Check if game completed
        const pairCount = getPairCount(difficulty);
        if (updatedMatched.length === pairCount) {
          handleGameFinish(attempts + 1, pairCount);
        }
      } else {
        // Not matched - brief delay to flip back
        setTimeout(() => {
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const handleGameFinish = async (totalAttempts, totalPairs) => {
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    // Calculate accuracy: perfect score = totalPairs attempts
    const accuracy = Math.min(100, Math.max(20, Math.round((totalPairs / totalAttempts) * 100)));
    const score = totalPairs * 50 + accuracy * 5;

    const res = await gameService.recordGameCompletion({
      gameType: 'memory_match',
      score,
      accuracy,
      difficulty,
      attempts: totalAttempts,
      completionTimeSeconds: timeSpent
    });

    if (onComplete) {
      onComplete(res);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-[#57534E] hover:text-[#1E1B4B] py-2 px-3 rounded-xl bg-white border border-[#E7E5E4]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h3 className="text-xl font-extrabold text-[#1E1B4B]">Memory Match</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-[#FEF3C7] text-[#B45309] rounded-full uppercase border border-[#FDE68A]">
            {difficulty} Level
          </span>
        </div>

        <button
          onClick={setupGame}
          aria-label="Restart Game"
          className="p-2.5 text-[#57534E] hover:text-[#D97706] rounded-xl bg-white border border-[#E7E5E4]"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Attempts Bar */}
      <div className="bg-white border border-[#E7E5E4] p-3 rounded-2xl flex justify-around text-center text-sm font-bold text-[#1E1B4B]">
        <div>
          <span className="text-xs text-[#78716C] font-semibold block uppercase">Attempts</span>
          <span className="text-xl text-[#D97706]">{attempts}</span>
        </div>
        <div>
          <span className="text-xs text-[#78716C] font-semibold block uppercase">Matches</span>
          <span className="text-xl text-[#166534]">{matchedIds.length} / {getPairCount(difficulty)}</span>
        </div>
      </div>

      {/* Memory Card Grid */}
      <div className={`grid gap-3 ${cards.length <= 4 ? 'grid-cols-2' : cards.length <= 8 ? 'grid-cols-4' : 'grid-cols-4'}`}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedIds.includes(card.itemId);
          const showFace = isFlipped || isMatched;

          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(idx)}
              disabled={isMatched || isProcessing}
              className={`aspect-square rounded-3xl border-3 flex items-center justify-center text-4xl shadow-sm transition-all transform active:scale-95 min-h-[72px] min-w-[72px] ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-80 cursor-default scale-95'
                  : isFlipped
                  ? 'bg-[#FEF3C7] border-[#D97706] scale-105'
                  : 'bg-[#1E1B4B] border-[#312E81] text-white hover:bg-[#312E81]'
              }`}
              aria-label={showFace ? card.name : `Card ${idx + 1}`}
            >
              {showFace ? card.emoji : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
