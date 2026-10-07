# Developer's Room: an interactive 3D portfolio

A cozy, cel-shaded cartoon bedroom that visitors explore by walking a little chibi version
of you around. Every portfolio section lives inside an object:

| Object             | Section                | What happens                                                                            |
| ------------------ | ---------------------- | --------------------------------------------------------------------------------------- |
| 💻 Desk and laptop | Projects               | You sit down, the camera moves in, and a cartoon OS opens with one app icon per project |
| 📚 Bookshelf       | Skills                 | One shelf per category, one book per skill; pull a book out to see its level            |
| 📌 Corkboard       | Experience & education | Pinned sticky notes joined by red string                                                |
| 🪞 Mirror          | About me               | Portrait, bio, fun facts, résumé download                                               |
| ☎️ Phone and door  | Contact                | Social links and a postcard that opens the visitor's email app                          |
| 🪟 Window          | Easter egg             | Day ↔ night: lights change, the lamp turns on, stars come out                           |
| 🐈 🪴 ☕ 💡        | Easter eggs            | The cat meows, the plant wiggles, the coffee steams, the lamp clicks                    |

There is also a **classic view**: a plain, fast, accessible single page with the same
content. It is linked from the loading screen and the top bar. It opens automatically
when the device has no WebGL, and it is suggested to visitors who prefer reduced motion.

## Run it

Requires Node 20.19+ (tested with Node 22).

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. Other scripts:

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run build`   | Type-checks and builds to `dist/`                |
| `npm run preview` | Serves the production build locally              |
| `npm run lint`    | ESLint (TypeScript + React hooks/compiler rules) |
| `npm run format`  | Prettier                                         |

## Edit your content

**Everything personal is in one file: [`src/content/portfolio.ts`](src/content/portfolio.ts).**
The 3D room, panels, classic view, page title and social-sharing tags all read from it.
Every placeholder is marked `TODO: replace`. Fill in:

1. `name`, `title`, `location`
2. `bio` (one string per paragraph) and `funFacts`
3. `email` and `socials` (GitHub, LinkedIn, email; `icon` can also be `x`, `globe`, `dribbble`, `youtube`)
4. `projects`: title, tagline, description, tech list, `liveUrl`/`repoUrl`, `year`, an emoji `icon` and a tile `color`.
   3 to 6 projects fit the laptop desktop best.
5. `skills`: categories become shelves (the first four are shown on the 3D bookshelf); `level` is 1–5
6. `experience` and `education`, newest first
7. `petName` for the cat
8. `seo.description` and `seo.siteUrl` (your deployed URL, used for link previews)

Then replace the files in `public/`:

- `public/resume.pdf`: your résumé
- `public/projects/*`: project screenshots. Use 16:10 images (for example 1280×800 WebP or
  PNG), and point each project's `images` array at them. The first image is the cover.
- `public/og.png`: the 1200×630 link-preview image (see below)
- `public/favicon.svg`: optional

## Change the avatar

Edit `avatar` in `src/content/portfolio.ts`:

```ts
avatar: {
  skin: '#e8b48f',          // any hex color
  hairStyle: 'short',       // 'short' | 'curly' | 'long' | 'bun' | 'spiky' | 'buzz'
  hairColor: '#2e2420',
  eyeColor: '#2d2541',
  glasses: true,
  glassesColor: '#2d2541',
  facialHair: 'none',       // 'none' | 'beard' | 'mustache'
  headphones: false,
  hoodie: '#7c9cff',
  pants: '#45406b',
  shoes: '#fffaf0',
},
```

The same config drives the 3D character (`src/Character/Avatar.tsx`) and the flat
portrait used in the top bar, the mirror and the classic view
(`src/Panels/AvatarPortrait.tsx`). If you want a hairstyle that doesn't exist yet, add a
case in both files.

## Regenerate the link-preview image

`public/og.png` is a render of the room. After changing the avatar or colors, run the dev
server, open the room in a 1200×630 browser window, enter, and take a screenshot.

## Deploy

The site is fully static. There is no backend, and the contact form uses `mailto:`.

- **Vercel**: import the repo. It detects Vite (build `npm run build`, output `dist`).
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: for a user site (`username.github.io`) or a custom domain, publish
  `dist/` as is. For a project site served from `/<repo>/`, add `base: '/<repo>/'` to
  `vite.config.ts` and include the sub-path in `seo.siteUrl`. Asset paths in the content
  file are resolved against `base` automatically. A simple option is the official
  "Deploy static content to Pages" GitHub Action pointed at `dist/`.

Remember to set `seo.siteUrl`, so link previews point at your real domain.

## How it's built

- **Vite + React 19 + TypeScript**, **React Three Fiber** + **drei** for the 3D scene,
  **zustand** for state, **motion** (Framer Motion) for UI animation.
- **Cartoon look**: `MeshToonMaterial` with a 3-step gradient ramp, drei `<Outlines>` for
  ink lines, flat (no tone-mapping) pastel colors, and a single soft shadow-casting light.
  Every object is built from rounded primitives in code, so there are no model downloads.
- **Character**: procedural chibi built from primitives, animated with code. Each
  animation (idle, walk, sit and type, wave, reach, stretch, phone, sip) is a function
  returning joint angles, and the controller cross-fades between them every frame. Walking
  adds squash-and-stretch and dust puffs.
- **Movement**: a nav grid built from furniture footprints, A* pathfinding with path
  smoothing for click-to-move, and sliding collision for WASD and the joystick.
- **Sound**: every effect is synthesized with the Web Audio API (no audio files). It is
  muted until the visitor turns it on.
- **Floating labels and speech bubbles** are plain DOM elements positioned by projecting
  3D points each frame. They stay accessible and avoid extra React roots.

### Deviations from the original brief, and why

- **No physics engine (Rapier).** The room is static, so a nav grid with A* does the job
  (click-to-move has to route around furniture anyway). Collision for keyboard movement
  uses the same footprints, and this avoids ~1–2 MB of WASM.
- **No GSAP.** Camera moves use `maath` damping, which is smaller and can be interrupted
  mid-move.
- **No Howler.** Synthesized Web Audio effects need no downloads or licenses.
- **three.js pinned to r182.** React Three Fiber 9 still uses `THREE.Clock`, which logs a
  deprecation warning from r183 on. Bump three once R3F switches to `THREE.Timer`.

### Performance

- Initial download: ~105 kB gzipped JS for the loader and UI. The 3D chunk (~270 kB
  gzipped, three.js included) loads lazily, and each panel is its own small chunk.
- Device pixel ratio capped at 2, dropping to 1.25 if the frame rate dips
  (`PerformanceMonitor`); one 1024² shadow map; instanced books, particles and fairy lights.

### Accessibility

- Every section is reachable from the quick-nav dock, and every easter egg from the help
  card (`?`), so nothing requires pointing at the 3D scene.
- Panels are real modal dialogs: focus moves in and is trapped, Esc closes, and focus
  returns afterwards.
- `prefers-reduced-motion` calms the camera and ambient motion and suggests the classic view.
- Checked with axe-core (WCAG 2.1 AA): no violations in the loader, room, all panels,
  the laptop OS or the classic view.

## Project structure

```
src/
  content/     portfolio.ts (your content), types, formatting helpers
  scene/       Experience, camera rig, lighting, layout, nav grid, toon primitives, particles
  Room/        floor and walls, window view and sunbeam, fairy lights
  Objects/     furniture and interactive objects (+ Interactive wrapper)
  Character/   avatar model, poses/animation, controller, commands
  UI/          loader, HUD, help card, joystick, floating labels, keyboard controls
  Panels/      panel shell (dialog), the five section panels, laptop OS
  classic/     classic single-page view
  store/       zustand store
```

To add a new object to the room, see `.claude/skills/add-room-object/SKILL.md`.
