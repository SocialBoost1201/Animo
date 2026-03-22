# UI/UX Global Rules Violation Report

- Project: Animo
- Generated: 2026-03-20T00:13:15.986Z
- Scope: UI files (176 files)
- Method: static analysis (regex-based heuristic)

## Critical

- なし

## High

1. absolute指定の過多
- 判定理由: absolute系記述が 80 件。重なり/改行崩れ/保守性低下の高リスク。
- 根拠:
- Animo/app/(cast)/cast/dashboard/page.tsx:119 `<div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>`
- Animo/app/(cast)/cast/register/page.tsx:51 `<div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center">`
- Animo/app/(public)/cast/[slug]/opengraph-image.tsx:58 `position: 'absolute',`
- Animo/app/(public)/cast/[slug]/page.tsx:79 `<div className="absolute top-4 right-4 z-20">`
- Animo/app/(public)/cast/[slug]/page.tsx:165 `<span className="absolute top-4 left-4 text-4xl text-gold opacity-20 leading-none">&ldquo;</span>`
- Animo/app/(public)/cast/[slug]/posts/[postId]/page.tsx:113 `<User className="absolute inset-0 m-auto text-gray-300 w-5 h-5" />`
- Animo/app/(public)/cast/page.tsx:61 `<div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent pointer-events-none h-[50vh]" />`
- Animo/app/(public)/cast/page.tsx:115 `<div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-20">`

## Medium

1. 行間不足の疑い
- 判定理由: line-height が詰まる指定を 2 件検出。可読性低下の可能性。
- 根拠:
- Animo/app/globals.css:108 `line-height: 1.45 !important;`
- Animo/app/globals.css:118 `line-height: 1.45 !important;`

## Low

- なし

## Notes

- このレポートは静的解析ベースのため、最終判断は実機表示（1920/1440/1024/768/430/390/375）で確認すること。
- Fixed要素・重なり・改行崩れは、実際のDOM/表示幅で再検証すること。
