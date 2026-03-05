# Club Animo Webサイト 技術設計書

0. 目的
   本書はClub Animo Webサイトを実装するための技術構成、アーキテクチャ、フロントエンド、バックエンド、CMS、データベース、画像管理、フォーム処理、SEO対策、セキュリティ設計を定義する。
   Antigravityは本技術設計に基づき、参考サイトを解析した上で最適な構成で実装すること。

参考サイト
https://www.club-xee.com/
https://www.chick.co.jp/roppongi/
https://princegroup.jp/
https://www.clubepic.net/top/

---

1 技術スタック

1.1 フロントエンド

- Framework: Next.js
- Rendering: SSG + ISR (SEOに強い / 高速表示 / 運用更新可能)
- Language: TypeScript
- Styling: Tailwind CSS

  1.2 アニメーション

- Library: Framer Motion (軽量 / 高性能 / Reactと親和性 / スクロール連動可能)
- 補助: Intersection Observer

  1.3 CMS / 管理画面

- Backend: Supabase (低コスト / 高速開発 / DB + Auth + Storage)
- 管理画面: Admin Dashboard

  1.4 データベース

- PostgreSQL (Supabase DB使用)

  1.5 画像管理

- Supabase Storage
- 画像最適化: Next Image

  1.6 デプロイ

- Vercel (Next.js最適 / 自動ビルド / CDN配信)

---

2 システムアーキテクチャ

- Frontend: Next.js App Router
- Backend: Supabase
- Database: PostgreSQL
- Storage: Supabase Storage
- CDN: Vercel Edge

---

3 ディレクトリ構成
/app
page.tsx
layout.tsx
/cast
/cast/[slug]
/shift
/gallery
/news
/system
/access
/faq
/reserve
/recruit
/recruit/cast
/recruit/staff

---

4 コンポーネント構造 (/components)

- Header / Footer / CTAStack / SectionTitle / PlaceholderImage
- CastCard / CastGrid / CastProfile
- ShiftTable / GalleryGrid / NewsCard / SystemPriceTable
- RecruitSection / NightStyleQuiz

---

5 画像プレースホルダ設計

- 画像はすべてPlaceholderImageコンポーネントを通す
- props: placeholderId / ratio / alt

---

6 データベース設計
6.1 Cast: id, name, slug, tags, intro, imageIds, isToday, joinedAt, isVisible
6.2 Shift: id, date, castIds
6.3 News: id, title, body, imageId, publishedAt
6.4 Gallery: id, category, imageId
6.5 SiteSettings: todayMood, vipAvailability
6.6 RecruitContent: type, title, content
6.7 FormSubmissions: id, type, payload, createdAt

---

7 API設計
7.1 Cast API: GET /api/cast, GET /api/cast/[slug]
7.2 Shift API: GET /api/shift/today, GET /api/shift/week
7.3 News API: GET /api/news, GET /api/news/[id]
7.4 Gallery API: GET /api/gallery
7.5 Form API: POST /api/reserve, POST /api/recruit/cast, POST /api/recruit/staff

---

8 フォーム設計
8.1 予約フォーム: name, date, time, people, firstVisit, purpose, castName, contact, message
8.2 キャスト応募: name, age, contact, experience, schedule, message
8.3 スタッフ応募: name, age, contact, position, experience, schedule, message

---

9 SEO設計

- meta title / meta description
- 構造化データ: LocalBusiness

---

10 パフォーマンス

- 画像最適化 / lazy loading / code splitting

---

11 セキュリティ

- CSRF対策 / XSS対策 / 管理画面認証

---

12 ログ

- フォーム送信ログ / 応募ログ

---

13 管理画面

- Cast管理 / Shift管理 / News管理 / Gallery管理 / 求人管理

---

14 画像管理
プレースホルダIDで管理

- hero_chandelier / cast_01 / gallery_vip_01

---

15 デプロイフロー

- GitHub -> Vercel build -> CDN配信

---

16 CI/CD

- main branch deploy / preview deploy

---

17 受け入れ基準

- サイト表示高速
- SEO対応
- モーション正常
- 管理画面更新可能
- 求人応募送信可能
- 予約送信可能
