# Scan Page: Animated File Tree Hero

## Context
The repo scan page (`/scan`) currently shows a static hero image (`scan_hero.png`). We're replacing it with an interactive animated file tree that visually communicates "scanning files" and responds to mouse movement with a 3D parallax tilt effect.

## Scope
- Create `ScanHeroTree` client component
- Replace the hero image in `src/app/scan/page.tsx`
- No changes to scan functionality or other components
- The "scanning in progress" animation is out of scope (future work)

## Component: `ScanHeroTree`

**File:** `src/components/agenthub/ScanHeroTree.tsx`

### File tree data
Static mock project structure:
```
src/
  components/
    Button.tsx
    Modal.tsx
    Layout.tsx
  lib/
    utils.ts
    api.ts
  app/
    page.tsx
    layout.tsx
package.json
tsconfig.json
README.md
```

### Cascade reveal animation
- Each line appears with a staggered delay (~80-100ms per line)
- Folders: chevron icon rotates from 0 to 90 degrees as they "expand"
- Files: fade in + slight translateX from left
- After all lines are revealed, hold for ~3 seconds, then fade out and restart the loop
- Pure CSS animations via Tailwind `animate-` classes and inline `animationDelay`

### File extension color coding
| Extension | Color | Tailwind |
|-----------|-------|----------|
| `.tsx/.ts` | Coral/red | `text-[#ff8c7e]` |
| `.py` | Green | `text-emerald-400` |
| `.json` | Amber | `text-amber-400` |
| `.yml` | Purple | `text-purple-400` |
| `.md` | Gray | `text-[#9ca3bb]` |

### Mouse interactivity
- Container uses CSS `perspective: 800px`
- `onMouseMove` tracks cursor position relative to container center
- Applies `rotateX` and `rotateY` transforms (clamped to +/-8 degrees)
- A radial gradient spotlight (`rgba(231,76,60,0.06)`) follows the mouse position
- `onMouseLeave` smoothly resets to neutral (0,0) with a 500ms transition
- All transforms via `requestAnimationFrame` for performance

### Container styling
- Monospace font (`font-mono`)
- Dark surface: `border border-white/10 bg-[#0a0a0c]/95 rounded-2xl`
- Max width: `max-w-2xl`, centered
- Faded edges: inner `box-shadow` or pseudo-element radial gradient fading into `#080808`
- Padding: `p-6 md:p-8`

## Integration

**File:** `src/app/scan/page.tsx`

Remove the current hero image block (the `<div>` with the background image and gradient overlays) and replace with `<ScanHeroTree />` in the same position above the heading.

## Verification
1. `npm run build` passes
2. Visit `/scan` — file tree animates in line by line, loops
3. Move mouse over the tree — 3D tilt and spotlight follow cursor
4. Resize to mobile — tree remains readable, tilt effect still works on touch
