import { gameState } from "./gameStates.js";
import { SHAPES } from "./shapes.js";
import { placeOnGrid, isValidPlacement } from "./grid.js";

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

class DraggableShape {
  constructor(template, colorKey, handIndex) {
    this.template = template; //[row][col]
    this.colorKey = colorKey;
    this.color = BLOCK_COLORS[colorKey];

    this.isDragging = false;
    this.scale = 0.5;

    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.visualOffsetY = -110;

    const handWidth = GAME_WIDTH / 3;
    this.spawnX = handWidth * handIndex + handWidth / 2;
    this.spawnY = GAME_HEIGHT - 150;

    this.x = this.spawnX;
    this.y = this.spawnY;

    this.w = null;
    this.h = null;
  }

  draw(ctx) {
    const displayCellSize = CELL_SIZE * this.scale;
    const innerSize = displayCellSize - PADDING * 2;

    const shapeWidth = this.template[0].length * displayCellSize;
    const shapeHeight = this.template.length * displayCellSize;

    this.w = shapeWidth;
    this.h = shapeHeight;

    const drawY = this.isDragging ? this.y + this.visualOffsetY : this.y;

    this.template.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 1) {
          const blockX = this.x + cellIndex * displayCellSize - shapeWidth / 2;
          const blockY = drawY + rowIndex * displayCellSize - shapeHeight / 2;

          drawBlock(
            ctx,
            blockX + PADDING,
            blockY + PADDING,
            innerSize,
            RADIUS * this.scale,
            PADDING,
            this.colorKey,
            this.scale,
          );
        }
      });
    });
  }

  reset() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.scale = 0.5;
  }
}

function createHand() {
  const shapeKeys = Object.keys(SHAPES);
  const colorKeys = Object.keys(BLOCK_COLORS);

  if (gameState.hand.length === 0) {
    for (let i = 0; i < 3; i++) {
      const shape = SHAPES[shapeKeys[Math.floor(Math.random() * shapeKeys.length)]];
      const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];

      const newShape = new DraggableShape(shape, color, i);
      gameState.hand.push(newShape);
    }
  }
}

function drawHand(ctx) {
  gameState.hand.forEach((shape) => {
    shape.draw(ctx);
  });
}

function isPointInRect(clickX, clickY, x, y, width, height) {
  return clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height;
}

function initDragControls() {
  gameState.canvas.addEventListener("pointerdown", (e) => {
    const rect = gameState.canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
    const clickY = ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT;

    gameState.hand.forEach((shape) => {
      const displayCellSize = CELL_SIZE * shape.scale;
      const shapeWidth = shape.template[0].length * displayCellSize;
      const shapeHeight = shape.template.length * displayCellSize;
      const shapeLeft = shape.x - shapeWidth / 2;
      const shapeTop = shape.y - shapeHeight / 2;
      if (isPointInRect(clickX, clickY, shapeLeft, shapeTop, shapeWidth, shapeHeight)) {
        shape.isDragging = true;

        //Offset before scaling
        shape.dragOffsetX = clickX - shape.x;
        shape.dragOffsetY = clickY - shape.y;

        shape.scale = 1;

        //Offset after scale
        shape.x = clickX - shape.dragOffsetX;
        shape.y = clickY - shape.dragOffsetY;
      }
    });
  });

  gameState.canvas.addEventListener("pointermove", (e) => {
    const rect = gameState.canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
    const clickY = ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT;
    gameState.hand.forEach((shape) => {
      if (shape.isDragging) {
        shape.x = clickX - shape.dragOffsetX;
        shape.y = clickY - shape.dragOffsetY;

        const shapeHeight = shape.template.length * CELL_SIZE;
        const shapeWidth = shape.template[0].length * CELL_SIZE;

        const shapeTopLeftX = shape.x - shapeWidth / 2;
        const shapeTopLeftY = shape.y + shape.visualOffsetY - shapeHeight / 2;

        const gridRow = Math.round((shapeTopLeftY - gridStartY) / CELL_SIZE);
        const gridCol = Math.round((shapeTopLeftX - gridStartX) / CELL_SIZE);

        if (isValidPlacement(shape.template, gridRow, gridCol)) {
          gameState.ghostPreview = {
            template: shape.template,
            colorKey: shape.colorKey,
            gridRow: gridRow,
            gridCol: gridCol,
          };
        } else {
          gameState.ghostPreview = null;
        }
      }
    });
  });

  gameState.canvas.addEventListener("pointerup", () => {
    gameState.ghostPreview = null;
    gameState.hand.forEach((shape) => {
      if (shape.isDragging) {
        const shapeHeight = shape.template.length * CELL_SIZE;
        const shapeWidth = shape.template[0].length * CELL_SIZE;

        const shapeTopLeftX = shape.x - shapeWidth / 2;
        const shapeTopLeftY = shape.y + shape.visualOffsetY - shapeHeight / 2;

        const gridRow = Math.round((shapeTopLeftY - gridStartY) / CELL_SIZE);
        const gridCol = Math.round((shapeTopLeftX - gridStartX) / CELL_SIZE);

        if (isValidPlacement(shape.template, gridRow, gridCol)) {
          placeOnGrid(shape.template, gridRow, gridCol, shape.colorKey);

          //Remove from hand
          const index = gameState.hand.indexOf(shape);
          gameState.hand.splice(index, 1);

          if (gameState.hand.length === 0) {
            createHand();
          }
        }
      }
      gameState.ghostPreview = null;
      shape.isDragging = false;
      shape.reset();
    });
  });
}

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

function initHand() {
  createHand();
  initDragControls();
}

export { drawBlock, initHand, drawHand, drawGhost, SHAPES };
