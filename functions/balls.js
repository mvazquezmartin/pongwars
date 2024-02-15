import { ctx, SQUARE_SIZE } from "../index.js";

function drawBallTrail(colorRGB, ballTrail) {
  const matches = colorRGB.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  const color = {
    r: parseInt(matches[1]),
    g: parseInt(matches[2]),
    b: parseInt(matches[3]),
    a: 0.2,
  };

  for (let i = 0; i < ballTrail.length; i++) {
    let alpha = i / ballTrail.length;
    ctx.beginPath();
    ctx.arc(
      ballTrail[i].x,
      ballTrail[i].y,
      SQUARE_SIZE / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
      color.a * alpha
    })`;
    ctx.fill();
    ctx.closePath();
  }
}

function drawBall(x, y, color) {
  ctx.beginPath();
  ctx.arc(x, y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export { drawBall, drawBallTrail };
