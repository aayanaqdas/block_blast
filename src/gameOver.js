import { gameState } from "./gameStates.js";
import { img } from "./assets.js";
import { layout } from "./layout.js";
import { spriteMap } from "./spriteMap.js";
import { drawScoreDigits } from "./score.js";
import { playSound } from "./audio.js";

const gameOverText = spriteMap.gameOverUI.gameOverText;
const scoreText = spriteMap.gameOverUI.scoreText;
const bestText = spriteMap.gameOverUI.bestText;
const newGameBtn = spriteMap.gameUI.redBtn;
const playIcon = spriteMap.gameUI.playIcon;
const shareBtn = spriteMap.gameOverUI.shareBtn;
const newBestTrophy = spriteMap.gameOverUI.newBestTrophy;

let newBestSoundPlayed = false;

function updateSilvering() {
  if (!gameState.silveringActive || gameState.silveringDone) return;

  const r = gameState.silveringRow;
  const c = gameState.silveringCol;

  if (gameState.gridData[r][c] !== null) {
    gameState.gridData[r][c] = "silver";
  }

  gameState.silveringCol++;

  if (gameState.silveringCol >= gameState.GRID_SIZE) {
    gameState.silveringCol = 0;
    gameState.silveringRow++;
  }

  if (gameState.silveringRow >= gameState.GRID_SIZE) {
    gameState.silveringActive = false;
    gameState.silveringDone = true;
  }
}

function drawGameOverScreen(ctx) {
  if (!gameState.isGameOver()) {
    newBestSoundPlayed = false;
    return;
  }
  let animDone = true;
  if (gameState.gameOverAnimProgress < 1) {
    gameState.gameOverAnimProgress += 0.05;
    if (gameState.gameOverAnimProgress > 1) {
      gameState.gameOverAnimProgress = 1;
    }

    animDone = false;
  }

  let countingDone = true;
  if (gameState.gameOverDisplayScore < gameState.score && animDone) {
    const diff = gameState.score - gameState.gameOverDisplayScore;
    gameState.gameOverDisplayScore += Math.max(1, Math.floor(diff * 0.08));
    if (gameState.gameOverDisplayScore > gameState.score) {
      gameState.gameOverDisplayScore = gameState.score;
    }
    countingDone = false;
  }

  const anim = gameState.gameOverAnimProgress;

  const scale = 1 - Math.pow(1 - anim, 3);
  const cx = gameState.GAME_WIDTH / 2;
  const cy = gameState.GAME_HEIGHT / 2;

  ctx.save();
  ctx.globalAlpha = 0.8 * anim;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameState.GAME_WIDTH, gameState.GAME_HEIGHT);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = anim;

  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  ctx.drawImage(img.gameOverDialog, layout.gameOverDialog.x, layout.gameOverDialog.y);

  ctx.save();
  ctx.translate(layout.dialogGameOverText.x, layout.dialogGameOverText.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiTextSheet,
    gameOverText.sx,
    gameOverText.sy,
    gameOverText.sw,
    gameOverText.sh,
    -gameOverText.sw / 2,
    -gameOverText.sh / 2,
    gameOverText.sw,
    gameOverText.sh,
  );
  ctx.restore();

  ctx.save();
  ctx.translate(layout.dialogScoreText.x, layout.dialogScoreText.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiTextSheet,
    scoreText.sx,
    scoreText.sy,
    scoreText.sw,
    scoreText.sh,
    -scoreText.sw / 2,
    -scoreText.sh / 2,
    scoreText.sw,
    scoreText.sh,
  );
  ctx.restore();

  drawScoreDigits(
    ctx,
    gameState.gameOverDisplayScore,
    layout.dialogScoreDigits.x,
    layout.dialogScoreDigits.y,
    layout.dialogScoreDigits.h,
  );

  ctx.drawImage(
    img.uiTextSheet,
    bestText.sx,
    bestText.sy,
    bestText.sw,
    bestText.sh,
    layout.dialogBestText.x - bestText.sw / 2,
    layout.dialogBestText.y,
    bestText.sw,
    bestText.sh,
  );

  drawScoreDigits(
    ctx,
    gameState.bestScore,
    layout.dialogBestDigits.x,
    layout.dialogBestDigits.y,
    layout.dialogBestDigits.h,
  );

  if (gameState.isNewBest && animDone && countingDone) {
    if (!newBestSoundPlayed) {
      playSound("newBest");
      newBestSoundPlayed = true;
    }
    ctx.drawImage(
      img.uiSheet,
      newBestTrophy.sx,
      newBestTrophy.sy,
      newBestTrophy.sw,
      newBestTrophy.sh,
      layout.newBestTrophy.x,
      layout.newBestTrophy.y,
      layout.newBestTrophy.w,
      layout.newBestTrophy.h,
    );
  }

  ctx.save();
  ctx.translate(layout.dialogNewGameBtn.x, layout.dialogNewGameBtn.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiSheet,
    newGameBtn.sx,
    newGameBtn.sy,
    newGameBtn.sw,
    newGameBtn.sh,
    -newGameBtn.sw / 2,
    -newGameBtn.sh / 2,
    layout.dialogNewGameBtn.h,
    newGameBtn.sh,
  );
  ctx.restore();

  ctx.save();
  ctx.translate(layout.playIcon.x, layout.playIcon.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiSheet,
    playIcon.sx,
    playIcon.sy,
    playIcon.sw,
    playIcon.sh,
    -playIcon.sw / 2,
    -playIcon.sh / 2,
    layout.playIcon.h,
    layout.playIcon.w,
  );
  ctx.restore();

  ctx.save();
  ctx.translate(layout.shareBtn.x, layout.shareBtn.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiSheet,
    shareBtn.sx,
    shareBtn.sy,
    shareBtn.sw,
    shareBtn.sh,
    -shareBtn.sw / 2,
    -shareBtn.sh / 2,
    shareBtn.sw,
    shareBtn.sh,
  );
  ctx.restore();

  ctx.restore();
}

export { drawGameOverScreen, updateSilvering };
