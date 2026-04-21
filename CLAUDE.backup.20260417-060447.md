# CLAUDE.md — Animo（技術エージェント向け憲法）

> 最終更新: 2026-03-19 | Package Manager: pnpm | Node: >=18.0.0

---

## コマンド一覧

```bash
pnpm dev           # 開発サーバー起動
pnpm build         # next build
pnpm start         # 本番サーバー起動
pnpm lint          # ESLint
```

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| Framework | Next.js 16.x (App Router) |
| React | 19.x |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 / GSAP 3 / Lenis |
| 3D | Three.js / @react-three/fiber / @react-three/drei |
| UI | Embla Carousel |
| Editor | TipTap v3 |
| DnD | @dnd-kit/core |
| Push | web-push |
| AI | Vercel AI SDK v6 (@ai-sdk/openai / @ai-sdk/google) |
| Auth | Supabase Auth (SSR) |
| Rate Limit | Upstash Redis + Ratelimit |

---

## TypeScript 規約

```ts
// AI SDK v6 ストリーミング
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// TipTap エディター（"use client" 必須）
import { useEditor, EditorContent } from "@tiptap/react"

// DnD Kit（アクセシビリティ: KeyboardSensor 必須設定）
import { DndContext, closestCenter, KeyboardSensor, PointerSensor } from "@dnd-kit/core"
```

---

## PPR & 最適化

```ts
// next.config.ts
experimental: { ppr: true }
images: { formats: ["image/avif", "image/webp"] }
// Three.js Canvas は必ず SSR: false + Suspense でラップ
```

---

## セキュリティ

- Upstash Rate Limit を AI API エンドポイント全体に適用
- Supabase RLS 全テーブルに設定
- Cloudflare Turnstile をユーザー登録・お問い合わせに実装
- ユーザー入力の AI 送信前に XSS サニタイズを必ず実施

---

## エラー解決

```bash
# AI SDK ストリーミングエラー → "use client" + useChat フックの確認
# web-push の VAPID キー → .env.local に NEXT_PUBLIC_VAPID_KEY / VAPID_PRIVATE_KEY 設定
# TipTap SSR エラー → dynamic import + ssr: false でラップ
```
