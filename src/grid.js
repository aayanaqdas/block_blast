import { gameState } from "./gameStates.js";
import { drawBlock } from "./blocks.js";
import { spriteMap } from "./spriteMap.js";

const GAME_WIDTH = gameState.GAME_WIDTH;
const GRID_SIZE = gameState.GRID_SIZE;
const CELL_SIZE = gameState.CELL_SIZE;
const gridData = gameState.gridData;

let gridXOffSet = 0;
let gridYOffSet = 0;

function intiGrid(outlineImg) {
  const gridWidth = GRID_SIZE * CELL_SIZE;
  const boardX = (GAME_WIDTH - outlineImg.width) / 2;
  const boardY = 210;

  gridXOffSet = boardX + (outlineImg.width - gridWidth) / 2;
  gridYOffSet = boardY + (outlineImg.height - gridWidth) / 2;
}

function getGridOffsets() {
  return { gridXOffSet, gridYOffSet };
}

function drawGrid(ctx) {
  const tile = spriteMap.board.tile;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      const x = gridXOffSet + column * CELL_SIZE;
      const y = gridYOffSet + row * CELL_SIZE;

      const colorKey = gridData[row][column];

      ctx.drawImage(
        gameState.spriteSheet,
        tile.sx,
        tile.sy,
        tile.sw,
        tile.sh,
        x,
        y,
        CELL_SIZE,
        CELL_SIZE,
      );

      if (colorKey !== null) {
        drawBlock(ctx, x, y, colorKey, 1);
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
  intiGrid,
  getGridOffsets,
  drawGrid,
  placeOnGrid,
  isValidPlacement,
  clearFromGrid,
  calculateOpenSpace,
};
