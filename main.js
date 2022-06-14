const cvs = document.querySelector('#canvas');
const ctx = cvs.getContext('2d');
const scoreSpan = document.querySelector('#score');
const jumpButton = document.querySelector('.jump-btn');
const highScoreSpan = document.querySelector('#high-score');
const highScore = localStorage.getItem('highScore');

let IS_START = true;
let IS_JUMP = false;
let SCORE = 0;

const WORLD_WIDTH = 300;
const WORLD_HEIGHT = 250;
ctx.canvas.width = WORLD_WIDTH;
ctx.canvas.height = WORLD_HEIGHT;

const BG_COLOR = 'lightgray';
const FG_SIZE = 32;
const FG_POS_Y = WORLD_HEIGHT - FG_SIZE;
const FG_COUNT = Math.floor(WORLD_WIDTH / FG_SIZE) * 2;
const FG = new Array(FG_COUNT).fill(null).map((_, i) => ({
  x: FG_SIZE * i,
  y: FG_POS_Y,
  color: i % 2 === 0 ? 'silver' : 'darkgray',
}));

const OBSTACLE_COLOR = 'gray';
const HERO_SIZE = 50;
const HERO_COLOR = 'black';
let HERO_POS_X = 50;
let HERO_POS_Y = WORLD_HEIGHT - HERO_SIZE - FG_SIZE;
const BOTTOM_BORDER = WORLD_HEIGHT - HERO_SIZE - FG_SIZE;
const COLLISION_BORDER = 10;
let JUMP_POWER = 31;
const BASE_GRAVITY = 16;
let GRAVITY = BASE_GRAVITY;
const MAX_SPEED = 9;
let SPEED = 5;
const SPEED_UP_STEP = 5;
const SPEED_STEP = 0.3;

let OBSTACLES = [
  {
    w: HERO_SIZE,
    h: HERO_SIZE,
    x: WORLD_WIDTH * 2,
    y: WORLD_HEIGHT - HERO_SIZE - FG_SIZE,
  },
];

function frame() {
  if (GRAVITY < BASE_GRAVITY) GRAVITY++;
  HERO_POS_Y += GRAVITY;

  checkWorldCollision();
  beautifyJumpBtn();
  drawBg();
  drawFg();
  drawObstacles();
  drawHero();

  IS_START && requestAnimationFrame(frame);
}

function drawHero() {
  ctx.fillStyle = HERO_COLOR;
  ctx.fillRect(HERO_POS_X, HERO_POS_Y, HERO_SIZE, HERO_SIZE);
}

function drawBg() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}

function drawFg() {
  FG.forEach((e, i) => {
    e.x -= SPEED;

    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, FG_SIZE, FG_SIZE);

    if (e.x + FG_SIZE <= -FG_SIZE) {
      FG.push({
        x: FG[FG.length - 1].x + FG_SIZE,
        y: FG_POS_Y,
        color: e.color,
      });
      FG.splice(i, 1);
    }
  });
}

function drawObstacles() {
  OBSTACLES.forEach((obstacle, index) => {
    obstacle.x -= SPEED;
    ctx.fillStyle = OBSTACLE_COLOR;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);

    createNewObstacle(obstacle);
    checkObstacleCollision(obstacle);
    removeOldObstacle(obstacle, index);
  });
}

function createNewObstacle(obstacle) {
  const spawnPoint = HERO_SIZE * 2;

  if (obstacle.x <= spawnPoint && obstacle.x >= spawnPoint - SPEED) {
    const gap =
      Math.random() * (SPEED * 50 - SPEED * 2) +
      SPEED * 2 +
      HERO_SIZE * 2;

    if (
      WORLD_WIDTH + gap - OBSTACLES[OBSTACLES.length - 1].x >=
      HERO_SIZE * 4
    ) {
      OBSTACLES.push({
        w: HERO_SIZE,
        h: HERO_SIZE,
        x: WORLD_WIDTH + gap,
        y: WORLD_HEIGHT - HERO_SIZE - FG_SIZE,
      });
    }
  }
}

function checkObstacleCollision(obstacle) {
  if (
    HERO_POS_X + HERO_SIZE - COLLISION_BORDER >= obstacle.x &&
    HERO_POS_X + COLLISION_BORDER <= obstacle.x + HERO_SIZE &&
    HERO_POS_Y + HERO_SIZE - COLLISION_BORDER >= obstacle.y
  ) {
    gameOver();
  }
}

function removeOldObstacle(obstacle, index) {
  const isOutOfWorld = obstacle.x + HERO_SIZE <= -HERO_SIZE / 2;
  if (isOutOfWorld) {
    OBSTACLES.splice(index, 1);

    speedUp();
    scoreUp();
  }
}

function speedUp() {
  if (SCORE % SPEED_UP_STEP === 0 && SPEED <= MAX_SPEED) {
    SPEED += SPEED_STEP;
  }
}

function scoreUp() {
  SCORE++;
  scoreSpan.innerHTML = SCORE;

  if (SCORE > highScore) {
    highScoreSpan.innerHTML = SCORE;
  }
}

function gameOver() {
  if (SCORE > highScore) {
    highScoreSpan.innerHTML = SCORE;
    localStorage.setItem('highScore', SCORE);
  }

  jumpButton.classList.add('game-over');
  jumpButton.innerHTML = 'retry';
  IS_START = false;
}

function checkWorldCollision() {
  if (HERO_POS_Y > BOTTOM_BORDER) {
    HERO_POS_Y = BOTTOM_BORDER;
    IS_JUMP = false;
  }
}

function jump() {
  !IS_START && location.reload();

  if (!IS_JUMP) {
    IS_JUMP = true;
    GRAVITY -= JUMP_POWER;
  }
}

function beautifyJumpBtn() {
  if (IS_JUMP) {
    jumpButton.classList.add('inactive');
  } else {
    jumpButton.classList.remove('inactive');
  }
}

function main() {
  highScoreSpan.innerHTML = highScore || 0;
  jumpButton.innerHTML = 'jump';

  frame();

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
  });
  jumpButton.addEventListener('click', jump);
}

main();
