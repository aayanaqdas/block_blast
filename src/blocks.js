const SHAPES = {
  DOT: [[1]],
  SQUARE_2: [
    [1, 1],
    [1, 1],
  ],

  SQUARE_3: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],

  LINE_2: [[1, 1]],
  LINE_3: [[1, 1, 1]],
  LINE_4: [[1, 1, 1, 1]],
  LINE_5: [[1, 1, 1, 1, 1]],

  L_SMALL: [
    [1, 0],
    [1, 1],
  ],
  L_STANDARD: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  L_BIG: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],

  T_SHAPE: [
    [1, 1, 1],
    [0, 1, 0],
  ],
  CORNER_2: [
    [1, 1],
    [1, 0],
  ],
  CORNER_3: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],

  Z_SHAPE: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  S_SHAPE: [
    [0, 1, 1],
    [1, 1, 0],
  ],

  RECT: [
    [1, 1, 1],
    [1, 1, 1],
  ],
};

function drawBlock(ctx, x, y, innerSize, RADIUS, PADDING, blockColor) {
  const bevelSize = 8;

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
  ctx.fillStyle = adjustColor(blockColor, 0.2);
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

export { drawBlock, SHAPES };
