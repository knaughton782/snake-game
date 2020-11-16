// author & original source code: https://dev.to/nitdgplug/learn-javascript-through-a-game-1beh 
let width;
let height;
let tileSize;
let canvas;
let ctx;
let fps;
let food;
let snake;
let score;
let isPaused;

// initialize game objects for canvas size
function init() {
    tileSize = 20;

    // dynamically control size of canvas 
    width = tileSize * Math.floor(window.innerWidth / tileSize);
    height = tileSize * Math.floor(window.innerHeight / tileSize);

    canvas = document.getElementById('game-area');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    food = new Food(spawnLocation(), 'red');

    snake = new Snake ({x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize))}, '#39ff14;');

    fps = 10;
    score = 0;
    isPaused = false;

}

// food as object
class Food {
    //intialize Food object properties
    constructor(pos, color) {
        this.x = pos.x;
        this.y = pos.y;
        this.color = color;
    }

    // draw food on the canvas 
    draw() {

        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }

}

// spawn food location 
function spawnLocation() {

    // create tiles in canvas 
    let rows = width / tileSize;
    let cols = height / tileSize;

    let xPos, yPos;
    xPos = Math.floor(Math.random() * rows) * tileSize;
    yPos = Math.floor(Math.random() * cols) * tileSize;

    return { x: xPos, y: yPos };
}

class Snake {

    //initialize snake object properties
    constructor(pos, color) {
        this.x = pos.x;
        this.y = pos.y;
        this.tail = [{ x: pos.x - tileSize, y: pos.y }, { x: pos.x - tileSize * 2, y: pos.y }];
        this.velX = 1;
        this.velY = 0;
        this.color = color;
    }
    // draw snake on canvas 
    draw() {
        //head of snake
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // draw snake tail
        for (var i = 0; i < this.tail.length; i++) {

            ctx.beginPath();
            ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();

        }
    }

    //move snake by updating position
    move() {

        // movement of tail
        for (var i = this.tail.length - 1; i > 0; i--) {
            this.tail[i] = this.tail[i - 1];
        }

        // update tail position to acquire the head position 
        if (this.tail.length != 0) {
            this.tail[0] = { x: this.x, y: this.y };
        }

        // movement of head
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;

    }

    // change direction of snake movement 
    dir(dirX, dirY) {
        this.velX = dirX;
        this.velY = dirY;
    }

    // has the snake eaten food 
    eat() {

        if (Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {
            // add to tail 
            this.tail.push({});
            return true;
        }
        return false;

    }

    //has snake died?
    die() {
        for (var i = 0; i < this.tail.length; i++) {
            if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize){
                return true;

            }
        }
        return false;
    }

    border() {
        if (this.x + tileSize > width && this.velX != -1 || this.x < 0 && this.velX != 1) {
            this.x = width - this.x;
        } else if (this.y + tileSize > height && this.velY != -1 || this.velY != 1 && this.y < 0) {
            this.y = height - this.y;
        }
    }

}
function game() {
    init();

    //game loop
    interval = setInterval(update, 1000/fps);
}
function update() {
    if(isPaused) {
        return;
    }
    if (snake.die()) {
        alert('Game Over!!');
        clearInterval(interval);
        window.location.reload();
    }

    snake.border();

    if (snake.eat()) {
        food = new Food(spawnLocation(), 'red');
        score += 10;
    }

    // clear and redraw
    ctx.clearRect(0, 0, width, height);
    

    food.draw();
    snake.draw();
    snake.move();
    showScore();
}

function showScore(){
    ctx.textAlign = 'center';
    ctx.font = '25px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE: ' + score, width - 120, 30);
}

// show if game is paused 
function showPaused() {
    ctx.textAlign = 'center';
    ctx.font = '35px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('PAUSED', width / 2, height / 2);
}

// use event listeners for keyboard controls
window.addEventListener('keydown', function(e) {
    if(e.key === ' ') {
        e.preventDefault();
        isPaused != isPaused;
        showPaused();
    }
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (snake.velY != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, -1);
    }
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (snake.velY != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, 1);
    }
    else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (snake.velX != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(-1, 0);
    }
    else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (snake.velX != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(1, 0);
    }

});

window.addEventListener('load', function() {
    game();
});