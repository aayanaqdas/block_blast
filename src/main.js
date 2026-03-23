import { gameState } from "./gameStates.js";
import { img, loadAssets } from "./assets.js";
import { initLayout, layout } from "./layout.js";
import { intiGrid, drawGrid } from "./grid.js";
import { initHand, drawHand } from "./hand.js";
import { initUIEvents } from "./uiEvents.js";
import { drawGhost } from "./blocks.js";
import { drawScoring } from "./score.js";
import { drawGameOverScreen } from "./gameOver.js";

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
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.drawImage(img.bg, 0, 0);

  drawScoring(ctx);

  drawGrid(ctx);
  ctx.drawImage(img.gridOutline, layout.gridOutline.x, layout.gridOutline.y);
  ctx.drawImage(img.bottomBg, layout.bottomBg.x, layout.bottomBg.y);
  ctx.drawImage(img.plantTop, layout.plantTop.x, layout.plantTop.y);
  ctx.drawImage(img.plantBottom, layout.plantBottom.x, layout.plantBottom.y);

  drawGhost(ctx);
  drawHand(ctx);
  drawGameOverScreen(ctx);
  requestAnimationFrame(gameLoop);
}

function initGame() {
  loadAssets().then(() => {
    gameState.init(canvas, ctx, img.uiSheet, img.uiGameSheet);
    initCanvas();
    initLayout(img);
    initUIEvents();
    intiGrid(img.gridOutline);
    initHand();
    window.addEventListener("resize", initCanvas);
    gameLoop();
  });
}

initGame();
