'use client';

import React, { useState } from 'react';
import {
  LogIn,
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  Bell,
  Briefcase,
  LifeBuoy,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Info,
  Printer,
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
const MANUAL_STEPS: StepItem[] = [
  {
    step: 1,
    icon: LogIn,
    title: 'ログイン',
    subtitle: 'システムへのアクセス方法',
    items: [
      'ブラウザで `https://club-animo.jp/admin` にアクセスします。',
      'ログイン画面で、店舗責任者より共有された「メールアドレス」と「パスワード」を入力します。',
      '「ログイン」ボタンを押すと、ダッシュボードが表示されます。',
      'スマートフォンの場合は、ブラウザのメニューから「ホーム画面に追加」しておくと便利です。',
    ],
    note: {
      type: 'important',
      text: 'パスワードを忘れた場合は、ログイン画面の「パスワードを忘れた方」から再設定できます。退職者のアカウント停止はシステム管理者へご連絡ください。',
    },
  },
  {
    step: 2,
    icon: LayoutDashboard,
    title: 'ダッシュボード確認',
    subtitle: '本日の営業状況を把握する',
    items: [
      'ログイン後メイン画面に、本日の出勤人数・来店予定件数・売上速報などのKPIが表示されます。',
      '「本日の営業状況」セクションで、各キャストの出勤確認ステータスを一覧で確認できます。',
      '「キャスト行動成績評価」で本日のランキングと未提出者を確認します。',
      '「重要アラート」カードに未対応の問い合わせや求人応募が表示されます。',
      '「来店予定一覧」で当日の予約・同伴予定を確認します。',
    ],
    note: {
      type: 'tip',
      text: 'ダッシュボードは自動更新されます。ページを再読込しなくても最新情報が表示されます。',
    },
  },
  {
    step: 3,
    icon: Calendar,
    title: 'シフト管理',
    subtitle: '本日の出勤キャストを登録する',
    items: [
      '左メニューから「シフト管理」を選択します。',
      '本日の日付が選択されていることを確認します（翌日以降の事前登録もカレンダーで可能です）。',
      '画面右上の「+ 出勤登録」ボタンを押します。',
      '登録済みキャスト一覧から出勤予定のキャストのチェックボックスをONにします。',
      '遅出などの場合は備考欄に「21時〜出勤」などコメントを入力します。',
      '「保存する」ボタンを押し、「設定しました」の通知が出れば完了です。',
    ],
    note: {
      type: 'tip',
      text: '保存するとサイトのお客様向け「本日の出勤一覧」ページに自動で反映されます。',
    },
  },
  {
    step: 4,
    icon: Users,
    title: 'キャスト管理',
    subtitle: 'プロフィール追加・更新・退店処理',
    items: [
      '左メニューから「キャスト管理」を選択します。',
      '【新規登録】: 右上「+ 新規追加」→ 名前（源氏名）・英語表記・役職を入力します。',
      '「顔写真（プロフィール画像）」欄で画像をアップロードします（縦長4:5比率推奨）。',
      '入力完了後、「登録する」ボタンを押します。',
      '【既存修正】: 一覧からキャストの「編集（ペンマーク）」を押し、変更後「更新する」を押します。',
      '【退店処理】: 削除ではなく、「ステータス」を「公開」から「非公開」に変更して保存します。',
    ],
    note: {
      type: 'caution',
      text: '退店処理はデータを削除せず「非公開」に変更してください。過去の管理データが残り、統計にも影響しません。',
    },
  },
  {
    step: 5,
    icon: BookOpen,
    title: '顧客データ',
    subtitle: 'お客様情報の確認・管理',
    items: [
      '左メニューから「顧客データ」を選択します。',
      '検索バーで名前・電話番号などで絞り込みができます。',
      '各顧客カードをクリックすると、来店履歴・指名キャスト・メモが確認できます。',
      '顧客情報の編集や備考の追記が可能です。',
      '新規顧客は初回来店登録時に自動で作成されます。',
    ],
  },
  {
    step: 6,
    icon: Bell,
    title: 'お知らせ・通知',
    subtitle: '内部連絡・スタッフへの一斉通知',
    items: [
      '左メニューから「通知」を選択します。',
      '「+ 新規作成」から通知のタイトルと本文を入力します。',
      '送信対象（全員・特定スタッフ）を選択し、「送信する」を押します。',
      '未読の通知はサイドバーのベルアイコンに赤いバッジで表示されます。',
      '送信済み一覧から既読状況を確認できます。',
    ],
    note: {
      type: 'tip',
      text: 'LINEと連携している場合は、通知をLINEにも自動送信できます。設定は「設定 > LINE通知」から確認ください。',
    },
  },
  {
    step: 7,
    icon: Briefcase,
    title: '求人応募管理',
    subtitle: '応募者への対応フロー',
    items: [
      '左メニューからバッジが表示されている「求人応募」を選択します。',
      '未対応の応募者一覧が表示されます。名前をクリックして詳細を確認します。',
      '応募者の情報（氏名・連絡先・応募内容）を確認し、実際に連絡を取ります。',
      '連絡後、ステータスを「未対応」→「連絡済」または「面接予定」に変更して保存します。',
      'スタッフ間で対応状況が共有され、連絡漏れや重複対応を防げます。',
    ],
    note: {
      type: 'important',
      text: 'ステータス変更を忘れると他のスタッフが重複して連絡してしまう可能性があります。必ず対応後に更新してください。',
    },
  },
  {
    step: 8,
    icon: LifeBuoy,
    title: 'トラブル対応',
    subtitle: 'よくある質問と対処法',
    items: [
      '【画像がアップロードできない】→ ファイルサイズが5MBを超えている可能性があります。画像を圧縮してから再試行ください。',
      '【「権限がありません」と表示される】→ セッションが切れています。一度ログアウトし、再度ログインしてください。',
      '【サイトに変更が反映されない】→ キャッシュ（最大5分）があります。5分ほど待ってからページを再読込してください。',
      '【ログインがうまくいかない】→ ログイン画面の「パスワードを忘れた方」から再設定用リンクを発行してください。',
      '【その他】→ システム管理者またはオーナーへご連絡ください。',
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
        relative rounded-[18px] overflow-hidden
        transition-all duration-300 ease-out
        border
        ${isOpen
          ? 'border-[#dfbd6930] shadow-[0_4px_32px_rgba(223,189,105,0.12)]'
          : 'border-[#ffffff0a] hover:border-[#dfbd6920] hover:shadow-[0_2px_16px_rgba(223,189,105,0.06)]'
        }
        group
      `}
    >
      {/* 土台 */}
      <div className="absolute inset-0 rounded-[18px] bg-[#141416]" />

      {/* 奥の金（openのみ表示） */}
      {isOpen && (
        <div
          className="absolute inset-0 rounded-[18px] opacity-30"
          style={{
            background: 'linear-gradient(135deg, #E8AA00 0%, #FBD84B 30%, #E7AB00 60%, #FBD94D 80%, #EEB502 100%)',
          }}
        />
      )}

      {/* 手前の黒面 */}
      <div
        className="absolute inset-[1px] rounded-[17px]"
        style={{
          background: 'linear-gradient(160deg, #1a1a1c 0%, #121214 50%, #1a1a1c 100%)',
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10">
        {/* ヘッダー行（クリックで開閉） */}
        <button
          onClick={onToggle}
          className="w-full text-left px-6 py-5 flex items-center gap-4 group/btn"
        >
          {/* STEPナンバー */}
          <div className="shrink-0 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-[14px] border border-[#dfbd6930] bg-[#dfbd6908] relative overflow-hidden">
            {/* Gold shimmer */}
            <div
              className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, transparent 30%, rgba(223,189,105,0.08) 50%, transparent 70%)',
              }}
            />
            <span
              className="text-[9px] font-bold tracking-[1.5px] uppercase leading-none mb-0.5"
              style={{ color: '#8A8478' }}
            >
              STEP
            </span>
            <span
              className="text-[20px] font-bold leading-none"
              style={{
                background: 'linear-gradient(90deg, #D1B25E 0%, #dfbd69 50%, #8F7130 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {data.step}
            </span>
          </div>

          {/* アイコン */}
          <div
            className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-[10px] transition-colors duration-200 ${
              isOpen ? 'bg-[#dfbd6920]' : 'bg-[#ffffff08] group-hover/btn:bg-[#dfbd6910]'
            }`}
          >
            <Icon
              size={16}
              className={`transition-colors duration-200 ${
                isOpen ? 'text-[#dfbd69]' : 'text-[#8A8478] group-hover/btn:text-[#c1a35d]'
              }`}
            />
          </div>

          {/* タイトル */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[15px] font-bold leading-snug tracking-tight truncate"
              style={{ color: isOpen ? '#f4f1ea' : '#c7c0b2' }}
            >
              {data.title}
            </p>
            <p className="text-[11px] text-[#8A8478] leading-none mt-0.5 truncate">
              {data.subtitle}
            </p>
          </div>

          {/* 展開アイコン */}
          <ChevronDown
            size={16}
            className={`shrink-0 text-[#8A8478] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* 展開コンテンツ */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-6 space-y-3">
            {/* 区切り線 */}
            <div className="h-px bg-[#ffffff08] mb-4" />

            {/* 手順リスト */}
            <ol className="space-y-3">
              {data.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#dfbd6915] border border-[#dfbd6930] mt-0.5">
                    <CheckCircle2 size={10} className="text-[#dfbd69]" />
                  </div>
                  <span
                    className="text-[13px] leading-relaxed text-[#c7c0b2] flex-1"
                  >
                    {item.replace(/`([^`]+)`/g, '$1')}
                  </span>
                </li>
              ))}
            </ol>

            {/* ノート */}
            {data.note && noteStyle && NoteIcon && (
              <div
                className={`mt-4 flex items-start gap-3 px-4 py-3 rounded-[12px] border ${noteStyle.border} ${noteStyle.bg}`}
              >
                <NoteIcon size={14} className={`${noteStyle.text} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <span className={`text-[9px] font-bold tracking-[1.4px] uppercase ${noteStyle.text} block mb-1`}>
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
export function ManualPage() {
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

  const expandAll = () => setOpenSteps(new Set<number>(MANUAL_STEPS.map((s) => s.step)));
  const collapseAll = () => setOpenSteps(new Set<number>());

  return (
    <div className="space-y-8 font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 py-4 border-b border-[#ffffff08]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-[#f4f1ea] tracking-tight">
            管理者 操作マニュアル
          </h1>
          <p className="text-[13px] text-[#8a8478] tracking-[0.1px] opacity-70">
            ANIMO CMS の日常業務手順をステップ形式で確認できます
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 印刷ボタン */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[12px] font-medium text-[#8a8478] bg-[#ffffff08] border border-[#ffffff0f] hover:bg-[#ffffff12] hover:text-[#c7c0b2] transition-all"
          >
            <Printer size={13} />
            印刷する
          </button>

          {/* 全て開く / 閉じる */}
          <button
            onClick={expandAll}
            className="px-4 py-2.5 rounded-[10px] text-[12px] font-medium text-[#8a8478] bg-[#ffffff08] border border-[#ffffff0f] hover:bg-[#ffffff12] hover:text-[#c7c0b2] transition-all"
          >
            全て開く
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2.5 rounded-[10px] text-[12px] font-medium text-[#8a8478] bg-[#ffffff08] border border-[#ffffff0f] hover:bg-[#ffffff12] hover:text-[#c7c0b2] transition-all"
          >
            全て閉じる
          </button>
        </div>
      </div>

      {/* ── 進捗インジケーター ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {MANUAL_STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = openSteps.has(s.step);
          return (
            <button
              key={s.step}
              onClick={() => toggleStep(s.step)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-[8px] shrink-0
                text-[11px] font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d]'
                  : 'bg-[#ffffff08] border border-[#ffffff0f] text-[#8a8478] hover:bg-[#ffffff12] hover:text-[#c7c0b2]'
                }
              `}
            >
              <Icon size={11} strokeWidth={isActive ? 2.5 : 2} />
              <span>STEP {s.step}</span>
            </button>
          );
        })}
      </div>

      {/* ── STEPカード一覧 ── */}
      <div className="space-y-3">
        {MANUAL_STEPS.map((step) => (
          <StepCard
            key={step.step}
            data={step}
            isOpen={openSteps.has(step.step)}
            onToggle={() => toggleStep(step.step)}
          />
        ))}
      </div>

      {/* ── フッター ── */}
      <div className="pt-4 pb-8 text-center">
        <p className="text-[11px] text-[#8a8478] opacity-60">
          CLUB ANIMO · 管理者向けCMS操作マニュアル · ご不明点はシステム管理者へお問い合わせください
        </p>
      </div>
    </div>
  );
}
