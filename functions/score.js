import { numSquaresX, numSquaresY } from '../index.js';

function calculateColorContrast(color1, color2) {
  // Función para calcular el color complementario de un color RGB
  function complementaryColor(color) {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    const complementarioR = 255 - r;
    const complementarioG = 255 - g;
    const complementarioB = 255 - b;
    return `rgb(${complementarioR}, ${complementarioG}, ${complementarioB})`;
  }

  // Calcular los colores complementarios de ambos colores
  const complementario1 = complementaryColor(color1);
  const complementario2 = complementaryColor(color2);

  // Convertir los colores complementarios a valores RGB
  const [r1, g1, b1] = complementario1.match(/\d+/g).map(Number);
  const [r2, g2, b2] = complementario2.match(/\d+/g).map(Number);

  // Aumentar la diferencia entre los colores intermedios
  const factor = 0.7; // Puedes ajustar este factor según tus preferencias
  const intermedioR = Math.round((r1 + r2) / 2 + (r1 - r2) * factor);
  const intermedioG = Math.round((g1 + g2) / 2 + (g1 - g2) * factor);
  const intermedioB = Math.round((b1 + b2) / 2 + (b1 - b2) * factor);

  // Devolver el color intermedio como una cadena en formato RGB
  return `rgb(${intermedioR}, ${intermedioG}, ${intermedioB})`;
}

export function updateScoreElement(
  DAY_COLOR,
  NIGHT_COLOR,
  squares,
  scoreElement
) {
  const totalSquares = numSquaresX * numSquaresY
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

  const dayPercentage = (dayScore / totalSquares) * 100;
  const nightPercentage = (nightScore / totalSquares) * 100;

  const contrastColor = calculateColorContrast(DAY_COLOR, NIGHT_COLOR);

  // scoreElement.textContent = `day ${dayScore} | night ${nightScore}`;
  scoreElement.innerHTML = `<span style="color:${DAY_COLOR};-webkit-text-stroke: 0.5px ${NIGHT_COLOR};">day ${dayPercentage.toFixed(2)}% </span> <span style="color:${contrastColor}">|</span> <span style="color:${NIGHT_COLOR}; -webkit-text-stroke: 0.5px ${DAY_COLOR};">night ${nightPercentage.toFixed(2)}%</span>`;
}
