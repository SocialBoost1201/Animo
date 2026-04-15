# Task Intake and Routing — Animo

> 対象: Antigravity / Codex / Claude Code
> 更新: 2026-04-14

---

## ワークフロー概要

新規タスクを受け取ったとき、このワークフローに従ってルーティングを決定する。

---

## Step 1: タスク分類

受け取ったタスクを以下の4種類に分類する：

| 種別 | 判断基準 | 担当 |
|---|---|---|
| **設計・構成・方針** | UI設計・アーキテクチャ決定・ドキュメント | Antigravity |
| **実装・コード変更** | ファイル編集・diff生成・リファクタ | Codex |
| **分析・監査** | 横断レビュー・品質確認・深堀り調査 | Claude Code |
| **複合タスク** | 設計+実装が混在 | Antigravity → Codex の分担 |

---

## Step 2: スコープ確認

タスク着手前に以下を確認する：

```
[ ] 問題・ゴールが明確か
[ ] 対象ファイルが特定されているか
[ ] 禁止事項（app code / schema / env）に抵触しないか
[ ] このリポジトリのスコープ内か
```

いずれかが NO の場合 → **即時停止してユーザーに確認**

---

## Step 3: 実行フロー

```
Analysis → Plan → Approval → Execution → Verification
```

1. **Analysis**: 対象コードを読み、影響範囲を特定
2. **Plan**: 実装計画を提示（変更ファイル・内容・使用Skill）
3. **Approval**: ユーザーの明示的な承認を待つ
4. **Execution**: 承認されたスコープのみ実施
5. **Verification**: 検証コマンド実行・結果を記録

---

## Step 4: 完了報告

```markdown
## 完了報告

### 変更ファイル
- `path/to/file.ts`

### diff
（変更前/変更後 または patch 形式）

### 検証
- コマンド: `pnpm lint && pnpm build`
- 結果: PASS / FAIL

### Skill Usage Report
- 使用: skill-name（理由）
- 未使用: なし
```

---

## Animo 固有チェックポイント

- AI エンドポイント追加時 → Upstash Rate Limit の実装を必ず確認
- Three.js 変更時 → `dynamic import + ssr: false + Suspense` パターンを維持
- Supabase 変更時 → RLS ポリシーへの影響を確認
