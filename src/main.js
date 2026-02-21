import { gameState } from "./gameStates.js";
import { drawGrid } from "./grid.js";
import { createHand, drawHand } from "./blocks.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = gameState.GAME_WIDTH;
const GAME_HEIGHT = gameState.GAME_HEIGHT;



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
  drawGrid(ctx);
  drawHand(ctx);
  requestAnimationFrame(gameLoop);
}

function initGame(){
  gameState.init(canvas, ctx);
  initCanvas();
  createHand()
  window.addEventListener("resize", initCanvas);
  gameLoop();
}

initGame();




