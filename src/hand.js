import { gameState } from "./gameStates.js";
import { placeOnGrid, isValidPlacement, clearFromGrid } from "./grid.js";
import { drawBlock, BLOCK_COLORS } from "./blocks.js";
import { SHAPES } from "./shapes.js";

const GAME_WIDTH = gameState.GAME_WIDTH;
const GAME_HEIGHT = gameState.GAME_HEIGHT;

const GRID_SIZE = 8;
const CELL_SIZE = 55;
const PADDING = 1;
const RADIUS = 3;

const gridWidth = GRID_SIZE * 55;
const gridStartX = (GAME_WIDTH - gridWidth) / 2;
const gridStartY = 160;

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


function simulatePlacement(grid, template, startRow, startCol, color) {
  const simulatedGrid = grid.map((row) => [...row]);

  for (let shapeRow = 0; shapeRow < template.length; shapeRow++) {
    for (let shapeCol = 0; shapeCol < template[shapeRow].length; shapeCol++) {
      if (template[shapeRow][shapeCol] === 1) {
        const gridRow = shapeRow + startRow;
        const gridCol = shapeCol + startCol;
        simulatedGrid[gridRow][gridCol] = color;
      }
    }
  }

  clearFromGrid(simulatedGrid);
  return simulatedGrid;
}

function isHandPlayable(grid, pieces) {
  if (pieces.length === 0) return true;

  for (let i = 0; i < pieces.length; i++) {
    const currentPiece = pieces[i];
    const remainingPieces = pieces.filter((_, index) => index !== i);

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (isValidPlacement(grid, currentPiece.template, r, c)) {
          const simulatedGrid = simulatePlacement(
            grid,
            currentPiece.template,
            r,
            c,
            currentPiece.colorKey,
          );
          if (isHandPlayable(simulatedGrid, remainingPieces)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function createHand() {
  const shapeKeys = Object.keys(SHAPES);
  const colorKeys = Object.keys(BLOCK_COLORS);

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const tempHand = [];

    if (gameState.hand.length === 0) {
      for (let i = 0; i < 3; i++) {
        const shape = SHAPES[shapeKeys[Math.floor(Math.random() * shapeKeys.length)]];
        const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];

        const newShape = new DraggableShape(shape, color, i);
        tempHand.push(newShape);
      }
    }
    if (isHandPlayable(gameState.gridData, tempHand)) {
      gameState.hand = tempHand;
      return;
    }

    attempts++;
  }
}



function removeFromHand(shape) {
  const index = gameState.hand.indexOf(shape);
  gameState.hand.splice(index, 1);

  if (gameState.hand.length === 0) {
    createHand();
  } else {
    if (!isHandPlayable(gameState.gridData, gameState.hand)) {
      console.log("Game over! No available space left");
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

        if (isValidPlacement(gameState.gridData, shape.template, gridRow, gridCol)) {
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

        if (isValidPlacement(gameState.gridData, shape.template, gridRow, gridCol)) {
          placeOnGrid(shape.template, gridRow, gridCol, shape.colorKey);
          removeFromHand(shape);
        }
      }
      gameState.ghostPreview = null;
      shape.isDragging = false;
      shape.reset();
    });
  });
}

function initHand() {
  createHand();
  initDragControls();
}

export { initHand, drawHand };
