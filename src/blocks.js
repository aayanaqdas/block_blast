function drawBlock(ctx, x, y, innerSize, RADIUS, blockColor) {
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

export { drawBlock };
