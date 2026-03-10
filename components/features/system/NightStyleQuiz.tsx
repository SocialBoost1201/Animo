'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { getMatchedCasts } from '@/lib/actions/public/data';
import {
  Sparkles, Map, Martini, RefreshCcw, ArrowRight,
  Heart, Users, Star, MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Ripple } from '@/components/motion/Ripple';

// ─────────────────────────────────────────────────────────────────
// 設問定義（4問）
// ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'purpose',
    label: 'Q1. 今日のご来店目的は？',
    options: [
      { text: '接待や大切な方のおもてなし', value: 'business', icon: Map },
      { text: '友人とワイワイ盛り上がりたい', value: 'party', icon: Users },
      { text: '一人でゆっくり飲みたい', value: 'solo', icon: Martini },
    ],
  },
  {
    id: 'atmosphere',
    label: 'Q2. どんな雰囲気の女性とお話ししたいですか？',
    options: [
      { text: '清楚で落ち着きのある女性', value: 'calm', icon: Sparkles },
      { text: '明るくてノリが良い女性', value: 'cheerful', icon: Star },
      { text: '聞き上手で癒される女性', value: 'healing', icon: Heart },
    ],
  },
  {
    id: 'look',
    label: 'Q3. お好みの見た目のタイプは？',
    options: [
      { text: '清楚系・上品な雰囲気', value: 'elegant', icon: Sparkles },
      { text: 'キュートで可愛い系', value: 'cute', icon: Heart },
      { text: 'スタイリッシュ・クール系', value: 'cool', icon: Star },
    ],
  },
  {
    id: 'talk',
    label: 'Q4. 好きな会話スタイルは？',
    options: [
      { text: '一緒に盛り上がって楽しみたい', value: 'funny', icon: Users },
      { text: '深い話や知的な会話が好き', value: 'intellectual', icon: MessageCircle },
      { text: 'ゆっくり聞いてくれるのが好き', value: 'quiet', icon: Heart },
    ],
  },
];

type MatchedCast = {
  id: string;
  stage_name: string;
  slug: string | null;
  age: number | null;
  matchScore: number;
  cast_images: { image_url: string; is_primary: boolean }[];
};

// ─────────────────────────────────────────────────────────────────
// コンポーネント
// ─────────────────────────────────────────────────────────────────
export const NightStyleQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [matchedCasts, setMatchedCasts] = useState<MatchedCast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 回答完了時にマッチキャストを取得
  useEffect(() => {
    if (!isFinished) return;
    const tags = [
      answers.purpose ? `purpose_${answers.purpose}` : null,
      answers.atmosphere ? `atm_${answers.atmosphere}` : null,
      answers.look ? `look_${answers.look}` : null,
      answers.talk ? `talk_${answers.talk}` : null,
    ].filter(Boolean) as string[];

    const timer = setTimeout(() => {
      setIsLoading(true);
      getMatchedCasts(tags, 4).then((casts) => {
        setMatchedCasts(casts as MatchedCast[]);
        setIsLoading(false);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [isFinished, answers]);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 350);
    } else {
      setTimeout(() => setIsFinished(true), 350);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsFinished(false);
    setMatchedCasts([]);
  };

  const currentQuestion = QUESTIONS[currentStep];

  // クエリパラメータ（キャスト一覧へのリンク用）
  const queryParams = new URLSearchParams({
    purpose: answers.purpose ?? '',
    atmosphere: answers.atmosphere ?? '',
    look: answers.look ?? '',
    talk: answers.talk ?? '',
  }).toString();

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white/40 backdrop-blur-xl border border-gold/20 p-8 md:p-12 shadow-aura">
      {!isFinished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col space-y-8"
          >
            {/* プログレスバー */}
            <div className="flex gap-1.5 justify-center">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                    i <= currentStep ? 'bg-gold' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <span className="text-[10px] text-gold font-serif luxury-tracking uppercase mb-2 block">
                Question {currentStep + 1} / {QUESTIONS.length}
              </span>
              <h3 className="text-lg md:text-xl font-serif text-[#171717] leading-relaxed">
                {currentQuestion.label}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(currentQuestion.id, option.value)}
                    className={`relative overflow-hidden p-4 md:p-5 w-full flex items-center gap-4 border transition-all duration-500 rounded-sm ${
                      isSelected
                        ? 'bg-gold/5 border-gold text-[#171717] shadow-[0_0_20px_rgba(201,160,99,0.3)]'
                        : 'bg-white/60 border-gray-200 text-gray-500 hover:border-gold/50 hover:bg-white hover:shadow-[0_0_15px_rgba(201,160,99,0.15)]'
                    }`}
                  >
                    <Ripple />
                    <div className={`p-2 rounded-full transition-colors duration-500 ${isSelected ? 'bg-gold text-white shadow-[0_0_10px_rgba(201,160,99,0.5)]' : 'bg-gray-100/80 text-gray-400 group-hover:bg-gold/10'}`}>
                      <Icon size={16} />
                    </div>
                    <span className="font-serif tracking-wide text-sm relative z-10">{option.text}</span>
                    {isSelected && (
                      <motion.div layoutId="selected-indicator" className="ml-auto relative z-10">
                        <ArrowRight size={18} className="text-gold dropshadow-glow" />
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
            className="flex flex-col items-center"
          >
            <div className="inline-flex justify-center items-center w-14 h-14 rounded-full bg-gold/10 mb-4">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-[#171717] mb-2 luxury-tracking text-center">
              診断完了
            </h3>
            <p className="text-xs text-gray-500 font-serif leading-relaxed mb-8 tracking-widest text-center">
              あなたの好みに合ったキャストをピックアップしました。
            </p>

            {/* マッチキャストプレビュー */}
            {isLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 font-serif mb-8">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-gold border-t-transparent rounded-full" />
                マッチするキャストを探しています…
              </div>
            ) : matchedCasts.length > 0 ? (
              <div className="w-full mb-8">
                <p className="text-[10px] text-gold font-serif luxury-tracking uppercase text-center mb-4">
                  Recommended Cast
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {matchedCasts.map((cast) => {
                    const img = cast.cast_images?.find((i) => i.is_primary) ?? cast.cast_images?.[0];
                    return (
                      <Link key={cast.id} href={`/cast/${cast.slug ?? cast.id}`} className="group block">
                        <div className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                          <PlaceholderImage
                            src={img?.image_url ?? null}
                            alt={cast.stage_name}
                            ratio="4:5"
                            placeholderText={cast.stage_name}
                            className="group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="p-2 text-center border-t border-gray-50">
                            <p className="text-[11px] font-serif luxury-tracking text-[#171717]">
                              {cast.stage_name}
                            </p>
                            {cast.age && (
                              <p className="text-[10px] text-gray-400 mt-0.5">{cast.age}歳</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-serif mb-8 text-center">
                診断タグが設定されたキャストがまだいません。
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button asChild className="px-8 btn-sheen">
                <Link href={`/cast?${queryParams}`}>
                  全キャストを見る
                </Link>
              </Button>
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center gap-2 text-[10px] uppercase font-serif text-gray-400 hover:text-gold transition-colors"
              >
                <RefreshCcw size={12} />
                やり直す
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
