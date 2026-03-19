# Club Animo Webサイト 技術アーキテクチャ設計書

0 目的
本設計書はClub Animo Webサイトの技術構成を定義する。
単なる静的サイトではなく、キャスト管理、本日の出勤表示、求人応募管理などを実現するため、モダンなWebアーキテクチャを採用する。

---

1 技術スタック

- Frontend: Next.js (App Router)
- 言語: TypeScript
- スタイル: Tailwind CSS
- アニメーション: Framer Motion または GSAP
- Backend: Supabase
- Database: PostgreSQL
- Hosting: Vercel
- 画像管理: Supabase Storage
- CMS: 独自管理画面

---

2 ディレクトリ構造

- `/app`
- `/components`
- `/features`
- `/lib`
- `/styles`
- `/admin`
- `/api`

---

3 データベース設計 (主要テーブル)

- `casts`
- `shifts`
- `events`
- `news`
- `gallery`
- `recruit_applications`
- `contacts`

---

4 `casts` テーブル (キャスト情報)

- id / name / age / height / hobby / comment / image_url / tags / status / created_at

---

5 `shifts` テーブル (本日の出勤)

- id / cast_id / date / start_time / end_time

---

6 `events` テーブル

- id / title / description / image_url / event_date / created_at

---

7 `news` テーブル

- id / title / content / image_url / published_at

---

8 `gallery` テーブル (店内写真)

- id / image_url / caption / sort_order

---

9 `recruit_applications` (求人応募)

- id / name / age / phone / type (cast / staff) / message / created_at

---

10 `contacts` (問い合わせ)

- id / name / phone / message / created_at

---

11 API設計

- `GET /casts`, `GET /casts/{id}`
- `GET /shifts/today`
- `GET /events`
- `POST /recruit`, `POST /contact`

---

12 キャスト表示ロジック

- 所属キャスト: `casts`テーブル
- 本日の出勤: `shifts`テーブル
- （これらをJOINで表示）

---

13 画像設計

- 画像はStorage管理 (`casts`, `gallery`, `hero`)

---

14 パフォーマンス最適化

- ISR / 画像最適化 / Lazy Load

---

15 セキュリティ

- RLSの設定 / Admin認証

---

16 管理画面

- `/admin` (ログイン認証)

---

17 SEO技術

- 構造化データ / metaタグ / sitemap

---

18 モーション

- Framer Motion / Scroll animation

---

19 ログ管理

- エラー監視 / Vercel Logs

---

20 受け入れ基準

- キャスト管理可能
- 出勤表示可能
- 求人応募保存
- 高速表示
- モバイル対応
