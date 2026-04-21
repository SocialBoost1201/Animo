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
  Sparkles,
  LineChart,
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
    title: 'ログインとセキュリティ',
    subtitle: 'システムへのアクセスと認証管理',
    items: [
      'ブラウザで `https://club-animo.jp/admin` にアクセスし、メールアドレスとパスワードでログインします。',
      'キャスト向けの `https://club-animo.jp/cast/login` では、携帯電話番号を用いた「SMS認証」が導入されています。',
      '「パスワードを忘れた方」からの再設定機能が利用可能です。',
    ],
    note: {
      type: 'important',
      text: '退職者のアカウントは、ダッシュボードへアクセスできなくするため、システム管理者へ連絡して権限を速やかに削除または無効化してください。',
    },
  },
  {
    step: 2,
    icon: LayoutDashboard,
    title: 'ダッシュボードとKPI',
    subtitle: '本日の営業状況とアラート管理',
    items: [
      'ログイン後のメイン画面では、本日の出勤人数・来店予定件数・売上速報などの重要KPIが表示されます。',
      '【本日の営業状況】各キャストの「出勤可能」「連絡なし未出勤」等ステータスを一覧で管理でき、ワンクリックで状態を変更可能です。',
      '【キャストランキング】本日の成績ランキングと、アクション（連絡・報告等）が未提出のキャストを確認できます。',
      '【重要アラート】求人応募や顧客からの未対応問い合わせがある場合、ポップアップカードで通知されます。',
    ],
    note: {
      type: 'tip',
      text: 'ダッシュボード内の情報はリアルタイムに近い形で集計されます。店舗の最前線での「本日の行動管理」に活用してください。',
    },
  },
  {
    step: 3,
    icon: Calendar,
    title: 'シフトと出勤管理',
    subtitle: '出勤登録とテンプレートシフト作成',
    items: [
      '【本日の出勤登録】左メニューの「シフトカレンダー」から、本日または指定日の出勤予定キャストをチェックボックスで登録します。（確定後、公式サイトの「本日の出勤一覧」に即時反映されます）',
      '【テンプレートシフト】毎週固定の出勤パターンを持つキャストに対し、「テンプレシフト」を事前作成し、ボタン一つで一括適用することが可能です。',
      '【キャストからの提出】キャストは自身のダッシュボード（/cast）から希望シフトの提出が可能です。',
    ],
  },
  {
    step: 4,
    icon: Users,
    title: 'キャスト・スタッフ管理',
    subtitle: 'プロフィールの更新とドラッグ＆ドロップ並び替え',
    items: [
      '左メニューから「キャスト管理」または「スタッフ管理」を選択します。',
      '【新規登録】右上「+ 新規追加」から基本情報（源氏名・役職など）を入力し、写真をアップロードできます。',
      '【並び替え】キャスト一覧画面では、キャストのカードをドラッグ＆ドロップすることで、公式サイトに表示される順番を自由に制御できます（保存ボタンで確定）。',
      '【ステータス変更】退店したキャストは削除せず、ステータスを「非公開」または「休職」に変更してください。',
    ],
    note: {
      type: 'caution',
      text: '完全にデータを削除すると、過去の各種レポートや売上データに欠損が生じるため、原則として「非公開」への変更のみとしてください。',
    },
  },
  {
    step: 5,
    icon: BookOpen,
    title: '顧客データ (CRM)',
    subtitle: 'お客様情報の登録・確認',
    items: [
      '左メニューから「顧客データ」を選択します。',
      '検索バーで「名前」や「電話番号」から顧客を絞り込み検索できます。',
      '顧客ごとに詳細画面を開き、「来店履歴」「指名したキャスト」「特記事項・メモ」の確認や追記が可能です。',
      '初回の電話対応時や来店時に、基本情報（お客様名カナや連絡先）を登録しておくことで、トラブル防止に繋がります。',
    ],
  },
  {
    step: 6,
    icon: Bell,
    title: 'お知らせとLINE連携通知',
    subtitle: 'スタッフ・キャストへの一斉連絡',
    items: [
      '左メニュー「通知」から、特定のスタッフや店舗全体へ内部連絡を一斉送信できます。',
      '【LINE連携】システムはLINE Bot（Messaging API）と連携済みです。店舗用LINEグループへ重要アラートを自動転送する設定が可能です。',
      '未読の通知は、画面右上（またはサイドバー最下部）のベルアイコンに赤いバッジで表示されます。',
    ],
    note: {
      type: 'tip',
      text: 'LINE通知が届かない場合は、ダッシュボードの「設定」メニューから、LINE Webhookの接続状態と対象キャストの設定を確認してください。',
    },
  },
  {
    step: 7,
    icon: Briefcase,
    title: '求人応募・問い合わせ管理',
    subtitle: '応募者管理と面接フロー',
    items: [
      'バッジが赤く点灯している「求人応募」または「お問い合わせ」メニューを確認します。',
      '未対応一覧から詳細を開き、記載された連絡先へ電話またはLINE/メールでアプローチします。',
      '対応後、必ずステータスを「未対応」→「連絡済」や「面接予定」に変更します。',
    ],
    note: {
      type: 'important',
      text: 'ステータスの更新漏れは、他のスタッフによる「二重連絡（重複対応）」の原因となります。対応後は速やかにステータスを保存してください。',
    },
  },
  {
    step: 8,
    icon: Sparkles,
    title: '【開発予定】Growth Agent (AI分析機能)',
    subtitle: '将来実装される機能ロードマップ',
    items: [
      '現在システムの裏側では、次世代のAIアシスタント「Growth Agent」の開発が進行中です。',
      '【売上・離職予測】過去のシフトや行動データをAIが分析し、「このキャストは出勤傾向が変化しておりケアが必要」等のインサイトを自動通知する予定です。',
      '【UIプレビュー】`アニメーションLab`（/admin/animation-preview）など、新しい視覚エフェクトの検証も並行して行われています。',
    ],
    note: {
      type: 'tip',
      text: 'Growth Agentはリリースされ次第、メニューに専用の「インサイトボード」が追加される予定です。ご期待ください。',
    },
  },
  {
    step: 9,
    icon: LifeBuoy,
    title: 'トラブル対応・FAQ',
    subtitle: 'よくある質問と対処法',
    items: [
      '【画像がアップロードできない】→ ファイルサイズが5MBを超えている可能性があります。長辺を1500px程度に圧縮してから再試行ください。',
      '【「権限がありません」と表示される】→ セッションが切れています。一度ログアウトし、再度ログインしてください。',
      '【サイトに変更が反映されない】→ Vercelによるキャッシュ（最大5分）があります。5分ほど待機してからページを再読込してください。',
      '【その他・エラー画面】→ システム管理者またはオーナーへご連絡ください。',
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
