import {
  SQUARE_SIZE,
  numSquaresX,
  numSquaresY,
  colorPalette,
  canvas,
  BALL_SPEED,
} from '../index.js';
import { generateParticles } from './Particles.js';

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function constrainSpeed(dx, dy) {
  const speed = Math.sqrt(dx * dx + dy * dy);
  if (speed > BALL_SPEED.MAX) {
    const ratio = BALL_SPEED.MAX / speed;
    dx *= ratio;
    dy *= ratio;
  } else if (speed < BALL_SPEED.MIN) {
    const ratio = BALL_SPEED.MIN / speed;
    dx *= ratio;
    dy *= ratio;
  }
  return { dx, dy };
}

// function updateSquareAndBounce(x, y, dx, dy, color, squares, particles) {
//   let updatedDx = dx;
//   let updatedDy = dy;

//   // Check multiple points around the ball's circumference
//   for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
//     let checkX = x + Math.cos(angle) * (SQUARE_SIZE / 2);
//     let checkY = y + Math.sin(angle) * (SQUARE_SIZE / 2);

//     let i = Math.floor(checkX / SQUARE_SIZE);
//     let j = Math.floor(checkY / SQUARE_SIZE);

//     if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
//       if (squares[i][j] !== color) {
//         squares[i][j] = color;

//         // Determine bounce direction based on the angle
//         if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
//           updatedDx = -updatedDx;
//         } else {
//           updatedDy = -updatedDy;
//         }

//         // Add some randomness to the bounce to prevent the balls from getting stuck in a loop
//         updatedDx += randomNum(-0.01, 0.01);
//         updatedDy += randomNum(-0.01, 0.01);
//         generateParticles(
//           // squareLeft + SQUARE_SIZE,
//           // squareTop + SQUARE_SIZE,
//           checkX,
//           checkY,
//           color,
//           particles,
//           colorPalette
//         );
//       }
//     }
//   }

//   const constrainedSpeed = constrainSpeed(updatedDx, updatedDy);
//   updatedDx = constrainedSpeed.dx;
//   updatedDy = constrainedSpeed.dy;

//   return { dx: updatedDx, dy: updatedDy };
// }

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

  const constrainedSpeed = constrainSpeed(updatedDx, updatedDy);
  updatedDx = constrainedSpeed.dx;
  updatedDy = constrainedSpeed.dy;

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
