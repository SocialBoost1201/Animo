# Club Animo Webサイト 詳細設計書

**ドキュメントID:** detail-design-01  
**受領日時:** 2026-03-06

---

## 0. 目的

基本設計書に基づき、Antigravityが実装できる粒度まで詳細化した設計仕様を定義する。
**最重要方針:**

- シャンデリアを象徴としたブランド体験
- 最先端サイトとしてのモーション設計
- 顔出し不可キャストでも成立するUI
- 求人導線の強化
- 画像差し替え前提の空ブロック設計（ID指定）

---

## 1. ページレイアウト仕様

### 1.1 共通レイアウト

- **Header:** Logo / Global Navigation / CTA Buttons
- **Main Content:** Section blocks
- **Footer:** Access / SNS / Recruit links / Policy
- **Sticky CTA:** Phone / Reservation / Instagram

### 1.2 レスポンシブ設計

- **Desktop:** 1200px以上
- **Tablet:** 768px〜1199px
- **Mobile:** 767px以下（縦スクロール中心設計）

---

## 2. トップページ詳細構造

### 2.1 Heroセクション

- **目的:** シャンデリアを最初に見せる
- **構造:** HeroContainer > HeroImagePlaceholder / HeroOverlay / HeroCopy / HeroCTA
- **HeroImagePlaceholder:** ID `hero_chandelier` / Aspect ratio 16:9
- **CTA:** 予約 / 本日出勤
- **アニメーション:** 画像フェードイン（ロード時） / テキストリビール / ゆっくりズーム（スクロール時）

### 2.2 Today Cast

- **コンポーネント:** TodayCastSection > CastCardCarousel
- **CastCard構成:** image placeholder / name / tag / today badge
- **アニメーション:** カードスタッガー表示

### 2.3 Concept Section

- **内容:** シャンデリア・広い空間・富裕層客層
- **コンポーネント:** TextBlock / ImageBlock placeholder

### 2.4 Gallery Preview

- **構造:** GallerySection > GalleryCard
- **カテゴリ:** chandelier / vip / floor

### 2.5 System Preview

- **構造:** SystemSummaryCard
- **表示:** セット料金 / 延長 / 指名（※ボトル価格非表示）

### 2.6 Night Style診断

- **UI:** QuizStep / OptionButton
- **質問例:** 「今日はどんな目的ですか」（接待 / 会話 / 盛り上がり）
- **結果:** CastRecommendation（推薦キャスト表示）

### 2.7 Recruit Teaser

- **カード:** Cast Recruit / Staff Recruit
- **CTA:** 応募ページへ

---

## 3. キャストページ設計

### 3.1 Cast List

- **コンポーネント:** CastFilterBar / CastGrid / CastCard
- **フィルタ項目:** 雰囲気 / 来店目的 / 新人 / 本日出勤

### 3.2 Cast Card（顔出し不可対応）

- **要素:** image placeholder / name / tags / today badge
- **Placeholder ratio:** 4:5

### 3.3 Cast Detail

- **構造:** Hero Image (placeholder) / Profile Section / Gallery (placeholder複数) / Shift info / Favorite Button / Reservation CTA

---

## 4〜11. 各ページ詳細レイアウト仕様

### 4. 出勤ページ

- Today Tab（今日のキャスト） / Week Tab（週間表示）

### 5. Gallery

- **カテゴリ:** chandelier / vip / floor
- **比率:** 3:2

### 6. Event / News

- **List:** NewsCard (title/date/image placeholder)
- **Detail:** Hero placeholder / RichText content

### 7. Access

- **構造:** Map placeholder / Address block / Taxi copy button / Route instructions

### 8. FAQ

- **アコーディオンカテゴリ:** 料金 / 予約 / ルール

### 9. 予約ページ（CTAフォーム連動）

- **項目:** 来店日/時間/人数/初来店/接待利用/希望キャスト/連絡先/メッセージ

### 10. キャスト求人ページ

- **構造:** Hero(placeholder) / Working Value / 仕事内容 / 待遇 / 安全方針 / FAQ / 応募フォーム
- **フォーム項目:** 名前/年齢/連絡先/経験/面談希望日

### 11. スタッフ求人ページ

- **構造:** Hero(placeholder) / 職種カード(ホール/ボーイ/店長候補/ドライバー) / 仕事内容 / 待遇 / キャリア / FAQ / 応募フォーム

---

## 12. コンポーネント仕様

- **Header:** StickyHeader
- **CastCard:** width responsive
- **PlaceholderImageBlock:** `props` = `placeholderId`, `ratio`, `alt`

---

## 13. 画像プレースホルダ仕様

**画像未設定でもレイアウトが成立すること**

- **構造:** SkeletonBlock / AspectRatioBox
- **ID命名例:** `hero_chandelier`, `cast_photo_01`, `gallery_vip_01`

---

## 14. アニメーション詳細

- **使用:** fade in / slide up / scale in / stagger list / text reveal
- **速度:** 300ms〜800ms（上品・軽量）

---

## 15. データモデル

| Entity         | 主要項目                                               |
| -------------- | ------------------------------------------------------ |
| Cast           | id, name, slug, tags, intro, images, isToday, joinedAt |
| Shift          | date, castIds                                          |
| News           | title, body, image                                     |
| Gallery        | category, image                                        |
| SiteSettings   | todayMood, vipAvailability                             |
| RecruitPosting | type, content                                          |

---

## 16. 管理画面設計

- **Dashboard:** 今日の出勤 / VIP席状況
- **CRUD:** Cast管理 / Shift管理(日付別) / News管理(投稿) / Gallery管理(追加) / Recruit管理(内容編集)

---

## 17. SEO仕様 / 18. パフォーマンス / 19. セキュリティ

- Meta data / LocalBusiness構造化データ
- 画像最適化 / lazy loading / JS軽量化
- フォームスパム対策 / 管理画面認証

---

## 20. 受け入れ基準

- シャンデリアがブランド象徴になっている
- 最先端のモーション体験がある
- キャスト顔出し無しでも成立する
- 求人ページが応募導線として機能する
- 画像未設定でもレイアウトが崩れない
- 管理画面から運用更新可能
