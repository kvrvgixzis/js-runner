# js-runner

> Endless runner game — vanilla JavaScript, Canvas 2D, zero dependencies

## Play

Open `index.html` in a browser (needs a local server for ES modules):

```bash
npx serve .
```

Or visit [kvrvgixzis.github.io/js-runner](https://kvrvgixzis.github.io/js-runner)

## Controls

- **Space** / **Arrow Up** — jump (hold for higher jump)
- **Tap** / **Click** the button or canvas on mobile
- Variable jump height: tap = small hop, hold = full jump

## Features

- Variable-height jump (Mario-style)
- Progressive difficulty
- High score saved locally
- Gravity reverse easter egg every 20 points
- Touch support for mobile
- Delta-time physics (frame-rate independent)

## Structure

```
src/
├── main.js       — game loop, state machine, init
├── config.js     — all constants in one place
├── state.js      — GameState class with reset()
├── input.js      — keyboard, mouse, touch input
├── physics.js    — gravity, variable jump, collisions
├── entities.js   — obstacles, tiles
└── renderer.js   — all drawing functions
```

