# Club Animo — Admin / Cast UI design source

**Scope:** Protected admin and cast surfaces only. **Out of scope:** public marketing site (separate labels, separate time rules).

**Stack rule:** Figma is the visual reference for composition. **This file** is the authority for operational structure, tokens, time semantics, approval layout, and prohibited patterns. If Figma and this file conflict on **operational** rules, this file wins; if **purely visual** (color step, shadow), Figma wins.

**Figma pages (names only; no separate doc section):** `Animo` project — `Animo Dashboard` (desktop admin), `Animo Dashboard-Mobile` (mobile admin), `Animo Cast Dashboard` (cast), public surfaces use separate frames (e.g. `Animo Login Desktop`); do not copy internal operation labels into public comps.

---

## 1. Design purpose

| Surface | Job |
|--------|-----|
| **Admin** | Run daily operations: attendance, shifts, approvals, customers, comms. |
| **Cast** | Fast submit, confirm state, and communicate; task-first, mobile. |
| **Public** | Never inherit internal operation labels, staff-only routes, or admin time copy. |

---

## 2. Core principles

- Sales and operation first; no decoration without function.
- No mock, placeholder, or fake operational UI.
- Every button, card, counter, and badge must map to **real data**, **server action**, or **route** (or be removed).
- **Mobile-first** for cast and for admin on-the-floor screens.
- **Desktop admin:** use width efficiently; avoid cramped type; fixed shell + scrollable main (see §4).
- **Information > decoration;** avoid empty visual mass (see §9, §12).
- Prefer subtle depth (shadows, micro-gradients) only when they clarify hierarchy — not loud effects or faux-operational chrome.

---

## 3. Color system (black / gold Animo)

Use existing design tokens / `globals.css` where they exist; values below are the **contract** for new work.

| Role | Value / note |
|------|----------------|
| Page background | Deepest black (e.g. `#0b0b0d` / foundation stack) — fixed under scroll |
| Card background | Dark panel (e.g. `#0a0a0a`–`#1a1a1a` / `.card-premium-skin` surface) |
| Border | Subtle light edge (e.g. `rgba(255,255,255,0.06)` on dark) |
| Gold accent | `#dfbd69` / `rgba(223,189,105,1)` — active, focus, primary emphasis |
| Warning / risk | Amber/orange family for pending / late (e.g. `#c8884d`) |
| Danger / reject | Red family for destructive / error (e.g. `#d4785a`) |
| Muted text | `#8a8478` — labels, secondary nav section titles |
| Primary text | `#f4f1ea` / high-contrast on dark — titles, values |

**Gold usage:** accent and thin bezels only — no large gold fills. **Bezel thickness:** 3–7px; larger gold frames are invalid.

**Admin surface stack (in code):** shared card surface = `.card-premium-skin` in `app/globals.css` (gold bezel via `::before` / `::after`); KPI cards = `.kpi-card` (4-layer: base → gold-back → gold-accent → surface). Content (text, icons, badges) sits above decorative layers (z-index on content).

---

## 4. Layout system

### Admin — desktop

- **Fixed sidebar** (width §11).
- **Fixed page background** (main content scrolls inside the shell).
- **Main content:** vertical scroll; max width **none** (full remaining width).
- **Approval hub / multi-queue:** may use **independent vertical scroll per lane** (§7).
- **Page padding:** 24px (§11).

### Admin — mobile

- Single column; **cards only**; **no horizontal tables.**
- Bottom nav or drawer — **must not cover primary submit / save** (content bottom padding §11).

### Cast — mobile

- Smartphone-first; **large tap targets** (min 44px); task order = priority order.

---

## 5. Component rules

| Component | Rule |
|-----------|------|
| **Cards** | One primary action or summary per card where applicable; use §11 radius/padding/min heights. |
| **Buttons** | Heights §11; every button wired to action or `href`. |
| **Badges** | StatusBadge / semantic colors; no invented labels. |
| **Section headers** | One baseline per row; typography §11. |
| **Form inputs** | Heights §11; labels associated; no dummy fields. |
| **Scroll areas** | Prefer single page scroll; nested scroll only where specified (lanes). Scrollable regions must use the shared `.custom-scrollbar` class (no one-off scrollbar styling). |
| **Empty states** | Explain why empty + next action (route), not “lorem” blocks. |
| **Approval cards** | Min height §11; full width of lane; actions call real mutations. |

---

## 6. Time display rules

| Context | Rule |
|---------|------|
| **Protected admin / cast** | Operating band copy: **`19:00〜2:00`** (next calendar day). |
| **Time selectors** | Options: **`19:00` … `23:45`**, then **`0:00` … `2:00`** (use `lib/operation-hours` / `getOperationTimeOptions` — never hand-roll forbidden strings). |
| **Forbidden** | Never show **`24:00` / `25:00` / `26:00`** in any UI string or option. |
| **Public site** | Hours copy: **`21:00〜LAST` only** — not the internal 19:00 band. |

---

## 7. Approval page design

### Desktop — 3 fixed lanes (equal logical width; grid §12)

1. **本日の出勤承認** + **来店予定承認** (single lane, stacked sections or tabs — same lane scroll).
2. **シフト承認**
3. **その他承認**（ブログ・写真）

- Fixed background; **each lane** scrolls independently; **cards only**; lane metrics §11.
- Lane header height **44px**.

### Mobile — single column order

1. 本日の出勤承認  
2. 来店予定承認  
3. シフト承認  
4. ブログ承認  
5. 写真承認  

---

## 8. Dashboard vs deep operations

- **`/admin/dashboard`:** decision + **entry points** only (links/cards to real queues).
- **`/admin/today`:** **deep operation** screen (phase controls, time selector, operational density).
- **Do not** duplicate `/admin/today` controls on the dashboard unless explicitly approved and sourced from the same data.

---

## 9. Forbidden patterns

- Fake counters; placeholder cards; dead buttons; horizontal scroll tables on mobile.
- Oversized cards that contain fewer than three meaningful data points (violates density rules in §12).
- Charts without axis labels / unexplained metrics.
- Hardcoded **24/25/26** time labels.
- **UI-only** approval buttons (no mutation / no route).
- Internal operation wording on **public** routes.
- Thick ornamental gold frames (bezels beyond §3 thickness band); one-off status colors outside `StatusBadge` semantics (success / warning / danger / neutral / accent).
- **Typography:** no arbitrary `font-family` inline — use Tailwind `font-sans` / `font-serif` / `font-heading` (see §11 scale).

---

## 10. Implementation checklist

### Read before UI work

- This file: **`DESIGN.md`**
- **`CURRENT_STATE.md`** + latest 2 × `PLANS.md` + `daily_log.md`
- **`AGENTS.md`** (repo constraints)
- When touching time UI: **`lib/operation-hours.ts`**, **`OperationTimeSelect`**

### Files / areas that must align with this doc

- `components/layouts/AdminLayout.tsx` — shell, sidebar, scroll.
- `app/admin/(protected)/**` — especially `dashboard`, `today`, `approvals`, `shift-requests`.
- `components/features/admin/**`
- `app/cast/**` and cast feature components.

### Validation before commit

- `pnpm lint` (0 new errors)
- `pnpm build` when shared types/layout touched
- Targeted `pnpm exec eslint "<paths>"` for changed files
- Grep: no `24:00`|`25:00`|`26:00` in changed UI strings

### Additional references (supplementary to §1–12)

- [docs/design/shared-foundation.md](docs/design/shared-foundation.md) — shared components, buttons, tables (desktop), depth tokens.
- [docs/design/mobile-admin.md](docs/design/mobile-admin.md) — mobile admin layout patterns; keep consistent with §4 / §11 here.

**Code anchors:** admin UI components live under `components/features/admin/`; canonical global surfaces in `app/globals.css`. Do not duplicate design rules into `CLAUDE.md` or `AGENTS.md`.

---

## 11. Component sizing tokens

**Spacing scale (only):** `8` / `12` / `16` / `24` — see §12. Section gap **always 24px**.

### Sidebar layout

| Token | Value |
|-------|--------|
| Sidebar **container** width | **220px** (desktop) |
| Sidebar **menu item** width | **180px** |
| **Intent:** 220 − 180 = **40px** total horizontal rail — **20px padding left + 20px padding right** inside the sidebar for breathing room and alignment. |

### Sidebar menu item (interactive row)

| Property | Value |
|----------|--------|
| Width | **180px** |
| Height | **35px** |
| Gap between items | **15px** |
| Radius | **10px** |
| Selected background | `rgba(223, 189, 105, 0.10)` |
| Selected border | `rgba(223, 189, 105, 0.16)` |
| Unselected background | `rgba(28, 29, 34, 1)` |
| Unselected border | `rgba(255, 255, 255, 0.06)` |
| Selected label | Inter **12px** / **600** / `rgba(223,189,105,1)` |
| Unselected label | Inter **12px** / **400** / `#C7C0B2` |
| Nav **section title** (group label) | Inter **15px** / `#8A8478` |

Mobile: **drawer or bottom nav only** — no persistent 220px rail.

### Admin content

| Token | Desktop | Mobile |
|-------|---------|--------|
| Max content width | none | — |
| Page padding | **24px** | **16px** |
| Section gap | **24** | **24** |
| Card gap | **16** | **16** |

### Cards

| Token | Desktop | Mobile |
|-------|---------|--------|
| Border radius | **18px** | **18px** |
| Padding | **20px** | **16px** |
| Border | **1px** | **1px** |
| KPI card min height | **88px** | **88px** |
| Approval card min height | **120px** | **120px** |

### Approval lanes (desktop)

| Token | Value |
|-------|--------|
| Lane count | **3** |
| Gap between lanes | **18px** |
| Lane min width | **300px** |
| Lane max height | `calc(100vh - headerHeight - pagePadding)` (header = actual admin header component) |
| Scroll | Independent per lane |
| Cards | **Full width** of lane |
| Lane header | **44px** |

### Buttons

| Size | Height |
|------|--------|
| Small | **32px** |
| Default | **40px** |
| Large | **48px** |

Radius **10px**. Mobile: **minimum tap target 44px** (use large/default heights or hit-padding).

### Inputs / selects

| Context | Height | Radius | Font size |
|---------|--------|--------|-----------|
| Desktop | **40px** | **10px** | **13px** |
| Mobile | **44px** | **10px** | **13px** |

### Badges

| Property | Value |
|----------|--------|
| Height | **22px** |
| Padding X | **8px** |
| Radius | **999px** |
| Font size | **10px** |

### Text scale

| Role | Desktop | Mobile |
|------|---------|--------|
| Page title | **24px** | **20px** |
| Section title | **15px** | **15px** |
| Card title | **14px** | **14px** |
| Body | **12px** | **12px** |
| Meta | **10px** | **10px** |

**Minimum body size on small viewports:** project may enforce **12px** floor via `globals.css` — do not go below for primary operational copy.

### Tables

- **Desktop only.** Never table layout for primary mobile admin/cast lists — use cards.

### Bottom navigation (mobile admin)

| Token | Value |
|-------|--------|
| Height | **64px** |
| Safe area | Respect `env(safe-area-inset-bottom)` |
| Main content bottom padding | **≥ 88px** so CTAs sit above nav |

---

## 12. Alignment and consistency

**Tie-in:** All numeric layout above must satisfy these rules — tokens are not negotiable individually.

### Horizontal

- Cards in the **same row**: **equal height**.
- **Section headers** in one band: **same baseline**.
- **KPI row:** equal height cards.
- **Approval lanes:** fixed **3-column** layout; columns **equal width** (grid/flex with explicit fractions — no uneven auto tracks); cards **100%** of lane width.

### Vertical rhythm

- Only spacing tokens: **8 / 12 / 16 / 24**.
- No arbitrary margins (e.g. 13px, 22px).
- **Section gap:** always **24px**.
- Card internal padding: **symmetric** top/bottom unless a single asymmetric element is documented.

### Grid

- **Desktop:** 12-column mental grid for alignment.
- **Approval:** three equal lanes + §11 lane metrics.

### Component consistency

- Same component type → same **height, padding, font-size, radius** everywhere.

### No visual drift

- No mixed button heights, mixed radii, mixed weights in one hierarchy, uneven line-heights for the same role.

### Empty space

- Intentional only: **structural** (scale token) or **grouping**. No meaningless dead zones.

### Card density

- Do not stretch cards vertically without content; do not over-compress; readability beats ornament.

### Scroll

- Scroll only where needed. **Nested scroll:** allowed for **approval lanes**; **avoid** on standard pages.

### Anti-patterns

- Uneven card heights in one row; random spacing; mixed font sizes at same level; floating misaligned elements; charts without meaning; excessive whitespace without grouping purpose.

---

**Document version:** Admin/cast rebuild baseline — align implementation with `CURRENT_STATE.md` (Phase 2 planning; Production Card Map completed).
