import { gameState } from "./gameStates.js";
import { layout } from "./layout.js";
import { spriteMap } from "./spriteMap.js";
import { createHand } from "./hand.js";
import { playSound } from "./audio.js";

const createButton = (onClick, config = {}) => ({
  x: 0,
  y: 0,
  baseY: 0,
  w: config.width,
  h: config.height,
  onClick,
});

const BUTTONS = {
  start: createButton(() => {
    gameState.startAnim();
  }),

  options: createButton(() => {
    gameState.showOptions();
  }),

  optionsClose: createButton(() => {
    gameState.optionsAnimProgress = 0;
    gameState.startGame();
  }),

  optionsSound: createButton(() => {
    gameState.isSoundOn ? (gameState.isSoundOn = false) : (gameState.isSoundOn = true);
  }),

  optionsReplay: createButton(() => {
    gameState.reset();
    createHand();
  }),

  optionsReset: createButton(() => {
    if (confirm(`Reset your best score (${gameState.bestScore})?`)) {
      gameState.bestScore = 0;
      localStorage.setItem("blockBlastBestScore", gameState.bestScore);
      gameState.reset();
      createHand();
    }
  }),

  newGame: createButton(() => {
    console.log("New game clicked");
    gameState.reset();
    createHand();
  }),
  share: createButton(async () => {
    console.log("share clicked");
    if (!navigator.share) {
      alert("Web share not supported");
      return;
    }
    try {
      await navigator.share({
        title: "Block Blast Score",
        text: `I scored ${gameState.score} points in this Block Blast game!`,
        url: window.location.href,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.log("Share failed: ", err.name);
      }
    }
  }),
};

function setButtonPosition(btn, x, y, width, height) {
  btn.x = x;
  btn.y = y;
  btn.baseY = y;
  if (width !== undefined) btn.w = width;
  if (height !== undefined) btn.h = height;
}

function positionButtons() {
  setButtonPosition(
    BUTTONS.options,
    layout.optionsBtn.x,
    layout.optionsBtn.y,
    layout.optionsBtn.w,
    layout.optionsBtn.h,
  );

  // New Game Button (Rotated -90 degrees in gameOver.js)
  // When rotated -90, Width maps to screen Height, and Height maps to screen Width.
  const newGameSprite = spriteMap.gameUI.redBtn;
  setButtonPosition(
    BUTTONS.newGame,
    layout.dialogNewGameBtn.x - newGameSprite.sh / 2,
    layout.dialogNewGameBtn.y + newGameSprite.sw / 2 - layout.dialogNewGameBtn.h,
    newGameSprite.sh,
    layout.dialogNewGameBtn.h,
  );

  // Share Button also rotated -90 degrees in gameOver.js
  const shareSprite = spriteMap.gameOverUI.shareBtn;
  setButtonPosition(
    BUTTONS.share,
    layout.shareBtn.x - shareSprite.sh / 2,
    layout.shareBtn.y - shareSprite.sw / 2,
    shareSprite.sh,
    shareSprite.sw,
  );

  const startBtnSprite = spriteMap.gameUI.startBtn;
  setButtonPosition(
    BUTTONS.start,
    layout.startBtn.x - startBtnSprite.sh / 2,
    layout.startBtn.y - startBtnSprite.sw / 2,
    startBtnSprite.sh,
    startBtnSprite.sw,
  );

  const closeBtnSprite = spriteMap.optionsUI.closeBtn;
  setButtonPosition(
    BUTTONS.optionsClose,
    layout.optionsCloseBtn.x - closeBtnSprite.sh / 2,
    layout.optionsCloseBtn.y - closeBtnSprite.sw / 2,
    closeBtnSprite.sh,
    closeBtnSprite.sw,
  );

  setButtonPosition(
    BUTTONS.optionsSound,
    layout.optionsSoundBtn.x,
    layout.optionsSoundBtn.y,
    layout.optionsSoundBtn.w,
    layout.optionsSoundBtn.h,
  );

  setButtonPosition(
    BUTTONS.optionsReplay,
    layout.optionsReplayBtn.x,
    layout.optionsReplayBtn.y,
    layout.optionsReplayBtn.w,
    layout.optionsReplayBtn.h,
  );

  setButtonPosition(
    BUTTONS.optionsReset,
    layout.optionsResetBtn.x,
    layout.optionsResetBtn.y,
    layout.optionsResetBtn.w,
    layout.optionsResetBtn.h,
  );
}

function isPointInRect(clickX, clickY, x, y, width, height) {
  return clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height;
}

function isButtonClicked(btn, clickX, clickY) {
  return isPointInRect(clickX, clickY, btn.x, btn.y, btn.w, btn.h);
}

function pressButton(layoutObj, action) {
  layoutObj.y += 2;
  playSound("click");
  setTimeout(() => {
    layoutObj.y -= 2;
    action();
  }, 100);
}
const STATE_CLICK_HANDLERS = {
  MENU: (clickX, clickY) => {
    if (isButtonClicked(BUTTONS.start, clickX, clickY)) {
      pressButton(layout.startBtn, BUTTONS.start.onClick);
      return true;
    }
    return false;
  },

  PLAYING: (clickX, clickY) => {
    if (isButtonClicked(BUTTONS.options, clickX, clickY)) {
      pressButton(layout.optionsBtn, BUTTONS.options.onClick);
      return true;
    }
    return false;
  },

  OPTIONS: (clickX, clickY) => {
    if (gameState.optionsAnimProgress < 1) return false;
    if (isButtonClicked(BUTTONS.optionsClose, clickX, clickY)) {
      pressButton(layout.optionsCloseBtn, BUTTONS.optionsClose.onClick);
      return true;
    } else if (isButtonClicked(BUTTONS.optionsSound, clickX, clickY)) {
      pressButton(layout.optionsSoundBtn, BUTTONS.optionsSound.onClick);
      return true;
    } else if (isButtonClicked(BUTTONS.optionsReplay, clickX, clickY)) {
      pressButton(layout.optionsReplayBtn, BUTTONS.optionsReplay.onClick);
      return true;
    } else if (isButtonClicked(BUTTONS.optionsReset, clickX, clickY)) {
      pressButton(layout.optionsResetBtn, BUTTONS.optionsReset.onClick);
      return true;
    }
    return false;
  },

  GAME_OVER: (clickX, clickY) => {
    if (gameState.gameOverAnimProgress < 1) return false;
    if (isButtonClicked(BUTTONS.newGame, clickX, clickY)) {
      pressButton(layout.dialogNewGameBtn, BUTTONS.newGame.onClick);
      return true;
    } else if (isButtonClicked(BUTTONS.share, clickX, clickY)) {
      pressButton(layout.shareBtn, BUTTONS.share.onClick);
      return true;
    }
    return false;
  },
};

function handleCanvasClick(e) {
  const rect = gameState.canvas.getBoundingClientRect();
  const clickX = ((e.clientX - rect.left) / rect.width) * gameState.GAME_WIDTH;
  const clickY = ((e.clientY - rect.top) / rect.height) * gameState.GAME_HEIGHT;

  const handler = STATE_CLICK_HANDLERS[gameState.currentState];

  if (handler) {
    handler(clickX, clickY);
  }
}

function initUIEvents() {
  positionButtons();
  gameState.canvas.addEventListener("click", handleCanvasClick);
}

export { initUIEvents, isPointInRect };
