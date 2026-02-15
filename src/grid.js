import { drawBlock } from "./blocks.js";

const GRID_SIZE = 8;
const CELL_SIZE = 55;
const PADDING = 1;
const RADIUS = 3;

const gridData = Array.from({ length: 8 }, () => Array(8).fill(null));

const BLOCK_COLORS = {
  CYAN: "#2ee6e6",
  BLUE: "#1a56b8",
  PURPLE: "#9e2ee6",
  ORANGE: "#ff9800",
  RED: "#e62e2e",
  YELLOW: "#e6d12e",
  GREEN: "#2ee62e",
};

gridData[0][0] = "CYAN";
gridData[1][0] = "BLUE";
gridData[2][0] = "GREEN";
gridData[3][0] = "ORANGE";
gridData[4][0] = "PURPLE";
gridData[5][0] = "RED";
gridData[6][0] = "YELLOW";

function drawGrid(ctx, GAME_WIDTH, GAME_HEIGHT) {
  const gridWidth = GRID_SIZE * CELL_SIZE;

  const xOffSet = (GAME_WIDTH - gridWidth) / 2;
  const yOffSet = 160;

  ctx.fillStyle = "#1a2244";
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
      const innerSize = CELL_SIZE - PADDING * 2;

      ctx.fillStyle = "#242c54";
      ctx.beginPath();
      ctx.roundRect(x + PADDING, y + PADDING, innerSize, innerSize, RADIUS);
      ctx.fill();

      const blockColorKey = gridData[row][column];
      if (blockColorKey) {
        drawBlock(ctx, x + PADDING, y + PADDING, innerSize, RADIUS, BLOCK_COLORS[blockColorKey]);
      }
    }
  }
}

export { drawGrid };
