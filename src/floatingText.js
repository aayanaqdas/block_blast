import { gameState } from "./gameStates.js";
import { img } from "./assets.js";
import { spriteMap } from "./spriteMap.js";

const FLOAT_SPEED = 1.5;
const FADE_SPEED = 0.01;

const COMBO_SPRITES = ["textGood", "textGreat", "textAmazing", "textPerfect"];

function addFloatingScore(points, x, y) {
  gameState.floatingTexts.push({
    type: "placement",
    value: points,
    x: x,
    y: y,
    alpha: 1.0,
    dy: FLOAT_SPEED,
  });
}

function getRandomComboSprite() {
  const available = COMBO_SPRITES.filter((s) => s !== gameState.lastComboSprite);
  const pool = available.length > 0 ? available : COMBO_SPRITES;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  gameState.lastComboSprite = picked;
  return picked;
}

function addFloatingComboText(linesCleared, comboStreak) {
  const cx = gameState.GAME_WIDTH / 2;
  const cy = gameState.GAME_HEIGHT / 2;

  if (linesCleared >= 2 || comboStreak >= 2) {
    const spriteKey = getRandomComboSprite();
    gameState.floatingTexts.push({
      type: "center_flavor",
      spriteKey: spriteKey,
      x: cx,
      y: cy - 40,
      alpha: 1.0,
      scale: 0.5,
      dy: FLOAT_SPEED * 0.5,
    });
  }

  if (comboStreak >= 2) {
    gameState.floatingTexts.push({
      type: "combo_streak",
      streak: comboStreak,
      x: cx,
      y: cy + 40,
      alpha: 1.0,
      scale: 0.5,
      dy: FLOAT_SPEED * 0.5,
    });
  }
}

function updateAndDrawFloatingTexts(ctx) {
  for (let i = gameState.floatingTexts.length - 1; i >= 0; i--) {
    const textObj = gameState.floatingTexts[i];

    textObj.y -= textObj.dy;
    textObj.alpha -= FADE_SPEED;

    if (textObj.scale !== undefined && textObj.scale < 1) {
      textObj.scale += 0.05;
      if (textObj.scale > 1) {
        textObj.scale = 1;
      }
    }

    if (textObj.alpha <= 0) {
      gameState.floatingTexts.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = textObj.alpha;

    if (textObj.type === "placement") {
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`+${textObj.value}`, textObj.x, textObj.y);
    } else if (textObj.type === "center_flavor") {
      const spr = spriteMap.gameUI[textObj.spriteKey];
      if (spr && img.uiGameSheet) {
        ctx.translate(textObj.x, textObj.y);
        ctx.drawImage(
          img.uiGameSheet,
          spr.sx,
          spr.sy,
          spr.sw,
          spr.sh,
          -spr.sw / 2,
          -spr.sh / 2,
          spr.sw,
          spr.sh,
        );
      }
    } else if (textObj.type === "combo_streak") {
      ctx.translate(textObj.x, textObj.y);
      ctx.scale(textObj.scale, textObj.scale);

      ctx.fillStyle = "#FFD700";
      ctx.font = "italic bold 50px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
      ctx.strokeText(`Combo x${textObj.streak}`, 0, 0);
      ctx.fillText(`Combo x${textObj.streak}`, 0, 0);
    }

    ctx.restore();
  }
}

export { addFloatingScore, addFloatingComboText, updateAndDrawFloatingTexts };
