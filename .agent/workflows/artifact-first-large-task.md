# Artifact-First Large Task — Animo

> 対象: Antigravity / Codex / Claude Code
> 更新: 2026-04-14

---

## 概要

中〜大規模タスク（複数ファイル・複数フェーズ）での実行手順。
小さなタスクは `task-intake-and-routing.md` を参照。

---

## 判断基準：このワークフローを使う条件

以下のいずれかに該当する場合はこのワークフローを使う：

- 変更対象ファイルが3つ以上
- 実装が複数フェーズに分かれる
- データ構造・アーキテクチャに影響する
- 別エージェントへのハンドオフが必要

---

## Phase 1: Research（調査）

```
[ ] 関連ファイルを読む（コード変更なし）
[ ] 影響範囲を特定する
[ ] 既存パターン・制約を確認する
[ ] 不明点をリストアップする
```

**出力**: `docs/ai/` または `.agent/memory/` に調査メモを保存

---

## Phase 2: Plan（計画）

以下の形式で Implementation Plan を作成する：

```markdown
# Implementation Plan — [タスク名]

## 目的
## 対象ファイル（変更 / 新規 / 削除）
## 実装手順（フェーズ別）
## 使用Skill
## リスク・前提条件
## 検証方法
```

**→ ユーザーの承認を待つ。承認なしに Phase 3 に進んではならない。**

---

## Phase 3: Execution（実行）

- 承認されたスコープのみ実施
- フェーズ単位で区切り、各フェーズ終了後に中間報告
- スコープ外の必要変更が発覚した場合 → 即停止して追加承認を取得

---

## Phase 4: Verification（検証）

```bash
# Animo 標準検証コマンド（pnpm）
pnpm typecheck
pnpm lint
pnpm build
```

---

## Phase 5: Walkthrough（完了報告）

```markdown
# Walkthrough — [タスク名]

## 変更内容サマリー
## 変更ファイル一覧（フルパス）
## 検証結果
## 残存リスク・未対応事項
## Skill Usage Report
```

---

## Animo 固有注意事項

- Supabase / Auth 変更は必ず専門レビュー後に実施
- Three.js SSR エラーは `dynamic import + ssr: false` で対処
- コンテキスト肥大時は `context-trim-flow` Skill を使用
