export const GameStates = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  OPTIONS: "OPTIONS",
  GAME_OVER: "GAME_OVER",
};

class GameState {
  constructor() {
    this.currentState = GameStates.PLAYING;

    this.canvas = null;
    this.ctx = null;
    this.uiSheet = null;
    this.uiGameSheet = null;

    this.GAME_WIDTH = 720;
    this.GAME_HEIGHT = 1280;

    this.GRID_SIZE = 8;
    this.CELL_SIZE = 81;

    this.gridData = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.hand = [];
    this.ghostPreview = null;

    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem("blockBlastBestScore")) || 0;
    this.displayScore = 0;
    this.displayBestScore = this.bestScore;
    this.isNewBest = false;

    this.gameOverDisplayScore = 0;
    this.gameOverAnimProgress = 0;

    this.streak = 0;
    this.movesSinceLastClear = 0;
    this.lastMoveCleared = false;
    this.streakMultiplier = 1;
    this.floatingTexts = [];
    this.lastComboSprite = null;
  }

  init(canvas, ctx, uiSheet, uiGameSheet) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.spriteSheet = uiSheet;
    this.uiGameSheet = uiGameSheet;
  }

  isPlaying() {
    return this.currentState === GameStates.PLAYING;
  }

  isGameOver() {
    return this.currentState === GameStates.GAME_OVER;
  }

  setState(newState) {
    this.currentState = newState;
  }

  startGame() {
    this.setState(GameStates.PLAYING);
  }

  gameOver() {
    this.setState(GameStates.GAME_OVER);
  }

  reset() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        this.gridData[r][c] = null;
      }
    }
    this.hand = [];
    this.score = 0;
    this.displayScore = 0;
    this.gameOverDisplayScore = 0;
    this.gameOverAnimProgress = 0;
    this.isNewBest = false;
    this.streak = 0;
    this.movesSinceLastClear = 0;
    this.lastMoveCleared = false;
    this.streakMultiplier = 1;
    this.setState(GameStates.PLAYING);
  }
}

export const gameState = new GameState();
