# For Beatrice — 19th Birthday Site

A small full-stack birthday website: an Express (Node.js) back end serving a
front-end invitation experience.

## What's inside

- **Gate / invitation page** — greets Beatrice, asks her to read the whole
  site, then asks "I have prepared a secret inside. Do you want to see it
  personally?" with a Yes and a No button. The No button dodges the cursor
  (and finger, on touch) every time she tries to hover or tap it.
- **Inside page** — an envelope with a wax seal that, when clicked, opens a
  modal with a long (600+ word) birthday letter, fetched from the back end.
- **Mini game** — a small offline-dino-style runner built on `<canvas>`.
  Reaching a score of 100 fades the game out and reveals three equally
  spaced buttons: **Poem**, **Proses**, and **...**, each opening a short
  piece of writing fetched from the back end.
- **Back end** (`server.js`) — an Express server that serves the static
  front end and exposes:
  - `GET /api/content/letter|poem|prose|mystery` — returns the writing
    shown in the modals
  - `GET /api/highscore` / `POST /api/highscore` — persists the game's
    high score to `data/highscore.json`

## Running it

```bash
npm install
npm start
```

Then open **http://localhost:3000** in a browser.

## Structure

```
beatrice-birthday/
├── server.js              # Express back end + API routes
├── package.json
├── data/                   # created at runtime, stores highscore.json
└── public/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── main.js         # gate logic, modal, dodging button
        └── dino.js          # canvas mini-game
```
