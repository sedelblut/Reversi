/*jshint esnext: true */
/* @flow */

const GRIDSIZE = 8;
const SQUARES = GRIDSIZE * GRIDSIZE;
const WIDTH = 500;
const HEIGHT = 500;
const LINEWIDTH = 2;
const RADIUS = 35;

var board = Array.matrix(GRIDSIZE, GRIDSIZE, 0);
var grid = new Image();
grid.src = "img/grid.svg";
var background = new Image();
background.src = "img/light-wood-textures-high-resolution.jpg";

function drawBoard() {
  var piece = null;
  context.globalAlpha = 1;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.width);
  context.drawImage(background, 0, 0, 500, 500);
  context.drawImage(grid, 0, 0);

  for (var i = 0; i < GRIDSIZE; i++) {

    for (var j = 0; j < GRIDSIZE; j++) {
      if (board[i][j] > 0) {
        var x = (i * WIDTH / GRIDSIZE);
        var y = (j * HEIGHT / GRIDSIZE);
        if (board[i][j] == 1) {
          piece = player1.piece;
        } else if (board[i][j] == 2) {
          piece = player2.piece;
        }
        context.drawImage(piece, x + 7.375, y + 7.375);
      }
    }

  }

  player1score.innerHTML = player1.score;
  player2score.innerHTML = player2.score;
}

function addPieceWithMouse(event) {
  if (state === true) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var squareX = Math.floor(x / (WIDTH / GRIDSIZE));
    var squareY = Math.floor(y / (HEIGHT / GRIDSIZE));
    makeMove(squareX, squareY);
  }
}
