# CODEX.md — Animo（事業エージェント向け文脈）

> 最終更新: 2026-03-19 | グループ: B（テック系）

---

## Project Goal（事業の目的）

**「AIと動的コンテンツで、チームの『伝える力』を最大化する」**

プレゼンテーション・社内共有・対外提案など「情報を動的に整理・共有する」場面で、
AI補助による構造化・リアルタイム共同編集・アニメーション付きエクスポートを提供する
次世代コラボレーションツール。

ターゲット: デザイン・マーケティング・コンサル・スタートアップのチーム
差別化: 「静的スライド」ではなく「動くコンテンツとして共有できる」点

---

## Brand Identity

**「AI × アニメーション × 速さ」**
- 電気ブルー（#0040FF）＋ダークネイビー（#0D2E57）
- R3F/Three.js を使った3Dバックグラウンドで「次世代感」
- ホバーで即反応・スプリングアニメーション・グロー効果

---

## AEO（JSON-LD）ルール

```tsx
// SoftwareApplication（自社ツールページ）
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Animo",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "priceCurrency": "JPY" },
}
// FAQPage（料金・機能に関するFAQ）
{ "@type": "FAQPage", "mainEntity": [...] }
```

---

## プライバシー・個人情報ルール

- **AI生成コンテンツ**: ユーザーが作成した資料をAI学習に使用することは禁止
- ユーザーデータはSupabase RLSで厳格に保護（他ユーザーのデータへのアクセス禁止）
- web-push の購読情報は明示的な同意取得後のみ保存
- Cloudflare Turnstile をサインアップフォームに実装
- AI API への送信データにPII（個人識別情報）が含まれないよう前処理を実施

---

## PPR & Edge

```ts
experimental: { ppr: true }
// ダッシュボードシェル（ナビ・サイドバー）→ 静的
// コンテンツカード・AI生成結果 → 動的（Suspense）
images: { formats: ["image/avif", "image/webp"] }
```
