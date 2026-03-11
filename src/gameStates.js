class GameState {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.spriteSheet = null;

    this.GAME_WIDTH = 720;
    this.GAME_HEIGHT = 1280;

    this.GRID_SIZE = 8;
    this.CELL_SIZE = 80;
    this.gridWidth = this.GRID_SIZE * this.CELL_SIZE;

    this.boardOutlineWidth = 708;
    this.boardOutlineHeight = 711;
    this.boardX = (this.GAME_WIDTH - this.boardOutlineWidth) / 2;
    this.boardY = 205;

    this.gridXOffSet = this.boardX + (this.boardOutlineWidth - this.gridWidth) / 2;
    this.gridYOffSet = this.boardY + (this.boardOutlineHeight - this.gridWidth) / 2;

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