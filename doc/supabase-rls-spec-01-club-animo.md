# Club Animo Webサイト Supabase RLS 設計書

0 目的
本設計書はClub Animo WebサイトのSupabaseデータベースにおけるRow Level Security（RLS）設計を定義する。
非公開データ（求人応募、問い合わせ、管理ログ）が外部から取得されないよう、RLSを厳密に設定する。

---

1 基本方針

- 公開データ（キャスト, イベント, ニュース, ギャラリー）: 匿名ユーザー閲覧可能
- 非公開データ（応募, 問い合わせ, 管理ログ）: 管理者のみアクセス可能

---

2 認証方式

- Supabase Auth を使用
- 認証ユーザー（管理者）: role `admin`
- 一般ユーザー: 匿名 (`anonymous`)

---

3 〜 8 公開データ RLS適用テーブル

- `casts`, `shifts`, `events`, `news`, `gallery`
- SELECT: 許可 (allow public read)
- INSERT / UPDATE / DELETE (※一部対象外): 管理者のみ

---

9 〜 10 非公開データ RLS適用テーブル

- `recruit_applications` (求人応募), `contacts` (問い合わせ)
- SELECT: 管理者のみ (select allowed only for admin)
- INSERT: 匿名ユーザー許可 (insert allowed for anon)
- UPDATE: 管理者のみ

---

11 Storage RLS

- Bucket: `images`
- 公開フォルダ: `casts`, `gallery`, `events`
- 非公開フォルダ: `admin`

---

12 〜 13 Roleとセキュリティ対策

- 管理者は `admin` ロールで管理
- 匿名ユーザーはSELECTのみ、INSERTは限定（応募・問い合わせ等）

---

14 APIアクセス制御

- 公開API: キャスト取得 / イベント取得
- 管理API: 応募取得 / 問い合わせ取得

---

15 〜 16 管理画面とログ管理

- `/admin` : ログイン必須
- 管理操作ログ: 作成者 / 更新日時を記録

---

17 〜 18 バックアップと不正アクセス対策

- DBバックアップ: 毎日
- 不正アクセス対策: RLS有効 / Service keyのフロントエンドでの使用禁止

---

19 テスト / 20 受け入れ基準

- 匿名アクセス確認 / 管理者アクセス確認
- 公開データ閲覧可能 / 応募データ外部閲覧不可 / 管理画面のみフルアクセス可能
