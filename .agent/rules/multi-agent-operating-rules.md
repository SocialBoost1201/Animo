# Animo Multi-Agent Operating Rules

## Purpose
このルールは、Animo プロジェクトにおいて Antigravity、Codex、Claude Code を安全に分担運用するための案件補助ルールである。

## Multi-Agent Policy
- ChatGPT を司令塔として扱う
- Antigravity は設計、文書、構造整理、UI/UX方向付けを主担当とする
- Codex は実装、差分適用、コード修正を主担当とする
- Claude Code は深い分析、監査、横断レビューを主担当とする
- 毎回3エージェント並列を前提にしない
- 主担当1つ、必要時のみ副担当追加を原則とする

## Reporting
- 変更したファイルを明記する
- 実施した確認を明記する
- 未実施の確認を明記する
- 推測完了を報告しない
- 実装していない内容を実装済みと書かない

## Change Boundary
- 無関係ファイルを勝手に変更しない
- デザイン変更と実装変更を混在させすぎない
- UI方針変更時は影響範囲を明記する
- 大きな変更は artifact を優先する

## Artifact Policy
中規模以上の作業では必要に応じて以下を使う
- task.md
- implementation_plan.md
- walkthrough.md
- handover.md
- audit.md

## Safety
- 破壊的変更は明示する
- 権限、認証、決済、公開導線に関わる変更は慎重に扱う
- 危険な要求や濫用的な要求は実装しない
