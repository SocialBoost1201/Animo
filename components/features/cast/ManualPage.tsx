'use client';

import React, { useState } from 'react';
import {
  LogIn,
  ClipboardCheck,
  CalendarDays,
  UserRound,
  FileText,
  LifeBuoy,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Info,
  type LucideIcon,
} from 'lucide-react';

// ─── 型定義 ──────────────────────────────────────────────────────────────────
type StepNote = {
  type: 'tip' | 'important' | 'caution';
  text: string;
};

type StepItem = {
  step: number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  items: string[];
  note?: StepNote;
};

// ─── マニュアルデータ ─────────────────────────────────────────────────────────
const CAST_MANUAL_STEPS: StepItem[] = [
  {
    step: 1,
    icon: LogIn,
    title: 'ログインと認証',
    subtitle: 'SMS認証による安全なアクセス',
    items: [
      'メールアドレスとパスワードを入力してログインします。',
      'セキュリティ保護のため、登録されている電話番号へSMS（ショートメッセージ）で6桁の認証コードが送信されます。',
      '届いたコードを入力すると、本人のみがダッシュボードにアクセスできます。',
    ],
    note: {
      type: 'important',
      text: '電話番号を変更した場合はログインできなくなります。変更時は店長やスタッフに新しい番号を伝えてください。',
    },
  },
  {
    step: 2,
    icon: ClipboardCheck,
    title: '今日の確認',
    subtitle: '出勤・同伴の報告と給与計算',
    items: [
      '出勤当日は必ず「今日の確認」ページを開きます。',
      '【出勤報告】出勤する直前や到着時に「本日の出勤を確定する」ボタンを押します。これがタイムカードとして扱われます。',
      '【同伴報告】お客様と同伴出勤する場合、「今日の確認」ページ内で誰と同伴予定かを入力します。予約管理と連動するため忘れずに登録してください。',
    ],
    note: {
      type: 'caution',
      text: '「出勤報告」を忘れると、当日の給与計算や指名ポイントの集計に影響が出る可能性があります。',
    },
  },
  {
    step: 3,
    icon: CalendarDays,
    title: 'シフト提出',
    subtitle: '希望シフトをカレンダーから申請',
    items: [
      '「シフト」メニューを開き、次週や次月の出勤希望日を選択します。',
      '時間帯（早番・遅番など）の希望がある場合は、送信時にメモを添えることができます。',
      'お店側で確定されたシフトは、スケジュールカレンダーに「確定」と表示されます。',
    ],
    note: {
      type: 'tip',
      text: '確定済みのシフトをお休みしたい場合は、直接店舗スタッフにご連絡ください。システム上からは変更できません。',
    },
  },
  {
    step: 4,
    icon: UserRound,
    title: 'プロフィールと写真管理',
    subtitle: '見栄えを良くして指名を増やす',
    items: [
      '「プロフィール」画面から、自分のお客様向け紹介文や基本情報を編集できます。',
      '出勤率や過去の指名ポイントなどの「キャスト成績（指標）」がプロフィール上で確認できます。',
    ],
  },
  {
    step: 5,
    icon: FileText,
    title: 'ブログ・SNS連携',
    subtitle: 'お客様へのアピール',
    items: [
      '「ブログ」メニューから、日常の様子や出勤予定をお客様向けに投稿できます。',
      '文字だけでなく、写真を一緒にアップロードすることが可能です。画像は自動で最適化されます。',
      '投稿頻度が高いほど、お店の公式HPでの表示順位（ランキング）が上がりやすくなります。',
    ],
  },
  {
    step: 6,
    icon: LifeBuoy,
    title: 'よくある質問とサポート',
    subtitle: '困ったときは',
    items: [
      '【画像がアップロードできない】→ ファイルサイズが5MBを超えている可能性があります。少し縮小してからお試しください。',
      '【認証コード（SMS）が届かない】→ 電波状況を確認するか、スマートフォンの迷惑メール設定を確認してください。',
      '【操作方法がわからない】→ まずはこのマニュアルを読み直し、それでも解決しない場合は店舗スタッフにお声掛けください。',
    ],
  },
];

// ─── ノートタイプ別スタイル ───────────────────────────────────────────────────
const NOTE_STYLES = {
  tip: {
    icon: Info,
    border: 'border-[#4a9d6f]',
    bg: 'bg-[#4a9d6f10]',
    text: 'text-[#5bba85]',
    label: 'TIP',
  },
  important: {
    icon: AlertCircle,
    border: 'border-[#dfbd69]',
    bg: 'bg-[#dfbd6910]',
    text: 'text-[#dfbd69]',
    label: 'IMPORTANT',
  },
  caution: {
    icon: AlertCircle,
    border: 'border-[#d4785a]',
    bg: 'bg-[#d4785a10]',
    text: 'text-[#d4785a]',
    label: 'CAUTION',
  },
};

// ─── STEPカードコンポーネント ─────────────────────────────────────────────────
function StepCard({ data, isOpen, onToggle }: {
  data: StepItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = data.icon;
  const noteStyle = data.note ? NOTE_STYLES[data.note.type] : null;
  const NoteIcon = noteStyle?.icon;

  return (
    <div
      className={`
        relative rounded-[16px] overflow-hidden
        transition-all duration-300 ease-out
        border
        ${isOpen
          ? 'border-[#dfbd6930] shadow-[0_4px_32px_rgba(223,189,105,0.08)]'
          : 'border-white/8 bg-[#131720] hover:border-[#dfbd6920] hover:shadow-[0_2px_16px_rgba(223,189,105,0.06)]'
        }
        group
      `}
    >
      {/* 展開時のGoldグラデーション背景（奥）を挟むための土台 */}
      <div className="absolute inset-0 rounded-[16px] bg-[#141416]" />

      {isOpen && (
        <div
          className="absolute inset-0 rounded-[16px] opacity-30"
          style={{
            background: 'linear-gradient(135deg, #E8AA00 0%, #FBD84B 30%, #E7AB00 60%, #FBD94D 80%, #EEB502 100%)',
          }}
        />
      )}

      {/* 手前の前面ダークパネル（これがテキストの背後になり視認性を保つ） */}
      <div
        className="absolute inset-[1px] rounded-[15px]"
        style={{
          background: 'linear-gradient(160deg, #131720 0%, #0d1016 50%, #131720 100%)',
        }}
      />

      <div className="relative z-10">
        <button
          onClick={onToggle}
          className="w-full text-left px-5 py-4 flex items-center gap-3 group/btn"
        >
          {/* STEPナンバー */}
          <div className="shrink-0 flex flex-col items-center justify-center w-[46px] h-[46px] rounded-[12px] border border-[#dfbd6930] bg-[#dfbd6908] relative overflow-hidden">
            <span
              className="text-[8px] font-bold tracking-[1px] uppercase leading-none mb-0.5"
              style={{ color: '#8A8478' }}
            >
              STEP
            </span>
            <span
              className="text-[18px] font-bold leading-none text-[#dfbd69]"
            >
              {data.step}
            </span>
          </div>

          <div
            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-[8px] transition-colors duration-200 ${
              isOpen ? 'bg-[#dfbd6920]' : 'bg-white/5'
            }`}
          >
            <Icon
              size={15}
              className={`transition-colors duration-200 ${
                isOpen ? 'text-[#dfbd69]' : 'text-[#8A8478]'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <p
              className="text-[14px] font-bold leading-snug tracking-tight truncate text-[#f7f4ed]"
            >
              {data.title}
            </p>
            <p className="text-[11px] text-[#8f96a3] leading-none mt-1 truncate">
              {data.subtitle}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`shrink-0 text-[#8A8478] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 pb-5 space-y-3">
            <div className="h-px w-full bg-white/5 mb-3" />
            <ol className="space-y-3 text-[13px] leading-[1.6]">
              {data.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#dfbd6915] border border-[#dfbd6930] mt-0.5">
                    <CheckCircle2 size={10} className="text-[#dfbd69]" />
                  </div>
                  <span
                    className="text-[#a9afbc] flex-1"
                  >
                    {item.replace(/`([^`]+)`/g, '$1')}
                  </span>
                </li>
              ))}
            </ol>

            {data.note && noteStyle && NoteIcon && (
              <div
                className={`mt-4 flex items-start gap-3 px-4 py-3 rounded-[12px] border ${noteStyle.border} ${noteStyle.bg}`}
              >
                <NoteIcon size={14} className={`${noteStyle.text} shrink-0 mt-[2px]`} />
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold tracking-[1px] uppercase ${noteStyle.text} block mb-1`}>
                    {noteStyle.label}
                  </span>
                  <p className="text-[12px] leading-relaxed text-[#c7c0b2]">{data.note.text}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────────────────
export function CastManualPage() {
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set<number>([1]));

  const toggleStep = (step: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      return next;
    });
  };

  const expandAll = () => setOpenSteps(new Set<number>(CAST_MANUAL_STEPS.map((s) => s.step)));
  const collapseAll = () => setOpenSteps(new Set<number>());

  return (
    <div className="space-y-4">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-[#f7f4ed]">システムを使いこなす</h2>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-[11px] text-[#c9a76a] font-medium px-2 py-1 bg-[#c9a76a15] rounded-[6px]"
          >
            全て開く
          </button>
          <button
            onClick={collapseAll}
            className="text-[11px] text-[#6b7280] font-medium px-2 py-1 bg-white/5 rounded-[6px]"
          >
            閉じる
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {CAST_MANUAL_STEPS.map((step) => (
          <StepCard
            key={step.step}
            data={step}
            isOpen={openSteps.has(step.step)}
            onToggle={() => toggleStep(step.step)}
          />
        ))}
      </div>
    </div>
  );
}
