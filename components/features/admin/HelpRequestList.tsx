'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
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
    } catch (error) {
      alert(error instanceof Error ? error.message : '作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    setProcessingId(id);
    try {
      await toggleShiftRequestActive(id, !currentActive);
    } catch (error) {
      alert('操作に失敗しました');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この募集を削除してもよろしいですか？（関連する応募も削除されます）')) return;
    setProcessingId(id);
    try {
      await deleteShiftRequest(id);
    } catch (error) {
      alert('削除に失敗しました');
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
    } catch (error) {
      alert(`${actionName}に失敗しました: ` + (error instanceof Error ? error.message : ''));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 募集要項の管理セクション */}
      <section className="rounded-[18px] border border-[#ffffff0a] bg-[#10141d] p-6 shadow-2xl">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#f7f4ed]">店舗からの募集管理</h2>
            <p className="mt-1 text-[12px] text-[#6b7280]">人手が足りない日に特定条件でキャストへ出勤を要請します。</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-[12px] font-bold transition-all sm:w-auto ${
              isCreating 
                ? 'border border-[#ffffff0a] bg-[#131720] text-[#6b7280] hover:text-[#f7f4ed]' 
                : 'bg-[#c9a76a] text-[#0b0d12] hover:bg-[#d4b576] active:scale-95'
            }`}
          >
            {isCreating ? <X size={14} /> : <Plus size={14} />}
            {isCreating ? 'キャンセル' : '新規募集を作成'}
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreate} className="mt-5 animate-in fade-in slide-in-from-top-4 rounded-[14px] border border-[#ffffff0a] bg-[#131720] p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#6b7280] uppercase">
                  <CalendarIcon size={12} className="text-[#c9a76a]" /> 募集対象日
                </label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-[10px] border border-[#ffffff0a] bg-black/40 px-4 py-2.5 text-[13px] text-[#f7f4ed] outline-none transition-all placeholder:text-[#5a5650] focus:border-[#c9a76a]/50 focus:ring-1 focus:ring-[#c9a76a]/20"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#6b7280] uppercase">
                  <MessageSquare size={12} className="text-[#c9a76a]" /> 募集メッセージ（条件・理由など）
                </label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="例: 【急募】団体予約があるため出勤できる方を募集！この日は指名バック率を10%UPします！"
                  className="h-28 w-full resize-none rounded-[10px] border border-[#ffffff0a] bg-black/40 px-4 py-3 text-[13px] text-[#f7f4ed] outline-none transition-all placeholder:text-[#5a5650] focus:border-[#c9a76a]/50 focus:ring-1 focus:ring-[#c9a76a]/20"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-[10px] bg-[#c9a76a] px-6 py-2.5 text-[12px] font-bold text-[#0b0d12] shadow-lg shadow-[#c9a76a]/10 transition-all hover:bg-[#d4b576] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '募集を発行する'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#ffffff0a] bg-white/2 py-12 text-center">
              <p className="text-[13px] text-[#6b7280]">現在、発行済みの募集はありません。</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {requests.map(req => {
                const isActive = req.is_active;
                return (
                  <div key={req.id} className={`flex flex-col items-start justify-between gap-4 rounded-[14px] border p-5 transition-all duration-300 md:flex-row md:items-center ${isActive ? 'border-[rgba(201,167,106,0.2)] bg-[rgba(201,167,106,0.03)]' : 'border-[#ffffff0a] bg-[#131720] opacity-60'}`}>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold text-[#f7f4ed]">
                          {format(new Date(req.target_date), 'M月d日 (E)', { locale: ja })}
                        </span>
                        {isActive ? (
                          <span className="rounded-full border border-[rgba(201,167,106,0.2)] bg-[rgba(201,167,106,0.1)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c9a76a] animate-pulse">Recruiting</span>
                        ) : (
                          <span className="rounded-full border border-[#ffffff0a] bg-[#1a1f29] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">Ended</span>
                        )}
                      </div>
                      <p className="text-[12px] leading-relaxed text-[#a9afbc]">{req.message}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleToggle(req.id, isActive)}
                        disabled={processingId === req.id}
                        className={`flex h-10 w-10 items-center justify-center rounded-[10px] border transition-all duration-300 disabled:opacity-50 ${
                          isActive 
                            ? 'border-[#ffffff0a] bg-[#131720] text-[#a9afbc] hover:bg-[#1a1f29] hover:text-[#f7f4ed]' 
                            : 'border-[rgba(201,167,106,0.5)] bg-[rgba(201,167,106,0.1)] text-[#c9a76a] hover:bg-[rgba(201,167,106,0.2)]'
                        }`}
                        title={isActive ? "受付を終了する" : "募集を再開する"}
                      >
                        {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(req.id)}
                        disabled={processingId === req.id}
                        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(224,106,106,0.2)] bg-[rgba(224,106,106,0.1)] text-[#e06a6a] transition-all hover:bg-[rgba(224,106,106,0.15)] disabled:opacity-50"
                        title="削除する"
                      >
                        {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* キャストからの応募一覧 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-[#f7f4ed]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[rgba(201,167,106,0.1)]">
              <MessageSquare size={14} className="text-[#c9a76a]" />
            </div>
            キャストからの応募
          </h3>
          <span className="rounded-full border border-[#ffffff0a] bg-[#10141d] px-3 py-1 text-[11px] font-bold text-[#a9afbc]">
            {responses.length} 件の応募
          </span>
        </div>
        
        <div className="space-y-3">
          {responses.length === 0 ? (
             <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#ffffff0a] bg-[#10141d] py-16 text-center shadow-2xl">
               <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#ffffff0a] bg-white/5">
                 <AlertCircle size={24} className="text-[#6b7280]" />
               </div>
               <p className="text-[13px] text-[#6b7280]">条件に一致する応募はありません</p>
             </div>
          ) : (
            <div className="grid gap-3">
              {responses.map((res) => (
                <div key={res.id} className="flex flex-col items-center gap-5 rounded-[18px] border border-[#ffffff0a] bg-[#10141d] p-5 shadow-xl transition-all duration-300 hover:border-[rgba(201,167,106,0.2)] md:flex-row">
                  <div className="flex w-full flex-1 flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    {/* キャスト情報 */}
                    <div className="flex w-full items-center gap-4 sm:w-auto">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ffffff0a] bg-[#131720] text-[16px] font-bold text-[#f7f4ed] transition-colors group-hover:border-[#c9a76a]/30">
                        {res.cast.stage_name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[15px] font-bold text-[#f7f4ed]">{res.cast.stage_name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                          Applied: {format(new Date(res.created_at), 'MM/dd HH:mm')}
                        </p>
                      </div>
                    </div>

                    {/* 応募内容 */}
                    <div className="flex w-full flex-col justify-center gap-2 rounded-[14px] border border-[#ffffff0a] bg-[#131720] p-4 sm:w-[280px]">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-[rgba(201,167,106,0.2)] bg-[rgba(201,167,106,0.1)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#c9a76a]">対象日</span>
                        <span className="text-[13px] font-bold text-[#f7f4ed]">{format(new Date(res.shift_request.target_date), 'M月d日 (E)', { locale: ja })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                        <Clock size={13} className="text-[#c9a76a]" />
                        <span className="font-bold text-[#f7f4ed]">{res.proposed_start_time.slice(0, 5)}</span>
                        <span>〜</span>
                        <span className="font-bold text-[#f7f4ed]">{res.proposed_end_time.slice(0, 5)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex w-full shrink-0 flex-row gap-2 md:w-auto md:flex-col">
                    {res.status === 'pending' && currentStatus === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleResponseAction(res.id, 'reject')}
                          disabled={processingId === res.id}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#ffffff0a] bg-[#131720] px-5 py-2.5 text-[12px] font-bold text-[#6b7280] transition-all hover:border-[rgba(224,106,106,0.3)] hover:bg-[rgba(224,106,106,0.08)] hover:text-[#e06a6a] disabled:opacity-50"
                        >
                          {processingId === res.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><X size={14} /> 却下</>}
                        </button>
                        <button
                          onClick={() => handleResponseAction(res.id, 'approve')}
                          disabled={processingId === res.id}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#c9a76a] px-5 py-2.5 text-[12px] font-bold text-[#0b0d12] shadow-lg shadow-[#c9a76a]/10 transition-all hover:bg-[#d4b576] active:scale-95 disabled:opacity-50"
                        >
                          {processingId === res.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0b0d12]" /> : <><Check size={14} /> 承認</>}
                        </button>
                      </>
                    ) : (
                      <div className={`flex w-full items-center justify-center rounded-[10px] border px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest md:min-w-[120px] ${
                        res.status === 'approved' 
                          ? 'border-[rgba(51,179,107,0.2)] bg-[rgba(51,179,107,0.08)] text-[#33b36b]' 
                          : 'border-[rgba(224,106,106,0.2)] bg-[rgba(224,106,106,0.08)] text-[#e06a6a]'
                      }`}>
                        {res.status === 'approved' ? '承認済' : '却下済'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
