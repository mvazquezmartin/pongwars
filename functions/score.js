import { numSquaresX, numSquaresY } from '../index.js';

export function updateScoreElement(DAY_COLOR, NIGHT_COLOR, squares, scoreElement) {
  let dayScore = 0;
  let nightScore = 0;
  for (let i = 0; i < numSquaresX; i++) {
    for (let j = 0; j < numSquaresY; j++) {
      if (squares[i][j] === DAY_COLOR) {
        dayScore++;
      } else if (squares[i][j] === NIGHT_COLOR) {
        nightScore++;
      }
    }
  }

  scoreElement.textContent = `day ${dayScore} | night ${nightScore}`;
}
