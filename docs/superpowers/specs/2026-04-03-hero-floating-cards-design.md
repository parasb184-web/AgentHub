# Hero Section: Floating Agent Cards Background

## Context
The homepage hero currently uses a static background image. We're adding an alternative "cards" variant where small agent preview cards float behind the heading with mouse parallax, making the hero interactive.

## Scope
- New component: `HeroFloatingCards`
- Add `variant` prop to `HeroSection` ("static" | "cards")
- Switch `page.tsx` to use `variant="cards"`

## Component: `HeroFloatingCards`
**File:** `src/components/agenthub/HeroFloatingCards.tsx`

### Card data
6-8 agent cards with name, category, color, language, positioned at fixed coordinates with depth layers.

### Animation
- Each card floats with CSS `float-slow` animation at staggered delays/durations
- Mouse parallax: cards translate based on cursor position, scaled by depth (near=1x, mid=0.6x, far=0.3x)
- Cards at 0.5-0.75 opacity to not compete with heading text
- Smooth reset on mouse leave

### Styling
- Small rounded cards with border, category color accent, monospace labels
- 3 depth layers for parallax effect

## Integration: `HeroSection`
**File:** `src/components/agenthub/HeroSection.tsx`

- Add `variant?: "static" | "cards"` prop, default "static"
- "static" renders current Image background
- "cards" renders `<HeroFloatingCards />` instead of Image blocks

## Verification
1. `npm run build` passes
2. Visit `/` — floating cards animate behind heading, respond to mouse
3. Change prop to "static" — original image background returns
