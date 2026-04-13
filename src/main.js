import { WORLD, TILE, GROUND_Y, PROGRESSION } from './config.js';
import { GameState } from './state.js';
import { InputManager } from './input.js';
import { startJump, updateJump, applyGravity, checkBounds, checkObstacleCollision } from './physics.js';
import { spawnInitialObstacle, updateObstacles, updateTiles } from './entities.js';
import {
  drawBackground,
  drawForeground,
  drawHero,
  drawObstacles,
  drawReverseFlash,
  drawIdleScreen,
  drawGameOver,
} from './renderer.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const jumpButton = document.querySelector('.jump-btn');

canvas.width = WORLD.width;
canvas.height = WORLD.height;

const state = new GameState();
const input = new InputManager(canvas, jumpButton);

let lastTime = 0;

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  update(dt);
  render();
  input.endFrame();

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  switch (state.phase) {
    case 'idle':
      updateIdle();
      break;
    case 'playing':
      updatePlaying(dt);
      break;
    case 'gameOver':
      updateGameOver();
      break;
  }
}

function updateIdle() {
  if (input.wasPressed('jump')) {
    state.phase = 'playing';
    spawnInitialObstacle(state);
    jumpButton.textContent = 'jump';
    startJump(state.hero, state.isReversed);
  }
}

function updatePlaying(dt) {
  const { hero } = state;

  // Jump input
  if (input.wasPressed('jump')) {
    startJump(hero, state.isReversed);
  }
  updateJump(hero, input, dt, state.isReversed);

  // Physics
  applyGravity(hero, dt, state.isReversed);
  checkBounds(hero, state);

  // World
  updateTiles(state.tiles, state.speed, dt);
  updateObstacles(state, dt);

  // Collision
  for (const obs of state.obstacles) {
    if (checkObstacleCollision(hero, obs)) {
      gameOver();
      return;
    }
  }

  // Progression
  handleProgression();

  // Reverse flash timer
  if (state.reverseFlashTimer > 0) {
    state.reverseFlashTimer -= dt;
  }

  // UI
  scoreSpan.textContent = state.score;
}

function updateGameOver() {
  if (input.wasPressed('jump')) {
    state.reset();
    jumpButton.textContent = 'start';
    jumpButton.classList.remove('game-over');
  }
}

function gameOver() {
  state.phase = 'gameOver';
  state.saveHighScore();
  highScoreSpan.textContent = state.highScore;
  jumpButton.textContent = 'retry';
  jumpButton.classList.add('game-over');
}

function handleProgression() {
  const { score, speed } = state;

  // Speed up
  if (score > 0 && score % PROGRESSION.speedUpEvery === 0) {
    const targetSpeed = PROGRESSION.startSpeed + (score / PROGRESSION.speedUpEvery) * PROGRESSION.speedStep;
    state.speed = Math.min(targetSpeed, PROGRESSION.maxSpeed);
  }

  // Reverse gravity easter egg
  if (
    score > 0 &&
    score % PROGRESSION.reverseGravityEvery === 0 &&
    state.hero.onGround &&
    !state._lastReverseScore
  ) {
    state._lastReverseScore = score;
    reverseGravity();
  }

  if (state._lastReverseScore && state.score > state._lastReverseScore) {
    state._lastReverseScore = null;
  }
}

function reverseGravity() {
  state.isReversed = !state.isReversed;
  state.reverseFlashTimer = 0.3;

  // Push obstacles ahead so player has time to react
  for (const obs of state.obstacles) {
    obs.x += 80;
    obs.y = state.isReversed
      ? TILE.size
      : GROUND_Y - obs.h;
  }

  // Reposition hero
  const { hero } = state;
  hero.y = state.heroGroundY;
  hero.vy = 0;
  hero.onGround = true;
  hero.holdingJump = false;
}

function render() {
  drawBackground(ctx);
  drawForeground(ctx, state.tiles, state.isReversed);

  if (state.phase === 'idle') {
    drawIdleScreen(ctx);
    return;
  }

  drawObstacles(ctx, state.obstacles);
  drawHero(ctx, state.hero);
  drawReverseFlash(ctx, state.reverseFlashTimer);

  if (state.phase === 'gameOver') {
    drawGameOver(ctx, state.score, state.highScore);
  }
}

// Init
highScoreSpan.textContent = state.highScore;
jumpButton.textContent = 'start';
requestAnimationFrame((t) => {
  lastTime = t;
  gameLoop(t);
});
