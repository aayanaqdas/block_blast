import { gameState } from "./gameStates.js";

const GAME_WIDTH = gameState.GAME_WIDTH;
const GAME_HEIGHT = gameState.GAME_HEIGHT;

const gridWidth = 8 * 55;
const gridStartX = (GAME_WIDTH - gridWidth) / 2;
const gridStartY = 160;
const CELL_SIZE = 55;
const PADDING = 1;
const RADIUS = 3;

const BLOCK_COLORS = {
  CYAN: "#2ee6e6",
  BLUE: "#1a56b8",
  PURPLE: "#9e2ee6",
  ORANGE: "#ff9800",
  RED: "#e62e2e",
  YELLOW: "#e6d12e",
  GREEN: "#2ee62e",
};

function drawGhost(ctx) {
  if (!gameState.ghostPreview) return;

  const { template, colorKey, gridRow, gridCol } = gameState.ghostPreview;

  ctx.save();
  ctx.globalAlpha = 0.3;

  template.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 1) {
        const x = gridStartX + (gridCol + cellIndex) * CELL_SIZE;
        const y = gridStartY + (gridRow + rowIndex) * CELL_SIZE;
        const innerSize = CELL_SIZE - PADDING * 2;

        drawBlock(ctx, x + PADDING, y + PADDING, innerSize, RADIUS, PADDING, colorKey, 1);
      }
    });
  });

  ctx.restore();
}

function drawBlock(ctx, x, y, innerSize, RADIUS, PADDING, colorKey, scale = 1) {
  const blockColor = BLOCK_COLORS[colorKey];
  const bevelSize = 8 * scale;

  ctx.fillStyle = blockColor;
  ctx.beginPath();
  ctx.roundRect(x, y, innerSize, innerSize, RADIUS);
  ctx.fill();

  //Top bevel
  ctx.fillStyle = adjustColor(blockColor, 0.4);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + innerSize, y);
  ctx.lineTo(x + innerSize - bevelSize, y + bevelSize);
  ctx.lineTo(x + bevelSize, y + bevelSize);
  ctx.closePath();
  ctx.fill();

  //Left bevel
  ctx.fillStyle = adjustColor(blockColor, 0.15);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + bevelSize, y + bevelSize);
  ctx.lineTo(x + bevelSize, y + innerSize - bevelSize);
  ctx.lineTo(x, y + innerSize);
  ctx.closePath();
  ctx.fill();

  //Right bevel
  ctx.fillStyle = adjustColor(blockColor, -0.15);
  ctx.beginPath();
  ctx.moveTo(x + innerSize, y);
  ctx.lineTo(x + innerSize, y + innerSize);
  ctx.lineTo(x + innerSize - bevelSize, y + innerSize - bevelSize);
  ctx.lineTo(x + innerSize - bevelSize, y + bevelSize);
  ctx.closePath();
  ctx.fill();

  //Bottom bevel
  ctx.fillStyle = adjustColor(blockColor, -0.3);
  ctx.beginPath();
  ctx.moveTo(x, y + innerSize);
  ctx.lineTo(x + bevelSize, y + innerSize - bevelSize);
  ctx.lineTo(x + innerSize - bevelSize, y + innerSize - bevelSize);
  ctx.lineTo(x + innerSize, y + innerSize);
  ctx.closePath();
  ctx.fill();

  //Center square
  ctx.fillStyle = blockColor;
  ctx.beginPath();
  ctx.moveTo(x + bevelSize, y + bevelSize);
  ctx.lineTo(x + innerSize - bevelSize, y + bevelSize);
  ctx.lineTo(x + innerSize - bevelSize, y + innerSize - bevelSize);
  ctx.lineTo(x + bevelSize, y + innerSize - bevelSize);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#242c54";
  ctx.beginPath();
  ctx.roundRect(x - PADDING, y - PADDING, innerSize + PADDING * 2, innerSize + PADDING * 2, RADIUS);

  ctx.stroke();
}

function adjustColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amount = Math.round(255 * Math.abs(percent));

  const r =
    percent > 0
      ? Math.min(255, ((num >> 16) & 255) + amount)
      : Math.max(0, ((num >> 16) & 255) - amount);
  const g =
    percent > 0
      ? Math.min(255, ((num >> 8) & 255) + amount)
      : Math.max(0, ((num >> 8) & 255) - amount);
  const b = percent > 0 ? Math.min(255, (num & 255) + amount) : Math.max(0, (num & 255) - amount);

  return `rgb(${r}, ${g}, ${b})`;
}

export { drawBlock, drawGhost, BLOCK_COLORS };
