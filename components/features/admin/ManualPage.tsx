'use client';

import React, { useState } from 'react';
import {
  LogIn,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Users,
  UserCheck,
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
      'ブラウザで https://club-animo.jp/admin にアクセスします。',
      'ログイン画面で、共有された「メールアドレス」と「パスワード」を入力して「ログイン」を押します。',
      '正常にログインするとダッシュボード画面が表示されます。',
      'スマートフォンから使う場合は、ブラウザの「ホーム画面に追加」でショートカットを作成すると便利です。',
    ],
    note: {
      type: 'important',
      text: 'パスワードを忘れた場合は、ログイン画面下部の「パスワードを忘れた方」から再設定メールを送れます。退職・離職したスタッフのアカウント停止はシステム管理者へご連絡ください。',
    },
  },
  {
    step: 2,
    icon: LayoutDashboard,
    title: 'ダッシュボード・本日の営業状況',
    subtitle: '毎日最初に確認する画面',
    items: [
      '左メニューの「ダッシュボード」で本日の出勤人数・来店予定件数・未対応の承認件数などを一覧確認できます。',
      '未承認の件数（シフト申請・ブログ・画像変更など）は画面上のバッジに表示されます。バッジが赤くなっている場合は要対応です。',
      '左メニューの「本日の営業状況」では、本日出勤のキャスト一覧・来店予定の顧客・指名状況を確認できます。',
      '来店予定の確認・出勤確認の承認は「承認」ページで行います（次のステップ参照）。',
    ],
    note: {
      type: 'tip',
      text: 'ダッシュボードは毎日の業務開始時に確認し、未対応件数を0にする習慣をつけましょう。',
    },
  },
  {
    step: 3,
    icon: ClipboardList,
    title: '承認ハブ（日次確認の中心）',
    subtitle: '出勤確認・ブログ・プロフィール画像の審査を一括で行う',
    items: [
      '左メニューの「承認」を選択します。画面が3列に分かれています。',
      '【列1: 出勤確認 & 来店予定】キャストが当日送信した出勤確認、お客様の来店予定申請が表示されます。「承認」を押すと本日の出勤一覧・来店予定に反映されます。',
      '【列2: ブログ承認】キャストが投稿したブログ記事が表示されます。内容を確認し「承認」を押すとサイトに公開されます。問題がある場合は「却下」を押してください。',
      '【列3: プロフィール画像承認】キャストが申請した新しい顔写真が表示されます。サムネイルで画像を確認し「承認」を押すとキャストのプロフィール画像が更新されます。',
      'どの列も件数が「0」になれば当日の対応完了です。',
    ],
    note: {
      type: 'important',
      text: 'ブログ承認・画像承認は「承認」を押した時点でサイトに公開・反映されます。必ず内容を確認してから承認してください。問題があれば「却下」を選択し、キャストへ直接フィードバックしてください。',
    },
  },
  {
    step: 4,
    icon: Calendar,
    title: '出勤調整（シフト申請の承認）',
    subtitle: 'キャストが提出した週次シフトを確認・承認する',
    items: [
      '左メニューの「出勤調整」を選択します。',
      '画面上部に「新規申請」と「変更申請」の2タブがあります。通常は「新規申請」タブを確認します。',
      'キャストが毎週金曜23:55までに提出したシフト申請が一覧表示されます。各キャストの申請内容（出勤日・時刻）を確認します。',
      '問題なければ「承認」を押します。承認するとそのキャストのシフトが「シフト管理」の月次マトリクスに反映されます。',
      '変更申請タブには、一度承認したシフトへの修正申請が表示されます。同様に内容を確認して承認・却下します。',
      '未提出のキャストがいる場合、LINEまたは口頭で提出を促してください（督促機能は管理者操作が必要です）。',
    ],
    note: {
      type: 'caution',
      text: '却下した場合、キャストに理由を別途LINEや口頭で伝えてください。システムから自動通知は現在送信されません。',
    },
  },
  {
    step: 5,
    icon: Calendar,
    title: 'シフト管理（月次確認・出勤募集）',
    subtitle: '月間シフト一覧の確認とLINE出勤募集の送信',
    items: [
      '左メニューの「シフト管理」を選択します。',
      '画面上部に「キャスト」と「スタッフ」の2タブがあります。',
      '【キャストタブ】月次マトリクス表で、縦軸にキャスト名、横軸に日付が並びます。各セルの記号は「○=出勤可、×=出勤不可、△=条件付き、時刻=指定時間出勤、同伴=同伴予定」を意味します。',
      '【出勤募集の送信】日付セル（列ヘッダーの数字）をクリックするとモーダルが開きます。メッセージを確認・編集し「募集する」を押すと、その日の出勤募集がキャストグループLINEに自動送信されます。',
      '【Excel出力】右上の「Excel出力（印刷用）」ボタンで月次シフト表をExcel形式でダウンロードできます。',
      '【スタッフタブ】アクティブなスタッフの一覧（名前・役職・電話番号・LINE ID）が確認できます。',
      '画面上部の「先月」「翌月」ボタンで表示月を切り替えられます。',
    ],
    note: {
      type: 'tip',
      text: '出勤募集のLINE送信は1回のクリックで完了します。当日の欠員が出た際や急なシフト補充に活用してください。メッセージ内容はモーダル内で自由に編集できます。',
    },
  },
  {
    step: 6,
    icon: Users,
    title: 'キャスト管理',
    subtitle: 'キャストの新規登録・プロフィール編集・退店処理',
    items: [
      '左メニューの「キャスト管理」を選択します。',
      '【新規登録】右上の「+ 新規追加」ボタンを押し、源氏名・英語表記・役職・プロフィール文・SNSリンクなどを入力して「登録する」を押します。',
      '【プロフィール編集】一覧から対象キャストの「編集」ボタンを押し、変更後「更新する」を押します。',
      '【顔写真の変更】キャスト自身がアプリ（/cast/profile/edit）から画像変更を申請できます。申請が届くと「承認」ページのプロフィール画像列に表示されます。管理者が承認することで画像が更新されます。',
      '【退店処理】データを削除せず、「ステータス」を「非公開」に変更して保存します。これによりサイト上から非表示になり、過去の出勤・売上データは保持されます。',
      '【表示順の変更】一覧画面でドラッグ＆ドロップして並び順を変更できます（サイトの表示順に反映されます）。',
    ],
    note: {
      type: 'caution',
      text: 'キャストを完全削除すると過去データも失われます。退店の場合は必ず「非公開」に変更してください。削除は絶対に行わないでください。',
    },
  },
  {
    step: 7,
    icon: UserCheck,
    title: 'スタッフ管理',
    subtitle: 'スタッフの登録・役職・連絡先の管理',
    items: [
      '左メニューの「スタッフ管理」を選択します。',
      '【新規登録】右上の「+ 新規追加」ボタンを押し、氏名・表示名・役職・携帯番号・LINE IDを入力して登録します。',
      '【編集】一覧から対象スタッフの「編集」ボタンを押して情報を更新します。',
      '【退職処理】「ステータス」を「非アクティブ」に変更します。シフト管理のスタッフ一覧に表示されなくなります。',
      'スタッフの連絡先情報は「シフト管理 > スタッフタブ」でも一覧確認できます。',
    ],
    note: {
      type: 'tip',
      text: 'LINE IDを登録しておくと、緊急時のグループ追加や個別連絡がスムーズになります。入社時に必ず登録しましょう。',
    },
  },
  {
    step: 8,
    icon: BookOpen,
    title: '顧客データ',
    subtitle: 'お客様情報の確認・管理',
    items: [
      '左メニューの「顧客データ」を選択します。',
      '検索バーで名前・電話番号・メールアドレスなどで絞り込みができます。',
      '各顧客をクリックすると、来店履歴・指名キャスト・メモ・連絡先を確認できます。',
      'メモ欄には接客上の注意事項・好み・特記事項などを自由に記録できます。',
      '新規顧客は来店予定の登録時、または初回来店時に手動で追加します。右上の「+ 新規追加」から登録してください。',
    ],
    note: {
      type: 'tip',
      text: '顧客メモはスタッフ全員が閲覧できます。次回来店時に活用できる情報（好みのドリンク・接客の注意点など）は積極的に記録してください。',
    },
  },
  {
    step: 9,
    icon: Bell,
    title: 'お知らせ・通知',
    subtitle: '内部連絡・スタッフへの一斉通知',
    items: [
      '左メニューの「通知」を選択します。',
      '「+ 新規作成」からタイトルと本文を入力します。',
      '送信対象（全スタッフ・特定スタッフ）を選択して「送信する」を押します。',
      '未読通知はサイドバーのベルアイコンに件数バッジで表示されます。',
      '送信済み一覧から各スタッフの既読状況を確認できます。',
    ],
    note: {
      type: 'tip',
      text: '急ぎの連絡はLINEグループを優先してください。この通知機能は業務連絡・お知らせ・ルール変更などの記録・共有に適しています。',
    },
  },
  {
    step: 10,
    icon: Briefcase,
    title: '求人応募管理',
    subtitle: '応募者への対応フロー',
    items: [
      '左メニューの「求人応募」を選択します。未対応の応募があるとバッジに件数が表示されます。',
      '応募者一覧から名前をクリックして詳細（氏名・連絡先・応募内容・希望日時）を確認します。',
      '実際に電話またはLINEで応募者に連絡を取ります。',
      '連絡後、ステータスを「未対応」→「連絡済」または「面接予定」に変更して保存します。',
      '面接・採用・不採用の結果もステータスで管理し、スタッフ間で対応状況を共有します。',
    ],
    note: {
      type: 'important',
      text: 'ステータス更新を忘れると別のスタッフが重複して連絡してしまいます。応募者に連絡したら必ずその場でステータスを変更してください。',
    },
  },
  {
    step: 11,
    icon: LifeBuoy,
    title: 'トラブル対応・よくある質問',
    subtitle: '困ったときの対処法',
    items: [
      '【画像がアップロードできない】ファイルサイズが大きすぎる可能性があります。5MB以下に圧縮してから再試行してください。',
      '【「権限がありません」と表示される】セッションが切れています。一度ログアウトして再ログインしてください。',
      '【サイトに変更が反映されない】キャッシュのため最大5分かかる場合があります。少し待ってからページを再読込してください。',
      '【ログインできない】ログイン画面の「パスワードを忘れた方」から再設定メールを送ってください。それでも解決しない場合はシステム管理者へ連絡してください。',
      '【シフト申請が届いていない】キャストに「出勤調整」メニューから期限内に提出するよう伝えてください。金曜23:55が提出期限です。',
      '【その他の不具合・操作不明点】システム管理者またはオーナーへご連絡ください。',
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
            isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
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
                  <span className="text-[13px] leading-relaxed text-[#c7c0b2] flex-1">
                    {item}
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
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[12px] font-medium text-[#8a8478] bg-[#ffffff08] border border-[#ffffff0f] hover:bg-[#ffffff12] hover:text-[#c7c0b2] transition-all"
          >
            <Printer size={13} />
            印刷する
          </button>
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
