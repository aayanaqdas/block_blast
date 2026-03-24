const assetPaths = {
  bg: "./images/bg_game.jpg",
  uiSheet: "./images/new_ui.png",
  uiGameSheet: "./images/ui_game.png",
  uiTextSheet: "./images/common_ui.png",
  gridOutline: "./images/grid_outline.png",
  topBg: "./images/top_bg.png",
  bottomBg: "./images/touch_bg.png",
  plantTop: "./images/plant_top.png",
  plantBottom: "./images/plant_bottom.png",
  scoreDigits: "./images/num_score.png",
  gameOverDialog: "./images/bg_dialog.png",
  jewelSheet: "./images/jewels.png",
};

export const img = {};

export function loadAssets() {
  const entries = Object.entries(assetPaths);
  let loaded = 0;

  return new Promise((resolve, reject) => {
    entries.forEach(([key, path]) => {
      const image = new Image();
      image.onload = () => {
        if (++loaded === entries.length) {
          resolve();
        }
      };
      image.onerror = () => reject(new Error(`Failed to loasd: ${path}`));
      image.src = path;
      img[key] = image;
    });
  });
}
