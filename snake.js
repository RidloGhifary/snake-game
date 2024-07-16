let GAME_SPEED = 100;
let CANVAS_BORDER_COLOUR = "black";
let CANVAS_BACKGROUND_COLOUR = "white";
let SNAKE_COLOUR = "lightgreen";
let SNAKE_BORDER_COLOUR = "darkgreen";
let FOOD_COLOUR = "red";
let FOOD_BORDER_COLOUR = "darkred";
let gameInterval;

const eatSound = document.getElementById("eat-sound");
const loseSound = document.getElementById("lose-sound");
const startSound = document.getElementById("start-sound");
const pauseSound = document.getElementById("pause-sound");
const directionSound = document.getElementById("direction-sound");

function changeTheme() {
  const gameTheme = document.getElementById("game-theme");
  if (gameStarted) return;
  switch (gameTheme.value) {
    case "light":
      CANVAS_BACKGROUND_COLOUR = "white";
      SNAKE_COLOUR = "lightgreen";
      SNAKE_BORDER_COLOUR = "darkgreen";
      FOOD_COLOUR = "red";
      FOOD_BORDER_COLOUR = "darkred";
      break;
    case "dark":
      CANVAS_BACKGROUND_COLOUR = "black";
      SNAKE_COLOUR = "white";
      SNAKE_BORDER_COLOUR = "darkgreen";
      FOOD_COLOUR = "white";
      FOOD_BORDER_COLOUR = "darkgreen";
      break;
    case "neon":
      CANVAS_BACKGROUND_COLOUR = "#059212";
      SNAKE_COLOUR = "#F3FF90";
      SNAKE_BORDER_COLOUR = "#06D001";
      FOOD_COLOUR = "#F3FF90";
      FOOD_BORDER_COLOUR = "#06D001";
      break;
    case "cold":
      CANVAS_BACKGROUND_COLOUR = "#4535C1";
      SNAKE_COLOUR = "#77E4C8";
      SNAKE_BORDER_COLOUR = "#36C2CE";
      FOOD_COLOUR = "#77E4C8";
      FOOD_BORDER_COLOUR = "#36C2CE";
      break;
    case "hell":
      CANVAS_BACKGROUND_COLOUR = "#550000";
      SNAKE_COLOUR = "#FF0000";
      SNAKE_BORDER_COLOUR = "#AA0000";
      FOOD_COLOUR = "#FF0000";
      FOOD_BORDER_COLOUR = "#AA0000";
      break;
    case "army":
      CANVAS_BACKGROUND_COLOUR = "#344E41";
      SNAKE_COLOUR = "#A3B18A";
      SNAKE_BORDER_COLOUR = "#DAD7CD";
      FOOD_COLOUR = "#A3B18A";
      FOOD_BORDER_COLOUR = "#DAD7CD";
      break;
    case "brownie":
      CANVAS_BACKGROUND_COLOUR = "#D5BDAF";
      SNAKE_COLOUR = "#F5EBE0";
      SNAKE_BORDER_COLOUR = "#EDEDE9";
      FOOD_COLOUR = "#F5EBE0";
      FOOD_BORDER_COLOUR = "#EDEDE9";
      break;
    case "pinky":
      CANVAS_BACKGROUND_COLOUR = "#FB6F92";
      SNAKE_COLOUR = "#FFB3C6";
      SNAKE_BORDER_COLOUR = "#FFC2D1";
      FOOD_COLOUR = "#FFB3C6";
      FOOD_BORDER_COLOUR = "#FFC2D1";
      break;
    case "ocean":
      CANVAS_BACKGROUND_COLOUR = "#0B0771";
      SNAKE_COLOUR = "#0F2AA8";
      SNAKE_BORDER_COLOUR = "#1832BA";
      FOOD_COLOUR = "#0F2AA8";
      FOOD_BORDER_COLOUR = "#1832BA";
      break;
  }
  previewCanvas();
}

function previewCanvas() {
  clearCanvas();
  drawSnake();
  drawFood();
}

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

let gameStarted = false;
// The user's score
let score = 0;
// When set to true the snake is changing direction
let changingDirection = false;
// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const modal = document.getElementById("gameOverModal");
const finalScore = document.getElementById("finalScore");
const closeModalSpan = document.getElementsByClassName("close")[0];
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");

// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startSound.play();
  main();
  createFood();
  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
}

function stopGame() {
  gameStarted = false;
  clearInterval(gameInterval);
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = false;
  pauseSound.play();
}

function resetGame() {
  stopGame();
  startSound.play();
  snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
  ];
  score = 0;
  dx = 10;
  dy = 0;
  document.getElementById("score").innerHTML = score;
  previewCanvas();
  resetButton.disabled = true; // Reset button is disabled after reset
}

function main() {
  gameInterval = setInterval(function onTick() {
    if (!gameStarted) return;
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    if (didGameEnd()) {
      loseSound.play();
      stopGame();
      showModal();
    }
  }, GAME_SPEED);
}

function clearCanvas() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
  ctx.strokestyle = CANVAS_BORDER_COLOUR;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawFood() {
  ctx.fillStyle = FOOD_COLOUR;
  ctx.strokestyle = FOOD_BORDER_COLOUR;
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    eatSound.play();
    score += 10;
    GAME_SPEED -= 2;
    document.getElementById("score").innerHTML = score;
    createFood();
  } else {
    snake.pop();
  }
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameCanvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsoNsnake = part.x == foodX && part.y == foodY;
    if (foodIsoNsnake) createFood();
  });
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOUR;
  ctx.strokestyle = SNAKE_BORDER_COLOUR;
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
  const LEFT_KEY = 65 || 37;
  const RIGHT_KEY = 68 || 39;
  const UP_KEY = 87 || 38;
  const DOWN_KEY = 83 || 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;

  const goingUp = dy === 10;
  const goingDown = dy === -10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    directionSound.play();
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    directionSound.play();
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    directionSound.play();
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    directionSound.play();
    dx = 0;
    dy = 10;
  }
}

function showModal() {
  finalScore.textContent = `Your score: ${score}`;
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function playAgain() {
  closeModal();
  resetGame();
  startGame();
}

previewCanvas();
