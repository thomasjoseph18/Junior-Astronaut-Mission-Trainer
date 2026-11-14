# BUILDSCAPES: Apollo to Artemis — Development Progress

Branch: `buildscapes-game` (original `main` history untouched).

## Verified in this session
- `npm test` -> 14/14 engine tests pass (Node 22, `--experimental-strip-types`). Run, not assumed.
- `tsc --noEmit -p .` (global TypeScript 6.0.3) -> 0 errors.
- NOT verified: `vite build` and the browser. The uploaded `node_modules` holds Windows-only binaries (rolldown, lightningcss, tsc 7) and the sandbox had no network. **Run `npm install && npm run build && npm test` locally first.**

## Phase 0 — Foundation (status: mostly done)
Done:
- `src/engine/simulation.ts`: pure engine extracted from the React hook. Equations copied unchanged.
- `src/hooks/useHabitatSimulation.ts`: now a thin wrapper; Moon and Mars keep independent progress (old code reset the sim on every destination switch).
- `src/engine/achievements.ts`: event-based rules. Fixes: solar threshold 8 -> 10 (matches on-screen criteria); oxygen/water/power achievements need sustained results at Sol end, not a button click; Sol-15 rule matches its criteria text; `first_touchdown` no longer pre-unlocked.
- Marker achievement IDs (`peak_light_scout`, `cryo_ice_prospector`, `apollo_historian`, `lunar_rover_driver`, and the Mars equivalents) never existed in data, so they were silent no-ops. Scenes and ExplorationView no longer get an unlock callback. `planetary_geologist` now needs `site_task_completed` events, which Phase 3/5 science tasks must emit.
- `src/engine/save.ts`: versioned save (v2), migration from legacy `buildscapes_achievements` / `buildscapes_explored_sites`, corrupt-save fallback. Journal now persists per destination (it was in-memory only).
- `App.tsx` uses the save. `tests/engine.test.ts` replaces the old self-referential `scripts/test_simulation_engine.mjs` (kept as `npm run test:legacy`, nothing deleted).

Remaining in Phase 0:
- Game state machine (intro -> command -> navigation -> moon/mars/habitat -> debrief), classic-mode switch, error boundary, WebGL detection/fallback, settings persistence (reduced motion, performance, audio, captions).
- Journal "classic" entries from `getInitialJournal` are seeded once per destination; confirm they look right in-browser.
- Persist `settings` and `viewedSites` into the save.

## Known issues found (not yet fixed)
- `ExplorationView` still keeps its own `buildscapes_explored_sites` localStorage key; migrate to `save.viewedSites`.
- `index.html` / Welcome UI use NASA logo styling. Replace with an original BUILDSCAPES emblem (the concept screenshot also shows a NASA logo; do not copy it).
- Existing POV scenes use separate height functions for terrain vs object placement; Phase 3 needs one shared terrain-height source.
- `PROJECT_AUDIT.md` is outdated (describes a pre-scaffold repo).

## Next steps (exact order)
1. Local: install, build, test, fix anything this session could not see.
2. Finish Phase 0 items above (state machine, error/WebGL handling, settings in save).
3. Phase 1: Apollo 13 cinematic (~100 s, skippable, captions, WebAudio radio sfx, REAL/FICTIONAL labels). Verify every date/fact against NASA sources before shipping; no graphic accident depiction.
4. Phase 2 onward as in the brief.
