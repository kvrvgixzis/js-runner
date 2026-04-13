import { WORLD, COLORS, HERO, TILE, GROUND_Y, CEILING_Y } from './config.js';

export function drawBackground(ctx) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
}

export function drawForeground(ctx, tiles, isReversed) {
  const tileSize = TILE.size;

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const color = COLORS.foreground[i % 2];

    // Bottom tiles (floor)
    ctx.fillStyle = isReversed ? COLORS.background : color;
    ctx.fillRect(tile.x, GROUND_Y, tileSize, tileSize);

    // Top tiles (ceiling)
    ctx.fillStyle = isReversed ? color : COLORS.background;
    ctx.fillRect(tile.x, 0, tileSize, tileSize);
  }
}

export function drawHero(ctx, hero) {
  const size = HERO.size;
  const { x, y } = hero;

  // Body
  ctx.fillStyle = COLORS.hero;
  ctx.fillRect(x, y, size, size);

  // Eye (white square)
  const eyeSize = Math.round(size * 0.35);
  const eyeX = x + size - eyeSize - 2;
  const eyeY = y + 3;
  ctx.fillStyle = COLORS.heroEye;
  ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);

  // Pupil
  const pupilSize = Math.round(eyeSize * 0.5);
  ctx.fillStyle = COLORS.heroPupil;
  ctx.fillRect(
    eyeX + eyeSize - pupilSize - 1,
    eyeY + eyeSize - pupilSize - 1,
    pupilSize,
    pupilSize,
  );
}

export function drawObstacles(ctx, obstacles) {
  ctx.fillStyle = COLORS.obstacle;
  for (const obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  }
}

export function drawScore(ctx, score) {
  // Score is rendered in the DOM, not on canvas
}

export function drawReverseFlash(ctx, timer) {
  if (timer <= 0) return;
  const alpha = Math.min(timer / 0.15, 1) * 0.4;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
}

export function drawIdleScreen(ctx) {
  ctx.fillStyle = '#212121';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('runner', WORLD.width / 2, WORLD.height / 2 - 20);

  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#666';
  ctx.fillText('press space or tap', WORLD.width / 2, WORLD.height / 2 + 15);
  ctx.textAlign = 'left';
}

export function drawGameOver(ctx, score, highScore) {
  ctx.fillStyle = 'rgba(230, 228, 228, 0.7)';
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.fillStyle = '#c0392b';
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('game over', WORLD.width / 2, WORLD.height / 2 - 20);

  ctx.fillStyle = '#212121';
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillText(`score: ${score}`, WORLD.width / 2, WORLD.height / 2 + 8);

  if (score >= highScore && score > 0) {
    ctx.fillStyle = '#e67e22';
    ctx.fillText('new record!', WORLD.width / 2, WORLD.height / 2 + 28);
  }

  ctx.fillStyle = '#666';
  ctx.fillText('press space to retry', WORLD.width / 2, WORLD.height / 2 + 50);
  ctx.textAlign = 'left';
}
