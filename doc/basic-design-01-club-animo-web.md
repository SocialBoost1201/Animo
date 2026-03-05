# Club Animo Webサイト 基本設計書

**ドキュメントID:** basic-design-01  
**受領日時:** 2026-03-06

---

## 0. 目的と範囲

要件定義に基づき、画面構成、導線、コンポーネント、データ構造、更新運用、非機能、実装方針を基本設計として確定する。

---

## 1. 画面構成 サイトマップ（全14画面）

### 1.1 画面一覧

1. Top
2. Concept
3. System（料金）
4. Cast 一覧
5. Cast 詳細
6. Shift（出勤表）
7. Gallery
8. Event / News 一覧
9. Event / News 詳細
10. Access
11. FAQ
12. Reserve / Contact
13. Recruit Cast（キャスト求人）
14. Recruit Staff（スタッフ求人）

### 1.2 共通要素

- グローバルナビ / 固定CTA（予約・電話・Instagram・問い合わせ） / フッター
- 【任意】パンくずリスト（SEO要件次第）
- 共通SEOメタ生成

---

## 2. 画面設計 詳細（主要画面抜粋）

### 2.1 Top

- **目的:** 3秒で店格と売り（シャンデリア・明るい高級空間）を理解させ、本日出勤・料金・予約への最短導線を提示する
- **セクション:**
  - Hero（シャンデリア主役シネマ動画/写真 + CTA）
  - Today Shift（モバイル横スクロール）
  - Concept（短文）
  - Gallery Preview（シャンデリア・VIP・フロア）
  - System Preview（要点のみ）
  - Night Style 診断
  - Event / News Preview（最新3件）
  - Access Preview（Map + 住所コピー + CTA）
  - Recruit Teaser（2CTA）
- **必須アニメーション:** Heroテキストリビール・ゆっくりズーム / セクション出現（フェード・スライド） / カードスタッガー / 段階表示

### 2.2 System（料金）

- **構成:** 基本システム（セット・延長・指名等） / ケース別合計目安（ボトル代別表記・横スワイプ対応） / 注意事項
- **アニメーション:** 料金ブロック段階表示 / 数字カウントアップ（軽量）

### 2.3 Cast一覧 / Cast詳細（顔出し不可対応）

- **一覧構成:** フィルタ（雰囲気・目的・新人・本日出勤） / グリッド表示 / ランキング（任意）
- **一覧カード:** プレースホルダ（後ろ姿） / 源氏名 / タグ（2つ） / 本日出勤・新人バッジ
- **詳細構成:** メインビジュアル / 写真ギャラリー / プロフィール（接客タイプ・趣味・ひとこと等） / 出勤予定 / お気に入り登録 / 【この子を希望】予約CTA
- **アニメーション:** カードスタッガー / フィルタ並び替え / ギャラリースムーズ切替

### 2.4 Recruit（求人：キャスト・スタッフ）

- **狙い:** 応募の不安払拭・体験入店獲得（キャスト） / スタッフ不足解消の最重要導線（スタッフ）
- **構成:** 働く価値・環境 / 職種別仕事内容 / 1日流れ / 待遇・安心安全 / フォーム常設
- **アニメーション:** 待遇段階表示 / 応募CTA追従 / ストーリー展開スクロール連動 / プログレス表示

---

## 3. コンポーネント設計

### 3.1 共通コンポーネント

- Header / GlobalNav / CTAStack / Footer / SectionTitle / RichTextBlock / PlaceholderImageBlock / Card / TagChip / Accordion / Tabs / Modal / Toast

### 3.2 ドメインコンポーネント

- CastCard / CastGrid / CastProfile / ShiftTable / SystemPriceTable / CasePriceCard / GalleryGrid / NewsCard / MoodBadge / VipAvailabilityBadge / NightStyleQuiz

---

## 4. 画像プレースホルダ設計

- **基本仕様:** 全画像は `PlaceholderImageBlock` 経由 / 管理画面のID紐付け / 画像未設定時はスケルトン表示
- **主要比率:** Hero(16:9) / CastCard(4:5) / Gallery(3:2) / RecruitHero(16:9) / News(16:9)

---

## 5. モーションシステム 基本設計

- **原則:** ページ全体で一貫 / 小さな動きを重ねて体験化 / 表示速度優先 / motion-reduced対応
- **使用:** Fade in up / Slide in / Text reveal / Scale in / Parallax lite / Stagger list / Layout shift
- **禁止:** 強い回転 / 激しい点滅 / 画面揺れ / 重い3D

---

## 6. データ設計（エンティティ）

1. `Cast` (id, name, tags, type, images_placeholderIds, isVisible, isToday 等)
2. `Shift` (id, date, castIds, timeRange)
3. `News` (id, title, publishedAt, heroImagePlaceholderId等)
4. `GalleryAsset` (category: chandelier/vip/floor, placeholderId)
5. `SystemPlan`
6. `SiteSetting` (todayMood, vipAvailability)
7. `RecruitPosting` (type: cast/staff, sections, placeholderId等)
8. `FormSubmission` (type, payload)

---

## 7. 管理画面 基本設計

- **画面:** ダッシュボード / キャスト管理 / 出勤管理 / ニュース管理 / ギャラリー管理 / サイト設定 / 求人管理 / 画像プレースホルダ管理 / 送信一覧
- **操作性:** 1画面で本日出勤更新 / 直感的な画像差し替え / リッチテキストセクション機能

---

## 8. 非機能設計

- Core Web Vitals重視 / 画像最適化 / 遅延読み込み / フォームスパム対策 / SEO（メタ・構造化データ）

---

## 9. 受け入れ基準

- トップのシャンデリア象徴成立 / 安っぽくない白基調高級感 / 全ページでのアニメーション体験 / 顔なしキャスト選び成立 / 求人の摩擦減 / プレースホルダレイアウト維持 / 管理画面更新の容易さ / スマホ30秒予約
