class GameState {
  constructor() {
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
    this.isNewBest = false;

    this.streak = 0;
    this.movesSinceLastClear = 0;
    this.lastMoveCleared = false;
    this.streakMultiplier = 1;

    this.isGameOver = false;
  }

  init(canvas, ctx, uiSheet, uiGameSheet) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.spriteSheet = uiSheet;
    this.uiGameSheet = uiGameSheet;
  }
}

export const gameState = new GameState();
