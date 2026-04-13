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
    // Reversed: ceiling is "ground" (top), floor is ceiling (bottom)
    if (hero.y <= ceilingY) {
      // Hit the "ground" (ceiling in reversed mode)
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
    // Normal: ground is bottom
    if (hero.y >= groundY) {
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

export function checkObstacleCollision(hero, obstacle) {
  const inset = 3;
  return (
    hero.x + HERO.size - inset > obstacle.x &&
    hero.x + inset < obstacle.x + obstacle.w &&
    hero.y + HERO.size - inset > obstacle.y &&
    hero.y + inset < obstacle.y + obstacle.h
  );
}
