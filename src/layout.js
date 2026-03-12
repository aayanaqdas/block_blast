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
}
