import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useCodext } from '../context/CodextContext';
import { CATEGORIES } from '../data/seedData';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setActiveCategory } = useCodext();

  const selectableInterests = CATEGORIES.filter((c) => c !== 'All');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Architecture',
    'Photography',
    'Interior Design',
  ]);

  if (!isOnboardingOpen) return null;

  const toggleInterest = (category: string) => {
    setSelectedInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleFinish = (skip = false) => {
    localStorage.setItem('codasa_onboarded_v1', 'true');
    if (!skip && selectedInterests.length > 0) {
      setActiveCategory(selectedInterests[0]);
    }
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Prism Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/25">
          <Sparkles className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to Codasa
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          Choose a few themes to personalize your discovery feed with daily visual inspiration.
        </p>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-6">
          {selectableInterests.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-3 rounded-2xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="truncate">{interest}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => handleFinish(false)}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
          >
            Start Exploring ({selectedInterests.length} selected)
          </button>

          <button
            onClick={() => handleFinish(true)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
};
