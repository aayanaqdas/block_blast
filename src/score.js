import { gameState } from "./gameStates.js";
import { spriteMap } from "./spriteMap.js";
import { img } from "./assets.js";
import { layout } from "./layout.js";

const scoreBg = spriteMap.gameUI.scoreBg;
const bestScoreBg = spriteMap.gameUI.bestScoreBg;
const optionsBtn = spriteMap.gameUI.optionsBtn;
const scoreTrophy = spriteMap.gameUI.trophy;
const digits = spriteMap.digits;

const SCORING = {
  PLACEMENT_POINTS: 1,
  LINE_BASE: 10,
  COMBO_STEP: 1,
  RESET_AFTER_MISSES: 3,

  MULTI_LINE_BONUS: {
    1: 0,
    2: 10,
    3: 30,
    4: 60,
    5: 100,
    6: 150,
  },
  EXTRA_BONUS: 50,
};

function getMultiLineBonus(linesCleared) {
  if (linesCleared <= 0) return 0;
  if (linesCleared <= 6) return SCORING.MULTI_LINE_BONUS[linesCleared];

  return SCORING.MULTI_LINE_BONUS[6] + (linesCleared - 6) * SCORING.EXTRA_BONUS;
}

function getComboMultiplier(streak) {
  const effectiveStreak = Math.max(0, streak - 1);
  return 1 + effectiveStreak * SCORING.COMBO_STEP;
}

function applyMoveScoring(placedBlocks, linesCleared) {
  let placementPoints = Math.max(0, placedBlocks) * SCORING.PLACEMENT_POINTS;
  let clearPoints = 0;
  let totalEarned = 0;

  gameState.score += placementPoints;
  totalEarned += placementPoints;

  if (linesCleared > 0) {
    gameState.movesSinceLastClear = 0;
    gameState.lastMoveCleared = true;
    gameState.streak += 1;

    const comboMultiplier = getComboMultiplier(gameState.streak);
    gameState.streakMultiplier = comboMultiplier;

    const lineBasePoints = linesCleared * SCORING.LINE_BASE;
    const multiLineBonus = getMultiLineBonus(linesCleared);
    clearPoints = Math.round((lineBasePoints + multiLineBonus) * comboMultiplier);

    gameState.score += clearPoints;
    totalEarned += clearPoints;
  } else {
    gameState.lastMoveCleared = false;
    gameState.movesSinceLastClear += 1;

    if (gameState.movesSinceLastClear >= SCORING.RESET_AFTER_MISSES) {
      gameState.streak = 0;
      gameState.streakMultiplier = 1;
      gameState.movesSinceLastClear = 0;
    }
  }

  if (gameState.score > gameState.bestScore) {
    gameState.isNewBest = true;
    gameState.bestScore = gameState.score;
    localStorage.setItem("blockBlastBestScore", gameState.bestScore);
  }

  return {
    placementPoints,
    clearPoints,
    linesCleared,
    totalEarned,
    streak: gameState.streak,
    comboMultiplier: gameState.streakMultiplier,
    total: gameState.score,
  };
}
function getDigitWidth(digit) {
  return parseInt(digit) === 1
    ? layout.DIGIT_CONFIG.widths.narrow
    : layout.DIGIT_CONFIG.widths.default;
}

function calculateScoreWidth(scoreStr) {
  let totalWidth = 0;
  for (let i = 0; i < scoreStr.length; i++) {
    totalWidth += getDigitWidth(scoreStr[i]);
    if (i < scoreStr.length - 1) {
      totalWidth += layout.DIGIT_CONFIG.spacing;
    }
  }
  return totalWidth;
}

function drawScoreDigits(ctx, score, centerX, y, h, minX = -Infinity) {
  const scoreStr = score.toString();
  const totalWidth = calculateScoreWidth(scoreStr);

  let startX = centerX - totalWidth / 2;

  if (startX < minX) {
    startX = minX;
  }

  for (let i = 0; i < scoreStr.length; i++) {
    const scoreDigit = parseInt(scoreStr[i]);
    const digitWidth = getDigitWidth(scoreStr[i]);
    const digit = digits[scoreDigit];
    ctx.drawImage(
      img.scoreDigits,
      digit.sx,
      digit.sy,
      digit.sw,
      digit.sh,
      startX,
      y,
      digitWidth,
      h,
    );

    startX += digitWidth + layout.DIGIT_CONFIG.spacing;
  }
}

function updateAndDrawScoring(ctx) {
  if (gameState.displayScore < gameState.score) {
    const diff = gameState.score - gameState.displayScore;
    gameState.displayScore += Math.max(1, Math.floor(diff * 0.03));
  }

  if (gameState.displayBestScore < gameState.bestScore) {
    const diffBest = gameState.bestScore - gameState.displayBestScore;
    gameState.displayBestScore += Math.max(1, Math.floor(diffBest * 0.03));
  }

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

  const bestScoreMinX = layout.scoreTrophy.x + layout.scoreTrophy.w;
  drawScoreDigits(
    ctx,
    gameState.displayBestScore,
    layout.bestScoreDigits.x,
    layout.bestScoreDigits.y,
    layout.bestScoreDigits.h,
    bestScoreMinX,
  );
  drawScoreDigits(
    ctx,
    gameState.displayScore,
    layout.scoreDigits.x,
    layout.scoreDigits.y,
    layout.scoreDigits.h,
  );
}

export { updateAndDrawScoring, applyMoveScoring, drawScoreDigits };
