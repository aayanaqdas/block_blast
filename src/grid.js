import { gameState } from "./gameStates.js";
import { drawBlock } from "./blocks.js";
import { SHAPES } from "./shapes.js";

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
        drawBlock(ctx, x + PADDING, y + PADDING, innerSize, RADIUS, PADDING, colorKey);
      }
    }
  }
}

function calculateOpenSpace(grid) {
  let openCells = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) openCells++;
    }
  }
  return openCells;
}

function isValidPlacement(grid, template, startRow, startCol) {
  for (let shapeRow = 0; shapeRow < template.length; shapeRow++) {
    for (let shapeCol = 0; shapeCol < template[shapeRow].length; shapeCol++) {
      if (template[shapeRow][shapeCol] === 1) {
        const gridRow = startRow + shapeRow;
        const gridCol = startCol + shapeCol;

        if (gridRow < 0 || gridRow > 7 || gridCol < 0 || gridCol > 7) {
          return false;
        }

        if (grid[gridRow][gridCol] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

function placeOnGrid(template, startRow, startCol, color) {
  for (let shapeRow = 0; shapeRow < template.length; shapeRow++) {
    for (let shapeCol = 0; shapeCol < template[shapeRow].length; shapeCol++) {
      if (template[shapeRow][shapeCol] === 1) {
        const gridRow = startRow + shapeRow;
        const gridCol = startCol + shapeCol;

        gridData[gridRow][gridCol] = color;
      }
    }
  }
  const linesCleared = clearFromGrid(gridData);

  if (linesCleared > 0) {
    gameState.movesSinceLastClear = 0;
    if (gameState.lastMoveCleared || gameState.streak > 0) {
      gameState.streak++;
    } else {
      gameState.streak = 1;
    }
    gameState.lastMoveCleared = true;

    gameState.streakMultiplier = Math.min(gameState.streak, 10);
    const points = linesCleared * 10 * gameState.streakMultiplier;
    gameState.score += points;
    console.log(
      `Cleared ${linesCleared} lines. Streak: ${gameState.streak}x | +${points} pts. Total: ${gameState.score}`,
    );
  } else {
    gameState.lastMoveCleared = false;
    gameState.movesSinceLastClear++;
    
    // 3 turns grace period before combo resets
    if (gameState.movesSinceLastClear >= 3) {
      gameState.streak = 0;
      gameState.streakMultiplier = 1;
    }
  }
}

function clearFromGrid(grid) {
  const rowFull = [];
  const colFull = [];
  let linesCleared = 0;

  for (let i = 0; i < GRID_SIZE; i++) {
    rowFull[i] = grid[i].every((cell) => cell !== null);
    colFull[i] = grid.every((row) => row[i] !== null);
    if (rowFull[i]) linesCleared++;
    if (colFull[i]) linesCleared++;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (rowFull[r] || colFull[c]) {
        grid[r][c] = null;
      }
    }
  }

  return linesCleared;
}



export {
  drawGrid,
  placeOnGrid,
  isValidPlacement,
  clearFromGrid,
  calculateOpenSpace
};
