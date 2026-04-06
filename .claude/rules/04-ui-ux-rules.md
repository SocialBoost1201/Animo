# 04 — UI/UX Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity
> UI stack: Tailwind CSS v4, Framer Motion v12, GSAP 3, Lenis, Embla Carousel, Three.js

## Design System

### Typography
- All headings use `clamp()` for responsive sizing
- `max-width` applied to text containers
- H1 once per page; strict H1→H2→H3 hierarchy

### Spacing
- 8px base scale throughout
- Consistent vertical rhythm

### Buttons / CTAs
- Minimum 48px height
- CTA in hero, mid-section, footer
- Action-driven CTA text

### Mobile First
- Design at 375px viewport baseline
- All tap targets ≥ 48px
- No horizontal overflow

## Animation Rules

**GSAP**
- Initialize in `useEffect` with cleanup (`kill()` / `revert()`)
- ScrollTrigger must be refreshed after DOM changes
- Use `gsap.matchMedia()` for responsive animations
- Respect `prefers-reduced-motion`

**Framer Motion**
- Always add `"use client"` directive
- `key` prop mandatory on `AnimatePresence` children
- Set `useReducedMotion` check for accessibility

**Lenis (smooth scroll)**
- Configure in a dedicated `SmoothScroll` client component
- Clean up `lenis.destroy()` in the useEffect return

**Three.js / R3F**
- Dynamic import + `ssr: false` + `<Suspense>` wrapper mandatory
- Dispose geometries, materials, textures in useEffect cleanup

## Embla Carousel

Use `useEmblaCarousel` hook pattern. Do not add Swiper or other carousel libraries.
