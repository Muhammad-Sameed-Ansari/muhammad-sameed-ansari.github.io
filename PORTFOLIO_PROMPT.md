# Prompt: Build an Interactive Cartoon "Developer's Room" Portfolio

> For use in a Claude Code session running **Opus 5.5** with **high effort**, opened in this project folder. Build the project here, next to this file, and leave this file in place.

---

You are building my personal developer portfolio. It must **not** be a typical scroll-and-read portfolio. It is an **interactive, cartoon-style 3D room**, my developer bedroom/studio, that visitors explore by moving an animated character who represents me. Every piece of portfolio content is found by walking up to objects in the room and interacting with them.

Treat this as a polished product. Aim for a site people share because it is fun to use, not a tech demo.

## 1. Skills, tools and packages: you have full permission

- **Before writing code, look for skills and plugins that would help, and install them.** Use `SearchSkills` / `ListSkills` / `SearchPlugins` (and `SuggestPluginInstall` / `SuggestSkills` where available) with keywords like "frontend design", "three.js", "3D", "game", "animation", "web performance" and "accessibility". Load any relevant skill you already have, such as `frontend-design`, `run`, `built-in-browser` and `design:accessibility-review`, at the point where it applies.
- If no existing skill covers something you will repeat (for example, adding a new interactive room object), you may write one with `skill-creator`.
- Install any npm packages you need. Download free 3D models, textures, fonts, sounds and animations only from reputable sources with permissive licenses (CC0 preferred: Kenney.nl, Quaternius, Poly Pizza, Mixamo, ambientCG, Google Fonts). Record every asset and its license in `CREDITS.md`.
- Use web search for current library APIs instead of relying on memory, especially for React Three Fiber, drei, Rapier and Three.js, since their APIs change often.

## 2. Recommended stack

You may change any of these if you have a better reason, but explain why in the README.

- **Vite + React + TypeScript**
- **Three.js through React Three Fiber (`@react-three/fiber`) and `@react-three/drei`**
- **Cartoon look:** toon/cel shading (`MeshToonMaterial` with a gradient map), black outlines (drei `<Outlines>` or a post-processing outline pass), a soft pastel palette, chunky rounded geometry and baked-looking soft shadows
- **Movement and collision:** `@react-three/rapier`, or a simple nav-grid with A* pathfinding so the character walks around furniture rather than through it
- **State:** `zustand`
- **UI overlays and animation:** `framer-motion` for panels and transitions, and GSAP if you need camera tweens
- **Audio (optional, muted by default):** `howler`

## 3. The scene: my room

A cozy, slightly exaggerated cartoon room, seen from a **3/4 isometric-style camera** (angled down, like Animal Crossing or Habbo). The camera follows the character smoothly with gentle easing and limited zoom/rotate.

Required objects. Each one is interactive and maps to a portfolio section:

| Object | Section | Interaction |
|---|---|---|
| **Desk with laptop** (centerpiece) | **Projects** | The character sits down, the camera zooms into the laptop screen, and the screen shows a cartoon-OS "desktop" where each project is an app icon. Clicking an icon opens a window with screenshots, tech stack, description, and links to the live demo and repo. |
| **Bookshelf** | **Skills / Tech stack** | Books labelled with technologies, grouped by category. Hovering a book pulls it out slightly. |
| **Wall with framed certificates / corkboard** | **Experience & Education** | A timeline shown as pinned notes connected with string. |
| **Mirror or poster of me** | **About me** | A short bio, a fun facts card and a resume download button. |
| **Phone / mailbox / door** | **Contact** | Social links (GitHub, LinkedIn, email) and a contact form that opens the user's mail client via `mailto:` (no backend needed). |
| **Window** | Easter egg | Toggles day ↔ night. Lighting changes, the desk lamp turns on, and stars appear outside. |
| **Coffee mug, plant, cat bed or pet** | Easter eggs | Small fun reactions such as steam puffs, a plant wiggle or the cat meowing. |

Add environmental life: a slowly spinning desk fan, blinking LEDs on a PC tower, dust motes in a sunbeam, a ticking wall clock that shows the **visitor's real local time**, and code scrolling on a second monitor.

## 4. The character (me)

- A **cute, stylized cartoon avatar** with chibi proportions (big head, small body). Make it customizable through a single config: skin tone, hair style and color, glasses yes/no, hoodie color. I will set these to match my real look. **Ask me for my appearance details before finalizing it.**
- You may build it procedurally from primitives (capsules and spheres with toon shading and outlines) or use a rigged CC0 model such as Quaternius or Kenney characters with Mixamo animations. Choose whichever gives the most charming result, and make sure it actually animates.
- Required animations: **idle** (breathing, occasional blink or look-around), **walk**, **sit and type** at the desk, **wave** (on first load and when the visitor clicks the character), **interact/reach** (when using an object). Blend between them smoothly.
- On first load the character waves and shows a speech bubble: *"Hey! I'm [NAME]. Click anywhere to walk around my room 👋"*
- If the visitor does nothing for about 20 seconds, the character does something idle-fun (stretches, checks their phone, sips coffee).

## 5. Controls

- **Click/tap to move:** clicking the floor makes the character walk there along a path that avoids furniture. Show a small animated ring marker at the destination.
- **Keyboard:** WASD or arrow keys move directly. **E** or **Enter** interacts with the nearest object. **Esc** closes panels.
- **Clicking an object** makes the character walk to its interaction point and then open the section automatically.
- **Proximity prompts:** when the character is near an interactive object, the object glows or bounces and shows a floating label such as "📚 Skills · press E".
- **Mobile:** tap-to-move works, there is an optional on-screen joystick, and layout and panels are responsive.

## 6. UI and UX

- **Loading screen:** a cartoon progress bar (for example a coffee cup filling up) while assets load, then a "Enter my room" button. This also unlocks audio.
- **HUD:** a minimal top bar with my name and title, a mini "map" or quick-nav buttons to jump straight to each section (the character walks there), a sound toggle, and a day/night toggle.
- **Content panels:** hand-drawn or comic-style cards (thick outlines, slight rotation, paper texture). Use a playful but readable font pairing, such as a rounded display font for headings and a clean sans for body text.
- **"Classic view" fallback:** a button that switches to a plain, fast, fully accessible single-page HTML version of the same content, for recruiters in a hurry, screen-reader users, `prefers-reduced-motion`, and devices without WebGL (detect this and fall back automatically).

## 7. Content: one data file

All personal content lives in **one typed file** (for example `src/content/portfolio.ts`): name, title, bio, avatar config, projects (title, description, tech, images, links), skills, experience, education, socials and resume path. The 3D room reads from it, so I can update my portfolio without touching any 3D code. Fill it with clearly marked **placeholder content** (`TODO: replace`) and tell me exactly what to fill in.

## 8. Quality bar

- **Performance:** a steady 60fps on a mid-range laptop and smooth on modern phones. Use instancing where it helps, compressed GLTF (Draco/meshopt), KTX2 or WebP textures, lazy-loaded panel content, `dpr` capped at about 2, and shadows baked or limited. Target an initial load under about 5 MB.
- **Accessibility:** every interactive object can be reached from keyboard and quick-nav; panels are real DOM with proper focus management; color contrast meets WCAG AA; `prefers-reduced-motion` is respected.
- **SEO and sharing:** a proper `<title>`, meta description, Open Graph image (a nice render of the room) and favicon.
- **Code:** clean TypeScript, small components (`Room/`, `Character/`, `Objects/`, `UI/`, `Panels/`), no dead code, and ESLint and Prettier configured.

## 9. Process

1. **Plan first.** Before coding, give me a short plan: architecture, folder structure, asset sources, character approach, and a milestone list. Ask me for anything you need, at minimum my name, title, appearance for the avatar, and any real projects or links I want included.
2. Build in milestones and **verify each one visually** by running the dev server and checking it in the browser preview, using screenshots, console errors and both desktop and mobile viewport sizes:
   1. Project scaffold, the empty room, toon shading and the camera
   2. The character with idle and walk animations, plus click-to-move with pathfinding and collision
   3. Furniture, proximity prompts and interactions
   4. The laptop "desktop OS" projects view, then the other content panels
   5. Day/night, easter eggs, sound and ambient life
   6. Loading screen, classic-view fallback, mobile controls
   7. Performance, accessibility and SEO pass, then a production build
3. Fix every console error and warning before moving on. Do not claim something works without having seen it work.
4. Finish with a `README.md` that covers how to run, build and deploy (Vercel, Netlify or GitHub Pages), how to edit content, and how to change the avatar, plus `CREDITS.md`.

Make it delightful: small squash-and-stretch on the character's steps, bouncy UI, little particle puffs. The goal is that a visitor smiles within 5 seconds of landing.
