'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { Sparkles, Map, Martini, ArrowRight, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

// モックの設問データ
const QUESTIONS = [
  {
    id: 'purpose',
    label: 'Q1. 今日のご来店目的は何ですか？',
    options: [
      { text: '接待や大切な方のおもてなし', value: 'business', icon: Map },
      { text: '友人とワイワイ盛り上がりたい', value: 'party', icon: Martini },
      { text: '一人でゆっくり飲みたい', value: 'solo', icon: Martini },
    ],
  },
  {
    id: 'atmosphere',
    label: 'Q2. どんな雰囲気の女性とお話ししたいですか？',
    options: [
      { text: '清楚で落ち着きのある女性', value: 'calm', icon: Sparkles },
      { text: '明るくてノリが良い女性', value: 'cheerful', icon: Sparkles },
      { text: '聞き上手で癒される女性', value: 'healing', icon: Sparkles },
    ],
  },
];

export const NightStyleQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 400); // 少し間を置いて次へ
    } else {
      setTimeout(() => setIsFinished(true), 400);
    }
  };

  const currentQuestion = QUESTIONS[currentStep];

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white/40 backdrop-blur-xl border border-gold/20 p-8 md:p-12 shadow-aura mix-blend-multiply">
      {!isFinished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col space-y-8"
          >
            <div className="text-center">
              <span className="text-[10px] text-gold font-serif luxury-tracking uppercase mb-2 block">
                Question {currentStep + 1} / {QUESTIONS.length}
              </span>
              <h3 className="text-lg md:text-xl font-serif text-[#171717] leading-relaxed">
                {currentQuestion.label}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(currentQuestion.id, option.value)}
                    className={`relative p-4 md:p-6 w-full flex items-center gap-4 border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gold/10 border-gold text-[#171717] shadow-sm'
                        : 'bg-white/60 border-gray-200 text-gray-500 hover:border-gold/50 hover:bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${isSelected ? 'bg-gold text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-serif tracking-wide text-sm md:text-base">{option.text}</span>
                    {isSelected && (
                      <motion.div layoutId="selected-indicator" className="ml-auto">
                        <ArrowRight size={20} className="text-gold" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gold/10 mb-6">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl font-serif text-[#171717] mb-4 luxury-tracking">
              あなたにぴったりのキャストを<br />ご案内します
            </h3>
            <p className="text-xs text-gray-500 font-serif leading-relaxed mb-10 tracking-widest">
              本日は特別な時間をAnimoでお過ごしください。<br />
              診断結果に基づき、最適なキャストをお勧めいたします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button asChild size="lg" className="w-full sm:w-auto px-10 btn-sheen">
                <Link href={`/cast?purpose=${answers.purpose}&atmosphere=${answers.atmosphere}`}>
                  キャスト一覧を見る
                </Link>
              </Button>
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center gap-2 text-[10px] uppercase font-serif text-gray-400 hover:text-gold transition-colors mt-4 sm:mt-0"
              >
                <RefreshCcw size={12} />
                診断をやり直す
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
