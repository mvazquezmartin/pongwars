// ORIGNAL https://steamcommunity.com/sharedfiles/filedetails/?id=3164122126

import { drawParticles } from './functions/Particles.js';
import { drawBall, drawBallTrail } from './functions/balls.js';
import { drawSquares, updateSquareColors } from './functions/drawCanva.js';
import {
  checkBoundaryCollision,
  updateSquareAndBounce,
} from './functions/physicBounceAndSquare.js';
import { updateScoreElement } from './functions/score.js';

export const canvas = document.getElementById('pongCanvas');
export const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

export const colorPalette = {
  MysticMint: 'rgb(231, 242, 246)', //'rgb(217, 232, 227)' day ball #D9E8E3
  NocturnalExpedition: 'rgb(21, 29, 40)', //rgb(17, 76, 90)' night ball #114C5A
};
export let SQUARE_SIZE = 15;
export const BALL_SPEED = {
  MAX: 10,
  MIN: 5,
};
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

canvas.width = 1020;
canvas.height = 1020;

export const numSquaresX = Math.floor(canvas.width / SQUARE_SIZE);
export const numSquaresY = Math.floor(canvas.height / SQUARE_SIZE);

let squares = [];
let ballTrail = [];
let particles = [];
let isDrawParticle = false;

let x1 = canvas.width / 4;
let y1 = canvas.height / 2;
let dx1 = 8;
let dy1 = -8;

let x2 = (canvas.width / 4) * 3;
let y2 = canvas.height / 2;
let dx2 = -8;
let dy2 = 8;

// PROPERTY WALLPAPER ENGINE
window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.daycolor) {
      let daycolor = properties.daycolor.value.split(' ');
      daycolor = daycolor.map(function (c) {
        return Math.ceil(c * 255);
      });

      let dayBallColorAsCss = 'rgb(' + daycolor + ')';

      colorPalette.MysticMint = dayBallColorAsCss;
      updateSquareColors(squares);
    }

    if (properties.nightcolor) {
      let nightcolor = properties.nightcolor.value.split(' ');
      nightcolor = nightcolor.map(function (c) {
        return Math.ceil(c * 255);
      });

      let nightballAsCss = 'rgb(' + nightcolor + ')';

      colorPalette.NocturnalExpedition = nightballAsCss;
      updateSquareColors(squares);
    }
    if (properties.hidetitle) {
      const checkValue = properties.hidetitle.value;
      scoreElement.style.visibility = checkValue ? 'hidden' : 'visible';
    }
    if (properties.ballspeed) {
      const speed = properties.ballspeed.value;
      dx1 = dy2 = speed;
      dy1 = dx2 = -speed;
      BALL_SPEED.MAX = speed + 2;
      BALL_SPEED.MIN = speed - 3;
    }
    if (properties.hideparticles) {
      const hideValue = properties.hideparticles.value;
      isDrawParticle = hideValue;
    }
  },
};

function draw() {
  const DAY_COLOR = colorPalette.MysticMint;
  const DAY_BALL_COLOR = colorPalette.NocturnalExpedition;

  const NIGHT_COLOR = colorPalette.NocturnalExpedition;
  const NIGHT_BALL_COLOR = colorPalette.MysticMint;

  ballTrail.push({ x: x1, y: y1 });
  ballTrail.push({ x: x2, y: y2 });

  // ballTrail limit
  const maxTrailLength = 20;
  if (ballTrail.length > maxTrailLength) {
    ballTrail = ballTrail.slice(-maxTrailLength);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSquares(squares);

  drawBallTrail(DAY_COLOR, ballTrail);

  drawBall(x1, y1, DAY_BALL_COLOR);
  let bounce1 = updateSquareAndBounce(
    x1,
    y1,
    dx1,
    dy1,
    DAY_COLOR,
    squares,
    particles
  );
  dx1 = bounce1.dx;
  dy1 = bounce1.dy;

  drawBallTrail(NIGHT_COLOR, ballTrail);

  drawBall(x2, y2, NIGHT_BALL_COLOR);
  let bounce2 = updateSquareAndBounce(
    x2,
    y2,
    dx2,
    dy2,
    NIGHT_COLOR,
    squares,
    particles
  );
  dx2 = bounce2.dx;
  dy2 = bounce2.dy;

  if (!isDrawParticle) {
    drawParticles(particles);
  }

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

  updateScoreElement(DAY_COLOR, NIGHT_COLOR, squares, scoreElement);

  requestAnimationFrame(draw);
}

updateSquareColors(squares);
requestAnimationFrame(draw);
