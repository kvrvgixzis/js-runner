const d = document;
const cvs = d.querySelector("#canvas");
const ctx = cvs.getContext("2d");
const scoreSpan = d.querySelector("#score");
const jumpBtn = d.querySelector(".jump-btn");
const highScoreSpan = d.querySelector("#high-score");
const highScore = localStorage.getItem("highScore");

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
const fgSz = 32;
const fgPosY = worldHeight - fgSz;
const lightFgColor = "silver";
const darkFgColor = "darkgray";
let fg = [];
for (let i = 0; i < 34; i++) {
    fg.push({
        x: fgSz * i,
        y: fgPosY,
        color: i % 2 === 0 ? lightFgColor : darkFgColor,
    });
}

// hero
const hero = new Image();
const heroSz = 50;
let heroPosX = 50;
let heroPosY = worldHeight - heroSz - fgSz;
hero.src = "static/img/hero.png";

// physics
let jumpBorder = 57.5;
let bottomBorder = worldHeight - heroSz - fgSz;
let topBorder = fgSz + jumpBorder;
let jumpTime = 550;
let jumpPower = 24;
let gravity = 16;
let speed = 5;

// obstacles
let obstacles = [{
    w: heroSz,
    h: heroSz,
    x: worldWidth * 2,
    y: worldHeight - heroSz - fgSz,
}];

function frame() {
    heroPosY += gravity;

    checkWorldCollision();
    beautifyJumpBtn();
    drawBg();
    drawFg();
    drawObstacles();
    drawHero();

    isStart && requestAnimationFrame(frame);
}

function drawHero() {
    ctx.drawImage(hero, heroPosX, heroPosY);
}

function drawBg() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, worldWidth, worldHeight);
}

function drawFg() {
    fg.forEach((e, i) => {
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
}

function drawObstacles() {
    obstacles.forEach((e, i) => {
        const posY = isReverse ? fgSz : e.y;

        e.x -= speed;
        ctx.fillStyle = "gray";
        ctx.fillRect(e.x, posY, e.w, e.h);

        createNewObstacle(e);
        checkObstacleCollision(e, posY);
        removeOldObstacle(e, i);        
    });
}

function createNewObstacle(e) {
    const spawnPoint = heroSz * 2;

    if (e.x <= spawnPoint && e.x >= spawnPoint - speed) {
        const gap = Math.floor(Math.random() * ((speed * 50) - speed * 2) + speed * 2) + heroSz * 2;
        
        if (worldWidth + gap - obstacles[obstacles.length - 1].x >= heroSz * 4) {
            obstacles.push({
                w: heroSz,
                h: heroSz,
                x: worldWidth + gap,
                y: worldHeight - heroSz - fgSz,
            });
        }
    }
}

function checkObstacleCollision(e, posY) {
    const collisionBorder = 10;

    if (isReverse) {
        if (heroPosX + heroSz - collisionBorder >= e.x &&
            heroPosX + collisionBorder <= e.x + heroSz &&
            heroPosY + collisionBorder <= posY + heroSz) {
            gameOver();
        }
    } else {
        if (heroPosX + heroSz - collisionBorder >= e.x &&
            heroPosX + collisionBorder <= e.x + heroSz &&
            heroPosY + heroSz - collisionBorder >= e.y) {
            gameOver();
        }
    }
}

function removeOldObstacle(e, i) {
    // obstacle out of world
    if (e.x + heroSz <= -heroSz / 2) {
        obstacles.splice(i, 1);

        scoreUp();
        speedUp();
        changeGravity();
    }
}

function speedUp() {
    if (score % 5 === 0 && score && speed <= 9) {
        speed += .3;
        jumpTime += isReverse ? 20 : -20;
        jumpPower += 1;
    }
}

function scoreUp() {
    score++;
    scoreSpan.innerHTML = score;
}

function changeGravity() {
    if (!isJump && score % 20 === 0) {
        obstacles.map(e => {e.x += heroSz * 5;});

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
    if (score > highScore) {
        highScoreSpan.innerHTML = score;
        localStorage.setItem("highScore", score);
    }
    jumpBtn.style.color = "red";
    jumpBtn.innerHTML = "retry";
    isStart = false;
}

function checkWorldCollision() {
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
    if (isJump) {
        jumpBtn.style.background = "silver";
        jumpBtn.style.color = "gray";
        jumpBtn.style.margin = "0 3px";
    } else {
        jumpBtn.style.background = "lightgray";
        jumpBtn.style.color = "#212121";
        jumpBtn.style.margin = "0";
    }
}

function main() {
    highScoreSpan.innerHTML = highScore || 0;

    jumpBtn.innerHTML = "jump";

    frame();

    d.addEventListener('keydown', e => { e.code === 'Space' && jump(); });
    jumpBtn.addEventListener('click', () => jump());
}

d.addEventListener("DOMContentLoaded", () => {
    main();
});