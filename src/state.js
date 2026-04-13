import { WORLD, HERO, TILE, PHYSICS, PROGRESSION, GROUND_Y } from './config.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.phase = 'idle'; // 'idle' | 'playing' | 'gameOver'

    this.hero = {
      x: HERO.startX,
      y: GROUND_Y - HERO.size,
      vy: 0,
      onGround: true,
      jumpHoldTime: 0,
      holdingJump: false,
    };

    this.obstacles = [];
    this.score = 0;
    this.speed = PROGRESSION.startSpeed;
    this.highScore = this.highScore ?? this._loadHighScore();

    this.isReversed = false;
    this.reverseFlashTimer = 0;
    this._lastReverseScore = null;

    this.tiles = this._createTiles();
  }

  get floorY() {
    return this.isReversed ? TILE.size : GROUND_Y;
  }

  get ceilingY() {
    return this.isReversed ? GROUND_Y : TILE.size;
  }

  get heroGroundY() {
    if (this.isReversed) {
      return TILE.size;
    }
    return GROUND_Y - HERO.size;
  }

  get heroCeilingY() {
    if (this.isReversed) {
      return GROUND_Y - HERO.size;
    }
    return TILE.size;
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem('highScore', String(this.highScore));
      } catch {
        // localStorage may be unavailable
      }
    }
  }

  _loadHighScore() {
    try {
      return parseInt(localStorage.getItem('highScore'), 10) || 0;
    } catch {
      return 0;
    }
  }

  _createTiles() {
    const count = Math.ceil(WORLD.width / TILE.size) + 2;
    const tiles = [];
    for (let i = 0; i < count; i++) {
      tiles.push({ x: TILE.size * i });
    }
    return tiles;
  }
}
