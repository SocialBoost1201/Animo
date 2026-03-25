# UI Architecture Foundation

## Goal

キャスト側と管理側の新機能を追加しても、見出し、余白、カード、CTA、状態表示が画面ごとに崩れないようにする。

## Design Principles

1. 1画面1主目的を守る
2. ページ上部で目的と次アクションを明示する
3. セクションはカード単位で整理し、余白は 8px ベースで統一する
4. キャスト側はスマホ最優先、管理側は一覧性最優先
5. 派手な装飾より、静かな高級感と即読性を優先する

## Shared UI Contract

### `PageShell`

- 画面全体の横幅と余白を管理する
- `narrow`, `default`, `wide`, `full` の4段階
- 画面ごとに `max-w-*` を直接書かない

### `PageHeader`

- H1、説明文、主要アクションを一箇所にまとめる
- H1 は `clamp()` 前提で運用する
- 画面の主目的をここで説明する

### `SectionCard`

- 情報ブロックを囲う標準コンテナ
- `default`, `subtle`, `accent`, `danger` のトーンで運用する
- 主要な機能単位は基本的にこのカード内に収める

### `SectionHeader`

- セクションタイトル、補足説明、補助操作を統一する
- セクションの責務が曖昧にならないようにする

### `StatCard`

- KPI やサマリー数値を統一表示する
- 数値、ラベル、補足情報の順序を固定する

### `EmptyState`

- データがないときの説明と次アクションを明示する
- 「空です」で終わらせず、次に何をすべきかを示す

### `StatusBadge`

- `neutral`, `success`, `warning`, `danger`, `accent`
- ステータス色をページごとに独自実装しない

## Page Rules

### Cast Pages

- `PageShell width="narrow"` を基本にする
- 最初に `PageHeader` を置く
- フォームは1機能1カードに分ける
- 主CTAは画面下部で固定または視認しやすい位置に置く

### Admin Pages

- `PageShell width="wide"` を基本にする
- 上部に `PageHeader` を置き、主要操作は右側へ寄せる
- 比較が必要な情報はカードだけでなくリスト・表を使う
- 「今日」「承認待ち」「異常値」を上部に集約する

## Implementation Notes

- 新規ページ追加時は、まず `PageShell` と `PageHeader` から組み立てる
- 既存ページ改修時は、見出し・余白・カードだけでも共通部品に寄せる
- 業務ロジックの追加より先に、UI骨格を shared components に乗せる
- route ごとの独自スタイルを増やしすぎない

## Next Candidates

1. `TodayDashboard` 内部セクションを `SectionCard` に寄せる
2. キャスト側の各フォームに共通 `FieldGroup` を追加する
3. 管理画面の一覧系に共通 `DataPanel` を追加する
4. feature flag ごとに表示切替してもレイアウトが壊れないようにする
