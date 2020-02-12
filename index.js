/** parameters **/
// square size of the snake and food
const boxSize = 20;
// number of boxes inside the board
const numberOfBoxes = 20;
/** -- **/

/** computed **/
// size of the board game
const boardSize = boxSize * numberOfBoxes;
/** -- **/

/** food **/
// food constructor
function Food(posX, posY) {
  this.fillStyle = 'rgb(200, 0, 0)';
  this.posX = posX;
  this.posY = posY;
}
//
Food.prototype.render = function() {
  ctx.fillStyle = this.fillStyle;
  ctx.fillRect(this.posX, this.posY, boxSize, boxSize);
};
/** -- **/

/** snake **/
// snake constructor
function Snake(posX, posY) {
  this.headFillStyle = 'rgba(0, 99, 177, 0.8)';
  this.posX = posX;
  this.posY = posY;
}
//
Snake.prototype.render = function() {
  ctx.fillStyle = this.headFillStyle;
  ctx.fillRect(this.posX, this.posY, boxSize, boxSize);
};
/** -- **/

// initialize game
function init() {
  // canvas is used to draw graphics
  const canvas = document.getElementById('canvas');
  // checking for support
  if (canvas.getContext) {
    // set canvas size
    canvas.width = boardSize;
    canvas.height = boardSize;
    // set context
    this.ctx = canvas.getContext('2d');

    // initialize food
    const { x: foodPosX, y: foodPosY } = getRandomPosition();
    //drawFood(foodPosX, foodPosY);
    this.food = new Food(foodPosX, foodPosY);
    food.render();

    // initialize snake
    const { x: snakePosX, y: snakePosY } = getRandomPosition();
    //drawSnake(snakePosX, snakePosY);
    this.snake = new Snake(snakePosX, snakePosY);
    snake.render();
  } else {
    // unsupported canvas code goes here
  }
}

/** useful functions **/
// returns a random integer between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// get random ponsition inside the board
function getRandomPosition() {
  const x = random(0, numberOfBoxes - 1) * boxSize;
  const y = random(0, numberOfBoxes - 1) * boxSize;
  return { x, y };
}
/** -- **/

// window event to move the snake inside the board (canvas) using arrow keys
window.onkeydown = function(event) {
  const keyCode = event.keyCode; // key pressed code

  // key codes
  // up:38 right:39 down:40 left:37
  if (keyCode === 38 && snake.posY >= boxSize) {
    snake.posY = snake.posY - 20;
  } else if (keyCode === 39 && snake.posX < boardSize - boxSize) {
    snake.posX = snake.posX + 20;
  } else if (keyCode === 40 && snake.posY < boardSize - boxSize) {
    snake.posY = snake.posY + 20;
  } else if (keyCode === 37 && snake.posX >= boxSize) {
    snake.posX = snake.posX - 20;
  }

  // clear canvas
  ctx.clearRect(0, 0, boardSize, boardSize);
  food.render();
  snake.render();
};

// initialize the game after the page has been loaded
window.onload = function() {
  init();
};
