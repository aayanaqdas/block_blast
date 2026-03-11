import { gameState } from "./gameStates.js";
import { drawGrid } from "./grid.js";
import { initHand, drawHand } from "./hand.js";
import { drawGhost } from "./blocks.js";


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = gameState.GAME_WIDTH;
const GAME_HEIGHT = gameState.GAME_HEIGHT;

const bg = new Image();
bg.src = "./assets/assets/img/bg_game.jpg";
const boardOutline = new Image();
boardOutline.src = "./images/board.png";
const topBg = new Image();
topBg.src = "./images/top_bg.png";
const bottomBg = new Image();
bottomBg.src = "./images/touch_bg.png";
const plantTop = new Image();
plantTop.src = "./images/plant_top.png";
const plantBottom = new Image();
plantBottom.src = "./images/plant_bottom.png";
const uiSheet = new Image();
uiSheet.src = "./images/new_ui.png";

function initCanvas() {
  const dpr = window.devicePixelRatio || 1;

  const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
  const displayWidth = GAME_WIDTH * scale;
  const displayHeight = GAME_HEIGHT * scale;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.scale(dpr * scale, dpr * scale);
}

function gameLoop() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.drawImage(bg, 0, 0);

  ctx.drawImage(topBg, GAME_WIDTH / 2 - topBg.width / 2, plantTop.height / 2);
  drawGrid(ctx, uiSheet);
  ctx.drawImage(boardOutline, GAME_WIDTH / 2 - boardOutline.width / 2, 210);
  ctx.drawImage(
    bottomBg,
    GAME_WIDTH / 2 - bottomBg.width / 2,
    GAME_HEIGHT - plantBottom.height * 2,
  );
  ctx.drawImage(plantTop, GAME_WIDTH / 2 - plantTop.width / 2, 0);
  ctx.drawImage(plantBottom, GAME_WIDTH / 2 - plantTop.width / 2, GAME_HEIGHT - plantBottom.height);

  drawGhost(ctx);
  drawHand(ctx);

  requestAnimationFrame(gameLoop);
}

function initGame() {
  gameState.init(canvas, ctx, uiSheet);
  initCanvas();
  initHand();
  window.addEventListener("resize", initCanvas);
  gameLoop();
}

initGame();
