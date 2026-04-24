# Shared Foundation — Animo Design System

This document defines the shared visual foundation used across all Animo admin interfaces (desktop and mobile).
It is the implementation reference for colors, surfaces, borders, typography, and shared component families.

---

## 1. Color System

### 1.1 Surface Colors

```
Page background:     #0b0b0d
Card surface deep:   #0a0a0a
Card surface mid:    #111111
Card surface light:  #1a1a1a
Foundation layer:    #393939
Divider / border:    #ffffff0a – #ffffff0f
Hover surface:       #ffffff05
```

### 1.2 Text Colors

```
Primary:     #f4f1ea    — Headings, KPI values, names
Secondary:   #c7c0b2    — Body text, data values
              #cbc3b3    — Alternate body (slightly warmer)
Muted:       #8a8478    — Labels, subtitles, descriptions
Dim:         #5a5650    — Table headers, placeholders, empty states
```

### 1.3 Accent Colors

```
Gold:           #dfbd69    — Icons, active indicators, accent elements
Gold gradient:  #D1B25E → #8F7130    — KPI values (background-clip: text)
Gold highlight: #E8D483 → #A78435    — Highlighted KPI variant
Gold bg tint:   #dfbd691a             — Icon backgrounds
```

### 1.4 Semantic Colors

| State | Foreground | Background (14% opacity) | Border (2e opacity) | Dot |
|-------|-----------|-------------------------|---------------------|-----|
| Success / Confirmed | `#72b894` | `#50a06414` | `#50a0642e` | `#72b894` |
| Warning / Pending | `#c8884d` | `#c8823214` | `#c882322e` | `#c8884d` |
| Danger / Alert | `#d4785a` | `#c8643c1a` | `#c8643c26` | `#d4785a` |
| Neutral / Muted | `#8a8478` | `#8a847814` | `#8a84782e` | `#8a8478` |
| Accent / Trial | `#dfbd69` | `#dfbd6914` | `#dfbd692e` | `#dfbd69` |

---

## 2. Surface Rules

### 2.1 Card Premium Skin (`.card-premium-skin`)

The canonical shared surface for all admin panels. Defined in `globals.css`.

**Architecture (4 layers):**

1. **Root element** — Positioning wrapper with `isolation: isolate`
2. **`::after`** — Dark gold foundation (z-index: -2). Inset: `--dark-gold-bezel` (default 7px)
3. **`::before`** — Bright gold metallic layer (z-index: -1). Inset: `--bright-gold-bezel` (default 3px)
4. **`__surface`** — Front dark gloss surface (z-index: 0). Black mirror with radial micro-highlight

**Content** sits at z-index: 1, always above decoration layers.

**Interaction states:**
- Hover: bezels expand by 1px
- Active: bezels collapse to 0–1px, card translates 2px down-right

**Usage:**
```html
<div class="card-premium-skin rounded-[18px]">
  <div class="card-premium-skin__surface rounded-[18px]">
    <!-- content here -->
  </div>
</div>
```

### 2.2 KPI Card (`.kpi-card`)

Specialized card variant for dashboard KPI metrics. Fixed dimensions.

**Dimensions:** 183px × 151px, border-radius: 18px

**Architecture (4 layers):**

1. `__base` — Black foundation (#393939) with drop shadow
2. `__gold-back` — Rear gold layer (offset 3px, metallic gradient)
3. `__gold-accent` — Front gold layer (offset 2px, 70% opacity gradient)
4. `__surface` — Front black mirror (offset 1px, 178×146px)

**Content layout:**
- `__icon` — Top-right (18px inset), gold color
- `__title` — 11px, #8A8478, centered
- `__value` — 30px bold, gradient text (#D1B25E → #8F7130)
- `__sub` — 11px, #8A8478, centered

**Variants:**
- `kpi-card--default` — Standard gold intensity
- `kpi-card--highlighted` — Brighter gold (brightness: 1.08), lighter value gradient

---

## 3. Border Rules

### 3.1 Dividers

```
Standard divider:   border-[#ffffff0a]     (4% white)
Section divider:    border-[#ffffff0f]     (6% white)
Subtle divider:     border-b-[0.56px]      (sub-pixel for headers)
```

### 3.2 Card Borders

Cards do not use visible borders. Depth comes from the gold bezel layers (`::before` / `::after`).

### 3.3 Badge / Pill Borders

Status pills use semantic border colors at low opacity (see Semantic Colors table, border column).

---

## 4. Radius and Depth

### 4.1 Border Radius Scale

```
Cards / Panels:     18px
Buttons:            10–12px
Icon containers:    7–10px
Input fields:       8px
Status pills:       20px (full round)
Tag chips:          6px
Score bars:         2–4px (sm rounded)
```

### 4.2 Depth (Shadows)

Cards derive depth from the gold bezel system, not from `box-shadow` alone.

```
Card foundation:    0 6px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.6)
Gold glow:          0 0 40px -8px rgba(200,140,0,0.2)
Badge shadow:       shadow-lg shadow-black/20 (Tailwind)
Avatar shadow:      shadow-2xl (Tailwind)
```

---

## 5. Typography

### 5.1 Font Stack

```
Sans (body/UI):     Noto Lao → Noto Sans JP → sans-serif
Serif (headings):   Cormorant → Noto Serif JP → serif
```

Tailwind utilities: `font-sans`, `font-serif`, `font-heading`, `font-ui`

### 5.2 Type Scale (Admin)

| Token | Size | Weight | Tracking | Color | Usage |
|-------|------|--------|----------|-------|-------|
| page-title | 22px | 700 | tight | `#f4f1ea` | Page H1 |
| section-title | 17px | 700 | -0.1px | `#f4f1ea` | Panel headers |
| card-title | 13px | 600–700 | -0.08px | `#f4f1ea` | Card headers |
| section-label | 10px | 700 | 2.5px | `#5a5650` | OVERVIEW, MANAGEMENT MEMO |
| kpi-value | 30px | 700 | -0.2px | gradient | Dashboard numbers |
| kpi-title | 11px | 500 | 0.064px | `#8a8478` | KPI labels |
| body | 13–14px | 500 | 0.2px | `#c7c0b2` | General text |
| label | 11–12px | 500–700 | 0.06–0.1px | `#8a8478` | Descriptions, subtitles |
| table-header | 9–10px | 700 | 0.71–1.5px | `#5a5650` | Column headers (uppercase) |
| badge | 10px | 700 | 0.12–0.5px | semantic | Status badges (uppercase) |
| data-value | 12px | 700 | tight | `#cbc3b3` | Table data |

### 5.3 Mobile Text Normalization

Enforced in `globals.css`:
```css
@media (max-width: 767px) {
  .text-[9px], .text-[10px], .text-[11px] {
    font-size: 12px !important;
    line-height: 1.45 !important;
  }
}
```

---

## 6. Shared Component Families

### 6.1 Panel Header

Standard header for `.card-premium-skin` panels.

```
Height:          64px (compact) or 88px (full)
Padding:         px-5 (compact) or px-10 (full)
Border bottom:   border-b border-[#ffffff0f] or border-b-[0.56px]
Icon container:  33px × 33px (compact) or 42px × 42px (full)
Icon bg:         bg-[#dfbd691a]
Icon radius:     rounded-[7px] or rounded-[10px]
Title:           13px (compact) or 17px (full), font-bold, #f4f1ea
Subtitle:        11px (compact) or 12px (full), #8a8478
```

### 6.2 Table Layout

```
Header row:      h-[42px] (compact) or h-[56px] (full)
Header bg:       bg-white/1
Header text:     9–10px, bold, uppercase, tracking-[0.71–1.5px], #5a5650
Data row:        min-h-[52px] (compact) or min-h-[72px] (full)
Row hover:       hover:bg-[#ffffff05]
Row divider:     divide-y divide-[#ffffff0a]
Horizontal scroll: min-w-[800–900px] with .custom-scrollbar
```

### 6.3 Avatar

```
Size:            40px × 40px (standard), 20px × 20px (compact)
Shape:           rounded-full
Border:          border border-[#ffffff0a]
Background:      bg-[#1c1d22]
Fallback:        Initial character, 11px bold, #5a5650
Ring overlay:    ring-1 ring-inset ring-white/10 rounded-full
```

---

## 7. Status Pill Rules

All status indicators use a consistent pill pattern.

```html
<div class="flex items-center gap-1.5–2 px-2.5–4 py-1–1.5 {bg} rounded-full border {border}">
  <div class="w-[5–6px] h-[5–6px] rounded-full {dot}" />
  <span class="text-[10px] font-bold tracking-[0.12–0.5px] uppercase {textColor}">
    {label}
  </span>
</div>
```

**Sizes:**
- Compact: `px-2.5 py-1`, dot 5px, min-w-[76px]
- Standard: `px-4 py-1.5`, dot 6px, min-w-[90px]

**Never:**
- Invent new status colors outside the semantic palette
- Use different pill shapes on the same page
- Mix pill sizes within a single table

---

## 8. Button Rules

### 8.1 Primary CTA

```
Background:    linear-gradient(90deg, #dfbd69 0%, #926f34 100%)
Text:          13px bold, #0b0b0d
Radius:        12px
Padding:       px-6 py-3
Hover:         scale(1.03)
Active:        scale(0.98)
Shadow:        shadow-xl shadow-gold/20
```

### 8.2 Secondary / Ghost

```
Background:    bg-white/4 or bg-[#ffffff0a]
Border:        border border-gold/40 or border-[#ffffff0f]
Text:          12px bold, #dfbd69 or #8a8478
Radius:        10px
Height:        40px
Hover:         bg-[#dfbd6910]
```

### 8.3 Add / Action Button (Small)

```
Background:    bg-[#ffffff0a]
Border:        border-[1.5px] border-[#dfbd6940]
Text:          11px bold, #8a8478
Radius:        8px
Height:        30px
Icon:          Plus 12px
```

---

## 9. Table Rules

### 9.1 Column Width Strategy

Use fixed pixel widths for structured columns, `flex-1` for variable content.

```
Name column:       w-[280px] (desktop), w-section-mobile (mobile)
Time column:       w-section
Status column:     w-[110–140px]
Count column:      w-[34–60px]
Note column:       w-[150px]
Variable content:  flex-1
```

### 9.2 Time Display

```html
<div class="inline-flex items-center gap-2 bg-gold/5 px-3 py-1.5 rounded-[6px] border border-gold/10">
  <span class="text-[14px] font-bold text-gold">{start}</span>
  <span class="text-[#5a5650]">—</span>
  <span class="text-[#8a8478]">{end}</span>
</div>
```

### 9.3 Tag Chips

```
Background:    bg-white/3
Border:        border border-white/5
Radius:        6px
Text:          10px semibold, #8a8478
Hover:         text-[#dfbd69]
Padding:       px-2.5 py-1
```

---

## 10. Icon Rules

- Library: Lucide React
- Default stroke width: 2.5
- Sizes: 14px (small), 16px (standard), 18px (medium), 20px (large)
- Colors: `#dfbd69` (accent), `#8a8478` (muted), `#5a5650` (dim)
- Icon containers: centered, rounded, gold-tinted background
