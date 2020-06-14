const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let isStart = true;

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
const jumpPower = 20;
const jumpTime = 500;
let speed = 4;
let gravity = 10;
let isJump = false;


let obstacles = [{
        w: heroSz,
        h: heroSz,
        x: worldWidth,
        y: worldHeight - heroSz,
    },
];

function draw() {
    heroPosY += gravity;

    checkCollision();

    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, cvs.clientWidth, cvs.clientHeight);

    ctx.fillStyle = "darkgray";

    obstacles.forEach((e, i, _) => {
        const spawnPoint = 50;

        ctx.fillRect(e.x, e.y, e.w, e.h);

        e.x -= speed;

        if (e.x <= spawnPoint && e.x >= spawnPoint - speed) {
            const gap = Math.floor(Math.random() * Math.floor(heroSz * 5));
            if (worldWidth + gap - obstacles[obstacles.length - 1].x >= heroSz * 4) {
                obstacles.push({
                    w: heroSz,
                    h: heroSz,
                    x: worldWidth + gap,
                    y: worldHeight - heroSz,
                })
            }
        }

        if (heroPosX + heroSz - 5 >= e.x &&
            heroPosX + 5 <= e.x + heroSz &&
            heroPosY + heroSz - 5 >= e.y) {
            isStart = false;
        }

        if (e.x + 50 <= 0) {
            obstacles.splice(i, 1);
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
    if (!isJump) {
        isJump = true;
        gravity -= jumpPower;

        setTimeout(() => {
            gravity += jumpPower;
        }, jumpTime);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const jumpBtn = document.querySelector(".jump-btn");

    draw();

    // Listeners
    document.addEventListener('keyup', e => action(e));
    jumpBtn.addEventListener('click', () => jump())
});