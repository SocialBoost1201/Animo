'use client';

import { useState } from 'react';
import { Bell, AlertCircle, X, Check, ChevronRight } from 'lucide-react';
import { CastNotice, markNoticeAsRead } from '@/lib/actions/cast-notices';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function CastNoticeWidget({ 
  notices,
  castId 
}: { 
  notices: CastNotice[];
  castId: string;
}) {
  const [selectedNotice, setSelectedNotice] = useState<CastNotice | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  // 未読のみ表示
  const unreadNotices = notices.filter(n => !n.is_read);

  if (unreadNotices.length === 0) {
    return null; // 未読がない場合はウィジェット自体を非表示
  }

  const handleOpenNotice = (notice: CastNotice) => {
    setSelectedNotice(notice);
  };

  const handleMarkAsRead = async () => {
    if (!selectedNotice) return;
    
    setMarkingId(selectedNotice.id);
    
    // Server Actionを呼び出して既読化（revalidatePathが含まれるため、成功後に一覧が再取得され、このウィジェットから消えるか再レンダリングされる）
    const result = await markNoticeAsRead(castId, selectedNotice.id);
    
    setMarkingId(null);
    if (result.success) {
      setSelectedNotice(null);
    } else {
      alert('エラーが発生しました: ' + result.error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-orange-500 animate-[ring_3s_ease-in-out_infinite]" />
            <h3 className="font-bold text-[#171717]">未読のお知らせがあります</h3>
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
              {unreadNotices.length}件
            </span>
          </div>

          <div className="space-y-2">
            {unreadNotices.slice(0, 3).map(notice => (
              <button
                key={notice.id}
                onClick={() => handleOpenNotice(notice)}
                className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100 cursor-pointer group"
              >
                {notice.importance === 'high' ? (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5"></span>
                )}
                
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-bold text-[#171717] truncate group-hover:text-orange-600 transition-colors">
                    {notice.title}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {format(new Date(notice.created_at), 'yyyy/MM/dd', { locale: ja })}
                  </p>
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all mt-1" />
              </button>
            ))}
            
            {unreadNotices.length > 3 && (
              <div className="text-center pt-2 pb-1">
                <span className="text-xs text-gray-400 font-medium">他 {unreadNotices.length - 3} 件の未読</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* お知らせ詳細・既読化モーダル */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedNotice(null)}
          ></div>
          
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-5 duration-300">
            
            {/* iOS style drag handle for mobile */}
            <div className="w-full flex justify-center py-3 sm:hidden bg-gray-50/50 rounded-t-[32px]">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div className="pr-4">
                <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold tracking-wider rounded border border-orange-200 mb-2">
                  STORE NOTICE
                </span>
                <h3 className="text-lg font-bold text-[#171717] leading-tight text-wrap">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  配信日: {format(new Date(selectedNotice.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedNotice(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black bg-white hover:bg-gray-100 rounded-full border border-gray-200 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {selectedNotice.importance === 'high' && (
                <div className="mb-4 bg-red-50 border border-red-100 px-3 py-2 rounded-lg flex items-center gap-2 text-red-600 text-xs font-bold">
                  <AlertCircle size={14} /> 重要なお知らせです
                </div>
              )}
              <div className="prose prose-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedNotice.content}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-center sm:justify-end">
              <button
                onClick={handleMarkAsRead}
                disabled={markingId === selectedNotice.id}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#171717] hover:bg-gold text-white px-8 py-3.5 text-sm font-bold tracking-wider transition-all duration-300 disabled:opacity-50 rounded-xl shadow-md hover:shadow-lg"
              >
                {markingId === selectedNotice.id ? (
                  <span className="animate-pulse">処理中...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5" /> 内容を確認しました
                  </>
                )}
              </button>
            </div>
            
            <div className="h-6 bg-gray-50 sm:hidden"></div>
          </div>
        </div>
      )}
    </>
  );
}
