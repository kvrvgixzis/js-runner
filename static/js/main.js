const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const width = 500;
const height = 500;
ctx.canvas.width  = width;
ctx.canvas.height = height;

const hero = new Image();
hero.src = "static/img/hero.png";

let heroPozX = 100;
let heroPosY = height - heroSz;
const heroSz = 50;

let speed = 0;
let gravity = 10;
const jumpPower = 20;
const jumpTime = 300;

function draw() {
    heroPozX += speed;
    heroPosY += gravity;

    collisionCheck();

    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, cvs.clientWidth, cvs.clientHeight);
    ctx.drawImage(hero, heroPozX, heroPosY);


    if (heroPozX + hero.width <= width) {
        requestAnimationFrame(draw);
    }
}

function action(e) {
    if (e.code === 'Space') {
        console.log("sdfsf")
        jump();
    }
}

function collisionCheck() {
    if (heroPosY > height - heroSz) {
        heroPosY = height - heroSz;
    }
}

function jump() {
    gravity -= jumpPower;
    setTimeout(() => {
        gravity += jumpPower;
    }, jumpTime);
}

document.addEventListener("DOMContentLoaded", () => {
    draw();
    document.addEventListener('keyup', e => action(e));
});