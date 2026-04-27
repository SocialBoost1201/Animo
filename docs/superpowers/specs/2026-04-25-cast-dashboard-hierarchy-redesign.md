# Cast Dashboard Hierarchy Redesign

**Date:** 2026-04-25  
**Scope:** `/cast/dashboard` only  
**Files changed:** 2 (1 modified, 1 created)  
**Status:** Approved for implementation

---

## Problem Statement

The current cast dashboard renders five `CastMobileCard` sections with uniform visual weight. Cards 2 (`翌週シフト提出`) and 3 (`今日のブログ`) share pixel-identical CTAs. The weekly schedule card has no footer or dedicated structure. Empty-state notices carry the same visual weight as action cards. Cast members cannot immediately identify what needs attention.

---

## Goal

Make cast members understand the most important action within 2 seconds on a 375px mobile screen. Reduce CTA confusion by giving each priority tier a distinct visual vocabulary.

---

## Priority Tier System

### Tier 1 — High Priority (Action Required)

Cards: `本日の確認`, `翌週シフト提出`

| Signal | Spec |
|--------|------|
| Shell | `card-premium-skin` (preserved) |
| Top accent | `border-t-2 border-t-[rgba(201,167,106,0.25)]` |
| Icon | `h-11 w-11 rounded-[13px]` |
| Title | `text-[17px] font-bold text-[#f7f4ed]` |
| Description | `text-[13px] leading-[1.7] text-[#a9afbc]` |
| CTA — 本日の確認 | Full-bleed solid gold bar: `bg-[#c9a76a] py-4 text-[15px] font-bold text-[#0b0d12]` |
| CTA — 翌週シフト提出 | Full-bleed outlined: `border-t border-[rgba(201,167,106,0.25)] py-3.5 text-[14px] font-bold text-[#c9a76a]` with chevron |

**Differentiation between the two Tier-1 cards:**  
`本日の確認` uses a solid filled gold footer — the strongest possible CTA signal.  
`翌週シフト提出` uses a full-bleed outlined footer row (text + chevron, no fill) — clearly secondary but still prominent.

---

### Tier 2 — Medium Priority (Routine Action)

Cards: `今日のブログ`, `今週のスケジュール`

| Signal | Spec |
|--------|------|
| Shell | `card-premium-skin` (preserved) |
| Top accent | None |
| Icon | `h-9 w-9 rounded-xl` |
| Title | `text-[15px] font-semibold text-[#f7f4ed]` |
| Description | `text-[13px] text-[#8f96a3]` |
| CTA — ブログ | Ghost text-button: `border border-white/12 bg-transparent rounded-xl py-2.5 text-[13px] text-[#8f96a3]` |
| CTA — スケジュール | No button. Footer = today's shift time (text) + `詳細 ›` text link |

**Why `今日のブログ` gets a ghost button and not an outlined gold button:**  
The identical outlined gold CTAs on shift and blog were the primary source of visual confusion. Blog is demoted to the ghost tier to restore hierarchy.

---

### Tier 3 — Low Priority (Passive Information)

Section: `お知らせ`

| Signal | Spec |
|--------|------|
| Shell | **None** — `CastMobileCard` removed |
| Surface | Flat: `rounded-[20px] bg-[#0d1018]` (barely distinct from page bg `#0b0d12`) |
| Header | `text-[12px] font-semibold text-[#6b7280]` + "すべて見る" text link |
| Icon | `h-7 w-7 rounded-lg` |
| Notice title | `text-[12px] text-[#8f96a3]` |
| Empty state | Single line, `text-[12px] text-[#6b7280] py-3` — no card padding |

Removing the shell collapses visual weight. The notice section looks like an appendix, not a card.

---

## CastWeeklyScheduleCard Component

**File:** `components/features/cast/dashboard/CastWeeklyScheduleCard.tsx`  
**Type:** Server Component (accepts pre-computed data as props — no async fetching inside)  
**Route:** Links to `/cast/schedule`

### Props Interface

```typescript
type CastWeeklyScheduleCardProps = {
  summaryDates: Date[];
  scheduleStatusMap: Map<string, 'work'>;
  today: string;         // YYYY-MM-DD
  todayShift: {
    start_time: string | null;
    end_time: string | null;
  } | null;
  workCount: number;
  offCount: number;
};
```

### Layout Structure (header / body / footer)

```
┌──────────────────────────────────────────────┐
│ HEADER                                        │
│  [CalendarDays icon]  今週のスケジュール      │
│                       [4出] [3休]            │  ← work/off count pills
├──────────────────────────────────────────────┤
│ BODY                                          │
│  月  火  水  木  金  土  日                   │
│  ○   ×   ○   ×   ○   ×   ×                  │
│  (today's col highlighted: gold bg + border)  │
├──────────────────────────────────────────────┤
│ FOOTER                                        │
│  本日 20:00–24:00          詳細 ›             │  ← or 本日 OFF
└──────────────────────────────────────────────┘
```

### Token Spec

| Element | Class |
|---------|-------|
| Work/off count pill (work) | `bg-[rgba(59,130,246,0.12)] text-[#3b82f6] text-[10px] rounded-full px-2 py-0.5` |
| Work/off count pill (off) | `bg-white/6 text-[#6b7280] text-[10px] rounded-full px-2 py-0.5` |
| Day column (today) | `rounded-[10px] border border-[rgba(201,167,106,0.4)] bg-[rgba(201,167,106,0.08)]` |
| Day column (other) | `rounded-[10px] border border-transparent` |
| Day label (today) | `text-[10px] text-[#c9a76a]` |
| Day label (other) | `text-[10px] text-[#6b7280]` |
| ○ indicator | `text-base font-bold text-[#3b82f6]` |
| × indicator | `text-base font-bold text-[#ef4444]` |
| Footer shift text | `text-[13px] font-semibold text-[#f7f4ed]` |
| Footer "詳細 ›" link | `text-[12px] text-[#8f96a3] flex items-center gap-0.5` |

---

## Strict Card Structure (header / body / footer)

All five sections must now follow this division, even where there is no visual footer separator:

```
<card header>   — icon + title + badge
<card body>     — description + supporting chips/grid
<card footer>   — primary action (type varies by tier)
```

This is a visual convention enforced in JSX structure, not a typed wrapper API (no new primitives introduced).

---

## Files Changed

| File | Change |
|------|--------|
| `app/(cast)/cast/dashboard/page.tsx` | Restructure 5 card sections per tier rules; import + use `CastWeeklyScheduleCard` |
| `components/features/cast/dashboard/CastWeeklyScheduleCard.tsx` | New component — extracted from page.tsx schedule section |

**Files NOT changed:**
- `components/features/cast/CastMobileShell.tsx` — `CastMobileCard` used as-is
- Any admin dashboard files
- Auth, middleware, Supabase schema, routing, SEO

---

## Verification

```bash
pnpm lint
pnpm build
```

Manual checks:
- [ ] `本日の確認` solid gold footer is visually dominant over all other CTAs
- [ ] `翌週シフト提出` outlined footer is clearly secondary to today's confirmation
- [ ] `今日のブログ` ghost button is softer than shift submission CTA
- [ ] `今週のスケジュール` has no gold button — footer is text only
- [ ] `お知らせ` section has no card shell — significantly reduced visual weight
- [ ] Empty-state notices render as a single subdued line (no padded card)
- [ ] No horizontal overflow at 375px viewport
- [ ] All existing routes (`/cast/today`, `/cast/shift`, `/cast/posts`, `/cast/schedule`, `/cast/notices`) preserved
