---
name: ui-qa-check
description: Use for any UI change. Validates typography, spacing, CTAs, mobile, animation cleanup, and Three.js SSR safety before completing a UI task.
---

# UI QA Check

## When to Use

After any UI change before marking complete.

## Checklist

### Design System
- [ ] Headings use `clamp()` for responsive sizing
- [ ] Text containers have `max-width`
- [ ] H1 appears once; H1→H2→H3 hierarchy strict
- [ ] 8px spacing scale throughout
- [ ] Buttons ≥ 48px height
- [ ] CTAs in hero, mid-section, footer (full pages)

### Mobile (375px)
- [ ] No horizontal overflow
- [ ] Tap targets ≥ 48px
- [ ] Readable at mobile font sizes

### Animation
- [ ] `"use client"` on Framer Motion / GSAP / Lenis components
- [ ] `key` prop on `AnimatePresence` children
- [ ] GSAP cleanup in `useEffect` return (`kill()` / `revert()`)
- [ ] Lenis `destroy()` in cleanup
- [ ] Three.js dispose in cleanup
- [ ] `prefers-reduced-motion` respected

### Three.js / R3F
- [ ] Dynamic import + `ssr: false` + `<Suspense>`
- [ ] Geometry, material, texture disposed in cleanup

### Embla Carousel
- [ ] Uses `useEmblaCarousel` hook pattern

## Output

PASS/FAIL per section. Violations listed with suggested fixes.
