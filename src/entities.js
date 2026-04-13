import { OBSTACLE, HERO, WORLD, TILE, GROUND_Y } from './config.js';

export function createObstacle(x, isReversed) {
  const y = isReversed
    ? TILE.size
    : GROUND_Y - OBSTACLE.height;

  return {
    x,
    y,
    w: OBSTACLE.width,
    h: OBSTACLE.height,
    scored: false,
  };
}

export function spawnInitialObstacle(state) {
  state.obstacles.push(createObstacle(WORLD.width * 1.5, state.isReversed));
}

export function updateObstacles(state, dt) {
  const { obstacles, speed, hero } = state;

  // Move and check — reverse loop for safe removal
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= speed * dt;

    // Score when hero passes obstacle
    if (!obs.scored && obs.x + obs.w < hero.x) {
      obs.scored = true;
      state.score++;
    }

    // Remove off-screen
    if (obs.x + obs.w < -20) {
      obstacles.splice(i, 1);
    }
  }

  // Spawn new obstacle based on last one's position
  const last = obstacles[obstacles.length - 1];
  if (!last || last.x < WORLD.width - randomGap(speed)) {
    obstacles.push(createObstacle(OBSTACLE.spawnX, state.isReversed));
  }
}

function randomGap(speed) {
  const min = OBSTACLE.minGap;
  const max = Math.max(min + 10, OBSTACLE.maxGap - speed * 0.3);
  return min + Math.random() * (max - min);
}

export function updateTiles(tiles, speed, dt) {
  const tileSize = TILE.size;
  let rightmostX = -Infinity;

  for (const tile of tiles) {
    tile.x -= speed * dt;
    if (tile.x > rightmostX) rightmostX = tile.x;
  }

  for (const tile of tiles) {
    if (tile.x + tileSize < -tileSize) {
      tile.x = rightmostX + tileSize;
      rightmostX = tile.x;
    }
  }
}
