const GRID_SIZE = 8;
const CELL_SIZE = 50;
const PADDING = 1;
const RADIUS = 2;

function drawGrid(ctx, GAME_WIDTH, GAME_HEIGHT) {
  const gridWidth = GRID_SIZE * CELL_SIZE;
  const xOffSet = GAME_WIDTH / 2 - gridWidth / 2;
  const yOffSet = GAME_HEIGHT / 2 - gridWidth + 100;

  ctx.fillStyle = "#1a2b4d";
  ctx.beginPath();
  ctx.roundRect(
    xOffSet - PADDING,
    yOffSet - PADDING,
    gridWidth + PADDING * 2,
    gridWidth + PADDING * 2,
    RADIUS,
  );
  ctx.fill();

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      const x = xOffSet + column * CELL_SIZE;
      const y = yOffSet + row * CELL_SIZE;

      ctx.fillStyle = "#20345c";

      ctx.beginPath();
      ctx.roundRect(
        x + PADDING,
        y + PADDING,
        CELL_SIZE - PADDING * 2,
        CELL_SIZE - PADDING * 2,
        RADIUS,
      );
      ctx.fill();
    }
  }
}

export { drawGrid };
