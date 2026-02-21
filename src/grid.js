import { gameState } from "./gameStates.js";
import { drawBlock, SHAPES } from "./blocks.js";

const GRID_SIZE = 8;
const CELL_SIZE = 55;
const PADDING = 1;
const RADIUS = 3;

const GAME_WIDTH = gameState.GAME_WIDTH;
const GAME_HEIGHT = gameState.GAME_HEIGHT;
const gridData = gameState.gridData;


function drawGrid(ctx) {
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
      const colorKey = gridData[row][column];

      ctx.fillStyle = "#242c54";
      ctx.beginPath();
      ctx.roundRect(x + PADDING, y + PADDING, innerSize, innerSize, RADIUS);
      ctx.fill();

      if (colorKey !== null) {
        drawBlock(
          ctx,
          x + PADDING,
          y + PADDING,
          innerSize,
          RADIUS,
          PADDING,
          colorKey,
        );
      }
    }
  }
}

function placeOnGrid(shape, startRow, startCol, color) {
  for (let shapeRow = 0; shapeRow < shape.length; shapeRow++) {
    for (let shapeCol = 0; shapeCol < shape[shapeRow].length; shapeCol++) {
      if (shape[shapeRow][shapeCol] === 1) {
        const gridRow = startRow + shapeRow;
        const gridCol = startCol + shapeCol;

        gridData[gridRow][gridCol] = color;
        
      }
    }
  }
}


placeOnGrid(SHAPES.L_STANDARD, 1, 2, "GREEN");
placeOnGrid(SHAPES.SQUARE_2, 0, 0, "YELLOW");
placeOnGrid(SHAPES.T_SHAPE, 0, 2, "RED");
placeOnGrid(SHAPES.SQUARE_3, 0, 5, "PURPLE");
// placeOnGrid(SHAPES.DOT, 7, 7, "BLUE");
// placeOnGrid(SHAPES.S_SHAPE, 6, 0, "GREEN");
// placeOnGrid(SHAPES.Z_SHAPE, 5, 2, "YELLOW");
// placeOnGrid(SHAPES.CORNER_2, 5, 0, "BLUE");
// placeOnGrid(SHAPES.LINE_5, 7, 2, "CYAN");
// placeOnGrid(SHAPES.LINE_4, 4, 0, "PURPLE");
// placeOnGrid(SHAPES.LINE_3, 6, 5, "PURPLE");
// placeOnGrid(SHAPES.L_BIG, 1, 4, "ORANGE");
// placeOnGrid(SHAPES.L_SMALL, 2, 0, "CYAN");
// placeOnGrid(SHAPES.RECT, 4, 4, "RED");


export { drawGrid };
