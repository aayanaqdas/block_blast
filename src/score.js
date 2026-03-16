import { gameState } from "./gameStates.js";
import { spriteMap } from "./spriteMap.js";
import { img } from "./assets.js";
import { layout } from "./layout.js";

const scoreBg = spriteMap.gameUI.scoreBg;
const bestScoreBg = spriteMap.gameUI.bestScoreBg;
const optionsBtn = spriteMap.gameUI.optionsBtn;
const scoreTrophy = spriteMap.gameUI.trophy;
const digit = spriteMap.digits[0];

function drawScoring(ctx) {
  ctx.drawImage(img.topBg, layout.topBg.x, layout.topBg.y);

  ctx.drawImage(
    img.uiGameSheet,
    bestScoreBg.sx,
    bestScoreBg.sy,
    bestScoreBg.sw,
    bestScoreBg.sh,
    layout.bestScoreBg.x,
    layout.bestScoreBg.y,
    layout.bestScoreBg.w,
    layout.bestScoreBg.h,
  );

  ctx.save();
  ctx.translate(layout.scoreBg.x + layout.scoreBg.w / 2, layout.scoreBg.y + layout.scoreBg.h / 2);

  ctx.rotate(Math.PI / 2);
  ctx.drawImage(
    img.uiGameSheet,
    scoreBg.sx,
    scoreBg.sy,
    scoreBg.sw,
    scoreBg.sh,
    -layout.scoreBg.h / 2,
    -layout.scoreBg.w / 2,
    layout.scoreBg.h,
    layout.scoreBg.w,
  );

  ctx.restore();

  ctx.drawImage(
    img.uiGameSheet,
    optionsBtn.sx,
    optionsBtn.sy,
    optionsBtn.sw,
    optionsBtn.sh,
    layout.optionsBtn.x,
    layout.optionsBtn.y,
    layout.optionsBtn.w,
    layout.optionsBtn.h,
  );

  ctx.save();
  ctx.translate(
    layout.scoreTrophy.x + layout.scoreTrophy.w / 2,
    layout.scoreTrophy.y + layout.scoreTrophy.h / 2,
  );

  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(
    img.uiGameSheet,
    scoreTrophy.sx,
    scoreTrophy.sy,
    scoreTrophy.sw,
    scoreTrophy.sh,
    -layout.scoreTrophy.h / 2,
    -layout.scoreTrophy.w / 2,
    layout.scoreTrophy.h,
    layout.scoreTrophy.w,
  );

  ctx.restore();

  ctx.drawImage(
    img.scoreDigits,
    digit.sx,
    digit.sy,
    digit.sw,
    digit.sh,
    layout.bestScoreDigits.x,
    layout.bestScoreDigits.y,
    layout.bestScoreDigits.w,
    layout.bestScoreDigits.h,
  );

  ctx.drawImage(
    img.scoreDigits,
    digit.sx,
    digit.sy,
    digit.sw,
    digit.sh,
    layout.scoreDigits.x,
    layout.scoreDigits.y,
    layout.scoreDigits.w,
    layout.scoreDigits.h,
  );
}

export { drawScoring };
