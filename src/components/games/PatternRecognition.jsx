import React, { useState } from 'react';
import { gameService } from '../../services/gameService';
import { voiceService } from '../../services/voiceService';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const PATTERN_QUESTIONS = {
  easy: [
    {
      id: 'p1',
      title: 'Complete the Shape Pattern',
      sequence: ['●', '▲', '●', '▲', '?'],
      options: [
        { text: '●', emoji: '●', isCorrect: true },
        { text: '▲', emoji: '▲', isCorrect: false },
        { text: '■', emoji: '■', isCorrect: false }
      ]
    },
    {
      id: 'p2',
      title: 'Complete the Fruit Sequence',
      sequence: ['🍎', '🍌', '🍎', '🍌', '?'],
      options: [
        { text: '🍎 Apple', emoji: '🍎', isCorrect: true },
        { text: '🍌 Banana', emoji: '🍌', isCorrect: false },
        { text: '🍇 Grapes', emoji: '🍇', isCorrect: false }
      ]
    }
  ],
  medium: [
    {
      id: 'p3',
      title: 'Complete the Day & Night Pattern',
      sequence: ['☀️', '🌙', '☀️', '🌙', '?'],
      options: [
        { text: '☀️ Sun', emoji: '☀️', isCorrect: true },
        { text: '🌙 Moon', emoji: '🌙', isCorrect: false },
        { text: '⭐ Star', emoji: '⭐', isCorrect: false }
      ]
    },
    {
      id: 'p4',
      title: 'Find the Matching Tea Cup',
      prompt: 'Which tea cup matches ☕?',
      options: [
        { text: '☕ Warm Tea Cup', emoji: '☕', isCorrect: true },
        { text: '🥛 Milk Glass', emoji: '🥛', isCorrect: false },
        { text: '🥣 Soup Bowl', emoji: '🥣', isCorrect: false }
      ]
    }
  ],
  hard: [
    {
      id: 'p5',
      title: 'Complete the Complex Pattern',
      sequence: ['🔴', '🟢', '🔵', '🔴', '🟢', '?'],
      options: [
        { text: '🔵 Blue Circle', emoji: '🔵', isCorrect: true },
        { text: '🔴 Red Circle', emoji: '🔴', isCorrect: false },
        { text: '🟢 Green Circle', emoji: '🟢', isCorrect: false }
      ]
    },
    {
      id: 'p6',
      title: 'Complete the Household Object Sequence',
      sequence: ['📖', '👓', '📖', '👓', '?'],
      options: [
        { text: '📖 Book', emoji: '📖', isCorrect: true },
        { text: '👓 Glasses', emoji: '👓', isCorrect: false },
        { text: '🗝️ Key', emoji: '🗝️', isCorrect: false }
      ]
    }
  ]
};

export function PatternRecognition({ difficulty = 'easy', onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [startTime] = useState(Date.now());

  const questions = PATTERN_QUESTIONS[difficulty?.toLowerCase()] || PATTERN_QUESTIONS.easy;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt) => {
    if (feedback) return;
    setSelectedOption(opt);

    const isRight = opt.isCorrect;
    if (isRight) {
      setCorrectCount(prev => prev + 1);
      setFeedback({ isRight: true, text: 'Great observation!' });
      voiceService.speak('Great observation!');
    } else {
      setFeedback({ isRight: false, text: 'Good try. Let\'s continue.' });
      voiceService.speak("Good try. Let's continue.");
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        finishGame(isRight ? correctCount + 1 : correctCount);
      }
    }, 1800);
  };

  const finishGame = async (finalCorrect) => {
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((finalCorrect / questions.length) * 100);
    const score = finalCorrect * 100;

    const res = await gameService.recordGameCompletion({
      gameType: 'pattern_recognition',
      score,
      accuracy,
      difficulty,
      attempts: questions.length,
      completionTimeSeconds: timeSpent
    });

    if (onComplete) {
      onComplete(res);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-[#57534E] hover:text-[#1E1B4B] py-2 px-3 rounded-xl bg-white border border-[#E7E5E4]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h3 className="text-xl font-extrabold text-[#1E1B4B]">Pattern Recognition</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-[#FEF3C7] text-[#B45309] rounded-full uppercase border border-[#FDE68A]">
            Pattern {currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Pattern Display Card */}
      <div className="bg-white border-2 border-[#E7E5E4] rounded-3xl p-6 shadow-sm space-y-6 text-center">
        <h4 className="text-lg font-bold text-[#1E1B4B]">{currentQ.title}</h4>

        {currentQ.sequence ? (
          <div className="flex items-center justify-center gap-3 bg-[#FAF9F6] p-5 rounded-2xl border border-[#E7E5E4] text-3xl font-extrabold">
            {currentQ.sequence.map((item, idx) => (
              <span
                key={idx}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  item === '?' ? 'bg-[#FEF3C7] text-[#D97706] border-2 border-dashed border-[#F59E0B] animate-pulse' : 'bg-white shadow-xs'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-2xl font-bold text-[#1E1B4B] bg-[#FAF9F6] p-4 rounded-2xl border border-[#E7E5E4]">
            {currentQ.prompt}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                disabled={!!feedback}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center font-bold transition-all min-h-[90px] active:scale-95 ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-[#FFFDF9] border-[#E7E5E4] text-[#1E1B4B] hover:border-[#D97706]'
                }`}
              >
                <span className="text-3xl mb-1">{opt.emoji}</span>
                <span className="text-xs">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-bold text-sm border animate-fade-in ${
            feedback.isRight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-amber-100 border-amber-300 text-amber-800'
          }`}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
}
