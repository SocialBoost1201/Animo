'use client';

import { useState } from 'react';
import { Trophy, Star, TrendingUp, History, X } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { CastScoreLog } from '@/lib/types/cast-ui';

export function CastScoreWidget({
  score,
  logs,
  targetMonth
}: {
  score: { total_score: number; current_level: number; };
  logs: CastScoreLog[];
  targetMonth?: string;
}) {
  const [showLogs, setShowLogs] = useState(false);
  const nextLevelScore = score.current_level * 50;
  const progressPercent = Math.min(100, (score.total_score / nextLevelScore) * 100);
  
  const displayMonth = targetMonth 
    ? format(new Date(targetMonth + '-01T00:00:00'), 'yyyy年M月') 
    : '';

  return (
    <>
      {/* Premium Score Widget Card */}
      <div 
        onClick={() => setShowLogs(true)}
        className="group relative overflow-hidden rounded-4xl bg-[#1a1c29] p-[2px] shadow-2xl cursor-pointer transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98]"
      >
        {/* Animated Gradient Border Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-yellow-500/30 via-transparent to-yellow-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow" style={{ animationDuration: '8s' }}></div>
        
        {/* Inner Card Container */}
        <div className="relative h-full w-full rounded-4xl bg-linear-to-br from-[#1a1c29] to-[#25283a] p-6 lg:p-8 overflow-hidden">
          
          {/* Subtle Background Glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/20 rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:bg-yellow-500/30"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs tracking-[0.25em] font-bold text-yellow-500/90 uppercase">
                    Animo Score {displayMonth ? <span className="text-yellow-500/60 ml-1">{displayMonth}</span> : ''}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-white drop-shadow-sm">
                    {score.total_score.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">pt</span>
                </div>
              </div>
              
              {/* Level Badge */}
              <div className="text-right flex flex-col items-end">
                <span className="text-xs text-gray-400 block mb-1.5 font-medium tracking-wider uppercase">Rank</span>
                <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-xl border border-yellow-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                  <Star className="w-3.5 h-3.5 fill-current opacity-80" />
                  <span className="text-sm font-bold tracking-widest pl-0.5">Lv.{score.current_level}</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-medium text-gray-400 px-1">
                <span>NEXT RANK</span>
                <span className="text-gray-300">{nextLevelScore - score.total_score} pt to go</span>
              </div>
              {/* Premium Progress Bar */}
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm shadow-inner">
                <div 
                  className="h-full bg-linear-to-r from-yellow-600 via-yellow-400 to-yellow-200 rounded-full relative"
                  style={{ width: `${progressPercent}%`, transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {/* Shimmer effect inside progress bar */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* History Modal - iOS Bottom Sheet / Smooth Center Modal */}
      {showLogs && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogs(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-5 duration-400 ease-out border border-gray-100/50">
            {/* iOS style drag handle for mobile */}
            <div className="w-full flex justify-center py-3 sm:hidden">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <div className="px-6 py-4 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-500 border border-gray-100 shadow-sm">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#171717] tracking-tight">スコア獲得履歴</h3>
                  <p className="text-xs text-gray-400 font-medium">Recent Activity</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLogs(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50/30">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Star className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">まだ獲得履歴がありません</p>
                  <p className="text-xs text-gray-400 mt-1">シフト提出などでポイントが貯まります</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {logs.map(log => (
                    <div key={log.id} className="group flex gap-4 items-start p-3 -mx-3 rounded-2xl hover:bg-white hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 border border-transparent hover:border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-50 to-orange-50 text-yellow-600 flex items-center justify-center shrink-0 border border-yellow-100/50 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <p className="text-sm font-bold text-[#171717] leading-tight flex-1">{log.description}</p>
                          <span className="text-sm font-bold bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-md border border-yellow-100 shrink-0 shadow-sm">
                            +{log.points_delta}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                          {format(new Date(log.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Safe area padding for mobile bottom */}
            <div className="h-6 bg-white sm:hidden"></div>
          </div>
        </div>
      )}
    </>
  );
}
