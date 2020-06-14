const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let isStart = true;

let score = 0;

// World
const worldWidth = 300;
const worldHeight = 250;
const fgHeight = 25;
ctx.canvas.width  = worldWidth;
ctx.canvas.height = worldHeight;

// Hero
const hero = new Image();
const heroSz = 50;
let heroPosX = 20;
let heroPosY = worldHeight - heroSz - fgHeight;
hero.src = "static/img/hero.png";

// Physics
const bottomBorder = worldHeight - heroSz - fgHeight;
const topBorder = worldHeight - 170;
const jumpTime = 600;
let jumpPower = 25;
let speed = 4;
let gravity = 12;
let isJump = false;

// Obstacles
let obstacles = [{
        w: heroSz,
        h: heroSz,
        x: worldWidth * 2,
        y: worldHeight - heroSz - fgHeight,
    },
];

function draw() {
    heroPosY += gravity;

    checkCollision();
    beautifyJumpBtn();

    // bg
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    //fg
    ctx.fillStyle = "silver";
    ctx.fillRect(0, worldHeight - 25, worldWidth, 25);

    // spawn obstacles
    ctx.fillStyle = "darkgray";
    obstacles.forEach((e, i, _) => {
        const spawnPoint = 50;

        ctx.fillRect(e.x, e.y, e.w, e.h);
        e.x -= speed;

        // spawn
        if (e.x <= spawnPoint && e.x >= spawnPoint - speed) {
            const gap = Math.floor(Math.random() * Math.floor(heroSz * 10)) + speed * 2;
            if (worldWidth + gap - obstacles[obstacles.length - 1].x >= heroSz * 4) {
                obstacles.push({
                    w: heroSz,
                    h: heroSz,
                    x: worldWidth + gap,
                    y: worldHeight - heroSz - fgHeight,
                })
            }
        }

        // check obstacle collision
        if (heroPosX + heroSz - 5 >= e.x &&
            heroPosX + 5 <= e.x + heroSz &&
            heroPosY + heroSz - 5 >= e.y) {
            gameOver();
        }

        // obstacle out of world
        if (e.x + heroSz <= 0) {
            obstacles.splice(i, 1);

            scoreUp();
            speedUp();
        }

    });
    
    ctx.drawImage(hero, heroPosX, heroPosY);
    isStart && requestAnimationFrame(draw);
}

function speedUp() {
    if (score % 10 === 0 && score) {
        speed += .5;
        // gravity += speed * 2;
        // jumpPower += speed * 2;
    }
}

function scoreUp() {
    const scoreSpan = document.querySelector("#score");
    score++;
    scoreSpan.innerHTML = score;
}

function gameOver() {
    const jumpBtn = document.querySelector(".jump-btn");
    const highScoreSpan = document.querySelector("#high-score");
    const highScore = localStorage.getItem("highScore");

    if (score > highScore) {
        highScoreSpan.innerHTML = score;
        localStorage.setItem("highScore", score);
    }

    jumpBtn.style.color = "red";
    jumpBtn.innerHTML = "retry";

    isStart = false;
}

function action(e) {
    e.code === 'Space' && jump();
}

function checkCollision() {
    if (heroPosY > bottomBorder) {
        heroPosY = bottomBorder;
        isJump = false;
    }

    if (heroPosY < topBorder) {
        heroPosY = topBorder;
    }
}

function jump() {
    !isStart && location.reload();

    if (!isJump) {
        isJump = true;
        gravity -= jumpPower;

        setTimeout(() => {
            gravity += jumpPower;
        }, jumpTime);
    }
}

function beautifyJumpBtn() {
    const jumpBtn = document.querySelector(".jump-btn");
    if (isJump) {
        jumpBtn.style.background = "silver";
        jumpBtn.style.color = "gray";
        jumpBtn.style.margin = "0 3px";
    } else {
        jumpBtn.style.background = "lightgray"
        jumpBtn.style.color = "#212121";
        jumpBtn.style.margin = "0";
    }
}

function main() {
    const jumpBtn = document.querySelector(".jump-btn");
    const highScoreSpan = document.querySelector("#high-score");
    const highScore = localStorage.getItem("highScore");

    highScoreSpan.innerHTML = highScore || 0;

    jumpBtn.innerHTML = "jump";

    draw();

    document.addEventListener('keydown', e => action(e));
    jumpBtn.addEventListener('click', () => jump())
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});