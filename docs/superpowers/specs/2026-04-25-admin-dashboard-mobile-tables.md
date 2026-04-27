# Admin Dashboard Mobile Tables — CSS Dual-Render

**Date:** 2026-04-25  
**Scope:** `DashboardTodayShifts.tsx` and `DashboardReservations.tsx` only  
**Files changed:** 2 (both modified)  
**Status:** Approved for implementation

---

## Problem

`DashboardTodayShifts` and `DashboardReservations` both wrap their content in `min-w-[900px]` / `min-w-[800px]` containers inside `overflow-x-auto`, forcing horizontal scrolling on mobile. This is the only mobile layout gap being addressed.

---

## Solution: CSS Dual-Render (Approach A)

Add a mobile card list in the filled branch of each component, alongside the existing table. Use Tailwind responsive utilities to show one at a time. No new files, no server→client conversion, no data fetching changes.

### Structural pattern (both components)

**Before:**
```tsx
{data.length === 0 ? (
  <EmptyState />
) : (
  <div className="flex-1 overflow-x-auto custom-scrollbar">
    <div className="min-w-[900px|800px]">
      {/* table — unchanged */}
    </div>
  </div>
)}
```

**After:**
```tsx
{data.length === 0 ? (
  <EmptyState />        {/* ← untouched */}
) : (
  <>
    {/* Desktop table — hidden on mobile */}
    <div className="hidden md:block flex-1 overflow-x-auto custom-scrollbar">
      <div className="min-w-[900px|800px]">
        {/* table — unchanged */}
      </div>
    </div>
    {/* Mobile card list — hidden on md+ */}
    <div className="block md:hidden divide-y divide-[#ffffff0a]">
      {/* mobile cards */}
    </div>
  </>
)}
```

**Why `hidden md:block` (not `hidden md:flex`):** The desktop wrapper uses `flex-1 overflow-x-auto`. `md:block` restores `display: block`; `flex-1` still provides `flex: 1 1 0%` which works correctly in the `flex flex-col` parent chain at md+. On mobile it is `display: none` so it contributes nothing to layout.

---

## Component 1: DashboardTodayShifts

### Mobile card anatomy

One card per `cast` in the `casts` array. Same iteration order as the table.

```
┌──────────────────────────────────────────────┐
│  [Avatar 36px]  キャスト名        [STATUS]   │  row 1: always shown
│  [18:00 — 24:00 gold time chip]              │  row 2: always shown
│  ● タグ1  ● タグ2                            │  row 3: only if cast.tags.length > 0
└──────────────────────────────────────────────┘
```

### Token spec

| Element | Classes |
|---------|---------|
| Card padding | `px-5 py-4` |
| Card gap (inner) | `flex flex-col gap-2.5` |
| Divider between cards | `divide-y divide-[#ffffff0a]` (on list wrapper) |
| Avatar | `w-9 h-9 rounded-full bg-[#1c1d22] border border-[#ffffff0a] overflow-hidden relative` |
| Avatar ring overlay | `absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full` |
| Avatar initial fallback | `text-[11px] font-bold text-[#5a5650]` |
| Cast name | `text-[14px] font-bold text-[#f4f1ea] tracking-tight truncate` |
| Row 1 layout | `flex items-center justify-between gap-3` |
| Status pill | reuse `STATUS_CONFIG[cast.status]` — `flex items-center gap-1.5 px-3 py-1 {cfg.bg} rounded-full border {cfg.border} shrink-0` |
| Status dot | `w-[5px] h-[5px] rounded-full {cfg.dot}` |
| Status label | `text-[10px] font-bold tracking-[0.12px] {cfg.textColor}` |
| Time chip | `inline-flex items-center gap-2 text-[13px] font-bold text-[#dfbd69] bg-[#dfbd690d] px-3 py-1.5 rounded-[6px] border border-[#dfbd6914] self-start` |
| Time separator `—` | `text-[#5a5650] font-normal opacity-50` |
| End time | `text-[#8a8478] font-medium` |
| Tag pill | `px-2 py-0.5 bg-white/3 border border-white/5 rounded-[6px] text-[10px] font-semibold text-[#8a8478]` |
| Tags wrapper | `flex flex-wrap gap-1.5` |

### Mobile card JSX (complete)

```tsx
{/* Mobile card list */}
<div className="block md:hidden divide-y divide-[#ffffff0a]">
  {casts.map((cast) => {
    const cfg = STATUS_CONFIG[cast.status] || STATUS_CONFIG.pending;
    return (
      <div key={cast.castId} className="px-5 py-4 flex flex-col gap-2.5">
        {/* Row 1: avatar + name + status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#1c1d22] border border-[#ffffff0a] flex items-center justify-center shrink-0 overflow-hidden relative">
              {cast.avatarUrl ? (
                <img
                  src={cast.avatarUrl}
                  alt={cast.castName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-[11px] font-bold text-[#5a5650]">{cast.initial}</span>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
            </div>
            <span className="text-[14px] font-bold text-[#f4f1ea] tracking-tight truncate">{cast.castName}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 ${cfg.bg} rounded-full border ${cfg.border} shrink-0`}>
            <div className={`w-[5px] h-[5px] rounded-full ${cfg.dot}`} />
            <span className={`text-[10px] font-bold tracking-[0.12px] ${cfg.textColor}`}>{cfg.label}</span>
          </div>
        </div>
        {/* Row 2: shift time chip */}
        <div className="inline-flex items-center gap-2 text-[13px] font-bold text-[#dfbd69] bg-[#dfbd690d] px-3 py-1.5 rounded-[6px] border border-[#dfbd6914] self-start">
          <span>{cast.startTime}</span>
          <span className="text-[#5a5650] font-normal opacity-50">—</span>
          <span className="text-[#8a8478] font-medium">{cast.endTime || '—'}</span>
        </div>
        {/* Row 3: tags (conditional) */}
        {cast.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cast.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-white/3 border border-white/5 rounded-[6px] text-[10px] font-semibold text-[#8a8478]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  })}
</div>
```

---

## Component 2: DashboardReservations

### Mobile card anatomy

One card per `r` in the `reservations` array. Same iteration order as the table.

```
┌──────────────────────────────────────────────┐
│  田中 様                        [STATUS]     │  row 1: always shown
│  20:00  ·  2名                               │  row 2: always shown
│  担当: [mini-avatar] キャスト名              │  row 3: only if r.castName !== '—'
│  備考テキスト...                              │  row 4: only if r.note
└──────────────────────────────────────────────┘
```

### Token spec

| Element | Classes |
|---------|---------|
| Card padding | `px-5 py-4` |
| Card gap (inner) | `flex flex-col gap-2` |
| Divider between cards | `divide-y divide-[#ffffff0a]` (on list wrapper) |
| Guest name | `text-[14px] font-bold text-[#cbc3b3] truncate` |
| Row 1 layout | `flex items-center justify-between gap-3` |
| Status pill | same structure as shifts — `{cfg.bg} rounded-full border {cfg.border}` |
| Visit time | `text-[13px] font-bold text-[#dfbd69]` |
| Guest count separator `·` | `text-[#5a5650] opacity-60` |
| Guest count number | `font-bold text-[#c7c0b2]` |
| Guest count `名` | `text-[#8a8478]` |
| Row 2 layout | `flex items-center gap-3 text-[13px]` |
| Cast mini-avatar | `w-4 h-4 rounded-full bg-[#dfbd691a] border border-[#dfbd6920] flex items-center justify-center shrink-0` |
| Cast avatar initial | `text-[8px] font-bold text-[#dfbd69]` |
| Cast label prefix `担当:` | `text-[12px] text-[#8a8478]` |
| Cast name value | `text-[#c7c0b2] font-semibold` |
| Note text | `text-[11px] leading-relaxed text-[#8a8478]` ← approved token |

### Mobile card JSX (complete)

```tsx
{/* Mobile card list */}
<div className="block md:hidden divide-y divide-[#ffffff0a]">
  {reservations.map((r) => {
    const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
    return (
      <div key={r.id} className="px-5 py-4 flex flex-col gap-2">
        {/* Row 1: guest name + status */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[14px] font-bold text-[#cbc3b3] truncate">{r.guestName} 様</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 ${cfg.bg} rounded-full border ${cfg.border} shrink-0`}>
            <div className={`w-[5px] h-[5px] rounded-full ${cfg.dot}`} />
            <span className={`text-[10px] font-bold tracking-[0.12px] ${cfg.textColor}`}>{cfg.label}</span>
          </div>
        </div>
        {/* Row 2: visit time + guest count */}
        <div className="flex items-center gap-3 text-[13px]">
          <span className="font-bold text-[#dfbd69]">{r.visitTime}</span>
          <span className="text-[#5a5650] opacity-60">·</span>
          <span>
            <span className="font-bold text-[#c7c0b2]">{r.guestCount}</span>
            <span className="text-[#8a8478]">名</span>
          </span>
        </div>
        {/* Row 3: cast (conditional) */}
        {r.castName !== '—' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#dfbd691a] border border-[#dfbd6920] flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-[#dfbd69]">{r.castName.charAt(0)}</span>
            </div>
            <span className="text-[12px] text-[#8a8478]">
              担当: <span className="text-[#c7c0b2] font-semibold">{r.castName}</span>
            </span>
          </div>
        )}
        {/* Row 4: note (conditional) */}
        {r.note && (
          <p className="text-[11px] leading-relaxed text-[#8a8478]">{r.note}</p>
        )}
      </div>
    );
  })}
</div>
```

---

## Files Changed

| File | Change |
|------|--------|
| `components/features/admin/dashboard/DashboardTodayShifts.tsx` | Wrap existing table in `hidden md:block`; add mobile card list with `block md:hidden` |
| `components/features/admin/dashboard/DashboardReservations.tsx` | Same pattern |

**Files NOT changed:**
- `STATUS_CONFIG` constants — untouched, reused by mobile cards
- Empty state branches — untouched
- Component headers — untouched
- All data fetching, types, imports
- `AdminLayout.tsx`, cast pages, auth, routing, SEO

---

## Verification Checklist

```bash
pnpm lint
pnpm build
```

Manual:
- [ ] At 390px: no horizontal overflow on either component
- [ ] At 390px: all four data fields visible per shift card
- [ ] At 390px: all four data fields visible per reservation card (guest name, time+count, cast, note)
- [ ] At 390px: empty state renders correctly (no duplication)
- [ ] At 768px+ (md): existing table layout unchanged, no mobile cards visible
- [ ] At 1280px (xl): right rail and full layout unaffected
