/** parameters **/
// square size of the snake and food
const boxSize = 20;
// number of boxes inside the board
const numberOfBoxes = 25;
// animation speed (lower is faster)
const speed = 90;
/** -- **/

/** variables and constants **/
// canvas is used to draw graphics
const canvas = document.getElementById('canvas');
// html element to render the game title
const gameTitle = document.getElementById('title');
// game score
let score = 0;
// identifier to cancel the animation
let timeoutID;
// directions
const directions = { left: 37, up: 38, right: 39, down: 40 };
// size of the board game
const boardSize = boxSize * numberOfBoxes;
/** -- **/

/** food **/
// food constructor
function Food(posX, posY) {
  // fillStyle of the food
  this.fillStyle = 'rgb(200, 0, 0)';
  // food position
  this.x = posX;
  this.y = posY;
}
//
Food.prototype.render = function() {
  ctx.fillStyle = this.fillStyle;
  // draw the head
  ctx.fillRect(this.x, this.y, boxSize, boxSize);
  // console.log(`food x:${this.x} y:${this.y}`);
};
/** -- **/

/** snake **/
// snake constructor
function Snake(posX, posY) {
  // fillStyle of the head
  this.headFillStyle = 'rgba(0, 99, 177, 1)';
  // fillStyle of the body
  this.bodyFillStyle1 = 'rgba(241, 144, 31, 0.9)'; //rrgba(232, 126, 4, 1)
  this.bodyFillStyle2 = 'rgba(241, 144, 31, 0.7)';
  // snake position
  this.x = posX;
  this.y = posY;
  // snake body
  this.body = [];

  // get initial direction
  this.direction = (function() {
    // direction codes
    let directions = [37, 38, 39, 40];

    if (posX === 0) directions.splice(directions.indexOf(directions.left), 1);
    if (posY === 0) directions.splice(directions.indexOf(directions.up), 1);
    if (posX === boardSize - boxSize)
      directions.splice(directions.indexOf(directions.right), 1);
    if (posY === boardSize - boxSize)
      directions.splice(directions.indexOf(directions.down), 1);

    return randomFromArray(directions);
  })();
}
// render snake
Snake.prototype.render = function() {
  // set the fillStyle of the head
  ctx.fillStyle = this.headFillStyle;
  // draw the head
  ctx.fillRect(this.x, this.y, boxSize, boxSize);

  // draw the body
  if (this.body.length > 0) {
    for (let i = 0; i < this.body.length; i++) {
      // set the fillStyle of the box
      ctx.fillStyle = i % 2 === 0 ? this.bodyFillStyle1 : this.bodyFillStyle2;
      // draw the box
      ctx.fillRect(this.body[i].x, this.body[i].y, boxSize, boxSize);
    }
  }
  // console.log(`snake x:${this.x} y:${this.y}`);
};
// move the snake one step
Snake.prototype.move = function() {
  // set the body's new position
  if (this.body.length > 0) {
    const newBody = [...this.body];
    for (let i = 1; i < newBody.length; i++) this.body[i] = newBody[i - 1];
    this.body[0] = { x: this.x, y: this.y };
  }

  // set the head's new position according the direction
  if (this.direction === directions.left) this.x = snake.x - boxSize;
  else if (this.direction === directions.up) this.y = snake.y - boxSize;
  else if (this.direction === directions.right) this.x = snake.x + boxSize;
  else if (this.direction === directions.down) this.y = snake.y + boxSize;
};
// check if snake has collided
Snake.prototype.hasCollided = function() {
  let ret = false;

  // board collision
  if (
    this.x < 0 ||
    this.y < 0 ||
    this.x > boardSize - boxSize ||
    this.y > boardSize - boxSize
  ) {
    ret = true;
  }

  // self collision code goes here ...

  return ret;
};
// check snake has eaten
Snake.prototype.hasEaten = function(x, y) {
  if (this.x === x && this.y === y) {
    // get the last box position of the snake
    let lastBoxPosition = { x: this.x, y: this.y };
    const bodyLenth = this.body.length;
    if (bodyLenth > 0)
      lastBoxPosition = {
        x: this.body[bodyLenth - 1].x,
        y: this.body[bodyLenth - 1].y
      };

    // set the new box position of the snake
    let newBoxPosition = { x: null, y: null };
    if (this.direction === directions.left)
      newBoxPosition = {
        x: lastBoxPosition.x + boxSize,
        y: lastBoxPosition.y
      };
    else if (this.direction === directions.up)
      newBoxPosition = {
        x: lastBoxPosition.x,
        y: lastBoxPosition.y + boxSize
      };
    else if (this.direction === directions.right)
      newBoxPosition = {
        x: lastBoxPosition.x - boxSize,
        y: lastBoxPosition.y
      };
    else if (this.direction === directions.down)
      newBoxPosition = {
        x: lastBoxPosition.x,
        y: lastBoxPosition.y - boxSize
      };

    this.body.push(newBoxPosition);
    score++;
    gameTitle.innerHTML = `Score: ${score}`;
    return true;
  }

  return false;
};
/** -- **/

// initialize game
function init() {
  // checking for support
  if (this.readyToPlay) {
    // initialize snake
    const { x: snakePosX, y: snakePosY } = getRandomPosition();
    this.snake = new Snake(snakePosX, snakePosY);

    // initialize food
    let foodPos = getValidPositionForFood([{ x: snakePosX, y: snakePosY }]);
    this.food = new Food(foodPos.x, foodPos.y);

    start();
  }
}

function start() {
  // check snake collision
  if (snake.hasCollided()) {
    clearTimeout(timeoutID);
    gameOver();
    return;
  }

  // check snake collision
  if (snake.hasEaten(food.x, food.y)) {
    const newFoodposition = getValidPositionForFood([
      { x: snake.x, y: snake.y },
      ...snake.body
    ]);
    food.x = newFoodposition.x;
    food.y = newFoodposition.y;
  }

  // clear the pixels in a given rectangle
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  food.render();

  snake.render();
  snake.move();

  // updates an animation before the next repaint
  timeoutID = setTimeout(start, speed);
}

/** useful functions **/
// returns a random integer between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// returns a random item from an array
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
// get random ponsition inside the board
function getRandomPosition() {
  const x = random(0, numberOfBoxes - 1) * boxSize;
  const y = random(0, numberOfBoxes - 1) * boxSize;
  return { x, y };
}
// returns a valid box position for food
function getValidPositionForFood(snakePositions) {
  const foodPosition = getRandomPosition();
  let isValidposition = true;

  for (let i = 0; i < snakePositions.length; i++) {
    if (
      foodPosition.x === snakePositions[i].x &&
      foodPosition.y === snakePositions[i].y
    ) {
      isValidposition = false;
      break;
    }
  }

  if (isValidposition) return foodPosition;
  else return getValidPositionForFood(snakePositions);
}
function gameOver() {
  // set initial board text
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvas.width / 2, canvas.width / 2);
  ctx.fillStyle = 'rgb(192, 192, 192, 0.4)';
  ctx.fillRect(0, 0, boardSize, boardSize);
}
/** -- **/

// window event to move the snake inside the board (canvas) using arrow keys
window.onkeydown = function(event) {
  const keyCode = event.keyCode; // key pressed code

  if (keyCode === directions.up) {
    snake.direction = directions.up;
  } else if (keyCode === directions.right) {
    snake.direction = directions.right;
  } else if (keyCode === directions.down) {
    snake.direction = directions.down;
  } else if (keyCode === directions.left) {
    snake.direction = directions.left;
  } else if (keyCode === 27) {
    clearTimeout(timeoutID);
  }
};

// initialize the game after the page has been loaded
window.onload = function() {
  this.readyToPlay = false;
  // checking for support
  if (canvas.getContext) {
    // set context
    this.ctx = canvas.getContext('2d');
    // set canvas size
    canvas.width = boardSize;
    canvas.height = boardSize;

    // set initial board text
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click Start Game', canvas.width / 2, canvas.width / 2);

    this.readyToPlay = true;
  } else {
    // unsupported canvas code goes here ...
  }
};
