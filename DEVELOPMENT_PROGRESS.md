# BUILDSCAPES: Apollo to Artemis — Development Progress (checkpoint backup)

## Update — Moon surface render freeze fix (2026-11-15)

- **Branch:** `integrate-game-fix`.
- **Fix:** Removed the positive `useFrame` priority from `SurfaceScene`, restoring React Three Fiber's automatic rendering after the Moon surface mounts.
- **Regression guard:** Added a test that rejects positive numeric priorities in `src/game` frame callbacks.
- **Validation:** `npm test` passed (55/55); `npm run build` passed (TypeScript and Vite production build); `git diff --check` passed.
- **Browser verification:** The user confirmed the Habitat-to-Moon transition works in the local browser. The supplied `frames-advance.py` helper was not added.
- **GitHub commit:** `f5b569de8875d56abb399756356ae101c542f0c0` committed the fix and also removed the earlier accidental archive-command file.
- **Cleanup:** The accidental terminal-output file `how --stat d776676` was removed in a follow-up cleanup commit. The Figma CSS commit remains in branch history.

- Git branch: `buildscapes-game` (main untouched)
- Code checkpoint commit: `8a2bc3e` (parent `b587d60`). A follow-up docs commit may sit on top of it.
- `docs/buildscapes-game-checkpoint.patch` = that commit as a `git am` patch for your existing repo.
- Phase 0 notes are preserved in `docs/PHASE0_PROGRESS.md`.

## What is completed (code exists and typechecks)
**Engine (pure, unit-tested):** `src/engine/field.ts` (suit O2/power/health, radiation + solar storms, rover battery/damage, food + hydroponics, crew health, refill costs drawn from the habitat), `src/engine/objectives.ts` (9 objectives per planet, 8 site tasks with cadet quizzes, XP, ranks, mission scoring/stars), save additions (`field` per destination, `game` progress; save version stays 2, old saves migrate), `resetDestinationProgress`. Phase 0 simulation untouched; hook gained `getState`, `drawResources`, and `advanceSol` now returns the new state.

**Game layer `src/game/`:** `GameApp.tsx` (one persistent WebGL canvas, scene routing, fades/loading cover, SceneApi, pause/Esc, hotkeys J K O N, NOVA bubble, toasts, Sol briefing, debrief), `FirstPersonRig.tsx` (pointer-lock look + drag-look fallback, WASD, collision, low-gravity hop, proximity interaction with hold-E), scenes: `IntroScene` (Apollo 13 3D cinematic), `CommandScene`, `HabitatScene`, `SurfaceScene` (Moon + Mars, drivable rover, sites, solar array, sample station, charge pad), `DebriefScene`; `terrain.ts` (shared deterministic heightfield: Moon south pole with PSR crater/Shackleton rim, Mars Jezero delta/glacier ridge), `props.tsx`, `textures.ts` (procedural, no external assets), `audio.ts` (procedural WebAudio + optional speech), HUD/panels/cinematic/debrief UI in `src/game/ui/`, `game.css`.
**Data:** `src/data/apollo13.ts` (16 beats tagged REAL vs STORY, exact quote only for "Houston, we've had a problem", sources + disclaimer).
**Default UI mode is now `game`** (`DEFAULT_UI_MODE`); Classic Mode still works from Pause > Switch to Classic / Settings. Existing saves that already stored `uiMode: classic` stay classic.

## Verified by actually running (authoring sandbox)
| Check | Result |
|---|---|
| `tsc --noEmit` | 0 errors |
| `npm test` | 54 tests, 54 pass, 0 fail (34 Phase 0 + 20 new in `tests/game.test.ts`). One Phase 0 assertion changed on purpose: `DEFAULT_UI_MODE` now `'game'`. |
| esbuild bundle of `src/main.tsx` (stand-in for Vite) | builds |
| Headless Chromium, software WebGL | Verified visually: title card, Apollo 13 beats (launch, bang + vent + red alert, tank diagram, Moon flyby, splashdown, story/Orion), Command Centre (globe, NOVA, astronaut, HUD), mission-selection panel (opened by walking to the table + E), habitat interior, Moon surface (base, dome, solar array, lander, rover, Earth, beacons, PSR crater). Zero console errors on those paths. |
| `vite build` | **NOT RUN** (sandbox has Windows-only native binaries, no network) |
| Real GPU, pointer lock, audio, speech, touch | **NOT RUN** |

## Not yet verified at runtime (code written, never exercised in a browser)
Mars scene visuals; rover driving; hold-E site tasks -> site panel -> quiz; sample drilling; solar cleaning; suit refill; sleeping/Sol briefing; autopilot; debrief and Mars unlock; Artemis briefing; save/load through the UI; restart mission; low-suit emergencies; WebGL-fallback screen inside the game; the intro keyboard controls; replay from Pause.

## Known bugs / rough edges
1. Habitat interior is dark/low-contrast (floor nearly black); hydroponic plants small. Brighten floor + add emissive.
2. Habitat/Command scenes are fragment-heavy in software GL (~2 fps there); expected fine on a GPU but not measured. Point lights were already trimmed.
3. Moon ground still dark outside the sun's lit side; tune `SurfaceLights`/`MOON_TONES` after looking at all sites.
4. Hold-E prompt text is reformatted by `Prompt` in Hud.tsx; verify wording of every prompt.
5. Compass/radar show every marker; no "done" styling yet.
6. `closePanel` in GameApp has a leftover no-op for the site panel; NOVA does not comment after a site finishes.
7. Controls are keyboard + mouse only (no touch).
8. Fonts (Orbitron/Rajdhani) rely on the existing Google Fonts link; fallback fonts are used offline.
9. Boulders: all `solid` ones are colliders (fine); no footprints/dust puffs.
10. The `#debug` URL hash exposes `window.__bsGame/__bsPlayer/__bsThree` for automated tests (harmless; remove if undesired).

## Exact next steps
1. `npm install && npm run typecheck && npm test && npm run build && npm run dev`; fix anything Vite reports.
2. Play-through in a real browser: intro -> command table -> Launch -> habitat -> airlock -> Moon. Fix whatever breaks (see "Not yet verified").
3. Use `scripts/sandbox-visual-test` ideas or the browser to check Mars, rover, PSR crater, all 8 sites.
4. Brighten habitat; balance suit drain (`SUIT_RATES` in `field.ts`) against distances in `terrain.ts`.
5. Add NOVA reactions to site completion, journal entries for achievements, and a short first-run tutorial.
6. Profile on a laptop GPU; if slow, lower `boulderCount`, terrain segments, or disable shadows by default.
7. Write the final README feature list + NASA attribution/credits screen.

## Tests / build commands
`npm run typecheck` · `npm test` · `npm run build` · `npm run dev`. Tests need Node >= 22.6.
