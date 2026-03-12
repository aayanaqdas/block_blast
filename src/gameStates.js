class GameState {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.spriteSheet = null;

    this.GAME_WIDTH = 720;
    this.GAME_HEIGHT = 1280;

    this.GRID_SIZE = 8;
    this.CELL_SIZE = 80;

    this.gridData = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.hand = [];
    this.ghostPreview = null;

    this.streak = 0;
    this.movesSinceLastClear = 0;
    this.lastMoveCleared = false;
    this.score = 0;
    this.streakMultiplier = 1;

    this.isGameOver = false;
  }

  init(canvas, ctx, spriteSheet) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.spriteSheet = spriteSheet;
  }
}

export const gameState = new GameState();
