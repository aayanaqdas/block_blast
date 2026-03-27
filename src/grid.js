import { gameState } from "./gameStates.js";
import { drawBlock } from "./blocks.js";
import { spriteMap } from "./spriteMap.js";
import { img } from "./assets.js";
import { applyMoveScoring } from "./score.js";
import { spawnJewels, spawnJewelsAt } from "./particles.js";
import { addFloatingScore, addFloatingComboText } from "./floatingText.js";
import { playSound } from "./audio.js";

const GAME_WIDTH = gameState.GAME_WIDTH;
const GRID_SIZE = gameState.GRID_SIZE;
const CELL_SIZE = gameState.CELL_SIZE;
const gridData = gameState.gridData;

let gridXOffSet = 0;
let gridYOffSet = 0;
let outlineW = 0;

function intiGrid(outlineImg) {
  const gridWidth = GRID_SIZE * CELL_SIZE;
  const boardX = (GAME_WIDTH - outlineImg.width) / 2;
  const boardY = 208;

  gridXOffSet = boardX + (outlineImg.width - gridWidth) / 2;
  gridYOffSet = boardY + (outlineImg.height - gridWidth) / 2;

  outlineW = outlineImg.width;
}

function getGridOffsets() {
  return { gridXOffSet, gridYOffSet };
}

function drawGrid(ctx) {
  const tile = spriteMap.board.tile;
  const gridBg = spriteMap.board.bg;
  ctx.drawImage(
    img.uiGameSheet,
    gridBg.sx,
    gridBg.sy,
    gridBg.sw,
    gridBg.sh,
    gridXOffSet - 15,
    gridYOffSet - 20,
    outlineW - 40,
    outlineW - 40,
  );

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      const x = gridXOffSet + column * CELL_SIZE;
      const y = gridYOffSet + row * CELL_SIZE;

      const colorKey = gridData[row][column];

      ctx.drawImage(img.uiSheet, tile.sx, tile.sy, tile.sw, tile.sh, x, y, CELL_SIZE, CELL_SIZE);

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
function countBlocksInTemplate(template) {
  let blocks = 0;
  for (let r = 0; r < template.length; r++) {
    for (let c = 0; c < template[r].length; c++) {
      if (template[r][c] === 1) {
        blocks++;
      }
    }
  }
  return blocks;
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
  const placedBlocks = countBlocksInTemplate(template);
  const { linesCleared, clearedCells } = clearFromGrid(gridData);

  playSound("blockPlace")

  if (clearedCells.length > 0) {
    spawnJewels(clearedCells, color);
  }

  const scoreResult = applyMoveScoring(placedBlocks, linesCleared);
  const dropX = gridXOffSet + (startCol * CELL_SIZE) + ((template[0].length * CELL_SIZE) / 2)
  const dropY = gridYOffSet + (startRow *CELL_SIZE);

  addFloatingScore(scoreResult.totalEarned, dropX, dropY)

  if(linesCleared > 0) {
    addFloatingComboText(linesCleared, scoreResult.comboMultiplier);
  }
}

function clearFromGrid(grid) {
  const rowFull = [];
  const colFull = [];
  let linesCleared = 0;
  const clearedCells = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    rowFull[i] = grid[i].every((cell) => cell !== null);
    colFull[i] = grid.every((row) => row[i] !== null);
    if (rowFull[i]) linesCleared++;
    if (colFull[i]) linesCleared++;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (rowFull[r] || colFull[c]) {
        if (grid[r][c] !== null) {
          clearedCells.push({ row: r, col: c});
        }
        grid[r][c] = null;
      }
    }
  }

  return { linesCleared, clearedCells };
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
