import React, { useState } from 'react';
import { gameService } from '../../services/gameService';
import { voiceService } from '../../services/voiceService';
import { ArrowLeft, CheckCircle2, Volume2 } from 'lucide-react';

const QUESTIONS_DATABASE = {
  easy: [
    {
      id: 'q1',
      question: 'What do you usually do right after waking up in the morning?',
      options: [
        { text: '🌅 Wash face & drink warm water', isCorrect: true },
        { text: '🌙 Go to sleep', isCorrect: false },
        { text: '🌙 Turn off night light', isCorrect: false }
      ],
      explanation: 'Washing your face and drinking water starts the morning fresh!'
    },
    {
      id: 'q2',
      question: 'Which meal comes first in the day?',
      options: [
        { text: '☀️ Breakfast', isCorrect: true },
        { text: '🌙 Dinner', isCorrect: false },
        { text: '☕ Afternoon Tea', isCorrect: false }
      ],
      explanation: 'Breakfast gives you energy for the morning!'
    }
  ],
  medium: [
    {
      id: 'q3',
      question: 'What is a good habit after taking your morning medicine?',
      options: [
        { text: '💧 Rest and drink a glass of water', isCorrect: true },
        { text: '🏃 Run a heavy marathon', isCorrect: false },
        { text: '😴 Skip all meals', isCorrect: false }
      ],
      explanation: 'Hydration helps your body absorb medicine comfortably.'
    },
    {
      id: 'q4',
      question: 'Which activity is best for a calm afternoon?',
      options: [
        { text: '📖 Reading or listening to music', isCorrect: true },
        { text: '📢 Loud construction work', isCorrect: false },
        { text: '🌙 Going to bed for the night', isCorrect: false }
      ],
      explanation: 'Reading or music keeps the mind active and calm.'
    }
  ],
  hard: [
    {
      id: 'q5',
      question: 'What should you check before stepping out for an evening walk?',
      options: [
        { text: '👟 Comfortable shoes and water bottle', isCorrect: true },
        { text: '📺 Television remote', isCorrect: false },
        { text: '🛏️ Bed sheets', isCorrect: false }
      ],
      explanation: 'Wearing good shoes ensures safe, comfortable walking.'
    },
    {
      id: 'q6',
      question: 'Which sequence correctly prepares you for a peaceful night?',
      options: [
        { text: '🌙 Light dinner → Evening walk → Take night medicine → Rest', isCorrect: true },
        { text: '☀️ Heavy morning breakfast → Sleep immediately', isCorrect: false },
        { text: '☕ Drink strong coffee at midnight', isCorrect: false }
      ],
      explanation: 'A calm routine helps ensure deep, restorative sleep.'
    }
  ]
};

export function RoutineRecall({ difficulty = 'easy', onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [startTime] = useState(Date.now());

  const questions = QUESTIONS_DATABASE[difficulty?.toLowerCase()] || QUESTIONS_DATABASE.easy;
  const currentQ = questions[currentIdx];

  const handleSpeakQuestion = () => {
    if (currentQ) {
      voiceService.speak(`${currentQ.question}`);
    }
  };

  const handleSelectOption = (option) => {
    if (feedback) return; // Prevent double selection
    setSelectedOption(option);

    const isRight = option.isCorrect;
    if (isRight) {
      setCorrectCount(prev => prev + 1);
      setFeedback({ isRight: true, text: 'Wonderful! That is correct.' });
      voiceService.speak('Wonderful! That is correct.');
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
      gameType: 'routine_recall',
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
          <h3 className="text-xl font-extrabold text-[#1E1B4B]">Daily Routine Recall</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-[#FEF3C7] text-[#B45309] rounded-full uppercase border border-[#FDE68A]">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        <button
          onClick={handleSpeakQuestion}
          aria-label="Read Question"
          className="p-2.5 text-[#D97706] hover:bg-[#FEF3C7] rounded-xl bg-white border border-[#E7E5E4]"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white border-2 border-[#E7E5E4] rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="text-xl font-bold text-[#1E1B4B] leading-snug">
          {currentQ.question}
        </h4>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                disabled={!!feedback}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition-all flex items-center justify-between min-h-[60px] active:scale-95 ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-[#FFFDF9] border-[#E7E5E4] text-[#1E1B4B] hover:border-[#D97706]'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 shrink-0" />}
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
