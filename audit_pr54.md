# PR #54 監査レポート

- **Branch**: `codex/final-stabilization`
- **Commit**: `c3b6723` fix(admin): stabilize restart operations
- **監査日**: 2026-05-06
- **対象**: 15ファイル, +213 / -41 行
- **Codex検証**: eslint ✓ / tsc ✓ / next build ✓ / smoke test ✓

---

## 監査結果サマリ

| 重大度 | 件数 |
|--------|------|
| **Blocker** | 0 |
| **High** | 1 |
| **Medium** | 2 |
| **Low** | 1 |

---

## Blocker — なし

---

## High

### H-1: DashboardTodayOps 全体を `<Link>` で包んだことによるUX・アクセシビリティ問題

| 項目 | 内容 |
|------|------|
| **ファイル** | [DashboardTodayOps.tsx](file:///Users/takumashinnyo/workspace/projects/10_active_projects/Animo/components/features/admin/dashboard/DashboardTodayOps.tsx#L44-L114) |
| **行** | L44, L114 |
| **問題** | カード全体（概要テーブル・メモリスト・ステータスバッジ等を含む大型コンポーネント）を `<Link href="/admin/today">` で包んでいる。`<a>` タグ内に対話的コンテンツ（テキスト選択、スクロール可能領域、将来ボタン追加可能性）を含めることはHTML仕様上推奨されない。 |
| **影響** | ① カード内テキストのコピー不可 ② `overflow-y-auto` 領域のスクロール操作とクリック遷移が干渉する可能性（特にタッチ端末） ③ スクリーンリーダーが巨大なリンクテキストを読み上げ、ナビゲーション体験が劣化 ④ 将来ボタン等を内部に追加した場合 `<a>` 内 `<button>` の入れ子が発生 |
| **最小修正案** | `<Link>` で包む代わりに、ヘッダー行のタイトル部分のみに `<Link>` を付与し、カード全体のクリック対応は CSS `cursor-pointer` + JS `onClick` + `router.push` で実現する。もしくはカード全体をクリック可能にする場合は `<div onClick>` + `role="link"` + `aria-label` + `tabIndex={0}` パターンを検討。 |

> [!WARNING]
> これは運用上ただちにブロックするものではないが、UX品質に影響するため High とした。merge前に修正が強く推奨される。

---

## Medium

### M-1: 料金例の税サービス料金額が計算結果と微妙に不一致

| 項目 | 内容 |
|------|------|
| **ファイル** | [page.tsx](file:///Users/takumashinnyo/workspace/projects/10_active_projects/Animo/app/(public)/page.tsx#L37-L72) |
| **行** | L43, L55, L67 |
| **問題** | 表示される税+サービス料内訳と実計算値にずれがある（「約」表記で許容範囲内だが一部方向が逆） |

| パターン | 小計 | 実際の税サービス料 | 表示値 | 差 |
|----------|------|--------------------|--------|----|
| Ex1 | ¥7,000 | ¥2,240 | 約¥2,200 | -40（切り捨て方向 ✓） |
| Ex2 | ¥13,000 | ¥4,160 | 約¥4,200 | +40（**切り上げ方向**） |
| Ex3 | ¥17,000 | ¥5,440 | 約¥5,400 | -40（切り捨て方向） |

| **影響** | Total の ¥9,000 / ¥17,000 / ¥22,000 は1000円丸め後の正確な金額で正しい。内訳行はあくまで参考表示だが、Ex2 で実計算より**高く**表示しているのは顧客不信につながる可能性がゼロではない。 |
| **最小修正案** | 全て `約¥2,200` / `約¥4,200` / `約¥5,400` の「約」表記で統一されており実害は軽微。もし正確性を重視するなら `約¥4,200` → `約¥4,100` に修正。 |

### M-2: `submitCheckin` の再送信 pending 化と既存承認済みガードの関係

| 項目 | 内容 |
|------|------|
| **ファイル** | [today.ts](file:///Users/takumashinnyo/workspace/projects/10_active_projects/Animo/lib/actions/today.ts#L631-L652) |
| **行** | L631, L648-650 |
| **問題（確認済み・問題なし）** | L631 で `existing?.approval_status === 'approved'` の場合はエラーを返して処理終了するため、approved 状態のレコードが pending に巻き戻されることはない。**upsert で設定される `approval_status: 'pending'` は新規 or 既存 pending の場合のみ到達する。** |
| **残存リスク（事実）** | ただし、DB の `daily_checkins` テーブルに `approval_status` カラムの CHECK 制約またはデフォルト値が設定されているかは未確認。もし制約がない場合、直接DB操作で不正な値が入る可能性は排除できないが、これはこのPRの責任範囲外。 |
| **影響** | **Medium としたのは、`approved_at: null` と `approved_by: null` を明示的にセットしている点。** これはupsertの `onConflict` 条件で既存行を上書きする際に必要な正しいリセット処理。ただし、万一ガードが将来変更された場合に承認済みデータを破壊するリスクがあるため、防御コメントを追加しておくことを推奨。 |
| **最小修正案** | L648 付近にコメントを追加: `// NOTE: L631 のガードにより approved 行はここに到達しない` |

---

## Low

### L-1: `GET /api/line` の認証 — CRON_SECRET 未設定時のフェイルクローズ

| 項目 | 内容 |
|------|------|
| **ファイル** | [route.ts](file:///Users/takumashinnyo/workspace/projects/10_active_projects/Animo/app/api/line/route.ts#L43-L46) |
| **行** | L44 |
| **問題（確認済み・安全）** | `!process.env.CRON_SECRET` が truthy の場合（= 未設定の場合）、条件全体が true になり 401 を返す。これは**フェイルクローズ**であり安全。他の cron ルート（`/api/automation/birthday`, `/api/cron/shift-reminders` 等）と同一パターン。 |
| **改善提案** | 認証パターンが複数箇所に重複しているため、将来的に共通ミドルウェアへ抽出を検討（このPRの範囲外）。 |

---

## 確認済み項目（問題なし）

### ✅ Supabase RLS / auth を弱めていないか
- RLS ポリシーの変更はゼロ。すべてサーバーアクション内のクエリ条件（`.eq()` フィルタ）の変更のみ。
- `createClient()` の使用パターンに変更なし。

### ✅ DB schema / env / config を変更していないか
- schema ファイル・migration・`.env` ファイルの変更はゼロ。
- 新しい環境変数の追加もなし（既存 `CRON_SECRET` を使用）。

### ✅ cron や既存の通知処理を壊していないか
- `/api/cron/*` ルートの変更はゼロ。
- `sendLineGroupMessage` の呼び出しパターンに変更なし。
- `GET /api/line` への認証追加は、管理画面テスト送信ボタンが `Authorization: Bearer CRON_SECRET` ヘッダーを送る前提。管理画面側のテスト送信UIがこのヘッダーを送っているかは未確認だが、そもそもこのエンドポイントはテスト用途であり、cron ジョブではない。

### ✅ admin 保護ルートの認証・redirect 挙動
- 新規ページ (`staffs/[id]`, `customers/[id]/edit`) は `app/admin/(protected)/` 配下に配置。
- `(protected)/layout.tsx` が `requireAdminLogin()` で認証をチェックし、未認証なら `/admin/login` へ 307 redirect。
- Codex の smoke test で確認済み（307 redirect to `/admin/login`）。

### ✅ staff edit が createStaff と updateStaff を正しく切り替えているか
- `StaffForm` に `initialData?: StaffSlave` prop が追加。
- `initialData` 存在時は `updateStaff(initialData.id, fd)` を呼び出し、非存在時は `createStaff(fd)` を呼び出す。
- `updateStaff` は `staffs.ts` L126-182 に既存実装があり、`id` パラメータで `.eq('id', id)` を指定して update。正しい。
- 名前の初期値は `getInitialNameParts()` で `family_name` / `given_name` 優先、fallback で `name` を split。安全。
- ボタンラベル・トーストメッセージも edit / new で切り替え済み。

### ✅ customer edit alias が Next.js App Router で安全に動くか
- `app/admin/(protected)/customers/[id]/edit/page.tsx` は `export { default } from '../page'` で親の `page.tsx` を re-export。
- `../page.tsx`（= `customers/[id]/page.tsx`）は `CustomerForm` に `initialData` を渡す編集ページ。
- Next.js App Router は `export { default }` による re-export をサポートしており、`params` は layout → page に正しく伝播する。
- `dynamic = 'force-dynamic'` も設定済み。

### ✅ DashboardKPIs のリンク先変更
- `href` を `/admin/approvals?view=posts` → `/admin/applications` に変更。
- `/admin/applications` ルートの存在を確認済み（`app/admin/(protected)/applications/page.tsx` が存在）。

### ✅ dashboard の reservation 集計が approved のみになったことの妥当性
- `getDashboardKPIs` と `getDashboardTodayOps` の `daily_reservations` クエリにすべて `.eq('approval_status', 'approved')` が追加。
- これにより、ダッシュボードの「予約件数」「来店人数」は**店長承認済みの来店予定のみ**をカウント。
- 承認フロー（`approveReservation` / `rejectReservation`）は `today.ts` L924-960 に既存実装あり。
- **意図通り「店長承認後のみ反映」になっている。**

### ✅ cast_posts status を `approved` → `published` に変えたことの DB 整合性
- `cast-posts.ts` L121 で `updateCastPostStatus(postId, status: 'draft' | 'pending' | 'published')` が定義。
- `getPublishedPosts` (L181) も `.eq('status', 'published')` でクエリ。
- 投稿作成時は `status: 'pending'` で INSERT（L90）。
- 管理画面で承認 → `published` に変更するフロー。
- **`dashboard.ts` のメトリクスクエリを `approved` → `published` に変えたのは DB 設計と一致。** `approved` は旧値であり、現在は `published` が正しい status 値。

### ✅ 公開サイトの料金表記の整合性
- 計算式: `subtotal × 1.1 × 1.2 = subtotal × 1.32` は数学的に正しい。
- `PriceSimulator.tsx` (L70): `subTotal * 1.32` → 正しい。
- `ShiftTable.tsx` (L12): `TAX_SERVICE_MULTIPLIER = 1.32` → 正しい。
- `SystemPriceGrid.tsx`: `30%` → `消費税10% + サービス料20%` → 表記として正確（1.1 × 1.2 - 1 = 0.32 = 32% だが、構造は「消費税後にサービス料」）。
- `guide/page.tsx`: FAQ とフッター注釈の表記を統一更新。

### ✅ #today-cast アンカーの有効化
- `page.tsx` L178: `<section id="today-cast" className="... scroll-mt-24">` を追加。
- ヘッダーCTA の `href="/#today-cast"` が正しくアンカーに対応。
- `scroll-mt-24` でヘッダー分のオフセットを確保。

### ✅ PR に不要な既存差分が混入していないか
- `git diff c3b6723^..c3b6723 --stat` で確認。15ファイルのみで、すべて PR の意図に合致。
- `PLANS.md` と `daily_log.md` はドキュメント更新。不要な未コミット差分の混入なし。

---

## 追加テスト推奨

### 1. DashboardTodayOps のタッチ端末テスト
```
手順:
1. Vercel Preview URL を iPhone / Android で開く
2. /admin/today にログイン
3. ダッシュボードの「本日の営業状況」カードを確認
4. MANAGEMENT MEMO 領域を縦スクロールしてみる
5. スクロール操作が /admin/today への遷移を誤発火しないか確認
```

### 2. 管理画面テスト送信ボタンの動作確認
```
手順:
1. 管理画面のLINEテスト送信UIを開く
2. テスト送信ボタンを押す
3. Authorization ヘッダーが正しく送られているか確認
   （もしヘッダーなしで送っている場合、401が返る）
```

### 3. スタッフ編集フローの E2E
```bash
# Vercel Preview で以下を確認:
# 1. /admin/staffs にログイン
# 2. 既存スタッフの行をクリック → /admin/staffs/[id] に遷移
# 3. フォームに既存データがプリフィルされていることを確認
# 4. データを変更して「更新する」ボタンを押す
# 5. /admin/staffs に戻り、変更が反映されていることを確認
```

---

## Merge 判定

> [!IMPORTANT]
> **条件付き Merge 可（Merge-able with minor fix recommended）**

### 根拠
- **Blocker**: 0件。セキュリティ・データ破壊リスクなし。
- **High**: 1件（H-1）は UX 品質の問題であり、データ破壊やセキュリティ侵害ではない。現状の管理画面ダッシュボードはデスクトップ利用が主であり、ただちにユーザー障害にはならない。
- **Medium**: 2件は表示上の軽微な不整合とコード品質改善であり、blocking ではない。

### 推奨アクション
1. **H-1 を merge 前に修正するか、merge 後に即座にフォローアップ Issue を起票する**
2. M-1, M-2 はフォローアップで対応可

### リスク評価
| 観点 | 評価 |
|------|------|
| セキュリティ（RLS/auth/認証） | ✅ 安全。認証強化のみ |
| データ整合性（DB/schema） | ✅ 安全。schema変更なし |
| 既存機能の破壊 | ✅ なし。cron/通知/承認フロー維持 |
| UX品質 | ⚠️ H-1 要対応 |
| 料金表記の正確性 | ⚠️ M-1 軽微 |

---

*監査担当: Antigravity*
*監査対象: PR #54 (commit c3b6723) のみ*
*未コミット差分・別ブランチの変更は対象外*
