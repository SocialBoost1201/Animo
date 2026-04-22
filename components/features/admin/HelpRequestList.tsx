'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  Plus, Check, X, Trash2, Power, Clock, MessageSquare, AlertCircle, Calendar as CalendarIcon, Loader2
} from 'lucide-react';
import { 
  ShiftRequest, 
  ShiftRequestResponse, 
  createShiftRequest, 
  toggleShiftRequestActive, 
  deleteShiftRequest, 
  approveShiftRequestResponse, 
  rejectShiftRequestResponse 
} from '@/lib/actions/admin-shift-requests';

export function HelpRequestList({ 
  requests, 
  responses,
  currentStatus 
}: { 
  requests: ShiftRequest[], 
  responses: ShiftRequestResponse[],
  currentStatus: string
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createShiftRequest(newDate, newMessage);
      setIsCreating(false);
      setNewDate('');
      setNewMessage('');
      toast.success('店舗からの募集を発行しました。');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    setProcessingId(id);
    try {
      await toggleShiftRequestActive(id, !currentActive);
      toast.success(currentActive ? '募集の受付を終了しました。' : '募集を再開しました。');
    } catch {
      toast.error('操作に失敗しました');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この募集を削除してもよろしいですか？（関連する応募も削除されます）')) return;
    setProcessingId(id);
    try {
      await deleteShiftRequest(id);
      toast.success('募集を削除しました。');
    } catch {
      toast.error('削除に失敗しました');
    } finally {
      setProcessingId(null);
    }
  };

  const handleResponseAction = async (responseId: string, action: 'approve' | 'reject') => {
    const actionName = action === 'approve' ? '承認' : '却下';
    if (!window.confirm(`この応募を${actionName}しますか？\n（承認すると、そのキャストの該当日のスケジュールが自動で上書きされます）`)) return;
    
    setProcessingId(responseId);
    try {
      if (action === 'approve') {
        await approveShiftRequestResponse(responseId);
      } else {
        await rejectShiftRequestResponse(responseId);
      }
      toast.success(`応募を${actionName}しました。`);
    } catch (error) {
      toast.error(`${actionName}に失敗しました: ` + (error instanceof Error ? error.message : ''));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* 募集要項の管理セクション */}
      <section className="bg-black/94 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#f4f1ea] leading-tight">出勤リクエスト（ヘルプ募集）の発行</h2>
            <p className="text-sm text-[#8a8478]">人手が足りない日に特定条件でキャストへ出勤を要請します。</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isCreating ? 'bg-white/5 text-[#8a8478] border border-white/10 hover:bg-white/10' : 'bg-gold hover:bg-[#d4b35a] text-black hover:scale-105 active:scale-95 shadow-lg shadow-gold/20'}`}
          >
            {isCreating ? <X size={16} /> : <Plus size={16} />}
            {isCreating ? 'キャンセル' : '新規募集を作成'}
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreate} className="bg-white/2 p-6 rounded-2xl border border-white/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8a8478] tracking-widest uppercase flex items-center gap-2">
                  <CalendarIcon size={14} className="text-gold" /> 募集対象日
                </label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-5 py-3 bg-black/40 border border-white/10 text-[#f4f1ea] rounded-xl focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all placeholder:text-[#5a5650]"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[#8a8478] tracking-widest uppercase flex items-center gap-2">
                  <MessageSquare size={14} className="text-gold" /> 募集メッセージ（条件・理由など）
                </label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="例: 【急募】団体予約があるため出勤できる方を募集！この日は指名バック率を10%UPします！"
                  className="w-full px-5 py-3 bg-black/40 border border-white/10 text-[#f4f1ea] rounded-xl focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none h-32 transition-all placeholder:text-[#5a5650] resize-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black font-bold rounded-full hover:bg-[#d4b35a] disabled:opacity-50 transition-all shadow-lg shadow-gold/20 active:scale-95"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? '作成中...' : '募集を発行する'}
              </button>
            </div>
          </form>
        )}

        {/* 募集一覧 */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white/1 border border-dashed border-white/5 rounded-2xl py-12 text-center space-y-2">
              <p className="text-[#8a8478] text-sm italic">現在、発行済みの募集はありません。</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map(req => (
                <div key={req.id} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group ${req.is_active ? 'border-gold/30 bg-gold/3 shadow-lg shadow-gold/5' : 'border-white/5 bg-white/1 grayscale opacity-70'}`}>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-xl text-[#f4f1ea] tracking-tight">
                        {format(new Date(req.target_date), 'M月d日 (E)', { locale: ja })}
                      </span>
                      {req.is_active ? (
                        <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black tracking-widest uppercase rounded-full border border-gold/20 animate-pulse">Recruiting</span>
                      ) : (
                        <span className="px-3 py-1 bg-white/5 text-[#8a8478] text-[10px] font-black tracking-widest uppercase rounded-full border border-white/10">Ended</span>
                      )}
                    </div>
                    <p className="text-sm text-[#8a8478] leading-relaxed max-w-2xl">{req.message}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleToggle(req.id, req.is_active)}
                      disabled={processingId !== null}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        req.is_active ? 'bg-white/5 border-white/10 text-[#f4f1ea] hover:bg-white/10' : 'bg-gold text-black border-gold hover:scale-105'
                      } disabled:opacity-50`}
                      title={req.is_active ? "受付を終了する" : "募集を再開する"}
                    >
                      {processingId === req.id ? <Loader2 size={20} className="animate-spin" /> : <Power size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      disabled={processingId !== null}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-xl transition-all duration-300 disabled:opacity-50 hover:scale-105"
                      title="削除する"
                    >
                      {processingId === req.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* キャストからの応募一覧 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-[#f4f1ea] flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <MessageSquare size={16} className="text-gold" />
            </span>
            キャストからの応募一覧
          </h3>
          <span className="text-xs font-bold text-[#5a5650] bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {responses.length} 件の応募
          </span>
        </div>
        
        <div className="space-y-4">
          {responses.length === 0 ? (
             <div className="bg-black/94 border border-white/10 rounded-2xl py-16 text-center space-y-4 shadow-2xl">
               <div className="w-16 h-16 bg-white/2 rounded-full flex items-center justify-center mx-auto border border-white/5">
                 <AlertCircle size={32} className="text-[#3a3630]" />
               </div>
               <p className="text-[#8a8478] text-sm italic">条件に一致する応募はありません</p>
             </div>
          ) : (
            responses.map((res) => (
              <div key={res.id} className="bg-black/94 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row gap-8 items-center group hover:border-gold/30 transition-all duration-500">
                <div className="flex-1 w-full flex flex-col md:flex-row gap-8 items-center">
                  {/* キャスト情報 */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center font-bold text-xl text-[#f4f1ea] shrink-0 group-hover:border-gold/30 transition-colors">
                      {res.cast.stage_name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-[#f4f1ea] group-hover:text-gold transition-colors">{res.cast.stage_name}</p>
                      <p className="text-[10px] font-black tracking-widest text-[#5a5650] uppercase">
                        Applied: {format(new Date(res.created_at), 'MM/dd HH:mm')}
                      </p>
                    </div>
                  </div>

                  {/* 応募内容 */}
                  <div className="flex-1 w-full bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded uppercase border border-gold/20">募集対象日</span>
                      <span className="text-md font-bold text-[#f4f1ea]">{format(new Date(res.shift_request.target_date), 'M月d日 (E)', { locale: ja })}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#8a8478]">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gold/50" />
                        <span className="font-bold text-[#f4f1ea]">{res.proposed_start_time}</span>
                        <span className="text-[#5a5650]">〜</span>
                        <span className="font-bold text-[#f4f1ea]">{res.proposed_end_time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* アクション (未承認の場合のみ) */}
                <div className="flex flex-row gap-3 shrink-0 w-full lg:w-auto">
                  {res.status === 'pending' && currentStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResponseAction(res.id, 'approve')}
                        disabled={processingId !== null}
                        className="flex-1 lg:px-8 py-3 bg-gold text-black text-sm font-bold rounded-full hover:bg-[#d4b35a] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold/20 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingId === res.id ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            承認中...
                          </>
                        ) : (
                          <>
                            <Check size={18} /> 承認
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleResponseAction(res.id, 'reject')}
                        disabled={processingId !== null}
                        className="flex-1 lg:px-8 py-3 bg-white/5 border border-white/10 text-[#8a8478] text-sm font-bold rounded-full hover:bg-white/10 hover:text-[#f4f1ea] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingId === res.id ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            却下中...
                          </>
                        ) : (
                          <>
                            <X size={18} /> 却下
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase text-center w-full lg:min-w-[140px] border shadow-sm ${
                      res.status === 'approved' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {res.status === 'approved' ? 'Approved' : 'Rejected'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
