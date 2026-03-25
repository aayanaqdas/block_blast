import { gameState } from "./gameStates.js";
import { getGridOffsets } from "./grid.js";
import { spriteMap } from "./spriteMap.js";
import { img } from "./assets.js";

const particles = [];
const GRAVITY = 0.5;

class Particle {
  constructor(x, y, colorKey) {
    this.x = x;
    this.y = y;
    this.colorKey = colorKey;

    this.vx = (Math.random() - 0.5) * 12;
    this.vy = (Math.random() - 1) * 10;

    this.life = 2.0;
    this.decay = 0.015 + Math.random() * 0.02;

    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.4;

    this.scale = 0.8 + Math.random() * 0.6;
  }

  update() {
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;

    const jewelSprite = spriteMap.jewelParticles[this.colorKey];
    if (!jewelSprite || !img.jewelSheet.complete) return;

    ctx.save();
    ctx.globalAlpha = this.life;

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const w = jewelSprite.sw * this.scale;
    const h = jewelSprite.sh * this.scale;

    ctx.drawImage(
      img.jewelSheet,
      jewelSprite.sx,
      jewelSprite.sy,
      jewelSprite.sw,
      jewelSprite.sh,
      -w / 2,
      -h / 2,
      w,
      h,
    );

    ctx.restore();
  }
}

function spawnJewels(clearedCells, colorKey) {
  const { gridXOffSet, gridYOffSet } = getGridOffsets();
  const CELL_SIZE = gameState.CELL_SIZE;

  clearedCells.forEach((cell) => {
    const pixelX = gridXOffSet + cell.col * CELL_SIZE + CELL_SIZE / 2;
    const pixelY = gridYOffSet + cell.row * CELL_SIZE + CELL_SIZE / 2;

    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(pixelX, pixelY, colorKey));
    }
  });
}

function updateAndDrawParticles(ctx) {
  if (particles.length === 0) return;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);

    if (p.life <= 0 || p.y > gameState.GAME_HEIGHT + 50) {
      particles.splice(i, 1);
    }
  }
}

export { spawnJewels, updateAndDrawParticles };
