# Animo AGENTS.md Diff Audit

## Existing File Summary

既存の `AGENTS.md` は全24行・900バイト。非常に簡潔なミニマル構成。
以下の4セクションのみ定義されている。

- Non-negotiable rules（5項目）
- Local pointers（2項目）
- Agent boundaries（3行）
- Context rules（3行）

内容の品質は「存在はしているが、プロダクション運用基準としては薄い」状態。
新規案は22セクション・詳細定義付きで、既存より大幅に充実している。

---

## Keep（維持）

| 項目 | 理由 |
|------|------|
| Non-negotiable rules > Plan-first（承認待ち原則） | 新規案の Section 2（Authority Order）と実質同義。既存の表現は簡潔で使いやすい |
| Non-negotiable rules > Minimal diff（最小変更） | 新規案 Section 14（Implementation Style）の「use the smallest safe diff」と一致 |
| Non-negotiable rules > No unrelated refactor | 新規案 Section 14 に対応。現行の表現も有効 |
| Non-negotiable rules > Evidence（コマンド確認・ファイル明記） | 新規案 Section 17（Completion Report）に対応。現行の明記方式も保持すべき |
| Context rules > Only load files within this project | 新規案 Section 18（Skill Usage Policy）の趣旨と一致 |

**維持候補: 5件**

---

## Add（追加候補）

| 項目 | 理由 |
|------|------|
| Purpose（Section 1） | 既存には「なぜこのファイルがあるか」の説明が一切ない |
| Authority Order（Section 2） | 法・GEMINI.md・本ファイル・rules等の優先順位が既存にない |
| Definition of Done（Section 4） | 既存には完了条件の定義がない。推測完了を防ぐために必須 |
| Required Reporting Language（Section 5） | 日本語要件が既存に明記されていない |
| Project Overview（Section 6） | プロジェクト概要・対象ユーザー・成功指標が既存にない |
| Tech Stack（Section 7） | 承認済みスタックの一覧が既存にない |
| Repository Structure（Section 8） | ディレクトリ責任の定義が既存にない |
| Non-Negotiable Constraints（Section 9） | URL構造・認証・ルーティング等の変更禁止事項が既存にない |
| UI/UX Rules（Section 10） | 既存は「UI preservation」の1行のみ。新規案は原則を定義 |
| Copy / Content Rules（Section 11） | 既存に一切なし |
| SEO / AI Search Rules（Section 12） | 既存に一切なし |
| Data Design Rules（Section 13） | 既存に一切なし |
| Validation Rules（Section 15） | 既存の「verify with commands」は1行のみ。変更種別ごとの検証要件がない |
| Required Artifacts（Section 16） | 既存に一切なし |
| Completion Report Requirements（Section 17） | 既存に一切なし |
| Forbidden Behaviors（Section 20） | 既存に一切なし |
| Review and Maintenance（Section 21） | このファイル自体の更新ルールが既存にない |
| Final Principle（Section 22） | 既存に一切なし |

**追加候補: 18件**

---

## Revise（修正候補）

| 項目 | 理由 |
|------|------|
| Agent boundaries | 既存は「Codex: implementation only / Claude: analysis/audit only / Antigravity: UI/UX only」の3行。新規案は Section 2 で優先順位付きの権威順序と組み合わせており、より明確で安全 |
| Local pointers（CLAUDE.md・.claude/rules/ への言及） | まだ Claude Code worktree（frosty-austin）が残存している状況での参照先として、`.agent/rules/` の方が現在の構成に合致している可能性がある。参照先の整合性確認が必要 |
| Non-negotiable rules > UI preservation | 「unless explicitly requested」の1行。新規案 Section 10 は原則として何を守るべきかを具体化しており、より実行可能 |

**修正候補: 3件**

---

## Remove（削除候補）

| 項目 | 理由 |
|------|------|
| Local pointers > `.claude/rules/` and `.claude/skills/` | 現在の `.agent/rules/` と `.agent/workflows/` への移行が完了しているなら、`.claude/` 配下への参照は旧構成の残存であり、混乱を招く可能性がある |

**削除候補: 1件**（ただし `.claude/` 配下が今も利用中であれば削除不要）

---

## Top Priority Changes

1. **Definition of Done を追加する**
   既存には完了条件の定義が一切ない。推測完了・曖昧な報告が発生しやすい最大の空白。

2. **Authority Order（優先順位順序）を追加する**
   GEMINI.md・本ファイル・rules/ の優先順位が不明確なままでは、エージェント間の判断基準にぶれが生じる。

3. **Required Reporting Language（日本語必須）を追加する**
   現行ファイルには言語要件の記述が一切なく、英語で報告されても発見が遅れる。

4. **Validation Rules を拡充する**
   既存の「verify with commands」は1行のみ。コード変更・UI変更・認証変更ごとに何を確認すべきかが定義されていない。

5. **Local pointers の参照先の整合性を確認する**
   `.claude/rules/` と `.agent/rules/` が混在している。現在の正規参照先を一本化し、旧参照先を削除または注記すべき。

---

## Recommended Next Action

1. 既存の `AGENTS.md` を新規案でそのまま上書きするのではなく、**既存の5項目（維持候補）を保持しつつ**、不足する18セクションをマージした統合版を作成することを推奨する。
2. **Local pointers の `.claude/` 参照先が現在も有効かどうか**を確認してから、削除候補の適用を判断する。
3. 上記確認後に、改訂版 `AGENTS.md` の新規案（差分統合済み）をAntigravityが作成し、ユーザーが承認した上で上書きする。
