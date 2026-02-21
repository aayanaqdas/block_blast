class GameState {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.GAME_WIDTH = 550;
    this.GAME_HEIGHT = 900;

    this.gridData = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.hand = [];
}

  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }
}

export const gameState = new GameState();