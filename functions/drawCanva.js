import {
  colorPalette,
  numSquaresX,
  numSquaresY,
  ctx,
  SQUARE_SIZE,  
} from '../index.js';

function updateSquareColors(squares) {
  for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
      squares[i][j] =
        i < numSquaresX / 2
          ? colorPalette.MysticMint
          : colorPalette.NocturnalExpedition;
    }
  }
}

function drawSquares(squares) {
  for (let i = 0; i < numSquaresX; i++) {
    for (let j = 0; j < numSquaresY; j++) {
      ctx.fillStyle = squares[i][j];
      ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

export { updateSquareColors, drawSquares };
