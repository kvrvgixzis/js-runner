import { WORLD, COLORS, HERO, TILE, GROUND_Y, CEILING_Y } from './config.js';

export function drawBackground(ctx) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
}

export function drawForeground(ctx, tiles, isReversed) {
  const tileSize = TILE.size;

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    // Color based on world position, not array index
    const colorIdx = Math.round(tile.x / tileSize) & 1;
    const color = COLORS.foreground[colorIdx];

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
  const { x, y, vy, onGround } = hero;

  // Squash & stretch based on vertical velocity
  const stretch = Math.min(Math.abs(vy) / 400, 0.3);
  const scaleX = onGround ? 1 + stretch * 0.5 : 1 - stretch;
  const scaleY = onGround ? 1 - stretch * 0.5 : 1 + stretch;
  const drawW = size * scaleX;
  const drawH = size * scaleY;
  const drawX = x + (size - drawW) / 2;
  const drawY = y + (size - drawH);

  // Body
  ctx.fillStyle = COLORS.hero;
  ctx.fillRect(drawX, drawY, drawW, drawH);

  // Eye (white square)
  const eyeSize = Math.round(drawW * 0.35);
  const eyeX = drawX + drawW - eyeSize - 2;
  const eyeY = drawY + 2;
  ctx.fillStyle = COLORS.heroEye;
  ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);

  // Pupil — follows vertical velocity
  const pupilSize = Math.round(eyeSize * 0.5);
  const pupilOffsetY = Math.round(Math.max(-1, Math.min(1, vy / 200)) * (eyeSize - pupilSize));
  ctx.fillStyle = COLORS.heroPupil;
  ctx.fillRect(
    eyeX + eyeSize - pupilSize - 1,
    eyeY + Math.max(0, Math.min(eyeSize - pupilSize, (eyeSize - pupilSize) / 2 + pupilOffsetY)),
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

export function drawParticles(ctx, particles) {
  ctx.fillStyle = '#999';
  for (const p of particles) {
    const alpha = Math.min(p.life / 0.15, 1);
    ctx.globalAlpha = alpha;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

export function drawReverseFlash(ctx, timer) {
  if (timer <= 0) return;
  const alpha = Math.min(timer / 0.15, 1) * 0.4;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
}

export function drawIdleScreen(ctx) {
  ctx.fillStyle = '#212121';
  ctx.font = '20px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('runner', WORLD.width / 2, WORLD.height / 2 - 16);

  ctx.font = '9px "Press Start 2P", monospace';
  ctx.fillStyle = '#666';
  ctx.fillText('press space or tap', WORLD.width / 2, WORLD.height / 2 + 20);
  ctx.textAlign = 'left';
}

export function drawGameOver(ctx, score, highScore) {
  ctx.fillStyle = 'rgba(230, 228, 228, 0.7)';
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.fillStyle = '#c0392b';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('game over', WORLD.width / 2, WORLD.height / 2 - 20);

  ctx.fillStyle = '#212121';
  ctx.font = '9px "Press Start 2P", monospace';
  ctx.fillText(`score: ${score}`, WORLD.width / 2, WORLD.height / 2 + 8);

  if (score >= highScore && score > 0) {
    ctx.fillStyle = '#e67e22';
    ctx.fillText('new record!', WORLD.width / 2, WORLD.height / 2 + 28);
  }

  ctx.fillStyle = '#666';
  ctx.fillText('press space to retry', WORLD.width / 2, WORLD.height / 2 + 52);
  ctx.textAlign = 'left';
}
