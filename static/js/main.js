const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let isStart = true;

let score = 0;

// world
const worldWidth = 300;
const worldHeight = 250;
ctx.canvas.width  = worldWidth;
ctx.canvas.height = worldHeight;

// fg
const fgBorderSz = 1.5;
const fgSz = 25;
const fgPosY = worldHeight - 25;
let fg = [];
for (let i = 0; i < 24; i++) {
    fg.push({
        x: 25 * i,
        y: fgPosY,
        color: i % 2 == 0 ? "silver" : "darkgray"
    })
}

// hero
const hero = new Image();
const heroSz = 50;
let heroPosX = 20;
let heroPosY = worldHeight - heroSz - fgSz;
hero.src = "static/img/hero.png";

// physics
const bottomBorder = worldHeight - heroSz - fgSz;
const topBorder = worldHeight - 170;
let jumpTime = 520;
let jumpPower = 27;
let speed = 6;
let gravity = 16;
let isJump = false;

// obstacles
let obstacles = [{
    w: heroSz,
    h: heroSz,
    x: worldWidth * 2,
    y: worldHeight - heroSz - fgSz,
},
];


function frame() {
    heroPosY += gravity;

    checkCollision();
    beautifyJumpBtn();

    // bg
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    //fg
    fg.forEach((e, i, _) => {
        e.x -= speed;
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, fgSz, fgSz);
        ctx.fillRect(e.x, 0, fgSz, fgSz);

        if (e.x + fgSz <= 0) {
            fg.push({
                x: fg[fg.length - 1].x + fgSz,
                y: fgPosY,
                color: e.color
            });
            fg.splice(i, 1);
        }
    });
    ctx.fillStyle = "gray";
    ctx.fillRect(0, worldHeight - fgSz, worldWidth, fgBorderSz);
    ctx.fillRect(0, fgSz - fgBorderSz, worldWidth, fgBorderSz);
    

    // spawn obstacles
    obstacles.forEach((e, i, _) => {
        const spawnPoint = 50;

        ctx.fillStyle = "gray";
        ctx.fillRect(e.x, e.y, e.w, e.h);
        e.x -= speed;

        // spawn
        if (e.x <= spawnPoint && e.x >= spawnPoint - speed) {
            const gap = Math.floor(Math.random() * ((speed * 50) - speed * 2) + speed * 2) + 20;
            // const gap = Math.floor(Math.random() * Math.floor(heroSz * 10)) + speed * 5;
            if (worldWidth + gap - obstacles[obstacles.length - 1].x >= heroSz * 4) {
                obstacles.push({
                    w: heroSz,
                    h: heroSz,
                    x: worldWidth + gap,
                    y: worldHeight - heroSz - fgSz,
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
    
    // draw hero
    ctx.drawImage(hero, heroPosX, heroPosY);

    isStart && requestAnimationFrame(frame);
}

function speedUp() {
    if (score % 10 === 0 && score && speed <= 11) {
        speed += .5;
        if (jumpTime >= 250) {
           jumpTime -= speed * 2;
        }
        jumpPower += 1;
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

    frame();

    document.addEventListener('keydown', e => action(e));
    jumpBtn.addEventListener('click', () => jump())
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});