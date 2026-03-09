class GameState {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.GAME_WIDTH = 550;
    this.GAME_HEIGHT = 900;

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

  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }
}

export const gameState = new GameState();
