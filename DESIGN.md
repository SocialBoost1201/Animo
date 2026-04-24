# Animo Design Constitution

This file is the root design authority for the Animo project.
It defines brand principles, surface hierarchy, and points to detailed design rules.

---

## Visual Source of Truth

**Figma** is the single source of truth for all visual decisions.

- File: `Animo` (Figma team project)
- Desktop Admin: `Animo Dashboard` page
- Mobile Admin: `Animo Dashboard-Mobile` page
- Cast Dashboard: `Animo Cast Dashboard` page
- Public Site: `Animo Login Desktop` page

When Figma and code diverge, Figma wins.
When Figma is ambiguous, this document and `docs/design/` win.
When neither covers a case, escalate — do not invent.

---

## Brand Principles

1. **Black is the main surface.** Admin interfaces use dark surfaces (#0a0a0a – #1a1a1a).
2. **Gold is a controlled accent.** Used for values, active states, and thin bezels — never for large fills or thick ornamental frames.
3. **Quiet luxury over decoration.** Prefer subtle depth (layered shadows, micro-gradients) over loud visual effects.
4. **Information density over empty space.** Every pixel should serve operational clarity. Avoid oversized empty cards.
5. **Shared components, not one-off visuals.** Every new surface must use an existing component family or formally extend one.

---

## Surface Hierarchy (Admin)

| Layer | Role | Example |
|-------|------|---------|
| Page background | Deepest black | `#0b0b0d` |
| Card surface | Dark gloss panel | `.card-premium-skin__surface` |
| Gold bezel | Thin metallic edge (3–7px) | `.card-premium-skin::before/::after` |
| Content | Text, icons, badges | z-index: 1, always on top |

The `.card-premium-skin` class in `globals.css` is the canonical shared surface for all admin panels and cards.
KPI cards use a specialized variant (`.kpi-card`) with a 4-layer stack: base → gold-back → gold-accent → surface.

---

## Color System (Admin Surfaces)

| Token | Hex | Usage |
|-------|-----|-------|
| Surface black | `#0a0a0a` – `#1a1a1a` | Card backgrounds |
| Foundation | `#393939` | Deepest card layer |
| Text primary | `#f4f1ea` | Headings, values |
| Text secondary | `#c7c0b2` – `#cbc3b3` | Body text |
| Text muted | `#8a8478` | Labels, subtitles |
| Text dim | `#5a5650` | Table headers, placeholders |
| Gold accent | `#dfbd69` | Icons, active states |
| Gold gradient | `#D1B25E → #8F7130` | KPI values |
| Success | `#72b894` / bg `#50a064` | Confirmed states |
| Warning | `#c8884d` / bg `#c88232` | Pending, late states |
| Danger | `#d4785a` / bg `#c8643c` | Alerts, errors |

---

## Typography (Admin)

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Page title | `font-sans` (Noto Sans JP) | 22px | 700 |
| Section title | `font-sans` | 17px | 700 |
| Card title | `font-sans` | 13px | 600–700 |
| KPI value | `font-sans` (Inter) | 30px | 700 |
| Body | `font-sans` | 13–14px | 500 |
| Label | `font-sans` | 11–12px | 500–700 |
| Table header | `font-sans` | 9–10px | 700 |
| Badge | `font-sans` | 10px | 700 |

---

## Non-Negotiable Rules

1. **No thick gold frames.** Gold bezels are 3–7px. Anything larger is a bug.
2. **No oversized empty cards.** If a card has less than 3 data points, it is too large.
3. **No one-off status colors.** Use `StatusBadge` patterns: success/warning/danger/neutral/accent.
4. **No custom scrollbars without `.custom-scrollbar`.** Scrollable regions use the shared class.
5. **No inline font-family.** Always use Tailwind `font-sans` / `font-serif` / `font-heading`.
6. **Mobile minimum font: 12px.** Enforced via `globals.css` media query.
7. **Border radius: 18px for cards, 10–12px for buttons, 6–8px for badges.**

---

## Detailed Design Documents

| File | Scope |
|------|-------|
| [shared-foundation.md](docs/design/shared-foundation.md) | Color, surface, border, radius, depth, typography, shared components, status pills, buttons, tables |
| [mobile-admin.md](docs/design/mobile-admin.md) | Mobile admin layout, compact KPIs, urgent action blocks, operational lists, bottom nav, anti-patterns |

Future files (not yet created):
- `docs/design/mobile-cast.md` — Cast-side mobile interface
- `docs/design/public-site.md` — Public-facing website

---

## Implementation Notes

- Desktop admin is the parent visual system.
- Mobile admin is the compressed operational surface using the same design language.
- All admin components live in `components/features/admin/`.
- The canonical CSS surface is defined in `app/globals.css` (`.card-premium-skin` family).
- Do not duplicate design rules into `CLAUDE.md` or `AGENTS.md`.
