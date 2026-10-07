---
name: add-room-object
description: Add a new piece of furniture or an interactive object (a new portfolio section or an easter egg) to the 3D developer room in this project. Use when asked to add, move or make clickable any object in the room.
---

# Add an object to the room

The room is built from code (no model files). Every object follows the same pattern.

## 1. Place it

Add its position (and size, if the character should not walk through it) to
`src/scene/layout.ts`. World units: the floor spans x ∈ [-5, 5], z ∈ [-4, 4]; the back
wall is z = -4, the left wall x = -5. The character is about 1.3 units tall.

If it stands on the floor, add a footprint to `FOOTPRINTS` so the A* nav grid
(`src/scene/nav.ts`) routes around it. Leave at least ~0.7 units of free floor for paths.

## 2. Model it

Create `src/Objects/<Name>.tsx`. Build from the toon primitives in
`src/scene/primitives.tsx` (`RBox`, `Ball`, `Cyl`, `Cap`, `Toon`), which already apply
the cel-shading gradient and ink outlines. Use pastel colors; keep outlines on for big
shapes and `outline={false}` for tiny details. Add `castShadow` only on large parts.

Animate in `useFrame` by mutating refs, never React state. For a reaction to clicks,
read a counter from `useStore.getState().pokes` and compare with the last seen value
(see `Plant.tsx` and `Cat.tsx`). Puffs/particles: `spawnPuff()` from `src/scene/puffPool.ts`.

## 3. Make it interactive (optional)

1. Add an id to `Section` or `EasterEgg` in `src/scene/objects.ts`, and an entry in
   `OBJECTS` with `label`, `emoji`, `labelPos`, and (if the character should walk there)
   `interact: { x, z, heading }`. Heading: 0 faces +z, π faces the back wall, -π/2 faces
   the left wall. Check the interaction point is walkable (outside inflated footprints).
2. Wrap the mesh group in `<Interactive id="...">` (`src/Objects/Interactive.tsx`). That
   gives hover cursor, bounce, the floating label and click-to-walk.
3. Easter egg: add its reaction to `triggerEasterEgg` in `src/Character/commands.ts`,
   and add the id to `pokes` in `src/store/useStore.ts`.
   New section: add a lazy panel in `src/Panels/Panels.tsx`, using `PanelShell`
   from `src/Panels/Dialog.tsx`, and add the id to `SECTIONS` so quick-nav and the help
   card list it. Put its content in `src/content/portfolio.ts` and show it in
   `src/classic/ClassicView.tsx` too.

## 4. Mount and verify

Render it from `src/Objects/Furniture.tsx`. Then run `npm run lint`, `npx tsc -b`, start
the dev server, and check it visually: walk to it, press E, click it, and look at both
day and night (lighting changes) and a phone-sized viewport.
