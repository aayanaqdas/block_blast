import { gameState } from "./gameStates.js";
import { spriteMap } from "./spriteMap.js";
import { layout } from "./layout.js";
import { img } from "./assets.js";

const closeBtn = spriteMap.optionsUI.closeBtn;
const replayBtn = spriteMap.optionsUI.replayBtn;
const resetBtn = spriteMap.optionsUI.resetBtn;

function drawOptionsText(ctx, labelObj) {
  const style = layout.LABEL_STYLE;
  ctx.font = style.font;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  ctx.fillStyle = style.shadowColor;
  ctx.fillText(labelObj.text, labelObj.x, labelObj.y + style.shadowOffSet);

  ctx.fillStyle = style.color;
  ctx.fillText(labelObj.text, labelObj.x, labelObj.y);
}

function drawOptionsDialog(ctx) {
  if (!gameState.isOptions()) return;
  if (gameState.optionsAnimProgress < 1) {
    gameState.optionsAnimProgress += 0.05;
    if (gameState.optionsAnimProgress > 1) {
      gameState.optionsAnimProgress = 1;
    }
  }

  const soundBtns = gameState.isSoundOn
    ? spriteMap.optionsUI.soundOnBtn
    : spriteMap.optionsUI.soundOffBtn;

  const anim = gameState.optionsAnimProgress;

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

  ctx.drawImage(img.optionsDialog, layout.optionsDialog.x, layout.optionsDialog.y);

  ctx.save();
  ctx.translate(layout.optionsCloseBtn.x, layout.optionsCloseBtn.y);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiSheet,
    closeBtn.sx,
    closeBtn.sy,
    closeBtn.sw,
    closeBtn.sh,
    -closeBtn.sw / 2,
    -closeBtn.sh / 2,
    closeBtn.sw,
    closeBtn.sh,
  );
  ctx.restore();

  drawOptionsText(ctx, layout.optionsSoundText);
  drawOptionsText(ctx, layout.optionsReplayText);
  drawOptionsText(ctx, layout.optionsResetText);

  ctx.drawImage(
    img.uiGameSheet,
    soundBtns.sx,
    soundBtns.sy,
    soundBtns.sw,
    soundBtns.sh,
    layout.optionsSoundBtn.x,
    layout.optionsSoundBtn.y,
    layout.optionsSoundBtn.w,
    layout.optionsSoundBtn.h,
  );

  ctx.drawImage(
    img.uiGameSheet,
    replayBtn.sx,
    replayBtn.sy,
    replayBtn.sw,
    replayBtn.sh,
    layout.optionsReplayBtn.x,
    layout.optionsReplayBtn.y,
    layout.optionsReplayBtn.w,
    layout.optionsReplayBtn.h,
  );

  ctx.drawImage(
    img.uiSheet,
    resetBtn.sx,
    resetBtn.sy,
    resetBtn.sw,
    resetBtn.sh,
    layout.optionsResetBtn.x,
    layout.optionsResetBtn.y,
    layout.optionsResetBtn.w,
    layout.optionsResetBtn.h,
  );

  ctx.restore();
}

export { drawOptionsDialog };
