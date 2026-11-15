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

## Scientific resource references shown in-game

The first-person mission site-discovery panels and the Exploration view provide source-linked learning references at two relevant locations:

- **Shackleton Crater Rim (Moon):** [NASA LRO/LOLA Site 04 topography](https://pgda.gsfc.nasa.gov/products/78). The product page identifies Site 04 as the Shackleton rim and describes 5 m/pixel elevation products and related slope/uncertainty products. The [NASA Moon Kit](https://svs.gsfc.nasa.gov/4720/) is also linked as an educational visualization resource.
- **Jezero Crater River Delta (Mars):** [Mars 2020 / Jezero terrain products](https://murray-lab.caltech.edu/Mars2020/index.html), published by the Bruce Murray Laboratory for Planetary Visualization at Caltech and derived from HiRISE imagery.

These links are **scientific references for learning and context**. The project does not download, bundle, or render those DEM files. The Moon and Mars playable surfaces remain procedural simulations; the resource cards explicitly say that the linked products are not inputs to the current 3D terrain. The Caltech Jezero page is credited to Caltech's Bruce Murray Laboratory rather than presented as a NASA-hosted dataset.

NASA is not affiliated with or endorsing this project. Follow the source pages' citation and usage guidance if their materials are reused beyond linking to them.

