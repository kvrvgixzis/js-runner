const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// World
const worldWidth = 500;
const worldHeight = 500;
ctx.canvas.width  = worldWidth;
ctx.canvas.height = worldHeight;

// Hero
const hero = new Image();
const heroSz = 50;
hero.src = "static/img/hero.png";
let heroPozX = 100;
let heroPosY = worldHeight - heroSz;

// Physics
let speed = 0;
let gravity = 10;
let isJump = false;

function draw() {
    heroPosY += gravity;

    collisionCheck();

    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, cvs.clientWidth, cvs.clientHeight);
    ctx.drawImage(hero, heroPozX, heroPosY);

    requestAnimationFrame(draw);
}

function action(e) {
    e.code === 'Space' && jump();
}

function collisionCheck() {
    if (heroPosY > worldHeight - heroSz) {
        heroPosY = worldHeight - heroSz;
        isJump = false;
    }
}

function jump() {
    const jumpPower = 20;
    const jumpTime = 300;

    if (!isJump) {
        isJump = true;
        gravity -= jumpPower;

        setTimeout(() => {
            gravity += jumpPower;
        }, jumpTime);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    draw();
    document.addEventListener('keyup', e => action(e));
});