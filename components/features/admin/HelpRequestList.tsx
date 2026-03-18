'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Plus, Check, X, Trash2, Power, Clock, MessageSquare, AlertCircle, Calendar as CalendarIcon 
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
    <div className="space-y-8">
      {/* 募集要項の管理セクション */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#171717]">出勤リクエスト（ヘルプ募集）の発行</h2>
            <p className="text-sm text-gray-500 mt-1">人手が足りない日に特定条件でキャストへ出勤を要請します。</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-4 py-2 bg-[#171717] text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"
          >
            {isCreating ? <X size={16} /> : <Plus size={16} />}
            {isCreating ? 'キャンセル' : '新規募集を作成'}
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CalendarIcon size={16} /> 募集対象日
                </label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MessageSquare size={16} /> 募集メッセージ（条件・理由など）
                </label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="例: 【急募】団体予約があるため出勤できる方を募集！この日は指名バック率を10%UPします！"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none h-24"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '作成中...' : '募集を発行する'}
              </button>
            </div>
          </form>
        )}

        {/* 募集一覧 */}
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">現在、発行済みの募集はありません。</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${req.is_active ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#171717]">
                      {format(new Date(req.target_date), 'M月d日 (E)', { locale: ja })}
                    </span>
                    {req.is_active ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full animate-pulse">募集中</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">終了</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{req.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(req.id, req.is_active)}
                    disabled={processingId === req.id}
                    className={`p-2 rounded-lg border transition-colors ${
                      req.is_active ? 'bg-white hover:bg-gray-100 text-gray-600' : 'bg-[#171717] text-white hover:bg-black'
                    } disabled:opacity-50`}
                    title={req.is_active ? "受付を終了する" : "募集を再開する"}
                  >
                    <Power size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(req.id)}
                    disabled={processingId === req.id}
                    className="p-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="削除する"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* キャストからの応募一覧 */}
      <div>
        <h3 className="text-lg font-bold text-[#171717] mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-500" />
          キャストからの応募一覧
        </h3>
        
        <div className="space-y-3">
          {responses.length === 0 ? (
             <div className="bg-white border rounded-xl p-8 text-center text-gray-500 text-sm">
             条件に一致する応募はありません
           </div>
          ) : (
            responses.map((res) => (
              <div key={res.id} className="bg-white border p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* キャスト情報 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700 shrink-0">
                      {res.cast.stage_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#171717]">{res.cast.stage_name}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(res.created_at), 'M/d HH:mm')} 応募
                      </p>
                    </div>
                  </div>

                  {/* 応募内容 */}
                  <div className="md:col-span-2 bg-blue-50/50 p-3 rounded-lg flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">募集対象</span>
                      <span className="text-sm font-bold">{format(new Date(res.shift_request.target_date), 'M月d日 (E)', { locale: ja })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      <span>提案時間: <strong>{res.proposed_start_time}</strong> 〜 <strong>{res.proposed_end_time}</strong></span>
                    </div>
                  </div>
                </div>

                {/* アクション (未承認の場合のみ) */}
                <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                  {res.status === 'pending' && currentStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResponseAction(res.id, 'approve')}
                        disabled={processingId === res.id}
                        className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-[#171717] text-white text-sm font-bold rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                      >
                        <Check size={16} /> 承認
                      </button>
                      <button
                        onClick={() => handleResponseAction(res.id, 'reject')}
                        disabled={processingId === res.id}
                        className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <X size={16} /> 却下
                      </button>
                    </>
                  ) : (
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold text-center w-full md:w-auto ${res.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {res.status === 'approved' ? '承認済' : '却下済'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
