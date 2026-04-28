# Cast Dashboard Hierarchy Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/cast/dashboard` so cast members immediately recognise the most urgent action via a strict 3-tier visual priority system, without changing any routes, data fetching, or non-dashboard code.

**Architecture:** Two files only. Extract the weekly schedule into a new server component `CastWeeklyScheduleCard.tsx` that receives pre-computed props from `page.tsx`. Restructure all five dashboard sections inside `page.tsx` to follow a header/body/footer card contract, with visually distinct CTAs per priority tier.

**Tech Stack:** Next.js 16 App Router (Server Components), Tailwind CSS v4, Lucide React, existing `card-premium-skin` CSS system, `@/lib/shift-utils`, `@/components/features/cast/CastMobileShell`

**Spec:** `docs/superpowers/specs/2026-04-25-cast-dashboard-hierarchy-redesign.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/features/cast/dashboard/CastWeeklyScheduleCard.tsx` | Dedicated schedule component: header (title + work/off counts), body (7-day grid), footer (today's shift + 詳細 link) |
| Modify | `app/(cast)/cast/dashboard/page.tsx` | Apply tier-based visual treatment to all 5 dashboard sections; remove `getWeeklySummaryLabel` helper (moved to component); import + use `CastWeeklyScheduleCard` |

No other files are touched.

---

## Task 1 — Create `CastWeeklyScheduleCard` component

**Files:**
- Create: `components/features/cast/dashboard/CastWeeklyScheduleCard.tsx`

- [ ] **Step 1.1: Create the directory and file**

```bash
mkdir -p /path/to/repo/components/features/cast/dashboard
```

Then create `components/features/cast/dashboard/CastWeeklyScheduleCard.tsx` with this complete content:

```tsx
import Link from 'next/link';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { CastMobileCard } from '@/components/features/cast/CastMobileShell';
import { formatDate } from '@/lib/shift-utils';

type CastWeeklyScheduleCardProps = {
  summaryDates: Date[];
  scheduleStatusMap: Map<string, 'work'>;
  today: string;
  todayShift: { start_time: string | null; end_time: string | null } | null;
  workCount: number;
  offCount: number;
};

function getWeeklySummaryLabel(value: 'work' | 'off'): { text: string; color: string } {
  if (value === 'work') return { text: '○', color: 'text-[#3b82f6]' };
  return { text: '×', color: 'text-[#ef4444]' };
}

export function CastWeeklyScheduleCard({
  summaryDates,
  scheduleStatusMap,
  today,
  todayShift,
  workCount,
  offCount,
}: CastWeeklyScheduleCardProps): React.JSX.Element {
  const todayShiftLabel = todayShift
    ? `本日 ${todayShift.start_time?.slice(0, 5) ?? '未定'}–${todayShift.end_time?.slice(0, 5) ?? '未定'}`
    : '本日 OFF';

  return (
    <Link href="/cast/schedule" aria-label="今週のスケジュール詳細を見る">
      <CastMobileCard>
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#c9a76a]" />
            <span className="text-[15px] font-semibold text-[#f7f4ed]">今週のスケジュール</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-[rgba(59,130,246,0.12)] px-2 py-0.5 text-[10px] text-[#3b82f6]">
              {workCount}出
            </span>
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-[#6b7280]">
              {offCount}休
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-3">
          {summaryDates.map((date) => {
            const dateKey = formatDate(date);
            const isToday = dateKey === today;
            const indicator = getWeeklySummaryLabel(
              scheduleStatusMap.has(dateKey) ? 'work' : 'off'
            );
            return (
              <div
                key={dateKey}
                className={`rounded-[10px] border px-1 py-2 text-center ${
                  isToday
                    ? 'border-[rgba(201,167,106,0.4)] bg-[rgba(201,167,106,0.08)]'
                    : 'border-transparent'
                }`}
              >
                <div className={`text-[10px] ${isToday ? 'text-[#c9a76a]' : 'text-[#6b7280]'}`}>
                  {date.toLocaleDateString('ja-JP', { weekday: 'short' }).replace('曜', '')}
                </div>
                <div className={`mt-2 text-base font-bold leading-none ${indicator.color}`}>
                  {indicator.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-white/6 px-4 py-3">
          <span className="text-[13px] font-semibold text-[#f7f4ed]">{todayShiftLabel}</span>
          <span className="flex items-center gap-0.5 text-[12px] text-[#8f96a3]">
            詳細
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </CastMobileCard>
    </Link>
  );
}
```

- [ ] **Step 1.2: Verify TypeScript compiles for the new file**

```bash
cd <repo-root>
pnpm tsc --noEmit --project tsconfig.json 2>&1 | grep CastWeeklyScheduleCard
```

Expected: no output (no errors for this file).

---

## Task 2 — Restructure `page.tsx`: Tier 1 cards

**Files:**
- Modify: `app/(cast)/cast/dashboard/page.tsx`

### 2a — `本日の確認` (Tier 1 Primary)

The current card already uses a solid gold footer. One change: strengthen the top accent from `0.18` opacity to `0.3`.

- [ ] **Step 2a.1: Update top accent border on 本日の確認**

Find in `page.tsx`:
```tsx
<CastMobileCard className="overflow-hidden border-t-2 border-t-[rgba(201,167,106,0.18)]">
```

Replace with:
```tsx
<CastMobileCard className="overflow-hidden border-t-2 border-t-[rgba(201,167,106,0.3)]">
```

No other change to this card.

### 2b — `翌週シフト提出` (Tier 1 Secondary)

Remove the inner rounded button. Replace with a full-bleed outlined footer row. Promote icon size and heading size to match Tier 1.

- [ ] **Step 2b.1: Replace the entire 翌週シフト提出 Link block**

Find this entire block in `page.tsx` (lines ~242–279):
```tsx
        <Link href="/cast/shift">
          <CastMobileCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                  <CalendarDays className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Weekly Shift</div>
                  <div className="text-base font-bold text-[#f7f4ed]">翌週シフト提出</div>
                </div>
                </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${weeklyShiftStatusMeta.badgeClass}`}>
                {weeklyShiftStatusMeta.badge}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">対象期間</div>
                <div className="font-bold text-[#f7f4ed]">
                  {nextMondayDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                  {' 〜 '}
                  {nextSundayDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                </div>
              </div>
              <div className="border-l border-white/8 pl-4">
                <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">締切</div>
                <div className="font-bold text-[#e6a23c]">土曜 23:55</div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-[1.7] text-[#a9afbc]">
              {weeklyShiftStatusMeta.description}
            </p>
            <div className="mt-5 rounded-xl border border-[rgba(201,167,106,0.3)] bg-[rgba(201,167,106,0.15)] px-4 py-3 text-center text-sm font-bold text-[#c9a76a]">
              シフトを提出する
            </div>
          </CastMobileCard>
        </Link>
```

Replace with:
```tsx
        <Link href="/cast/shift">
          <CastMobileCard className="overflow-hidden border-t-2 border-t-[rgba(201,167,106,0.18)]">
            {/* HEADER + BODY */}
            <div className="space-y-4 px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Weekly Shift</div>
                    <div className="text-[17px] font-bold text-[#f7f4ed]">翌週シフト提出</div>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${weeklyShiftStatusMeta.badgeClass}`}>
                  {weeklyShiftStatusMeta.badge}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">対象期間</div>
                  <div className="font-bold text-[#f7f4ed]">
                    {nextMondayDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                    {' 〜 '}
                    {nextSundayDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                  </div>
                </div>
                <div className="border-l border-white/8 pl-4">
                  <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">締切</div>
                  <div className="font-bold text-[#e6a23c]">土曜 23:55</div>
                </div>
              </div>
              <p className="text-[13px] leading-[1.7] text-[#a9afbc]">
                {weeklyShiftStatusMeta.description}
              </p>
            </div>
            {/* FOOTER — full-bleed outlined row */}
            <div className="flex items-center justify-center gap-2 border-t border-[rgba(201,167,106,0.2)] px-6 py-3.5 text-[14px] font-bold text-[#c9a76a]">
              シフトを提出する
              <ChevronRight className="h-4 w-4" />
            </div>
          </CastMobileCard>
        </Link>
```

---

## Task 3 — Restructure `page.tsx`: Tier 2 cards

### 3a — `今日のブログ` (Tier 2)

Downgrade icon size, heading size, and CTA to ghost button.

- [ ] **Step 3a.1: Replace the entire 今日のブログ Link block**

Find this entire block in `page.tsx` (lines ~281–309):
```tsx
        <Link href="/cast/posts">
          <CastMobileCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                  <PenLine className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Daily Blog</div>
                  <div className="text-base font-bold text-[#f7f4ed]">今日のブログ</div>
                </div>
              </div>
              <span className="rounded-full bg-[rgba(230,162,60,0.12)] px-2.5 py-1 text-[11px] font-bold text-[#e6a23c]">
                {hasBlogPost ? '投稿済' : '未投稿'}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-[#a9afbc]">
                {hasBlogPost ? '本日の投稿があります。内容確認や追加投稿ができます。' : '本日のブログはまだ投稿されていません'}
              </p>
              <p className="text-xs text-[#6b7280]">
                前回: {recentPosts?.[0]?.content ? `${recentPosts[0].content.slice(0, 18)}...` : '未投稿'}
              </p>
            </div>
            <div className="mt-5 rounded-xl border border-[rgba(201,167,106,0.3)] bg-[rgba(201,167,106,0.15)] px-4 py-3 text-center text-sm font-bold text-[#c9a76a]">
              ブログを書く
            </div>
          </CastMobileCard>
        </Link>
```

Replace with:
```tsx
        <Link href="/cast/posts">
          <CastMobileCard className="p-4">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.12)] text-[#c9a76a]">
                  <PenLine className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Daily Blog</div>
                  <div className="text-[15px] font-semibold text-[#f7f4ed]">今日のブログ</div>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${hasBlogPost ? 'bg-[rgba(51,179,107,0.1)] text-[#33b36b]' : 'bg-white/6 text-[#6b7280]'}`}>
                {hasBlogPost ? '投稿済' : '未投稿'}
              </span>
            </div>
            {/* BODY */}
            <div className="mt-3 space-y-1.5">
              <p className="text-[13px] text-[#8f96a3]">
                {hasBlogPost ? '本日の投稿があります。内容確認や追加投稿ができます。' : '本日のブログはまだ投稿されていません'}
              </p>
              <p className="text-[11px] text-[#6b7280]">
                前回: {recentPosts?.[0]?.content ? `${recentPosts[0].content.slice(0, 18)}...` : '未投稿'}
              </p>
            </div>
            {/* FOOTER — ghost button */}
            <div className="mt-4 rounded-xl border border-white/12 px-4 py-2.5 text-center text-[13px] font-medium text-[#8f96a3]">
              ブログを書く
            </div>
          </CastMobileCard>
        </Link>
```

### 3b — `今週のスケジュール` (Tier 2 — replace with CastWeeklyScheduleCard)

- [ ] **Step 3b.1: Add import for CastWeeklyScheduleCard at the top of page.tsx**

Find the existing import block near the top of `page.tsx`:
```tsx
import {
  CastMobileCard,
  CastMobileHeader,
  CastMobileHeaderBell,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';
```

Add this import directly below it:
```tsx
import { CastWeeklyScheduleCard } from '@/components/features/cast/dashboard/CastWeeklyScheduleCard';
```

- [ ] **Step 3b.2: Remove `getWeeklySummaryLabel` from page.tsx**

Find and delete this function entirely (lines ~21–24):
```tsx
function getWeeklySummaryLabel(value: 'work' | 'off') {
  if (value === 'work') return { text: '○', color: 'text-[#3b82f6]' };
  return { text: '×', color: 'text-[#ef4444]' };
}
```

It now lives in `CastWeeklyScheduleCard.tsx`.

- [ ] **Step 3b.3: Replace the schedule Link block with the new component**

Find this entire block in `page.tsx` (lines ~311–348):
```tsx
        <Link href="/cast/schedule" aria-label="今週のスケジュール詳細を見る">
          <CastMobileCard className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f7f4ed]">
                <CalendarDays className="h-4 w-4 text-[#c9a76a]" />
                今週のスケジュール
              </div>
              <div className="flex items-center gap-1 text-xs text-[#8f96a3]">
                詳細
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {summaryDates.map((date) => {
                const dateKey = formatDate(date);
                const isToday = dateKey === today;
                const indicator = getWeeklySummaryLabel(scheduleStatusMap.has(dateKey) ? 'work' : 'off');

                return (
                  <div
                    key={dateKey}
                    className={`rounded-[10px] border px-1 py-2 text-center ${
                      isToday ? 'border-[rgba(201,167,106,0.4)] bg-[rgba(201,167,106,0.08)]' : 'border-transparent'
                    }`}
                  >
                    <div className={`text-[10px] ${isToday ? 'text-[#c9a76a]' : 'text-[#6b7280]'}`}>
                      {date.toLocaleDateString('ja-JP', { weekday: 'short' }).replace('曜', '')}
                    </div>
                    <div className={`mt-2 text-base font-bold leading-none ${indicator.color}`}>{indicator.text}</div>
                  </div>
                );
              })}
            </div>
            <span className="font-bold text-[#c9a76a]">
              {todayShift ? `本日 ${todayShift.start_time?.slice(0, 5) ?? '未定'}-${todayShift.end_time?.slice(0, 5) ?? '未定'}` : '本日 OFF'}
            </span>
          </CastMobileCard>
        </Link>
```

Replace with:
```tsx
        <CastWeeklyScheduleCard
          summaryDates={summaryDates}
          scheduleStatusMap={scheduleStatusMap}
          today={today}
          todayShift={todayShift}
          workCount={workCount}
          offCount={offCount}
        />
```

---

## Task 4 — Restructure `page.tsx`: Tier 3 notices section

Remove the `CastMobileCard` shell. Replace with a flat low-weight surface.

- [ ] **Step 4.1: Replace the entire お知らせ CastMobileCard block**

Find this entire block in `page.tsx` (lines ~350–385):
```tsx
        <CastMobileCard className="overflow-hidden bg-[#181d27]">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
            <div className="text-sm font-bold text-[#f7f4ed]">お知らせ</div>
            <Link href="/cast/notices" className="flex items-center gap-1 text-xs text-[#8f96a3]">
              すべて見る
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div>
            {unreadNotices.length > 0 ? (
              unreadNotices.map((notice) => {
                const tone = getNoticeTone(notice.importance);
                return (
                  <Link
                    key={notice.id}
                    href="/cast/notices"
                    className="flex items-start gap-3 border-b border-white/8 px-5 py-4 last:border-b-0"
                  >
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${tone.iconWrap}`}>
                      <Bell className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] leading-5 ${tone.title}`}>{notice.title}</p>
                      <p className="mt-1 text-[11px] text-[#6b7280]">
                        {formatDistanceToNowStrict(new Date(notice.created_at), { addSuffix: true, locale: ja })}
                      </p>
                    </div>
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#c9a76a]" />
                  </Link>
                );
              })
            ) : (
              <div className="px-5 py-6 text-sm text-[#8f96a3]">新しいお知らせはありません。</div>
            )}
          </div>
        </CastMobileCard>
```

Replace with:
```tsx
        <div className="overflow-hidden rounded-[20px] bg-[#0d1018]">
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
            <div className="text-[12px] font-semibold text-[#6b7280]">お知らせ</div>
            <Link href="/cast/notices" className="flex items-center gap-0.5 text-[12px] text-[#6b7280]">
              すべて見る
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div>
            {unreadNotices.length > 0 ? (
              unreadNotices.map((notice) => {
                const tone = getNoticeTone(notice.importance);
                return (
                  <Link
                    key={notice.id}
                    href="/cast/notices"
                    className="flex items-start gap-3 border-b border-white/6 px-5 py-3 last:border-b-0"
                  >
                    <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${tone.iconWrap}`}>
                      <Bell className="h-3 w-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12px] leading-5 ${tone.title}`}>{notice.title}</p>
                      <p className="mt-0.5 text-[11px] text-[#6b7280]">
                        {formatDistanceToNowStrict(new Date(notice.created_at), { addSuffix: true, locale: ja })}
                      </p>
                    </div>
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c9a76a]" />
                  </Link>
                );
              })
            ) : (
              <div className="px-5 py-3 text-[12px] text-[#6b7280]">新しいお知らせはありません。</div>
            )}
          </div>
        </div>
```

- [ ] **Step 4.2: Verify `CastMobileCard` is no longer imported unused**

After removing the notices card shell, check whether `CastMobileCard` is still used in `page.tsx`.

It IS still used by the 本日の確認, 翌週シフト提出, and 今日のブログ cards — keep the import.

---

## Task 5 — Verify and commit

- [ ] **Step 5.1: Run lint**

```bash
cd <repo-root>
pnpm lint
```

Expected: no errors. If `h-4.5` or `w-4.5` warnings appear (non-standard Tailwind values), replace with `h-[18px] w-[18px]` in the new component.

- [ ] **Step 5.2: Run build**

```bash
pnpm build
```

Expected: build completes with no TypeScript or Next.js errors.

- [ ] **Step 5.3: Manual visual checklist**

Open `/cast/dashboard` at 375px viewport and verify:

| Check | Expected |
|-------|----------|
| 本日の確認 | Solid gold footer bar is the visually dominant CTA |
| 翌週シフト提出 | Full-bleed outlined footer row — clearly secondary to today's gold bar |
| 今日のブログ | Ghost button (gray border, gray text) — noticeably softer than shift CTA |
| 今週のスケジュール | No button at all — footer shows shift time + 詳細 › text link |
| お知らせ | No card shell — flat dark section, reduced visual weight |
| Empty-state notices | Single subdued line `py-3` (not padded card) |
| No horizontal overflow | Entire page fits 375px without scroll |
| All routes work | `/cast/today`, `/cast/shift`, `/cast/posts`, `/cast/schedule`, `/cast/notices` all link correctly |

- [ ] **Step 5.4: Commit**

```bash
git checkout -b feat/cast-dashboard-hierarchy
git add components/features/cast/dashboard/CastWeeklyScheduleCard.tsx
git add app/\(cast\)/cast/dashboard/page.tsx
git commit -m "feat(cast-dashboard): apply 3-tier visual hierarchy and extract CastWeeklyScheduleCard

- Tier 1: 本日の確認 keeps solid gold footer; 翌週シフト提出 gets full-bleed outlined footer
- Tier 2: ブログ downgraded to ghost button; schedule replaced by CastWeeklyScheduleCard
- Tier 3: お知らせ loses card shell, becomes flat low-weight section
- Move getWeeklySummaryLabel into CastWeeklyScheduleCard

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 3-tier priority structure — Tasks 2, 3, 4
- ✅ 本日の確認 strongest primary action — Task 2a (border accent) + existing solid gold footer
- ✅ 翌週シフト提出 secondary to today — Task 2b (full-bleed outlined row, not filled)
- ✅ 今日のブログ less dominant than shift — Task 3a (ghost button, smaller icon/heading)
- ✅ CastWeeklyScheduleCard extracted to correct path — Task 1
- ✅ Weekly schedule remains card-shaped — Task 1 uses CastMobileCard
- ✅ お知らせ visually lighter — Task 4 (no shell, flat surface, reduced padding)
- ✅ Empty-state reduced — Task 4 (`py-3` vs `py-6`, `text-[12px]` vs `text-sm`)
- ✅ Preserves black/gold tone — no color token changes
- ✅ Routes preserved — all hrefs unchanged
- ✅ No admin/auth/schema changes — only 2 files touched
- ✅ `pnpm lint` + `pnpm build` in Task 5

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `CastWeeklyScheduleCardProps.todayShift` typed as `{ start_time: string | null; end_time: string | null } | null` — matches `todayShift` shape from `cast_schedules` Supabase query in page.tsx (selects `*` which includes these fields).
- `scheduleStatusMap` typed as `Map<string, 'work'>` — matches construction in page.tsx: `new Map((schedules ?? []).map((schedule) => [schedule.work_date, 'work' as const]))`.
- `getWeeklySummaryLabel` removed from page.tsx in Step 3b.2, present in component in Task 1. No lingering call sites.
