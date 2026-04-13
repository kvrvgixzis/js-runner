export const WORLD = {
  width: 600,
  height: 200,
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
  jumpImpulse: -340,
  holdGravity: 120,
  maxJumpHoldMs: 300,
  terminalVelocity: 600,
};

export const OBSTACLE = {
  width: 24,
  height: 24,
  minGap: 140,
  maxGap: 320,
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
