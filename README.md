# Junior-Astronaut-Mission-Trainer

## Restoring this checkpoint
1. Unzip `buildscapes-checkpoint.zip` into a new folder (node_modules and dist are intentionally excluded).
2. `npm install` then `npm run typecheck`, `npm test`, `npm run dev` (Node >= 22.6).
3. To apply onto your existing git repo instead: `git checkout buildscapes-game && git am docs/buildscapes-game-checkpoint.patch`.
4. Read `DEVELOPMENT_PROGRESS.md` for status, bugs and next steps.

NASA is credited as the source of the mission facts used in this educational project. It is not endorsed by or affiliated with NASA.

## 3D terrain provenance

The Moon and Mars first-person surfaces are deterministic procedural terrain simulations. Their landforms are inspired by real planetary features, while exploration entries provide real-world landmark names, scientific context, and reference coordinates. The current rendered terrain is **not** generated from NASA digital elevation models, and local in-game X/Z positions are not registered to the listed latitude/longitude coordinates. Do not describe the current 3D surfaces as NASA DEM terrain.

A future elevation-data integration should use appropriately licensed and documented NASA planetary datasets (for example, LRO/LOLA products for the Moon and MRO/MOLA or local higher-resolution products for Mars), with clear dataset citations, coordinate transforms, and a procedural fallback.
