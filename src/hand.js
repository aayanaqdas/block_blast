import { gameState } from "./gameStates.js";
import {
  placeOnGrid,
  isValidPlacement,
  clearFromGrid,
  calculateOpenSpace,
  getGridOffsets,
} from "./grid.js";
import { drawBlock, BLOCK_COLORS } from "./blocks.js";
import { SHAPES, CHUNKS, SPANNERS, FILLERS, HELPERS } from "./shapes.js";
import { isPointInRect } from "./uiEvents.js";

const GAME_WIDTH = gameState.GAME_WIDTH;
const GAME_HEIGHT = gameState.GAME_HEIGHT;

const GRID_SIZE = gameState.GRID_SIZE;
const CELL_SIZE = gameState.CELL_SIZE;

class DraggableShape {
  constructor(template, colorKey, handIndex) {
    this.template = template;
    this.colorKey = colorKey;

    this.isDragging = false;
    this.scale = 0.4;

    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.visualOffsetY = -110;

    const handWidth = GAME_WIDTH / 3;
    this.spawnX = handWidth * handIndex + handWidth / 2;
    this.spawnY = GAME_HEIGHT - 210;

    this.x = this.spawnX;
    this.y = this.spawnY;

    this.w = null;
    this.h = null;
  }

  draw(ctx) {
    const displayCellSize = CELL_SIZE * this.scale;

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

          drawBlock(ctx, blockX, blockY, this.colorKey, this.scale);
        }
      });
    });
  }

  reset() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.scale = 0.4;
  }
}

function canPieceFitAnywhere(grid, template) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (isValidPlacement(grid, template, r, c)) return true;
    }
  }
  return false;
}

function isHandPlayable(grid, pieces) {
  for (const piece of pieces) {
    if (!canPieceFitAnywhere(grid, piece.template)) return false;
  }
  return true;
}

function scorePlacementAt(grid, template, colorKey, r, c) {
  const simGrid = grid.map((row) => [...row]);

  for (let sr = 0; sr < template.length; sr++) {
    for (let sc = 0; sc < template[sr].length; sc++) {
      if (template[sr][sc] === 1) {
        simGrid[r + sr][c + sc] = colorKey;
      }
    }
  }

  let linesCleared = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    if (simGrid[i].every((cell) => cell !== null)) linesCleared++;
    if (simGrid.every((row) => row[i] !== null)) linesCleared++;
  }

  let setupValue = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    const rowFilled = simGrid[i].filter((cell) => cell !== null).length;
    if (rowFilled >= 6 && rowFilled < 8) setupValue += rowFilled;
    let colFilled = 0;
    for (let rx = 0; rx < GRID_SIZE; rx++) {
      if (simGrid[rx][i] !== null) colFilled++;
    }
    if (colFilled >= 6 && colFilled < 8) setupValue += colFilled;
  }

  const resultGrid = simGrid.map((row) => [...row]);
  clearFromGrid(resultGrid);

  return { grid: resultGrid, linesCleared, setupValue };
}

function findBestPlacement(grid, template, colorKey) {
  let best = null;
  let bestLinesCleared = -1;
  let bestSetup = -1;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!isValidPlacement(grid, template, r, c)) continue;

      const result = scorePlacementAt(grid, template, colorKey, r, c);

      if (
        result.linesCleared > bestLinesCleared ||
        (result.linesCleared === bestLinesCleared && result.setupValue > bestSetup)
      ) {
        bestLinesCleared = result.linesCleared;
        bestSetup = result.setupValue;
        best = result;
      }
    }
  }

  return best;
}

// Score a hand by greedy best-placement in a fixed order (no permutations).
// 2 orderings (as-is + reversed) to get a reasonable estimate.
function scoreHand(grid, pieces) {
  let bestClears = 0;
  let bestSetup = 0;

  const orderings = [pieces, [...pieces].reverse()];

  for (const ordering of orderings) {
    let simGrid = grid.map((row) => [...row]);
    let totalClears = 0;
    let totalSetup = 0;
    let allFit = true;

    for (const piece of ordering) {
      const result = findBestPlacement(simGrid, piece.template, piece.colorKey);
      if (!result) {
        allFit = false;
        break;
      }
      simGrid = result.grid;
      totalClears += result.linesCleared;
      totalSetup += result.setupValue;
    }

    if (
      allFit &&
      (totalClears > bestClears || (totalClears === bestClears && totalSetup > bestSetup))
    ) {
      bestClears = totalClears;
      bestSetup = totalSetup;
    }
  }

  return { clears: bestClears, setup: bestSetup };
}

function analyzeBoardNeeds(grid) {
  const rowGaps = [];
  const colGaps = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    const rowFilled = grid[i].filter((c) => c !== null).length;
    const rowEmpty = GRID_SIZE - rowFilled;
    if (rowFilled >= 4) {
      rowGaps.push({ type: "row", index: i, empty: rowEmpty, filled: rowFilled });
    }

    let colFilled = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][i] !== null) colFilled++;
    }
    const colEmpty = GRID_SIZE - colFilled;
    if (colFilled >= 4) {
      colGaps.push({ type: "col", index: i, empty: colEmpty, filled: colFilled });
    }
  }

  rowGaps.sort((a, b) => b.filled - a.filled);
  colGaps.sort((a, b) => b.filled - a.filled);

  return { rowGaps, colGaps };
}

const ALL_POOLS = { CHUNKS, SPANNERS, FILLERS, HELPERS };

function getPoolCategory(name) {
  if (CHUNKS.includes(name)) return "chunk";
  if (SPANNERS.includes(name)) return "spanner";
  if (FILLERS.includes(name)) return "filler";
  return "helper";
}

function pickFromPool(pool, exclude) {
  let available = pool.filter((s) => !exclude.has(s));
  if (available.length === 0) available = pool;
  return available[Math.floor(Math.random() * available.length)];
}

let recentShapeHistory = [];

function createHand() {
  const colorKeys = BLOCK_COLORS;
  const openSpace = calculateOpenSpace(gameState.gridData);
  const fillPercent = 1 - openSpace / (GRID_SIZE * GRID_SIZE);
  const boardNeeds = analyzeBoardNeeds(gameState.gridData);

  const nearClearCount =
    boardNeeds.rowGaps.filter((g) => g.empty <= 2).length +
    boardNeeds.colGaps.filter((g) => g.empty <= 2).length;

  // Pool selection using weighted random per slot.
  // Each slot picks a pool based on weighted probabilities that shift with board state.
  function getPoolWeights(attempt) {
    if (fillPercent > 0.85 || attempt > 50) {
      return { CHUNKS: 0, SPANNERS: 5, FILLERS: 5, HELPERS: 90 };
    }
    if (fillPercent > 0.75 || attempt > 40) {
      return { CHUNKS: 0, SPANNERS: 15, FILLERS: 10, HELPERS: 75 };
    }

    if (fillPercent >= 0.65) {
      return nearClearCount >= 2
        ? { CHUNKS: 5, SPANNERS: 40, FILLERS: 15, HELPERS: 40 }
        : { CHUNKS: 5, SPANNERS: 30, FILLERS: 25, HELPERS: 40 };
    }

    if (fillPercent >= 0.4) {
      return nearClearCount >= 2
        ? { CHUNKS: 10, SPANNERS: 35, FILLERS: 25, HELPERS: 30 }
        : { CHUNKS: 20, SPANNERS: 25, FILLERS: 30, HELPERS: 25 };
    }

    return { CHUNKS: 35, SPANNERS: 15, FILLERS: 35, HELPERS: 15 };
  }

  function pickPoolByWeight(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let roll = Math.random() * total;
    for (const [poolName, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return ALL_POOLS[poolName];
    }
    return HELPERS;
  }

  const maxAttempts = 60;
  const targetCandidates = 8;
  let candidates = [];

  for (let attempt = 0; attempt < maxAttempts && candidates.length < targetCandidates; attempt++) {
    const tempHand = [];
    const currentHandNames = [];
    const weights = getPoolWeights(attempt);
    const excluded = new Set(recentShapeHistory);

    for (let i = 0; i < 3; i++) {
      const pool = pickPoolByWeight(weights);
      let shapeName = pickFromPool(pool, excluded);

      if (currentHandNames.includes(shapeName)) {
        const alternatives = pool.filter((s) => !excluded.has(s) && !currentHandNames.includes(s));
        if (alternatives.length > 0) {
          shapeName = alternatives[Math.floor(Math.random() * alternatives.length)];
        } else {
          const allNames = Object.keys(SHAPES);
          const fallbacks = allNames.filter((s) => !currentHandNames.includes(s));
          if (fallbacks.length > 0) {
            shapeName = fallbacks[Math.floor(Math.random() * fallbacks.length)];
          }
        }
      }

      currentHandNames.push(shapeName);
      excluded.add(shapeName);

      const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const newShape = new DraggableShape(SHAPES[shapeName], color, i);
      newShape.name = shapeName;
      tempHand.push(newShape);
    }

    if (!isHandPlayable(gameState.gridData, tempHand)) continue;

    const { clears, setup } = scoreHand(gameState.gridData, tempHand);

    const poolCategories = currentHandNames.map(getPoolCategory);
    const diversity = new Set(poolCategories).size;

    let totalBlocks = 0;
    for (const piece of tempHand) {
      for (const row of piece.template) {
        for (const cell of row) {
          if (cell === 1) totalBlocks++;
        }
      }
    }

    let finalScore;
    if (fillPercent < 0.3) {
      finalScore = clears * 8 + setup * 0.5 + diversity * 3 + totalBlocks * 0.5;
    } else if (fillPercent < 0.55) {
      finalScore = clears * 12 + setup * 0.3 + diversity * 2 + totalBlocks * 0.2;
    } else {
      finalScore = clears * 20 + setup * 0.2 + diversity;
    }

    candidates.push({
      hand: tempHand,
      names: currentHandNames,
      clears,
      setup,
      totalBlocks,
      score: finalScore,
    });
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);

    const topN = Math.min(3, candidates.length);
    const pick = candidates[Math.floor(Math.random() * topN)];

    gameState.hand = pick.hand;
    recentShapeHistory = pick.names;
    // console.log(
    //   `Hand: [${pick.names.join(", ")}] | clears: ${pick.clears}, setup: ${pick.setup.toFixed(0)}, blocks: ${pick.totalBlocks}, score: ${pick.score.toFixed(1)} | fill: ${(fillPercent * 100).toFixed(0)}% | near-clear: ${nearClearCount} | candidates: ${candidates.length}`,
    // );
    return;
  }

  console.log("emergency DOT fallback");
  const tempHand = [];
  const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  const newShape = new DraggableShape(SHAPES["DOT"], color, 1);
  newShape.name = "DOT";
  tempHand.push(newShape);
  gameState.hand = tempHand;
  recentShapeHistory = ["DOT"];
}

function removeFromHand(shape) {
  const index = gameState.hand.indexOf(shape);
  gameState.hand.splice(index, 1);

  if (gameState.hand.length === 0) {
    createHand();
  } else {
    let anyFits = false;
    for (const piece of gameState.hand) {
      if (canPieceFitAnywhere(gameState.gridData, piece.template)) {
        anyFits = true;
        break;
      }
    }
    if (!anyFits) {
      console.log("Game over! No remaining piece can fit");
      gameState.gameOver();
    }
  }
}

function drawHand(ctx) {
  gameState.hand.forEach((shape) => {
    shape.draw(ctx);
  });
}

function initDragControls() {
  const { gridXOffSet, gridYOffSet } = getGridOffsets();
  const hitBoxPadding = 60;

  gameState.canvas.addEventListener("pointerdown", (e) => {
    if (gameState.isPlaying()) {
      const rect = gameState.canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
      const clickY = ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT;

      gameState.hand.forEach((shape) => {
        const displayCellSize = CELL_SIZE * shape.scale;
        const shapeWidth = shape.template[0].length * displayCellSize;
        const shapeHeight = shape.template.length * displayCellSize;
        const shapeLeft = shape.x - shapeWidth / 2;
        const shapeTop = shape.y - shapeHeight / 2;
        if (
          isPointInRect(
            clickX,
            clickY,
            shapeLeft - hitBoxPadding,
            shapeTop - hitBoxPadding,
            shapeWidth + hitBoxPadding * 2,
            shapeHeight + hitBoxPadding * 2,
          )
        ) {
          shape.isDragging = true;
          shape.dragOffsetX = clickX - shape.x;
          shape.dragOffsetY = clickY - shape.y;
          shape.scale = 1;
          shape.x = clickX - shape.dragOffsetX;
          shape.y = clickY - shape.dragOffsetY;
        }
      });
    }
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

        const gridRow = Math.round((shapeTopLeftY - gridYOffSet) / CELL_SIZE);
        const gridCol = Math.round((shapeTopLeftX - gridXOffSet) / CELL_SIZE);

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

        const gridRow = Math.round((shapeTopLeftY - gridYOffSet) / CELL_SIZE);
        const gridCol = Math.round((shapeTopLeftX - gridXOffSet) / CELL_SIZE);

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

export { initHand, drawHand, createHand };
