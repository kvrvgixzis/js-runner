const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const scoreSpan = document.querySelector("#score");

let isStart = true;
let isReverse = false;
let isJump = false;

let score = 0;

// world
const worldWidth = 300;
const worldHeight = 250;
ctx.canvas.width  = worldWidth;
ctx.canvas.height = worldHeight;

//bg
const bgColor = "lightgray";

// fg
const fgBorderSz = 0;
const fgSz = 20;
const fgPosY = worldHeight - fgSz;
const lightFgColor = "silver";
const darkFgColor = "darkgray";

let fg = [];
for (let i = 0; i < 34; i++) {
    fg.push({
        x: fgSz * i,
        y: fgPosY,
        color: i % 2 == 0 ? lightFgColor : darkFgColor,
    })
}

// hero
const hero = new Image();
const heroSz = 50;
let heroPosX = 50;
let heroPosY = worldHeight - heroSz - fgSz;
hero.src = "static/img/hero.png";

// physics
let jumpBorder = 70;
let bottomBorder = worldHeight - heroSz - fgSz;
let topBorder = fgSz + jumpBorder;
let jumpTime = 520;
let jumpPower = 24;
let gravity = 16;
let speed = 6;

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

    drawBg();
    drawFg();
    drawObstacles();
    
    ctx.drawImage(hero, heroPosX, heroPosY);

    isStart && requestAnimationFrame(frame);
}

function drawBg() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, worldWidth, worldHeight);
}

function drawFg() {
    fg.forEach((e, i, _) => {
        e.x -= speed;

        // bottom fg
        ctx.fillStyle = isReverse ? bgColor : e.color;
        ctx.fillRect(e.x, e.y, fgSz, fgSz);

        // top fg
        ctx.fillStyle = isReverse ? e.color : bgColor;
        ctx.fillRect(e.x, 0, fgSz, fgSz);

        if (e.x + fgSz <= -fgSz) {
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
}

function drawObstacles() {
    obstacles.forEach((e, i, _) => {
        const spawnPoint = heroSz * 2;
        const posY = isReverse ? fgSz : e.y;

        e.x -= speed;

        ctx.fillStyle = "gray";
        ctx.fillRect(e.x, posY, e.w, e.h);

        // spawn
        if (e.x <= spawnPoint && e.x >= spawnPoint - speed) {
            const gap = Math.floor(Math.random() * ((speed * 50) - speed * 2) + speed * 2) + heroSz * 2;
            
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
        if (isReverse) {
            if (heroPosX + heroSz - 5 >= e.x &&
                heroPosX + 5 <= e.x + heroSz &&
                heroPosY - 5 <= posY + heroSz) {
                gameOver();
            }
        } else {
            if (heroPosX + heroSz - 5 >= e.x &&
                heroPosX + 5 <= e.x + heroSz &&
                heroPosY + heroSz + 5 >= e.y) {
                gameOver();
            }
        }
        
        // obstacle out of world
        if (e.x + heroSz <= -heroSz / 2) {
            obstacles.splice(i, 1);

            scoreUp();
            speedUp();
            changeGravity();
        }
    });
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
    score++;
    scoreSpan.innerHTML = score;
}

function changeGravity() {
    if (!isJump && score % 20 === 0) {
        obstacles.map(e => {e.x += heroSz * 5})

        isJump = true;
        isReverse = !isReverse;
        gravity = -gravity;
        jumpPower = -jumpPower;

        if (gravity < 0) {
            topBorder -= jumpBorder;
            bottomBorder -= jumpBorder;
        } else {
            topBorder += jumpBorder;
            bottomBorder += jumpBorder;
        }
    }
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
    // e.code === 'Enter' && changeGravity();
}

function checkCollision() {
    if (heroPosY > bottomBorder) {
        if (isReverse) {
            heroPosY = bottomBorder;    
        } else {
            heroPosY = bottomBorder;
            isJump = false;
        }
    }
    if (heroPosY < topBorder) {
        if (isReverse) {
            heroPosY = topBorder;
            isJump = false;
        } else {
            heroPosY = topBorder;
        }
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