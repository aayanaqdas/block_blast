import { gameState } from "./gameStates.js";
import { img } from "./assets.js";
import { layout } from "./layout.js";
import { spriteMap } from "./spriteMap.js";
import { drawScoreDigits } from "./score.js";

const gameOverText = spriteMap.gameOverUI.gameOverText;
const scoreText = spriteMap.gameOverUI.scoreText;
const bestText = spriteMap.gameOverUI.bestText;
const newGameBtn = spriteMap.gameUI.redBtn;
const playIcon = spriteMap.gameUI.playIcon;
const shareBtn = spriteMap.gameOverUI.shareBtn;
const newBestTrophy = spriteMap.gameOverUI.newBestTrophy;

function drawGameOverScreen(ctx) {
  if (!gameState.isGameOver()) return;
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameState.GAME_WIDTH, gameState.GAME_HEIGHT);
  ctx.restore();

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
    gameState.score,
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

  if (gameState.isNewBest) {
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
}

export { drawGameOverScreen };
