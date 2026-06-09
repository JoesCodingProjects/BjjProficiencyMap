# 🥋 BJJ Proficiency Map

An interactive web app for learning the Brazilian Jiu-Jitsu position hierarchy. Click a
position on the node-graph map to see the moves available from it, filter by belt level /
move type / category, and track which techniques you've learned. Marking techniques learned
builds an estimated proficiency belt for each position — and an overall level — derived from
how much of each position's (belt-weighted) curriculum you've covered.

## Features

- **Interactive node-graph map** of the major BJJ positions with transition arrows
- **Per-position belt proficiency** — derived from which techniques you've marked learned
  (belt-weighted), plus an averaged overall belt level
- **Filtering** by belt (cumulative — your belt and below), offensive/defensive, category, and gi/no-gi
- **Search** across technique names and descriptions
- **Learning tracker** — mark techniques as learned; progress is saved on-device (localStorage)
- **263 no-gi techniques** covering all positions and categories
- **Installable PWA** — works offline and installs to a phone home screen like a native app

## Run it

```bash
cd app
npm install      # first time only
npm run dev      # open the printed http://localhost:5173 URL
```

Build a static, deployable version:

```bash
npm run build    # outputs to app/dist/  (includes PWA manifest + offline service worker)
npm run preview  # preview the production build
```

## Install on a phone (free, no app store)

This is a **PWA** — it installs to a phone home screen and works offline, with no Apple/Google
developer fees and no store submission. Host the `app/dist/` folder anywhere free, then share the
URL with training partners:

- **Netlify** (drag `app/dist/` onto [app.netlify.com/drop](https://app.netlify.com/drop)), or
- **GitHub Pages** / **Vercel** / **Cloudflare Pages** — all have free tiers.

Then partners install it:

- **Android (Chrome):** open the link → tap the **⋮** menu → **Add to Home screen** (or accept the
  install prompt).
- **iPhone (Safari):** open the link → tap the **Share** button → **Add to Home Screen**.

It then launches fullscreen with its own icon, and works offline — ideal for gyms with weak signal.
Each person's learned techniques and belt levels save on their own device.

## Project structure

```
BJJ Interactive Map/
├── app/                       # the web app (Vite + React + TypeScript)
│   └── src/
│       ├── data/
│       │   ├── positions.ts   # map nodes + transitions (edges)
│       │   ├── techniques.json # the technique dataset — edit freely to add moves
│       │   └── types.ts       # shared types, belt colors, category labels
│       ├── components/        # PositionMap, Filters, MoveList
│       ├── hooks/useLearned.ts # localStorage-backed learned tracker
│       └── App.tsx            # wires it all together
├── discovery/prds/            # product requirements doc (planning)
└── README.md
```

## Adding / editing techniques

Edit [app/src/data/techniques.json](app/src/data/techniques.json). Each entry:

```json
{
  "id": "unique_snake_case",
  "name": "Armbar from Closed Guard",
  "description": "Short explanation of the mechanic.",
  "positions": ["closed_guard"],
  "moveType": "offensive",
  "category": "submission_upper_body",
  "beltLevel": "white",
  "difficulty": 2,
  "videoUrl": ""
}
```

`category` is one of: `position`, `pass`, `sweep`, `submission_choke`, `submission_upper_body`,
`submission_lower_body`. `positions` must use ids from
[app/src/data/positions.ts](app/src/data/positions.ts).

> Note: `videoUrl`s are currently empty — web access wasn't available when the dataset was
> generated. Drop in instructional YouTube links anytime.

## Deploying privately

The `app/dist/` folder is a static site — host it on Vercel, Netlify, or GitHub Pages
(private repo). No backend required; all progress is stored client-side.
