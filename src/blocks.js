import { gameState } from "./gameStates.js";
import { spriteMap } from "./spriteMap.js";

const GRID_SIZE = gameState.GRID_SIZE;
const CELL_SIZE = gameState.CELL_SIZE;
const gridStartX = gameState.gridXOffSet;
const gridStartY = gameState.gridYOffSet;

const BLOCK_COLORS = ["cyan", "blue", "green", "yellow", "red", "purple", "pink", "silver"];

function drawBlock(ctx, x, y, colorKey, scale) {
  const spriteData = spriteMap.blocks[colorKey];
  if (!spriteData || !gameState.spriteSheet.complete) return;

  const size = CELL_SIZE * scale;
  ctx.drawImage(
    gameState.spriteSheet,
    spriteData.sx,
    spriteData.sy,
    spriteData.sw,
    spriteData.sh,
    x,
    y,
    size,
    size,
  );
}

function drawGhost(ctx) {
  if (!gameState.ghostPreview) return;

  const { template, colorKey, gridRow, gridCol } = gameState.ghostPreview;

  const tempGrid = gameState.gridData.map((row) => [...row]);

  template.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 1) {
        const r = gridRow + rowIndex;
        const c = gridCol + cellIndex;

        tempGrid[r][c] = colorKey;
      }
    });
  });

  ctx.save();
  ctx.globalAlpha = 0.3;
  template.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 1) {
        const x = gridStartX + (gridCol + cellIndex) * CELL_SIZE;
        const y = gridStartY + (gridRow + rowIndex) * CELL_SIZE;

        drawBlock(ctx, x, y, colorKey, 1);
      }
    });
  });

  ctx.restore();

  ctx.save();
  highlightLine(ctx, tempGrid, colorKey);
  ctx.restore();
}

function highlightLine(ctx, grid, colorKey) {
  const rowFull = [];
  const colFull = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    rowFull[i] = grid[i].every((cell) => cell !== null);
    colFull[i] = grid.every((row) => row[i] !== null);
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (rowFull[r] || colFull[c]) {
        const x = gridStartX + c * CELL_SIZE;
        const y = gridStartY + r * CELL_SIZE;

        drawBlock(ctx, x, y, colorKey, 1);
      }
    }
  }
}

export { drawBlock, drawGhost, BLOCK_COLORS };
