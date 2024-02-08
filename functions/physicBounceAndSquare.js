import {
  SQUARE_SIZE,
  numSquaresX,
  numSquaresY,
  colorPalette,
  canvas,
} from '../index.js';
import { generateParticles } from './Particles.js';

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function updateSquareAndBounce(x, y, dx, dy, color, squares, particles) {
  let updatedDx = dx;
  let updatedDy = dy;
  let destroyed = false;  

  // Calcular la nueva posición de la pelota después del movimiento
  const nextX = x + dx;
  const nextY = y + dy;
  const nextLeft = nextX - SQUARE_SIZE / 2;
  const nextRight = nextX + SQUARE_SIZE / 2;
  const nextTop = nextY - SQUARE_SIZE / 2;
  const nextBottom = nextY + SQUARE_SIZE / 2;

  // Verificar colisión con cada cuadrado
  for (let i = 0; i < numSquaresX; i++) {
    for (let j = 0; j < numSquaresY; j++) {
      if (squares[i][j] !== color) {
        // Calcular los límites del cuadrado
        const squareLeft = i * SQUARE_SIZE;
        const squareRight = (i + 1) * SQUARE_SIZE;
        const squareTop = j * SQUARE_SIZE;
        const squareBottom = (j + 1) * SQUARE_SIZE;

        // Verificar colisión entre la pelota y el cuadrado
        if (
          nextRight > squareLeft &&
          nextLeft < squareRight &&
          nextBottom > squareTop &&
          nextTop < squareBottom
        ) {
          // Determinar dirección de rebote basado en la posición relativa
          const overlapX = Math.min(
            nextRight - squareLeft,
            squareRight - nextLeft
          );
          const overlapY = Math.min(
            nextBottom - squareTop,
            squareBottom - nextTop
          );

          if (overlapX < overlapY) {
            updatedDx = -updatedDx;
          } else {
            updatedDy = -updatedDy;
          }

          // Agregar algo de aleatoriedad al rebote
          updatedDx += randomNum(-0.01, 0.01);
          updatedDy += randomNum(-0.01, 0.01);

          // Actualizar color del cuadrado
          squares[i][j] = color;
          generateParticles(
            squareLeft + SQUARE_SIZE,
            squareTop + SQUARE_SIZE,
            color,
            particles,
            colorPalette
          );

          destroyed = true;
        }
      }
    }
  }

  return { dx: updatedDx, dy: updatedDy, destroyed: destroyed };
}

function checkBoundaryCollision(x, y, dx, dy) {
  if (x + dx > canvas.width - SQUARE_SIZE / 2 || x + dx < SQUARE_SIZE / 2) {
    dx = -dx;
  }
  if (y + dy > canvas.height - SQUARE_SIZE / 2 || y + dy < SQUARE_SIZE / 2) {
    dy = -dy;
  }

  return { dx: dx, dy: dy };
}

export { updateSquareAndBounce, checkBoundaryCollision };
