import { gameState } from "./gameStates.js";
import { img, loadAssets } from "./assets.js";
import { preloadAllAudio, initAudioUnlock } from "./audio.js";
import { initLayout, layout } from "./layout.js";
import { intiGrid, drawGrid, updateFillGridAnim } from "./grid.js";
import { initHand, drawHand } from "./hand.js";
import { initUIEvents } from "./uiEvents.js";
import { drawGhost } from "./blocks.js";
import { updateAndDrawScoring } from "./score.js";
import { drawGameOverScreen, updateSilvering } from "./gameOver.js";
import { updateAndDrawParticles } from "./particles.js";
import { updateAndDrawFloatingTexts } from "./floatingText.js";
import { spriteMap } from "./spriteMap.js";

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

function drawMenu(ctx) {
  if (!gameState.isMenu()) return;
  const sb = spriteMap.gameUI.startBtn;
  ctx.drawImage(img.plantTop, layout.plantTop.x, layout.plantTop.y);

  ctx.drawImage(img.logo, layout.logo.x, layout.logo.y);
  
  ctx.save();
  ctx.translate(layout.startBtn.x, layout.startBtn.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiSheet,
    sb.sx,
    sb.sy,
    sb.sw,
    sb.sh,
    -sb.sw / 2,
    -sb.sh / 2,
    layout.startBtn.h,
    sb.sh,
  );
  ctx.restore();

  ctx.drawImage(img.plantBottom, layout.plantBottom.x, layout.plantBottom.y);
}

function gameLoop() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.drawImage(img.bg, 0, 0);

  drawMenu(ctx);

  if (!gameState.isMenu()) {
    updateAndDrawScoring(ctx);

    if (gameState.isStartAnim()) {
      updateFillGridAnim();
    }
    drawGrid(ctx);
    ctx.drawImage(img.gridOutline, layout.gridOutline.x, layout.gridOutline.y);
    ctx.drawImage(img.bottomBg, layout.bottomBg.x, layout.bottomBg.y);
    ctx.drawImage(img.plantTop, layout.plantTop.x, layout.plantTop.y);
    ctx.drawImage(img.plantBottom, layout.plantBottom.x, layout.plantBottom.y);

    drawGhost(ctx);
    drawHand(ctx);
    updateAndDrawParticles(ctx);
    updateAndDrawFloatingTexts(ctx);
    updateSilvering();
    if (gameState.isGameOver() && gameState.silveringDone) {
      drawGameOverScreen(ctx);
    }
  }
  requestAnimationFrame(gameLoop);
}

function initGame() {
  loadAssets().then(async () => {
    gameState.init(canvas, ctx, img.uiSheet, img.uiGameSheet);
    initCanvas();
    await preloadAllAudio();
    initAudioUnlock();
    initLayout(img);
    initUIEvents();
    intiGrid(img.gridOutline);
    initHand();
    window.addEventListener("resize", initCanvas);
    gameLoop();
  });
}

initGame();
