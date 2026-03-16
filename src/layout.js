import { gameState } from "./gameStates.js";

export const layout = {};

export function initLayout(imgs) {
  const W = gameState.GAME_WIDTH;
  const H = gameState.GAME_HEIGHT;
  const cx = W / 2;

  layout.topBg = {
    x: cx - imgs.topBg.width / 2,
    y: imgs.topBg.height / 2,
  };
  layout.gridOutline = {
    x: cx - imgs.gridOutline.width / 2,
    y: 210,
  };
  layout.bottomBg = {
    x: cx - imgs.bottomBg.width / 2,
    y: H - imgs.plantBottom.height * 2,
  };
  layout.plantTop = {
    x: cx - imgs.plantTop.width / 2,
    y: 0,
  };

  layout.plantBottom = {
    x: cx - imgs.plantBottom.width / 2,
    y: H - imgs.plantBottom.height,
  };

  const bgHeight = 78;
  const bestScoreWidth = 266;
  const scoreWidth = 266;
  const optionsSize = 78;
  const trophySize = 55;
  const gap = 12;

  const totalWidth = bestScoreWidth + scoreWidth + optionsSize + gap * 2;
  const startX = cx - totalWidth / 2;
  const rowY = layout.topBg.y + (imgs.topBg.height - bgHeight) / 2 - 7;

  layout.bestScoreBg = {
    x: startX,
    y: rowY,
    w: bestScoreWidth,
    h: bgHeight,
  };

  layout.scoreTrophy = {
    x: layout.bestScoreBg.x + gap,
    y: layout.bestScoreBg.y + (layout.bestScoreBg.h - trophySize) / 2,
    w: trophySize,
    h: trophySize,
  };

  layout.scoreBg = {
    x: startX + bestScoreWidth + gap,
    y: rowY,
    w: scoreWidth,
    h: bgHeight,
  };

  layout.optionsBtn = {
    x: startX + bestScoreWidth + gap + scoreWidth + gap,
    y: rowY,
    w: optionsSize,
    h: optionsSize,
  };

  const digitHeight = 40;
  const digitWidth = 30;

  layout.DIGIT_CONFIG = {
    height: digitHeight,
    spacing: 2,
    widths: { default: digitWidth, narrow: digitWidth / 2 },
  };

  layout.bestScoreDigits = {
    x: layout.bestScoreBg.x + layout.bestScoreBg.w / 2,
    y: layout.bestScoreBg.y + (layout.bestScoreBg.h - digitHeight) / 2,
    w: digitWidth,
    h: digitHeight,
  };

  layout.scoreDigits = {
    x: layout.scoreBg.x + layout.scoreBg.w / 2,
    y: layout.scoreBg.y + (layout.scoreBg.h - digitHeight) / 2,
    w: digitWidth,
    h: digitHeight,
  };
}
