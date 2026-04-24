# Mobile Admin — Animo Design System

This document defines the mobile admin layout principles, component rules, and anti-patterns.
Mobile admin is the compressed operational surface — same design language as desktop, optimized for speed.

---

## 1. Layout Principles

### 1.1 Core Philosophy

- Mobile admin is **not a separate design system.** It is the desktop admin compressed for single-hand operation.
- Every component on mobile must have a desktop counterpart using the same shared foundation.
- The goal is **operational speed:** a manager glances at the phone to check status, approve requests, and flag issues.

### 1.2 Source of Truth

**Figma `Animo Dashboard-Mobile` page** is the definitive reference for mobile admin layout.

When implementing mobile admin:
1. Check Figma mobile page first
2. Fall back to `shared-foundation.md` for tokens
3. Fall back to `DESIGN.md` for principles
4. Never invent mobile-only visual treatments

### 1.3 Viewport and Safe Areas

```
Target viewports:    375px, 390px, 430px
Min touch target:    44px × 44px
Safe area bottom:    env(safe-area-inset-bottom)
Page padding:        px-4 (16px sides)
Section gap:         space-y-4 (16px)
```

### 1.4 Surface Continuity

The same `.card-premium-skin` system applies on mobile.
Gold bezels should be reduced to maintain proportion:

```css
/* Mobile override */
@media (max-width: 767px) {
  .card-premium-skin {
    --bright-gold-bezel: 2px;
    --dark-gold-bezel: 4px;
  }
}
```

---

## 2. Compact KPI Rules

### 2.1 Layout

Mobile KPIs use a **2-column grid** instead of desktop's 6-column:

```
Grid:              grid-cols-2
Gap:               gap-3 (12px)
Card height:       auto (content-driven), min-h-[100px]
Card radius:       14px
Card padding:      p-4
```

### 2.2 Content Hierarchy

```
1. Value (largest)     — 24px bold, gradient text
2. Label (above value) — 10px bold, #8a8478, uppercase
3. Sub (below value)   — 10px, #5a5650
4. Icon (top-right)    — 14px, #dfbd69, in 24px container
```

### 2.3 Size Reduction from Desktop

| Element | Desktop | Mobile |
|---------|---------|--------|
| Card width | 183px fixed | 50% - gap |
| Card height | 151px fixed | auto, min 100px |
| Value size | 30px | 24px |
| Title size | 11px | 10px |
| Icon container | 18px inset | 12px inset, 24px container |
| Bezel | 3–7px | 2–4px |

---

## 3. Urgent Action Block Rules

### 3.1 Purpose

Mobile admin needs a prominent block for items requiring immediate action.
This replaces browsing the full dashboard — the manager sees what needs attention NOW.

### 3.2 Structure

```
Container:       Full-width card, no side margins
Background:      card-premium-skin (standard)
Header:          Compact panel header (64px)
Content:         Stacked action items
```

### 3.3 Action Item Pattern

```html
<div class="flex items-center justify-between py-3 px-4 border-b border-[#ffffff0a]">
  <div class="flex items-center gap-3">
    <div class="w-[28px] h-[28px] rounded-[6px] {semantic-bg} flex items-center justify-center">
      <Icon size={14} class="{semantic-color}" />
    </div>
    <div>
      <p class="text-[12px] font-bold text-[#f4f1ea]">{title}</p>
      <p class="text-[10px] text-[#8a8478]">{detail}</p>
    </div>
  </div>
  <ChevronRight size={14} class="text-[#5a5650]" />
</div>
```

### 3.4 Priority Order

1. Danger items (unconfirmed attendance, missing shifts)
2. Warning items (pending approvals, unanswered applications)
3. Info items (new messages, blog reminders)

---

## 4. Operational List Rules

### 4.1 Today's Cast List (Mobile)

The cast shift list on mobile uses a **card-per-row** layout instead of the desktop table.

```
Card layout:     Vertical stack
Card padding:    p-4
Avatar:          32px (smaller than desktop 40px)
Name:            13px bold
Time:            12px bold, gold
Status pill:     Compact size (px-2.5 py-1)
Tags:            Hidden on mobile or collapsed to count badge
```

### 4.2 Reservation List (Mobile)

```
Layout:          Vertical stack (not horizontal table)
Each item:       Time (gold, left) → Name + count → Status pill
Tap target:      Full row is tappable (min-h-[52px])
Cast name:       Hidden on mobile or shown as avatar only
Notes:           Collapsed behind expand
```

### 4.3 Alert List (Mobile)

```
Layout:          Vertical stack
Item padding:    p-3.5
Dot + label:     Same as desktop
Detail text:     Below label, indented to dot width
Tap:             Navigates to relevant admin page
```

---

## 5. Bottom Navigation Rules

### 5.1 Structure

```
Position:        fixed bottom-0
Height:          64px + safe-area-inset-bottom
Background:      #0b0b0d with border-t border-[#ffffff0a]
Items:           4–5 max
Active state:    Gold icon + gold label
Inactive state:  #5a5650 icon + label
```

### 5.2 Tab Items

| Tab | Icon | Destination |
|-----|------|-------------|
| Home | LayoutDashboard | /admin/dashboard |
| Shifts | Calendar | /admin/today |
| Casts | Users | /admin/staffs |
| Settings | Settings | /admin/settings |

### 5.3 Rules

- No more than 5 tabs
- Icon size: 20px
- Label size: 9px, font-bold
- Active tab uses gold color (#dfbd69)
- Inactive tab uses dim color (#5a5650)
- Bottom padding must account for safe area

---

## 6. Anti-Patterns — Do Not Do These

### 6.1 Visual Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|------------------|
| Thick gold frames on mobile | Eats precious screen space, looks heavy | Use 2–4px bezels max |
| Desktop table rendered at mobile width | Requires horizontal scroll, breaks layout | Reflow to card-per-row |
| Oversized empty KPI cards | Wastes above-the-fold space | Use compact 2-column grid |
| Full-size panel headers on mobile | 88px header on 667px screen is 13% of viewport | Use 64px compact headers |
| Desktop-width padding (px-10) | Content area becomes too narrow | Use px-4 on mobile |

### 6.2 Structural Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|------------------|
| Recoloring desktop layout for mobile | Ignores touch targets, information hierarchy | Redesign from Figma mobile spec |
| Adding mobile-only visual treatments | Breaks design system consistency | Extend shared components with size props |
| Hiding important data behind tabs | Manager misses critical info | Use priority-ordered vertical stack |
| Using modals for simple actions | Blocks context, hard to dismiss on mobile | Use inline actions or sheet patterns |
| Duplicating component code for mobile | Maintenance burden, style drift | Use responsive props on shared components |

### 6.3 Performance Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|------------------|
| Loading all dashboard data at once | Slow initial paint on mobile | Use Suspense boundaries per section |
| Large gold gradient images | Bandwidth waste | Use CSS gradients only |
| Complex hover animations on touch | No hover on touch devices | Gate with `@media (hover: hover)` |

---

## 7. Responsive Breakpoint Strategy

```
Mobile:          max-width: 767px
Tablet:          min-width: 768px
Desktop:         min-width: 1024px
Wide desktop:    min-width: 1280px (xl)
```

Mobile overrides should be applied via:
1. Tailwind responsive prefixes (`md:`, `lg:`, `xl:`)
2. `@media (max-width: 767px)` in `globals.css` for CSS class overrides
3. Never via JavaScript window width checks
