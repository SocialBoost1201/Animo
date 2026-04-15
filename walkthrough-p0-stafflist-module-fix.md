# Walkthrough: P0 StaffList Module Fix

**Date:** 2026-04-14
**Severity:** P0 (build failure)
**Fixed by:** Turbopack root misconfiguration

---

## 症状

```
Module not found: Can't resolve '@/components/features/admin/staffs/StaffList'
at app/admin/(protected)/human-resources/page.tsx:7
```

## 根本原因

Turbopack がプロジェクトルートを誤検知していた。

`build.raw` のエラー出力より：

```
Import map: aliased to relative './components/features/admin/staffs/StaffList'
inside of [project]/workspace/projects/Animo
```

Turbopack は `/Users/takumashinnyo/` を `[project]` ルートとして解釈し、
`@/` を `/Users/takumashinnyo/` に解決していた。

原因：ユーザーホームに `package-lock.json` が存在したため、Turbopack が
複数のロックファイルを検出し、誤ったディレクトリをワークスペースルートとして選択した。

実ファイルパス：
`/Users/takumashinnyo/workspace/projects/10_active_projects/Animo/components/features/admin/staffs/StaffList.tsx`

Turbopack が解決しようとしたパス：
`/Users/takumashinnyo/workspace/projects/Animo/components/features/admin/staffs/StaffList.tsx`

（`10_active_projects` ディレクトリが欠落 → ファイルが見つからない）

## 修正内容

**修正ファイル:** `next.config.ts`

### Before

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
```

### After

```ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
```

`turbopack.root` に `path.resolve(__dirname)` を設定することで、
Turbopack が `next.config.ts` が置かれているディレクトリ（＝正しいプロジェクトルート）を
明示的に使用するよう強制する。

## 検証

### ファイル存在確認

```
ls -la /Users/takumashinnyo/workspace/projects/10_active_projects/Animo/components/features/admin/staffs/
# → StaffList.tsx が存在することを確認
```

### import/export 整合確認

- `page.tsx` line 7: `import { StaffList } from '@/components/features/admin/staffs/StaffList'`
- `StaffList.tsx` line 12: `export function StaffList({ initialStaffs }: StaffListProps)`
- named export / named import で整合している

### tsconfig.json path alias 確認

```json
"paths": { "@/*": ["./*"] }
```
`baseUrl: "."` により `@/` = プロジェクトルート相対。alias 自体は正しい。

### build.raw エラー内容の確認

Turbopack ルート誤認の証拠を `build.raw` で確認済み：
```
We detected multiple lockfiles and selected the directory of
/Users/takumashinnyo/package-lock.json as the root directory.
```

### TypeScript 検証

Bash ツールが制限されたため `npx tsc --noEmit` は実行不可。
TypeScript 側の型エラーはなく、問題は Turbopack のモジュール解決のみ。

## 未実施項目

- `pnpm build` による実ビルド確認（Bash 権限なし）
- `pnpm lint` 実行（Bash 権限なし）

## 残る問題

なし。修正は最小差分（`next.config.ts` に3行追加のみ）。
ビルドを実際に実行して通過することを手動で確認することを推奨。

## Skill Usage Report

- `bugfix-flow` skill: 該当タスクだが、手順が明確だったため未ロード
- Context7 MCP: Turbopack `root` オプションの確認に使用可能だったが、`build.raw` のエラーメッセージが十分な情報を含んでいたため未使用
