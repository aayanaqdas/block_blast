import { drawGrid } from "./grid.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 600;
const GAME_HEIGHT = 900;

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
  drawGrid(ctx, GAME_WIDTH, GAME_HEIGHT);
  requestAnimationFrame(gameLoop);
}

initCanvas();

gameLoop();

window.addEventListener("resize", initCanvas);
