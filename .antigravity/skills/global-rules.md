# global-rules.md — Animo

> グループ: **B（SocialBoost / テック系）**  
> 最終更新: 2026-03-19

---

## 1. ブランドアイデンティティ

### カラーシステム

| 役割 | HEX | 用途 |
|------|-----|------|
| プライマリブルー | `#0040FF` | プライマリCTA・ブランドカラー |
| ダークネイビー | `#0D2E57` | ヘッダー・フッター・深い背景 |
| アクセント | `#00CFFF` | グロー・ハイライト |
| 背景（ダーク） | `#0A0E1A` | ダークモード背景 |
| 背景（ライト） | `#F0F4FF` | ライトモード背景 |
| テキスト | `#0D1A2E` | 本文（ライト）|

### Tailwind v4 カラー定義
```css
@theme {
  --color-brand-primary: #0040FF;
  --color-brand-dark:    #0D2E57;
  --color-brand-accent:  #00CFFF;
  --color-bg-dark:       #0A0E1A;
  --color-bg-light:      #F0F4FF;
  --color-text-base:     #0D1A2E;
}
```

### ブランドトーン
- AIを活用した業務効率化・自動化ツールとしての先進性
- 「使ってみて驚く」体験を設計する意識
- 難しいAI機能をわかりやすく・直感的に見せる

---

## 2. デザインシステム

### 基本方針
- **近未来的・テクノロジカルなビジュアル**
- ダークモード推奨（`next-themes` 相当の仕組みを利用する場合）
- グリッドライン・サイバー感のある区切り
- ガラスモーフィズム（`backdrop-blur`）を適所で使用

### ガラスモーフィズムパターン
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## 3. アニメーション（GSAP + Lenis + Framer Motion + Three.js/R3F）

このプロジェクトは `gsap@^3.14` / `lenis@^1.3` / `framer-motion@^12` / `three@^0.183` / `@react-three/fiber@^9` / `@react-three/drei@^10` / `embla-carousel@^8.6` を使用。

### スピーディーなホバーインタラクション
```tsx
// ボタン・カード全般
<motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(0, 64, 255, 0.5)" }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 500, damping: 25 }}
/>
```

### テキストスライドイン（キレよく）
```tsx
export const slideUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}
```

### Three.js / R3F 利用ルール
```tsx
// Canvas は必ず遅延ロード
import dynamic from "next/dynamic"
const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false })

// Canvas の GPU負荷を下げるための設定
<Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }}>
```

### Embla Carousel（Autoplay付き）
```tsx
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

const [ref] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })])
```

---

## 4. フォント

| 要素 | フォント |
|------|---------|
| 見出し | Inter + Noto Sans JP |
| 本文 | Noto Sans JP |
| 数値・英字强調 | Inter（Tabular Nums） |

---

## 5. 技術スタック最適化パターン

**スタック**: Next.js 16 / React 19 / AI SDK / GSAP / Lenis / Three.js / R3F / Supabase / TipTap / Tailwind CSS v4

### AI SDK 利用ルール
```ts
// Vercel AI SDK v6 — ストリーミングレスポンス
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"

// Rate Limitは必ずUpstashで管理
import { Ratelimit } from "@upstash/ratelimit"
```

### Supabase 認証
```ts
import { createServerClient } from "@supabase/ssr"
// cookieStoreベースのSSR認証パターンのみ使用
```

### TipTap エディター
```tsx
// StarterKit + カスタム拡張を使う場合は必ず "use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
```

### DnD Kit (ドラッグ&ドロップ)
```tsx
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
// アクセシビリティのため KeyboardSensor も必ず設定する
```

---

## 6. コンポーネント設計ルール

- `src/components/ui/` → 汎用UI
- `src/components/three/` → Three.js関連（ssr: false 必須）
- `src/components/editor/` → TipTap関連
- `any` 型の使用禁止
- `console.log` の本番コードへの混入禁止
- 画像は `next/image` を必ず使用

---

## 7. セキュリティ

- Upstash Rate Limit を全APIエンドポイントに適用
- Supabase RLS を全テーブルに設定
- AI APIへのユーザー入力はXSSサニタイズ後に送信

---

## 8. アニメーション アクセシビリティ基準（2026追加）

### useReducedMotion 必須ルール

```tsx
// lib/motion.ts
"use client"
import { useReducedMotion } from "framer-motion"

export function useMotionSafe() { return !useReducedMotion() }

// R3F（Three.js）でのreduced-motion対応
export function useR3FMotionConfig() {
  const prefersReduced = useReducedMotion()
  return {
    animationSpeed: prefersReduced ? 0 : 1,
    enableParticles: !prefersReduced,
  }
}
```

```tsx
"use client"
import { motion, useReducedMotion } from "framer-motion"
export function SlideUp({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={prefersReduced ? {} : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
    >{children}</motion.div>
  )
}
```

### Suspense による重エフェクトの遅延

```tsx
import { Suspense } from "react"
import dynamic from "next/dynamic"
// R3F Canvas は必ずSuspense + dynamic import（最優先ルール）
const ThreeCanvas = dynamic(() => import("@/components/three/Canvas"), { ssr: false })
<Suspense fallback={<div className="bg-bg-dark animate-pulse h-96 rounded-lg" />}>
  <ThreeCanvas />
</Suspense>
```

### パフォーマンス基準
- AI API呼び出し中のローディングUIもアニメーションを `useReducedMotion` で制御する
- LCP要素にアニメーション禁止・Lighthouse Performance 90+ 維持

---

## Tailwind CSS v4 アニメーション定義（2026追加）

> このプロジェクトはTailwind CSS v4（`@tailwindcss/postcss`使用）のため、`globals.css` に直接定義する。

### app/globals.css への追記

```css
/* =============================================
   2026: Shimmer・Floating・Glow アニメーション
   ============================================= */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

@keyframes floating-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-5px) rotate(0.4deg); }
  66%       { transform: translateY(-2px) rotate(-0.3deg); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(0, 64, 255, 0.3); }
  50%       { box-shadow: 0 0 24px rgba(0, 64, 255, 0.7); }
}

@keyframes slide-in-left {
  0%   { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* =============================================
   Shimmer グラデーション共通ユーティリティ
   スケルトンUIに適用: className="animate-shimmer shimmer-bg"
   ============================================= */
@utility shimmer-bg {
  background: linear-gradient(
    90deg,
    theme(colors.gray.200) 25%,
    theme(colors.gray.100) 50%,
    theme(colors.gray.200) 75%
  );
  background-size: 200% 100%;
}

/* ============
   アニメーション
   ============ */
@utility animate-shimmer       { animation: shimmer 1.8s linear infinite; }
@utility animate-floating      { animation: floating 3.5s ease-in-out infinite; }
@utility animate-floating-slow { animation: floating-slow 8.0s ease-in-out infinite; }
@utility animate-glow-pulse    { animation: glow-pulse 2.5s ease-in-out infinite; }
@utility animate-slide-in-left { animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
```

### 使用例

```tsx
// スケルトンローディング
<div className="animate-shimmer shimmer-bg h-48 rounded-lg" />

// 浮遊するアイコン・バッジ
<div className="animate-floating">
  <Icon />
</div>

// CTAボタンのグロー
<button className="animate-glow-pulse bg-brand-primary text-white px-6 py-3 rounded-lg">
  今すぐ始める
</button>
```

