# BUILDSCAPES: Apollo to Artemis — Development Progress (checkpoint backup)

## Update — Recovery comparison and Mars runtime validation (2026-11-15)

- **Recovery baseline:** isolated source archive of `origin/integrate-game-fix` at `a6d3cea`. During the comparison, the original checkout was at `f5b569d`; it was later fast-forwarded outside this task and is now at `a6d3cea`.
- **Recovery bundle:** ZIP integrity passed and all 19 manifest-listed hashes matched. The Moon render fix and regression guard were already present. No files were restored; `restore.py` was not run. Linux-oriented browser helpers remain references and were not copied into the project.
- **Browser QA:** used the integrated browser on Windows against the scratch Vite server. Confirmed Command Centre, Mars Habitat and Mars surface render; habitat/surface transitions; Mars sample collection; all four site hold-E interactions and quiz results (one incorrect and three correct); sample/site XP and journal entries; rover boarding, driving, steering, braking and exit; solar cleaning; suit drain/refill; five habitat system inspections; hydroponics harvest; and power allocation.
- **Screenshots captured:** Command Centre, Mars Surface HUD, Mars Habitat, Sol 9 storm HUD, MOXIE quiz, and the final Mars debrief are attached in the development chat.
- **Storms and progression:** observed Mars storm briefings at Sols 9, 18 and 25. On Sol 9 the storm HUD/warning appeared and radiation increased during surface exposure; radiation faded while sheltered. Cleaned the array at Sols 9, 15, 21 and 27. All 9 objectives completed.
- **Victory/debrief:** managed communications power and crop harvests, then completed the 30-Sol mission. Debrief showed success, 3/3 stars, 4/4 sites, 9/9 objectives, O₂ 100%, water 67%, battery 100%, food 88%, crew health 100%, and zero suit recoveries.
- **XP correction:** browser QA found the debrief reported 665 XP while the saved total was 660. The result calculation counted the initial Sol as an XP award even though gameplay awards Sol XP only when advancing. Changed it to count `currentSol - 1` advances and added a regression assertion; a fresh browser load then showed `+660 XP` and `660 XP total`.
- **Applied after approval:** the XP correction was applied to the original checkout in `src/engine/objectives.ts`, `tests/game.test.ts`, and this progress file. No commit, push, or merge was made.
- **Validation on the original checkout:** `npm run typecheck`, `npm test` (55/55), `npm run build` (TypeScript and Vite), and `git diff --check` all passed. Node emitted only the existing `module.register()` deprecation warning.
- **Still unverified:** genuine Moon-victory-to-Mars-unlock browser flow; rover charge-pad interaction; suit-emergency recovery; Classic Mode and restart UI; WebGL fallback; Artemis briefing; real-GPU performance. The unit test covers Mars unlock rules, but that is not a browser verification.
- **Next:** verify the genuine Moon victory -> Mars unlock flow in a browser, then continue with the remaining checks above. Keep the Moon habitat-exit regression on the QA list.

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

## Still not verified at runtime (after the 2026-11-15 Mars browser run)
Genuine Moon-victory-to-Mars-unlock browser flow; rover charge-pad interaction; suit-emergency recovery; autopilot; Classic Mode and restart UI; WebGL-fallback screen inside the game; Artemis briefing; save/load through the UI; the intro keyboard controls; replay from Pause; real-GPU performance.

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
1. Review the scratch-only XP fix and its patch; do not apply it to the original checkout without permission.
2. Verify the genuine Moon victory -> Mars unlock flow in a browser.
3. Test the rover charge pad, suit-emergency recovery, save/load, restart, Classic Mode, WebGL fallback, and Artemis briefing.
4. Recheck the Moon habitat-exit transition and evaluate real-GPU performance.
5. Continue focused gameplay polish only after those checks.

## Tests / build commands
`npm run typecheck` · `npm test` · `npm run build` · `npm run dev`. Tests need Node >= 22.6.
