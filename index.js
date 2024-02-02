// Idea for Pong wars: https://twitter.com/nicolasdnl/status/1749715070928433161
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const colorPalette = {
  MysticMint: 'rgb(217, 232, 227)', //day ball #D9E8E3
  NocturnalExpedition: 'rgb(17, 76, 90)', //night ball #114C5A
};
const SQUARE_SIZE = 15;
canvas.width = 1000;
canvas.height = 1080;

const numSquaresX = canvas.width / SQUARE_SIZE;
const numSquaresY = canvas.height / SQUARE_SIZE;

let squares = [];
let ballTrail = [];
let particles = [];

let x1 = canvas.width / 4;
let y1 = canvas.height / 2;
let dx1 = 7.5;
let dy1 = -7.5;

let x2 = (canvas.width / 4) * 3;
let y2 = canvas.height / 2;
let dx2 = -7.5;
let dy2 = 7.5;

let iteration = 0;

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.daycolor) {
      let daycolor = properties.daycolor.value.split(' ');
      daycolor = daycolor.map(function (c) {
        return Math.ceil(c * 255);
      });

      let dayBallColorAsCss = 'rgb(' + daycolor + ')';

      colorPalette.MysticMint = dayBallColorAsCss;
      updateSquareColors();
    }

    if (properties.nightcolor) {
      let nightcolor = properties.nightcolor.value.split(' ');
      nightcolor = nightcolor.map(function (c) {
        return Math.ceil(c * 255);
      });

      let nightballAsCss = 'rgb(' + nightcolor + ')';

      colorPalette.NocturnalExpedition = nightballAsCss;
      updateSquareColors();
    }

    if (properties.textcolor) {
      let textcolor = properties.textcolor.value.split(' ');
      textcolor = textcolor.map(function (c) {
        return Math.ceil(c * 255);
      });
      let textColorAsCss = 'rgb(' + textcolor + ')';
      scoreElement.style.color = textColorAsCss;
    }
    if (properties.hidetitle) {
      const checkValue = properties.hidetitle.value;
      scoreElement.style.visibility = checkValue ? 'hidden' : 'visible';
    }
    if (properties.ballspeed) {
      const speed = properties.ballspeed.value;
      dx1 = dy2 = speed;
      dy1 = dx2 = -speed;
    }
  },
};

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 1.5;
    this.speed = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    this.opacity = 1;
    this.fadeOut = 0.02;
    this.shouldRemove = false;
  }

  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.opacity -= this.fadeOut;

    if (this.opacity <= 0) {
      this.shouldRemove = true;
    }
  }

  draw(ctx) {
    const rgbValues = this.color.match(/\d+/g); // Extraer los valores RGB como números
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`; // Usar los valores RGB extraídos
    ctx.fill();
    ctx.closePath();
  }
}

function generateParticles(x, y, color) {
  // console.log(color)
  const particleColor =
    color === colorPalette.MysticMint
      ? colorPalette.NocturnalExpedition
      : colorPalette.MysticMint;
  for (let i = 0; i < 20; i++) {
    const particle = new Particle(x, y, particleColor);
    particles.push(particle);
  }
}

function drawParticles() {
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw(ctx);

    // Eliminar la partícula si debe ser removida
    if (particle.shouldRemove) {
      particles.splice(index, 1);
    }
  });
}

function updateSquareColors() {
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

function drawBallTrail(colorRGB) {
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

function drawSquares() {
  for (let i = 0; i < numSquaresX; i++) {
    for (let j = 0; j < numSquaresY; j++) {
      ctx.fillStyle = squares[i][j];
      ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function updateSquareAndBounce(x, y, dx, dy, color) {
  let updatedDx = dx;
  let updatedDy = dy;
  let destroyed = false;

  // Calcular los límites de la pelota
  const left = x - SQUARE_SIZE / 2;
  const right = x + SQUARE_SIZE / 2;
  const top = y - SQUARE_SIZE / 2;
  const bottom = y + SQUARE_SIZE / 2;

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
            color
          );

          destroyed = true;
        }
      }
    }
  }

  return { dx: updatedDx, dy: updatedDy, destroyed: destroyed };
}

function updateScoreElement(DAY_COLOR, NIGHT_COLOR) {
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

function checkBoundaryCollision(x, y, dx, dy) {
  if (x + dx > canvas.width - SQUARE_SIZE / 2 || x + dx < SQUARE_SIZE / 2) {
    dx = -dx;
  }
  if (y + dy > canvas.height - SQUARE_SIZE / 2 || y + dy < SQUARE_SIZE / 2) {
    dy = -dy;
  }

  return { dx: dx, dy: dy };
}

function draw() {
  const DAY_COLOR = colorPalette.MysticMint;
  const DAY_BALL_COLOR = colorPalette.NocturnalExpedition;

  const NIGHT_COLOR = colorPalette.NocturnalExpedition;
  const NIGHT_BALL_COLOR = colorPalette.MysticMint;

  ballTrail.push({ x: x1, y: y1 });
  ballTrail.push({ x: x2, y: y2 });

  // Limitar la longitud de ballTrail
  const maxTrailLength = 20;
  if (ballTrail.length > maxTrailLength) {
    ballTrail = ballTrail.slice(-maxTrailLength);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSquares();

  drawBallTrail(DAY_COLOR);

  drawBall(x1, y1, DAY_BALL_COLOR);
  let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, DAY_COLOR);
  dx1 = bounce1.dx;
  dy1 = bounce1.dy;

  drawBallTrail(NIGHT_COLOR);

  drawBall(x2, y2, NIGHT_BALL_COLOR);
  let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, NIGHT_COLOR);
  dx2 = bounce2.dx;
  dy2 = bounce2.dy;

  drawParticles();

  let boundary1 = checkBoundaryCollision(x1, y1, dx1, dy1);
  dx1 = boundary1.dx;
  dy1 = boundary1.dy;

  let boundary2 = checkBoundaryCollision(x2, y2, dx2, dy2);
  dx2 = boundary2.dx;
  dy2 = boundary2.dy;

  x1 += dx1;
  y1 += dy1;
  x2 += dx2;
  y2 += dy2;

  iteration++;
  // if (iteration % 1_000 === 0) console.log('interation', iteration);

  updateScoreElement(DAY_COLOR, NIGHT_COLOR);

  requestAnimationFrame(draw);
}

updateSquareColors();
requestAnimationFrame(draw);
