'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, Users, CalendarClock } from 'lucide-react';

type Prediction = {
  summary: string;
  recommendations: string[];
  peakDays: { day: string; forecast: string }[];
};

export function DashboardAIPrediction() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  async function fetchPrediction() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/predict', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPrediction(data);
        setLastUpdated(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
            <Sparkles size={15} className="text-gold" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-widest text-white">AIレコメンデーション</h2>
            <p className="text-[10px] text-white/40 mt-0.5">過去データに基づく需給予測と最適化サジェスト</p>
          </div>
        </div>
        <button
          onClick={fetchPrediction}
          disabled={isLoading}
          className="flex items-center gap-2 text-xs bg-white/10 hover:bg-gold/20 text-white/70 hover:text-gold px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50 font-bold"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? '分析中...' : prediction ? '再分析' : 'AIに分析させる'}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {!prediction && !isLoading && (
          <div className="text-center py-8">
            <Sparkles size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">「AIに分析させる」を押すと、過去の来客データを解析して</p>
            <p className="text-white/30 text-sm">来週の需要予測とシフト最適化サジェストを生成します。</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-white/40 text-xs">過去データを解析しています...</p>
          </div>
        )}

        {prediction && !isLoading && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="bg-white/5 rounded-sm p-4">
              <div className="flex items-start gap-2">
                <TrendingUp size={14} className="text-gold shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm leading-relaxed">{prediction.summary}</p>
              </div>
            </div>

            {/* Peak Days */}
            {prediction.peakDays && prediction.peakDays.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarClock size={12} className="text-white/40" />
                  <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">来週の需要予測</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {prediction.peakDays.map((d) => (
                    <div key={d.day} className="text-center bg-white/5 rounded-sm p-2">
                      <p className="text-white/50 text-[10px] mb-1">{d.day}</p>
                      <p className="text-xs font-bold text-white">{d.forecast}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={12} className="text-white/40" />
                  <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">推奨アクション</p>
                </div>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-gold font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
                      <p className="text-white/60 text-xs leading-relaxed">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lastUpdated && (
              <p className="text-[10px] text-white/20 text-right font-mono">最終更新: {lastUpdated}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
