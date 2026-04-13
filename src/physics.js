import { PHYSICS, HERO } from './config.js';

export function startJump(hero, isReversed) {
  if (!hero.onGround) return;

  hero.vy = isReversed ? -PHYSICS.jumpImpulse : PHYSICS.jumpImpulse;
  hero.onGround = false;
  hero.holdingJump = true;
  hero.jumpHoldTime = 0;
}

export function updateJump(hero, input, dt, isReversed) {
  if (hero.holdingJump) {
    hero.jumpHoldTime += dt * 1000;

    const released = input.wasReleased('jump') || !input.isHeld('jump');
    const expired = hero.jumpHoldTime >= PHYSICS.maxJumpHoldMs;

    if (released || expired) {
      hero.holdingJump = false;
    }
  }
}

export function applyGravity(hero, dt, isReversed) {
  const gravityDir = isReversed ? -1 : 1;
  const gravity = hero.holdingJump ? PHYSICS.holdGravity : PHYSICS.gravity;

  hero.vy += gravity * gravityDir * dt;

  // Terminal velocity
  const maxV = PHYSICS.terminalVelocity;
  hero.vy = Math.max(-maxV, Math.min(maxV, hero.vy));

  hero.y += hero.vy * dt;
}

export function checkBounds(hero, state) {
  const groundY = state.heroGroundY;
  const ceilingY = state.heroCeilingY;

  if (state.isReversed) {
    if (hero.y <= ceilingY) {
      if (!hero.onGround && Math.abs(hero.vy) > 50) spawnDust(state, hero.x + HERO.size / 2, ceilingY + HERO.size);
      hero.y = ceilingY;
      hero.vy = 0;
      hero.onGround = true;
      hero.holdingJump = false;
    }
    if (hero.y >= groundY) {
      hero.y = groundY;
      hero.vy = 0;
    }
  } else {
    if (hero.y >= groundY) {
      if (!hero.onGround && Math.abs(hero.vy) > 50) spawnDust(state, hero.x + HERO.size / 2, groundY);
      hero.y = groundY;
      hero.vy = 0;
      hero.onGround = true;
      hero.holdingJump = false;
    }
    if (hero.y <= ceilingY) {
      hero.y = ceilingY;
      hero.vy = 0;
    }
  }
}

function spawnDust(state, x, y) {
  for (let i = 0; i < 5; i++) {
    state.particles.push({
      x: x + (Math.random() - 0.5) * 16,
      y,
      vx: (Math.random() - 0.5) * 60,
      vy: -Math.random() * 40 - 10,
      life: 0.3 + Math.random() * 0.2,
      size: 2 + Math.random() * 2,
    });
  }
}

export function checkObstacleCollision(hero, obstacle) {
  const inset = 3;
  return (
    hero.x + HERO.size - inset > obstacle.x &&
    hero.x + inset < obstacle.x + obstacle.w &&
    hero.y + HERO.size - inset > obstacle.y &&
    hero.y + inset < obstacle.y + obstacle.h
  );
}
