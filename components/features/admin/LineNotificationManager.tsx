'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell, Plus, Trash2, Send, ChevronDown, ChevronUp,
  Clock, RefreshCw, Loader2, X, Check, Users, User,
} from 'lucide-react'
import {
  type LineNotification,
  type LinkedCast,
  type CreateLineNotificationInput,
  type ScheduleType,
  type TargetType,
  createLineNotification,
  updateLineNotification,
  toggleLineNotification,
  deleteLineNotification,
  testSendLineNotification,
} from '@/lib/actions/line-notifications'
import { useAdminTheme } from '@/components/providers/AdminThemeProvider'
import { showToast } from '@/components/ui/Toast'

// ── 曜日ラベル ──────────────────────────────────────────────────────────────
const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

// ── スケジュール表示テキスト ─────────────────────────────────────────────────
function formatSchedule(n: LineNotification): string {
  const time = n.schedule_time.slice(0, 5)
  switch (n.schedule_type) {
    case 'daily':
      return `毎日 ${time}`
    case 'weekly': {
      const days = (n.schedule_days ?? []).map((d) => DAY_LABELS[d]).join('・')
      return `毎週 ${days} ${time}`
    }
    case 'monthly': {
      const dates = (n.schedule_dates ?? []).map((d) => `${d}日`).join('・')
      return `毎月 ${dates} ${time}`
    }
    case 'once':
      if (!n.schedule_once_at) return `一回のみ ${time}`
      return `${new Date(n.schedule_once_at).toLocaleDateString('ja-JP')} ${time}`
    default:
      return time
  }
}

// ── 空フォーム初期値 ─────────────────────────────────────────────────────────
const EMPTY_FORM: CreateLineNotificationInput = {
  name: '',
  content: '',
  target_type: 'group',
  target_id: '',
  schedule_type: 'daily',
  schedule_time: '09:00',
  schedule_days: [],
  schedule_dates: [],
  schedule_once_at: '',
}

// ── メインコンポーネント ─────────────────────────────────────────────────────
export function LineNotificationManager({
  initialNotifications,
  linkedCasts = [],
}: {
  initialNotifications: LineNotification[]
  linkedCasts?: LinkedCast[]
}) {
  const { F, isDark } = useAdminTheme()
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateLineNotificationInput>(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ── フォームリセット ──────────────────────────────────────────────────────
  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  // ── 編集開始 ─────────────────────────────────────────────────────────────
  const startEdit = (n: LineNotification) => {
    setForm({
      name: n.name,
      content: n.content,
      target_type: n.target_type,
      target_id: n.target_id ?? '',
      schedule_type: n.schedule_type,
      schedule_time: n.schedule_time.slice(0, 5),
      schedule_days: n.schedule_days ?? [],
      schedule_dates: n.schedule_dates ?? [],
      schedule_once_at: n.schedule_once_at ?? '',
    })
    setEditingId(n.id)
    setShowForm(true)
  }

  // ── 保存（新規 or 更新）──────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim()) {
      showToast('通知名と通知内容は必須です', 'error')
      return
    }
    startTransition(async () => {
      const result = editingId
        ? await updateLineNotification(editingId, form)
        : await createLineNotification(form)

      if (result.error) {
        showToast(result.error, 'error')
        return
      }

      showToast(editingId ? '通知を更新しました' : '通知を追加しました', 'success')
      resetForm()
      router.refresh()
    })
  }

  // ── ON/OFF トグル ────────────────────────────────────────────────────────
  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleLineNotification(id, !current)
      if (result.error) { showToast(result.error, 'error'); return }
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_enabled: !current } : n))
      )
    })
  }

  // ── テスト送信 ───────────────────────────────────────────────────────────
  const handleTest = async (id: string) => {
    setTestingId(id)
    const result = await testSendLineNotification(id)
    setTestingId(null)
    if (result.ok) {
      showToast('テスト送信しました', 'success')
    } else {
      showToast(`送信失敗: ${result.error ?? 'unknown'}`, 'error')
    }
  }

  // ── 削除 ─────────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteLineNotification(id)
      setDeletingId(null)
      if (result.error) { showToast(result.error, 'error'); return }
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      showToast('通知を削除しました', 'success')
      router.refresh()
    })
  }

  // ── 曜日トグル ───────────────────────────────────────────────────────────
  const toggleDay = (day: number) => {
    setForm((prev) => {
      const days = prev.schedule_days ?? []
      return {
        ...prev,
        schedule_days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
      }
    })
  }

  // ── 日付トグル ───────────────────────────────────────────────────────────
  const toggleDate = (date: number) => {
    setForm((prev) => {
      const dates = prev.schedule_dates ?? []
      return {
        ...prev,
        schedule_dates: dates.includes(date) ? dates.filter((d) => d !== date) : [...dates, date],
      }
    })
  }

  // ── テーマ依存スタイル ───────────────────────────────────────────────────
  const cardBg = isDark
    ? 'bg-black/94 border border-[#ffffff10] rounded-[18px] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)]'
    : 'bg-white border border-[#0000001a] rounded-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
  const labelSm = isDark ? 'text-[#5a5650]' : 'text-[#b0a898]'
  const textPrimary = isDark ? 'text-[#f4f1ea]' : 'text-[#1a1710]'
  const textSecondary = isDark ? 'text-[#8a8478]' : 'text-[#7a7268]'
  const divider = isDark ? 'border-white/5' : 'border-[#0000000a]'
  const tagBase = isDark
    ? 'text-[10px] font-bold px-2 py-0.5 rounded-full border'
    : 'text-[10px] font-bold px-2 py-0.5 rounded-full border'

  return (
    <div className="space-y-5">

      {/* ── ヘッダー ── */}
      <div className={`flex items-center justify-between border-b ${divider} pb-4`}>
        <div className="flex items-center gap-2.5">
          <Bell size={14} className="text-gold" />
          <h3 className={`text-sm font-bold tracking-widest uppercase ${textPrimary}`}>
            LINE 自動通知
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDark ? 'bg-white/5 text-[#8a8478]' : 'bg-[#0000000a] text-[#b0a898]'
          }`}>
            {notifications.length} 件
          </span>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold/10 border border-gold/30 text-gold text-[12px] font-bold tracking-widest rounded-[8px] hover:bg-gold/20 transition-all font-sans"
        >
          <Plus size={14} /> 新規追加
        </button>
      </div>

      {/* ── 新規/編集フォーム ── */}
      {showForm && (
        <NotificationForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          isPending={isPending}
          isDark={isDark}
          F={F}
          labelSm={labelSm}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          divider={divider}
          tagBase={tagBase}
          linkedCasts={linkedCasts}
          onSave={handleSave}
          onCancel={resetForm}
          toggleDay={toggleDay}
          toggleDate={toggleDate}
        />
      )}

      {/* ── 通知一覧 ── */}
      {notifications.length === 0 && !showForm ? (
        <div className={`py-12 text-center ${cardBg}`}>
          <Bell size={24} className={`mx-auto mb-3 ${labelSm}`} />
          <p className={`text-xs ${textSecondary}`}>自動通知が設定されていません</p>
          <p className={`text-[10px] mt-1 ${labelSm}`}>「新規追加」から最初の通知を作成してください</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              n={n}
              isExpanded={expandedId === n.id}
              isTesting={testingId === n.id}
              isDeleting={deletingId === n.id}
              isDark={isDark}
              cardBg={cardBg}
              labelSm={labelSm}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              tagBase={tagBase}
              onToggle={() => handleToggle(n.id, n.is_enabled)}
              onTest={() => handleTest(n.id)}
              onEdit={() => startEdit(n)}
              onDelete={() => handleDelete(n.id)}
              onExpand={() => setExpandedId(expandedId === n.id ? null : n.id)}
            />
          ))}
        </div>
      )}

    </div>
  )
}

// ── 通知カード ───────────────────────────────────────────────────────────────
function NotificationCard({
  n, isExpanded, isTesting, isDeleting, isDark,
  cardBg, labelSm, textPrimary, textSecondary, tagBase,
  onToggle, onTest, onEdit, onDelete, onExpand,
}: {
  n: LineNotification
  isExpanded: boolean
  isTesting: boolean
  isDeleting: boolean
  isDark: boolean
  cardBg: string
  labelSm: string
  textPrimary: string
  textSecondary: string
  tagBase: string
  onToggle: () => void
  onTest: () => void
  onEdit: () => void
  onDelete: () => void
  onExpand: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className={`${cardBg} overflow-hidden transition-all`}>
      {/* カードヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* ON/OFF トグル */}
        <button
          onClick={onToggle}
          title={n.is_enabled ? 'オフにする' : 'オンにする'}
          className={`w-9 h-5 rounded-full transition-all shrink-0 relative ${
            n.is_enabled
              ? 'bg-gold/80'
              : isDark ? 'bg-white/10' : 'bg-[#0000001a]'
          }`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
            n.is_enabled ? 'left-4' : 'left-0.5'
          }`} />
        </button>

        {/* 通知名・スケジュール */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onExpand}>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold truncate ${
              n.is_enabled ? textPrimary : textSecondary
            }`}>{n.name}</span>
            {!n.is_enabled && (
              <span className={`${tagBase} ${isDark ? 'border-white/10 text-[#5a5650]' : 'border-[#0000001a] text-[#b0a898]'}`}>
                OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-[10px] flex items-center gap-1 ${labelSm}`}>
              <Clock size={9} />
              {formatSchedule(n)}
            </span>
            <span className={`${tagBase} ${
              n.target_type === 'group'
                ? isDark ? 'border-blue-500/20 text-blue-400/80' : 'border-blue-400/30 text-blue-500/80'
                : isDark ? 'border-purple-500/20 text-purple-400/80' : 'border-purple-400/30 text-purple-500/80'
            }`}>
              {n.target_type === 'group' ? <><Users size={8} className="inline mr-0.5" />グループ</> : <><User size={8} className="inline mr-0.5" />個別</>}
            </span>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onTest}
            disabled={isTesting}
            title="テスト送信"
            className={`p-1.5 rounded transition-all ${
              isDark ? 'text-[#8a8478] hover:text-gold hover:bg-gold/10' : 'text-[#b0a898] hover:text-[#926f34] hover:bg-[#926f3410]'
            }`}
          >
            {isTesting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          </button>
          <button
            onClick={onEdit}
            title="編集"
            className={`p-1.5 rounded transition-all ${
              isDark ? 'text-[#8a8478] hover:text-[#f4f1ea] hover:bg-white/5' : 'text-[#b0a898] hover:text-[#1a1710] hover:bg-[#0000000a]'
            }`}
          >
            <RefreshCw size={13} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(); setConfirmDelete(false) }}
                disabled={isDeleting}
                className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              >
                {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className={`p-1.5 rounded transition-all ${isDark ? 'text-[#5a5650] hover:text-[#8a8478]' : 'text-[#b0a898] hover:text-[#7a7268]'}`}
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              title="削除"
              className={`p-1.5 rounded transition-all ${
                isDark ? 'text-[#5a5650] hover:text-red-400 hover:bg-red-500/10' : 'text-[#b0a898] hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={onExpand} className={`p-1.5 rounded transition-all ${isDark ? 'text-[#5a5650]' : 'text-[#b0a898]'}`}>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* 展開時: 通知内容プレビュー */}
      {isExpanded && (
        <div className={`px-4 pb-4 border-t ${isDark ? 'border-white/5' : 'border-[#0000000a]'}`}>
          <p className={`text-[10px] font-bold tracking-widest uppercase mt-3 mb-2 ${labelSm}`}>通知内容</p>
          <pre className={`text-[13px] leading-relaxed whitespace-pre-wrap font-sans ${textSecondary} ${
            isDark ? 'bg-black/60 rounded-[12px] p-5 shadow-inner' : 'bg-[#0000000a] rounded-[12px] p-5'
          }`}>{n.content}</pre>
          {n.last_sent_at && (
            <p className={`text-[10px] mt-2 ${labelSm}`}>
              最終送信: {new Date(n.last_sent_at).toLocaleString('ja-JP')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── 新規/編集フォーム ─────────────────────────────────────────────────────────
function NotificationForm({
  form, setForm, editingId, isPending, isDark, F,
  labelSm, textPrimary, divider, tagBase, linkedCasts,
  onSave, onCancel, toggleDay, toggleDate,
}: {
  form: CreateLineNotificationInput
  setForm: React.Dispatch<React.SetStateAction<CreateLineNotificationInput>>
  editingId: string | null
  isPending: boolean
  isDark: boolean
  F: ReturnType<typeof useAdminTheme>['F']
  labelSm: string
  textPrimary: string
  textSecondary: string
  divider: string
  tagBase: string
  linkedCasts: LinkedCast[]
  onSave: () => void
  onCancel: () => void
  toggleDay: (d: number) => void
  toggleDate: (d: number) => void
}) {
  const borderColor = isDark ? 'border-gold/30' : 'border-[#926f3440]'
  const activeDayClass = isDark ? 'bg-gold/20 border-gold text-gold' : 'bg-[#926f3415] border-[#926f34] text-[#926f34]'
  const inactiveDayClass = isDark ? 'border-white/10 text-[#5a5650] hover:border-white/20' : 'border-[#0000001a] text-[#b0a898] hover:border-[#00000030]'

  return (
    <div className={`border ${borderColor} rounded-[18px] p-8 space-y-8 ${isDark ? 'bg-gold/[0.04]' : 'bg-[#926f340a]'}`}>
      <div className="flex items-center justify-between">
        <h4 className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-gold' : 'text-[#926f34]'}`}>
          {editingId ? '通知を編集' : '新規通知を追加'}
        </h4>
        <button onClick={onCancel} className={labelSm}><X size={14} /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 通知名 */}
        <div className="sm:col-span-2">
          <label className={F.label}>通知名</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="例：シフトリマインド"
            className={F.input}
          />
        </div>

        {/* 通知内容 */}
        <div className="sm:col-span-2">
          <label className={F.label}>
            通知内容
            <span className={`ml-2 normal-case font-normal ${labelSm}`}>
              ※ <code className="text-[10px]">{'{today}'}</code> で今日の日付に自動置換
            </span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            placeholder={'例：【Club Animo】\n本日 {today} の出勤確認をお願いします。'}
            rows={4}
            className={`${F.input} resize-none`}
          />
        </div>

        {/* 送信先 */}
        <div>
          <label className={F.label}>送信先</label>
          <div className="flex gap-2">
            {(['group', 'individual'] as TargetType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({ ...p, target_type: t }))}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 text-[13px] font-bold border rounded-[8px] transition-all font-sans ${
                  form.target_type === t ? activeDayClass : inactiveDayClass
                }`}
              >
                {t === 'group' ? <><Users size={11} /> グループ</> : <><User size={11} /> 個別</>}
              </button>
            ))}
          </div>
        </div>

        {/* キャスト選択（個別のみ） */}
        {form.target_type === 'individual' && (
          <div>
            <label className={F.label}>送信先キャスト</label>
            {linkedCasts.length === 0 ? (
              <div className={`px-4 py-3 rounded-[8px] text-[12px] ${
                isDark
                  ? 'bg-white/5 text-[#8a8478] border border-white/10'
                  : 'bg-[#0000000a] text-[#b0a898] border border-[#0000001a]'
              }`}>
                LINE連携済みのキャストがいません。<br />
                <span className="text-[11px]">キャストがBotを友達追加し、携帯番号を送ると自動連携されます。</span>
              </div>
            ) : (
              <select
                value={form.target_id ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, target_id: e.target.value }))}
                className={F.input}
              >
                <option value="">キャストを選択してください</option>
                {linkedCasts.map((c) => (
                  <option key={c.cast_id} value={c.line_user_id}>
                    {c.stage_name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* 頻度 */}
        <div>
          <label className={F.label}>頻度</label>
          <select
            value={form.schedule_type}
            onChange={(e) => setForm((p) => ({ ...p, schedule_type: e.target.value as ScheduleType }))}
            className={F.input}
          >
            <option value="daily">毎日</option>
            <option value="weekly">毎週（曜日指定）</option>
            <option value="monthly">毎月（日付指定）</option>
            <option value="once">一回のみ</option>
          </select>
        </div>

        {/* 時刻 */}
        <div>
          <label className={F.label}>送信時刻（JST）</label>
          <input
            type="time"
            value={form.schedule_time}
            onChange={(e) => setForm((p) => ({ ...p, schedule_time: e.target.value }))}
            className={F.input}
          />
          <p className={`text-[10px] mt-1 ${labelSm}`}>※ 実際の送信は ±7分の誤差があります</p>
        </div>

        {/* 曜日選択（weekly） */}
        {form.schedule_type === 'weekly' && (
          <div className="sm:col-span-2">
            <label className={F.label}>曜日</label>
            <div className="flex gap-2 flex-wrap">
              {DAY_LABELS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-12 h-12 text-[13px] font-bold border rounded-[8px] transition-all font-sans ${
                    (form.schedule_days ?? []).includes(i) ? activeDayClass : inactiveDayClass
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 日付選択（monthly） */}
        {form.schedule_type === 'monthly' && (
          <div className="sm:col-span-2">
            <label className={F.label}>日付</label>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDate(d)}
                  className={`w-10 h-10 text-[13px] font-bold border rounded-[8px] transition-all font-sans ${
                    (form.schedule_dates ?? []).includes(d) ? activeDayClass : inactiveDayClass
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 一回のみ：日時指定 */}
        {form.schedule_type === 'once' && (
          <div className="sm:col-span-2">
            <label className={F.label}>送信日時</label>
            <input
              type="datetime-local"
              value={form.schedule_once_at ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, schedule_once_at: e.target.value }))}
              className={F.input}
            />
          </div>
        )}
      </div>

      {/* 保存ボタン */}
      <div className={`flex justify-end gap-3 pt-8 border-t ${divider}`}>
        <button onClick={onCancel} className={`px-6 py-2.5 text-[12px] font-bold border rounded-[8px] transition-all font-sans ${
          isDark ? 'border-white/10 text-[#8a8478] hover:text-[#f4f1ea]' : 'border-[#0000001a] text-[#7a7268] hover:text-[#1a1710]'
        }`}>
          キャンセル
        </button>
        <button
          onClick={onSave}
          disabled={isPending}
          className={`flex items-center gap-2 px-8 py-2.5 text-[12px] font-bold rounded-[8px] transition-all font-sans ${
            isDark
              ? 'bg-gold/90 text-black hover:bg-gold'
              : 'bg-[#926f34] text-white hover:bg-[#7a5c2a]'
          }`}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {editingId ? '更新する' : '追加する'}
        </button>
      </div>
    </div>
  )
}
