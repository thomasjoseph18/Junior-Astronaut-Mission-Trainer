# 🚀 BUILDSCAPES — Junior Astronaut Mission Trainer

### Explore. Survive. Discover.

**BUILDSCAPES** is an interactive space-exploration and mission-training game created to introduce young learners to the science and challenges of human space exploration.

Players step into the role of an astronaut, explore the Moon and Mars, manage mission resources, make decisions, complete objectives, and learn through hands-on discovery.

> **Explore. Survive. Discover.**

## 🌌 Explore two worlds

### 🌕 Moon mission — Lunar South Pole

Embark on a 30-Sol expedition around the **Shackleton Rim** region.

- Explore a simulated lunar environment.
- Manage habitat resources and life-support systems.
- Monitor spacesuit oxygen and power.
- Discover lunar landmarks and scientific context.
- Complete mission activities and record discoveries.

### 🔴 Mars mission — Jezero Crater

Continue the journey with a 30-Sol expedition to **Jezero Crater**.

- Explore a simulated Martian environment.
- Manage essential mission and survival resources.
- Use rover exploration systems.
- Learn about the geology and environment of Mars.
- Complete objectives and document discoveries.

## 🎮 Gameplay features

| Feature | What it offers |
| --- | --- |
| First-person exploration | Explore planetary environments from an astronaut's perspective. |
| Mission management | Make decisions and manage resources throughout the expedition. |
| Habitat life support | Monitor water, food, power, and environmental protection. |
| Spacesuit systems | Keep track of oxygen and suit power. |
| Rover systems | Support exploration across the mission environment. |
| NOVA assistant | Get in-game guidance and assistance. |
| Mission journal | Record observations and discoveries. |
| Achievements | Track progress and accomplishments. |
| Space weather | Learn about environmental challenges in space. |
| Mission debrief | Review mission progress and outcomes. |
| Educational Q&A and quizzes | Reinforce learning with questions and multiple-choice activities. |

## 🧪 Learn through exploration

BUILDSCAPES connects interactive gameplay with topics including:

- Lunar and Martian environments
- Human survival and life support in space
- Spacesuit and rover systems
- Planetary science and geology
- Scientific observation and problem-solving
- The challenges of long-duration exploration

**Intended audience:** young learners aged 7–12.

## 🛰️ Scientific resources and references

The game includes source-linked educational references related to its exploration locations.

### Moon — Shackleton Rim

- [NASA LRO/LOLA — Lunar South Pole Site 04](https://pgda.gsfc.nasa.gov/products/78)
- [NASA Moon Kit](https://svs.gsfc.nasa.gov/4720/)

### Mars — Jezero Crater

- [Caltech Bruce Murray Laboratory — Mars 2020 / Jezero resources](https://murray-lab.caltech.edu/Mars2020/index.html)

These links provide scientific context and further reading. The Jezero resource is hosted by Caltech's Bruce Murray Laboratory, not presented as a NASA-hosted dataset.

### Important terrain and data note

The Moon and Mars first-person surfaces are deterministic, procedurally generated terrain simulations inspired by real planetary features. **The current playable terrain is not generated from NASA digital elevation models (DEMs).** The project does not download, bundle, or render the linked DEM files, and in-game X/Z positions are not registered to the listed latitude/longitude coordinates.

The linked resources are educational references, not data inputs powering the current 3D terrain. Any future elevation-data integration should document dataset sources and usage terms, coordinate transformations, and a procedural fallback.

NASA is credited as a source of mission facts where applicable. **NASA is not affiliated with, does not sponsor, and does not endorse this project.** Follow the source pages' citation and usage guidance when reusing their materials.

## 🛠️ Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) **22.6 or later**
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/thomasjoseph18/Junior-Astronaut-Mission-Trainer.git
cd Junior-Astronaut-Mission-Trainer
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal.

## 🧪 Quality checks

Run these checks before submitting code changes:

```bash
npm run typecheck
npm test
npm run build
```

- `npm run typecheck` checks TypeScript.
- `npm test` runs the project's automated tests.
- `npm run build` creates the production build.

## 🎯 Project goals

1. Make space exploration engaging and accessible.
2. Introduce young learners to planetary science.
3. Demonstrate the challenges of astronaut survival.
4. Encourage critical thinking and resource management.
5. Connect interactive learning with real scientific references.

## 🌍 Project information

- **Project:** BUILDSCAPES — Junior Astronaut Mission Trainer
- **Repository:** [Junior-Astronaut-Mission-Trainer](https://github.com/thomasjoseph18/Junior-Astronaut-Mission-Trainer)
- **Team:** SOLO COMPOSER
- **Audience:** Ages 7–12
- **Category:** Educational Gaming / Space Exploration

### Play the game

[Launch BUILDSCAPES](https://sol-30.vercel.app/)

## 👨‍🚀 Our vision

Space exploration is about understanding unfamiliar environments, solving difficult problems, and discovering what humanity can achieve.

**BUILDSCAPES brings that journey into an interactive learning experience.**

*Explore. Survive. Discover.* 🚀

---

## Maintainer note: restoring the checkpoint

If you are restoring the separately supplied checkpoint archive:

1. Extract `buildscapes-checkpoint.zip` into a new folder. The archive intentionally excludes `node_modules` and `dist`.
2. Use Node.js 22.6 or later, then run `npm install`, `npm run typecheck`, `npm test`, and `npm run dev`.
3. To apply the checkpoint patch to the original repository, check the patch instructions and target branch before running `git am`.
4. Consult `DEVELOPMENT_PROGRESS.md` for the recorded development status and follow-up notes.
