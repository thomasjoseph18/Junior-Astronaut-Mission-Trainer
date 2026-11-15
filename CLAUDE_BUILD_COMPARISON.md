# Claude Build Comparison

**Audit date:** 2026-11-15  
**Authoritative project:** `Junior-Astronaut-Mission-Trainer`, branch `integrate-game-fix`  
**Compared build:** `https://github.com/thomasjoseph18/TEST`

## Executive conclusion

Do **not** replace the authoritative project with `TEST`, and do not apply either recovery patch wholesale. The `TEST` repository is an older snapshot of the same game architecture: after normalizing Windows/Linux line endings, 87 of 95 tracked files shared by the two projects are byte-identical. Most Moon/Mars gameplay, engine, scenes, terrain, and tests are already present in the authoritative project.

The meaningful gaps are small, targeted changes described by the Claude snapshot: brighter habitat lighting, a NOVA follow-up after closing a site panel, and hiding the loading cover immediately when 3D rendering is unavailable. These may be considered separately after focused review and browser testing. They are not reasons to import the rest of the snapshot.

The Claude copy does **not** integrate NASA elevation data. Both projects use the same seeded procedural terrain implementation. NASA names in the educational content are descriptive references, not DEM data or a terrain-data pipeline.

## Revisions and worktree state

### Authoritative repository

- Branch: `integrate-game-fix`
- HEAD: `535d0c091ddb1793865d303ca9067be3d57660a6` — `Fix Mars XP calculation and regression tests`
- The checkout was clean at inspection: no staged, unstaged, or untracked changes; HEAD matched `origin/integrate-game-fix`.
- Relevant history:
  - `363ea42` — `FIXED THE GAME WITH POV MODEL`
  - `7a447ec` — Figma-aligned game UI polish
  - `f5b569d` — Moon surface render-freeze fix
  - `a6d3cea` — progress-record correction
  - `535d0c0` — Mars XP correction and regression assertions

### Claude repository and embedded provenance

- The GitHub snapshot examined is commit `07bc22f5a45b9c4919641b68d6df977feabda909` (`initial`, author `thomasjoseph18`). The earlier reachable commit is `d2810a5782f699c0d26342c529e52684dbb8bc6a` (`Initial commit`).
- The snapshot includes `MANIFEST.md`, `manifest.json`, `PROJECT_AUDIT.md`, and two patches under `docs/`.
- The embedded manifest identifies branch `integrate-game-fix-sandbox` and code/docs commit `82cf14e63c884fdd8b4e50e0b456327baa882e54`. The checkpoint patch header names `8a2bc3ee4934b5774f0e4029bed130bda3245106`; the progress note also mentions `85aafa8`.
- Those embedded references are **not** commits in the GitHub repository's reachable history; that repository currently exposes only the two commits listed above. The patch header says `From BUILDSCAPES dev`, so the GitHub history does not independently establish a Claude account as the author of the code.

### File comparison

- Current repository: 96 tracked files.
- `TEST`: 106 tracked files.
- Common tracked paths: 95; 87 are identical after CRLF/LF normalization, and 8 have content differences.
- Only in current: `buildscapes-integration-fix.patch`.
- Only in `TEST`: `MANIFEST.md`, `manifest.json`, `docs/changes-since-first-checkpoint.patch`, and eight Python browser scripts (`e2e1.py`–`e2e8.py`). These are reports, patch/test artifacts, not missing production game modules.

## Already implemented in the authoritative project

| Area | Evidence and comparison |
|---|---|
| Game shell and first-person architecture | `src/App.tsx`, `src/game/GameApp.tsx`, `src/game/FirstPersonRig.tsx`, and the game scenes are present. `src/App.tsx` and most shared implementation files are identical to the snapshot. |
| Engine and mission simulation | The shared engine, save/progress code, objectives, field systems, and mission data exist in both projects. The current version includes the later XP correction described below. |
| Moon and Mars terrain/sites | `src/game/terrain.ts` has the **same Git blob** in both repositories (`32d76167c6fd2516861abdcbd3562ee425ada04d`). Moon south-pole terrain and Mars Jezero features are already implemented; no terrain implementation is missing from the snapshot. |
| Habitat, rover, suit, and exploration | The shared `HabitatScene`, `SurfaceScene`, field engine, site tasks, quizzes, rover interactions, and storm systems are present. The habitat lighting values are one of the exceptions described under candidate improvements. |
| Progression and Mars unlock | `src/engine/gameState.ts` and `src/engine/progress.ts` already gate Mars on Moon training completion. Those files are identical between the repositories. |
| Moon rendering regression | `src/game/scenes/SurfaceScene.tsx` in the current branch no longer supplies a positive `useFrame` priority; `tests/game.test.ts` already contains the positive-priority regression guard. The Claude follow-up patch describes this same fix, not a missing feature. |
| UI polish | Current `src/game/game.css` includes the additional 148-line Figma-aligned style section from `7a447ec`. The `TEST` copy lacks that section, so its CSS is older, not an improvement to import. |
| XP correction | Current `src/engine/objectives.ts` counts `max(0, currentSol - 1)` Sol advances. Commit `535d0c0` also adds exact score assertions in `tests/game.test.ts`. The browser QA recorded the corrected 660 XP total. |
| Test coverage | Engine, differential, progression, settings, WebGL-detection, and game tests already exist in the authoritative repository. The test suites in `TEST` are mostly the same; its XP test is weaker. |

## Missing improvements worth considering

These are candidates for **selective** integration only. They are present in `docs/changes-since-first-checkpoint.patch`, but are not in the current source:

1. **Habitat brightness — `src/game/scenes/HabitatScene.tsx`.** The snapshot lightens the floor material and raises ambient/hemisphere lighting. Current values remain the darker `#2b313c`, ambient `0.55`, and hemisphere `0.7`. This addresses the current progress document's known low-contrast habitat issue, but should be visually checked on both destinations to avoid washing out the scene.
2. **NOVA response after site panel — `src/game/GameApp.tsx`.** The snapshot replaces a no-op in `closePanel` with a delayed “Great discovery!” response using the next objective hint. This could improve guidance for children. If adopted, test the hint for both destinations and ensure a delayed message cannot appear after a mission/screen change.
3. **Immediate no-WebGL cover dismissal — `src/game/GameApp.tsx`.** The snapshot hides the loading cover when `canRender3D` is false, rather than waiting for the existing six-second readiness failsafe. This is a plausible fallback UX improvement; verify the unsupported-WebGL/context-lost route and that fallback actions remain accessible before adopting it.

No whole new engine, mission, terrain, habitat, rover, or quiz module from `TEST` is needed.

## Conflicts and outdated implementations

- **XP formula:** `TEST/src/engine/objectives.ts` uses `solsSurvived * XP.solSurvived`, which counts the starting Sol and overstates the award by 5 XP. The current `solAdvances` calculation in `src/engine/objectives.ts` is the corrected implementation. `TEST/tests/game.test.ts` only asserts `win.xp > 600`; the current exact assertion is stronger. Do not copy either old file over the current versions.
- **Rendering fix duplication:** both builds already omit the positive `useFrame` priority. The current regression test already guards against reintroducing it. Do not reapply the duplicate fix or test.
- **Figma styling regression:** copying `TEST/src/game/game.css` would remove the current 148-line Figma polish section from `7a447ec`.
- **Recovery-patch applicability:** read-only `git apply --check` of `docs/changes-since-first-checkpoint.patch` against the authoritative branch failed for all four touched paths: `src/game/GameApp.tsx`, `src/game/scenes/HabitatScene.tsx`, `src/game/scenes/SurfaceScene.tsx`, and `tests/game.test.ts`. It is not a clean patch for this branch. The overlapping hunks must not be applied wholesale.
- **Stale documentation:** `TEST/PROJECT_AUDIT.md` describes a pre-scaffold project, despite the repository containing the full game. Its `DEVELOPMENT_PROGRESS.md` and README describe a different checkpoint/archive. Do not replace current documentation with these older copies.
- **Browser scripts are not production tests:** `scripts/sandbox-visual-test/` is Linux-specific (hard-coded `/home/claude/...`, `/tmp/bs`, and `localhost:8765`) and uses software WebGL. Some scripts directly set `moonTrainingComplete` or provide an unlock object to select Mars, so they cannot prove the natural Moon-to-Mars unlock flow. Preserve them as historical references only; do not treat their forced-state results as progression evidence.
- **Checkpoint patch scope:** `docs/buildscapes-game-checkpoint.patch` is a large first-game-layer patch (its header identifies checkpoint `8a2bc3e`; it reports 34 files and roughly 6,304 insertions). Its implementation is substantially already represented in the current branch and it is not an upgrade patch for the current HEAD.

## NASA elevation-data check

**No actual NASA DEM/elevation dataset is integrated in either project.**

- `src/game/terrain.ts` generates height with a seeded `hash2`, value noise, fractal Brownian motion, and procedural crater/ridge formulas. Its Git blob is identical in the two repositories.
- No tracked `.tif`, `.tiff`, `.img`, `.dem`, `.hgt`, `.asc`, `.grd`, `.vrt`, or equivalent elevation dataset was found. No terrain-data fetch/loader or raster parser was found in the source.
- `src/data/exploration.ts` contains NASA-related educational text (for example LRO, Perseverance, MOXIE, MEDA, and SHARAD connections). These are narrative references, not imported topographic measurements.
- The generated terrain may be geographically inspired, but it is not evidence of NASA DEM integration. A real-data claim would require a named dataset/product, its source and license/attribution, a data-loading path, and a documented mapping from coordinates/elevations into the terrain mesh.

## Recommended files to integrate

Do not copy the repository or apply either patch. If the owner wants the improvements, review these source changes individually:

| Candidate | File | Recommendation |
|---|---|---|
| Habitat lighting | `src/game/scenes/HabitatScene.tsx` | Manually port only the three material/light adjustments, then compare screenshots/browser rendering on Moon and Mars. |
| NOVA discovery follow-up | `src/game/GameApp.tsx` | Consider separately; add focused tests for completed-site hints, both destinations, and stale delayed callbacks. |
| No-WebGL loading cover | `src/game/GameApp.tsx` | Consider separately after testing unsupported WebGL, context loss, and fallback navigation. |

Do **not** integrate the snapshot's `src/engine/objectives.ts`, `tests/game.test.ts`, `src/game/game.css`, terrain, progression, or browser scripts over current files.

## Risks and required tests for any selective port

1. Run `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.
2. Browser-check the habitat visual change in Moon and Mars scenes at representative viewport sizes.
3. Browser-check no-WebGL and context-lost fallback entry/exit; confirm the loading cover does not obscure the fallback.
4. Verify NOVA's site-completion message and next hint for both planets, including rapid navigation/screen changes.
5. Keep exact XP scoring and the R3F render-priority regression tests intact.
6. If actual NASA elevation data is later introduced, document the dataset, license, attribution, coordinate system, resolution, scaling, and offline/error behavior; add deterministic terrain/data-loading tests.

No tests or builds were run for this read-only comparison. The only patch operation performed was `git apply --check`, which made no changes and failed as noted above.

## Final recommendation

Keep the current `integrate-game-fix` branch as authoritative. **Do not integrate the Claude build or its patches wholesale.** Most game code is already shared; the current branch is newer in the XP fix and Figma styling, and already contains the Moon render fix. The only plausible imports are the small habitat-lighting, NOVA-guidance, and no-WebGL-cover improvements, each gated on a focused review and tests. NASA DEM integration remains future work; neither build contains it.
