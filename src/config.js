export const WORLD = {
  width: 600,
  height: 400,
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
  size: 26,
  startX: 50,
};

export const TILE = {
  size: 20,
};

export const PHYSICS = {
  gravity: 980,
  jumpImpulse: -400,
  holdGravity: 130,
  maxJumpHoldMs: 300,
  terminalVelocity: 700,
};

export const OBSTACLE = {
  width: 26,
  minHeight: 30,
  maxHeight: 64,
  minGap: 130,
  maxGap: 280,
  spawnX: WORLD.width + 40,
  collisionInset: 3,
};

export const PROGRESSION = {
  speedUpEvery: 5,
  speedStep: 12,
  startSpeed: 140,
  maxSpeed: 320,
  reverseGravityEvery: 20,
};

export const GROUND_Y = WORLD.height - TILE.size;
export const CEILING_Y = TILE.size;
