import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Clock, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
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
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white brand-shadow min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <RotateCcw className="w-6 h-6 text-[#BE94F5] shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-2xl text-white break-words">Spaced Concept Review Queue</h1>
            <p className="text-stone-400 text-xs leading-relaxed">
              Memory reinforcement engine using SM-2 spaced repetition for core CS concepts, mathematical formulas, and algorithmic patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Review Flashcard Card */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white space-y-6 brand-shadow min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs text-stone-400 min-w-0 gap-2">
            <span className="font-bold text-[#BE94F5] truncate">{currentCard.courseTitle}</span>
            <span className="font-mono shrink-0">Card {currentIndex + 1} of {cards.length}</span>
          </div>

          <div className="space-y-3 min-w-0">
            <h3 className="font-display font-bold text-lg text-stone-100 break-words">{currentCard.conceptTitle}</h3>
            <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex items-start gap-3 min-w-0">
              <HelpCircle className="w-5 h-5 text-[#BE94F5] shrink-0 mt-0.5" />
              <p className="text-sm text-stone-200 leading-relaxed font-medium break-words min-w-0">{currentCard.questionPrompt}</p>
            </div>
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] rounded-xl font-bold text-xs transition-all brand-shadow min-h-[44px]"
            >
              Reveal Answer & Code Pattern
            </button>
          ) : (
            <div className="space-y-4 pt-4 border-t border-stone-800 min-w-0">
              <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-2 text-xs text-stone-300 min-w-0">
                <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 shrink-0" /> Explanation & Insight
                </h4>
                <p className="leading-relaxed break-words">{currentCard.answerSummary}</p>
                {currentCard.codeExample && (
                  <pre className="font-mono text-[11px] bg-stone-950 p-3 rounded-lg text-stone-200 border border-stone-800 overflow-x-auto mt-2 break-words">
                    {currentCard.codeExample}
                  </pre>
                )}
              </div>

              {/* Recall Performance Self-Assessment */}
              <div className="space-y-2 min-w-0">
                <span className="text-xs text-stone-400 font-medium">How well did you recall this concept?</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold min-w-0">
                  <button
                    onClick={() => handleReviewAnswer('hard')}
                    className="py-2.5 bg-[#BE94F5]/20 text-[#BE94F5] border border-[#BE94F5]/40 hover:bg-[#BE94F5]/30 rounded-xl transition-all min-h-[44px]"
                  >
                    Hard (1 Day)
                  </button>
                  <button
                    onClick={() => handleReviewAnswer('good')}
                    className="py-2.5 bg-[#FCCC42]/20 text-[#FCCC42] border border-[#FCCC42]/40 hover:bg-[#FCCC42]/30 rounded-xl transition-all min-h-[44px]"
                  >
                    Good ({Math.round(currentCard.intervalDays * 1.5)} Days)
                  </button>
                  <button
                    onClick={() => handleReviewAnswer('easy')}
                    className="py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 rounded-xl transition-all min-h-[44px]"
                  >
                    Easy ({Math.round(currentCard.intervalDays * 2.5)} Days)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#151313] border border-stone-800 rounded-2xl text-stone-400">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="font-bold text-stone-200">Spaced Review Queue Complete!</p>
          <p className="text-xs mt-1">All concepts reviewed for today. Check back tomorrow.</p>
        </div>
      )}
    </div>
  );
};
