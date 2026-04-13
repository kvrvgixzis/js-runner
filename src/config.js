export const WORLD = {
  width: 300,
  height: 250,
};

export const COLORS = {
  background: 'lightgray',
  foreground: ['silver', 'darkgray'],
  hero: '#212121',
  heroEye: 'white',
  heroPupil: '#212121',
  obstacle: 'gray',
};

export const HERO = {
  size: 24,
  startX: 50,
};

export const TILE = {
  size: 20,
};

export const PHYSICS = {
  gravity: 900,
  jumpImpulse: -330,
  holdGravity: 250,
  maxJumpHoldMs: 180,
  terminalVelocity: 600,
};

export const OBSTACLE = {
  width: 24,
  height: 24,
  minGap: 120,
  maxGap: 260,
  spawnX: WORLD.width + 40,
  collisionInset: 3,
};

export const PROGRESSION = {
  speedUpEvery: 5,
  speedStep: 12,
  startSpeed: 120,
  maxSpeed: 280,
  reverseGravityEvery: 20,
};

export const GROUND_Y = WORLD.height - TILE.size;
export const CEILING_Y = TILE.size;
