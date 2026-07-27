import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { SpacedReviewCard } from '../../types/practice';
import { INITIAL_SPACED_REVIEW_CARDS } from '../../data/practiceData';

export const SpacedReviewView: React.FC = () => {
  const [cards, setCards] = useState<SpacedReviewCard[]>(INITIAL_SPACED_REVIEW_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = cards[currentIndex];

  const handleReviewAnswer = (quality: 'easy' | 'good' | 'hard') => {
    if (!currentCard) return;

    let nextInterval = currentCard.intervalDays;
    if (quality === 'easy') nextInterval = Math.round(currentCard.intervalDays * 2.5);
    else if (quality === 'good') nextInterval = Math.round(currentCard.intervalDays * 1.5);
    else nextInterval = 1;

    const updated = cards.map((c, idx) =>
      idx === currentIndex
        ? {
            ...c,
            intervalDays: nextInterval,
            reviewCount: c.reviewCount + 1,
            lastReviewedDate: new Date().toISOString(),
            nextReviewDate: new Date(Date.now() + 86400000 * nextInterval).toISOString()
          }
        : c
    );

    setCards(updated);
    setShowAnswer(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <RotateCcw className="w-6 h-6 text-[#000000] dark:text-[#F2C94C] shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-[#000000] dark:text-[#F6EFEF] break-words">Spaced Concept Review Queue</h1>
            <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-xs font-bold leading-relaxed">
              Memory reinforcement engine using SM-2 spaced repetition for core CS concepts, mathematical formulas, and algorithmic patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Review Flashcard Card */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-6 min-w-0">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#000000] text-xs font-mono font-black uppercase min-w-0 gap-2">
            <span className="text-[#000000] dark:text-[#F2C94C] truncate">{currentCard.courseTitle}</span>
            <span className="shrink-0">Card {currentIndex + 1} of {cards.length}</span>
          </div>

          <div className="space-y-3 min-w-0">
            <h3 className="font-display font-black text-lg uppercase text-[#000000] dark:text-[#F6EFEF] break-words">{currentCard.conceptTitle}</h3>
            <div className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded flex items-start gap-3 min-w-0">
              <HelpCircle className="w-5 h-5 text-[#000000] dark:text-[#F2C94C] shrink-0 mt-0.5" />
              <p className="text-sm font-bold leading-relaxed break-words min-w-0">{currentCard.questionPrompt}</p>
            </div>
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] neo-btn rounded font-black text-xs uppercase tracking-wider transition-all min-h-[44px]"
            >
              Reveal Answer & Code Pattern
            </button>
          ) : (
            <div className="space-y-4 pt-4 border-t-2 border-[#000000] min-w-0">
              <div className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2 text-xs font-bold min-w-0">
                <h4 className="font-black text-sm uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0" /> Explanation & Insight
                </h4>
                <p className="leading-relaxed break-words">{currentCard.answerSummary}</p>
                {currentCard.codeExample && (
                  <pre className="font-mono text-[11px] bg-[#FFFFFF] dark:bg-[#1E1C1C] p-3 rounded text-[#000000] dark:text-[#F6EFEF] border border-[#000000] overflow-x-auto mt-2 break-words">
                    {currentCard.codeExample}
                  </pre>
                )}
              </div>

              {/* Recall Performance Self-Assessment */}
              <div className="space-y-2 min-w-0 font-bold">
                <span className="text-xs uppercase">How well did you recall this concept?</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-black uppercase min-w-0">
                  <button
                    onClick={() => handleReviewAnswer('hard')}
                    className="py-2.5 bg-[#FFDAD6] text-[#000000] border-2 border-[#000000] rounded transition-all min-h-[44px]"
                  >
                    Hard (1 Day)
                  </button>
                  <button
                    onClick={() => handleReviewAnswer('good')}
                    className="py-2.5 bg-[#F2C94C] text-[#000000] border-2 border-[#000000] rounded transition-all min-h-[44px]"
                  >
                    Good ({Math.round(currentCard.intervalDays * 1.5)} Days)
                  </button>
                  <button
                    onClick={() => handleReviewAnswer('easy')}
                    className="py-2.5 bg-[#82E0AA] text-[#000000] border-2 border-[#000000] rounded transition-all min-h-[44px]"
                  >
                    Easy ({Math.round(currentCard.intervalDays * 2.5)} Days)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded">
          <CheckCircle2 className="w-10 h-10 text-[#82E0AA] mx-auto mb-2" />
          <p className="font-black uppercase text-base">Spaced Review Queue Complete!</p>
          <p className="text-xs font-bold mt-1">All concepts reviewed for today. Check back tomorrow.</p>
        </div>
      )}
    </div>
  );
};
