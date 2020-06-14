const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let isStart = true;

let score = 0;

// World
const worldWidth = 300;
const worldHeight = 250;
ctx.canvas.width  = worldWidth;
ctx.canvas.height = worldHeight;

// Hero
const hero = new Image();
hero.src = "static/img/hero.png";
const heroSz = 50;
let heroPosX = 20;
let heroPosY = worldHeight - heroSz;

// Physics
let jumpPower = 20;
let jumpTime = 600;
let speed = 4;
let gravity = 12;
let isJump = false;

// Obstacles
let obstacles = [{
        w: heroSz,
        h: heroSz,
        x: worldWidth * 2,
        y: worldHeight - heroSz,
    },
];

function draw() {
    heroPosY += gravity;

    checkCollision();
    beautifyJumpBtn();

    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, cvs.clientWidth, cvs.clientHeight);

    ctx.fillStyle = "darkgray";

    obstacles.forEach((e, i, _) => {
        const spawnPoint = 50;

        ctx.fillRect(e.x, e.y, e.w, e.h);

        e.x -= speed;

        // Spawn
        if (e.x <= spawnPoint && e.x >= spawnPoint - speed) {
            const gap = Math.floor(Math.random() * Math.floor(heroSz * 10)) + speed * 2;
            if (worldWidth + gap - obstacles[obstacles.length - 1].x >= heroSz * 4) {
                obstacles.push({
                    w: heroSz,
                    h: heroSz,
                    x: worldWidth + gap,
                    y: worldHeight - heroSz,
                })
            }
        }

        // Check crash
        if (heroPosX + heroSz - 5 >= e.x &&
            heroPosX + 5 <= e.x + heroSz &&
            heroPosY + heroSz - 5 >= e.y) {
            const jumpBtn = document.querySelector(".jump-btn");

            jumpBtn.style.color = "red";
            jumpBtn.innerHTML = "retry";

            isStart = false;
        }

        // Remove old obstacle
        if (e.x + heroSz <= 0) {
            const scoreSpan = document.querySelector("#score");

            score++;
            scoreSpan.innerHTML = score;
            obstacles.splice(i, 1);

            // Speed up
            if (score % 10 === 0 && score) {
                speed += .5;
                gravity += speed * 2;
                jumpPower += speed * 2;
            }
        }

    });
    
    ctx.drawImage(hero, heroPosX, heroPosY);

    isStart && requestAnimationFrame(draw);
}

function action(e) {
    e.code === 'Space' && jump();
}

function checkCollision() {
    const bottomBorder = worldHeight - heroSz;
    const topBorder = worldHeight - 180;

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
        jumpBtn.style.margin = "3px";
    } else {
        jumpBtn.style.background = "lightgray"
        jumpBtn.style.color = "#212121";
        jumpBtn.style.margin = "0";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const jumpBtn = document.querySelector(".jump-btn");

    draw();

    // Listeners
    document.addEventListener('keydown', e => action(e));
    jumpBtn.addEventListener('click', () => jump())
});