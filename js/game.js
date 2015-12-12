/*jshint esnext: true */
/* @flow */
var state = false;
var turn = 1;
var player1 = null;
var player2 = null;
var compVsCompInterval = null;
var firstComputerMoveTimeout = null;
var computerMoveTimeout = null;
var cursorInterval = null;
var mousedownEventListener = null;

var initGameLoop = function() {
  board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  state = true;
  turn = 1;
  if (document.getElementById("player1_human").checked) {
    player1 = new humanPlayer();
  } else {
    player1 = new computerPlayer();
  }
  if (document.getElementById("player2_human").checked) {
    player2 = new humanPlayer();
  } else {
    player2 = new computerPlayer();
  }
  player1.score = 2;
  player2.score = 2;
  player1.piece = blackPiece;
  player2.piece = whitePiece;
  player1.cursor = blackCursor;
  player2.cursor = whiteCursor;
  comments.innerHTML += "New Game" + "<br>";
  comments.innerHTML += "Player " + turn + " turn<br>";
  comments.scrollTop = comments.scrollHeight;
  player1score.innerHTML = player1.score;
  player2score.innerHTML = player2.score;
  player1type.innerHTML = player1.name;
  player2type.innerHTML = player2.name;

  window.clearInterval(compVsCompInterval);
  window.clearInterval(cursorInterval);
  window.clearTimeout(firstComputerMoveTimeout);
  window.clearTimeout(computerMoveTimeout);
  canvas.removeEventListener("mousedown", mousedownEventListener);

  drawBoard();

  if (player1.isComputer && player2.isComputer) {
    var desiredFps = 10;
    var frameCount = 0;
    document.getElementById("board").style.cursor = "default";
    compVsCompInterval = setInterval(function() {
      if (frameCount % 2 === 0) {
        if (turn == 1) player1.acceptMove(player1);
      } else {
        if (turn == 2) player2.acceptMove(player2);
      }
      frameCount += 1;
      drawBoard();
      if (!state) {
        window.clearInterval(compVsCompInterval);
      }
    }, 1000 / desiredFps);
  } else if (player1.isHuman || player2.isHuman) {
    if (player1.isComputer) {
      firstComputerMoveTimeout = setTimeout(function() {
        player1.acceptMove(player1);
        drawBoard();
        document.getElementById("board").style.cursor =
          (turn == 1) ? player1.cursor : player2.cursor;
      }, 1000);
    }

    cursorInterval = setInterval(function() {
      if (turn == 1 && player1.isHuman) {
        document.getElementById("board").style.cursor = player1.cursor;
      } else if (turn == 2 && player2.isHuman) {
        document.getElementById("board").style.cursor = player2.cursor;
      } else if ((turn == 1 && player1.isComputer) ||
        (turn == 2 && player2.isComputer)) {
        document.getElementById("board").style.cursor = "default";
      }
    });

    canvas.addEventListener("mousedown", mousedownEventListener = function() {
      if (turn == 1 && player1.isHuman) {
        player1.acceptMove(event);
        drawBoard();
      } else if (turn == 2 && player2.isHuman) {
        player2.acceptMove(event);
        drawBoard();
      }

      computerMoveTimeout = setTimeout(function() {
        if (turn == 1 && player1.isComputer) {
          player1.acceptMove(player1);
          drawBoard();
        } else if (turn == 2 && player2.isComputer) {
          player2.acceptMove(player2);
          drawBoard();
        }
      }, 1000);
    });
  }
};

function isSquareOnGrid(square) {
  var x = square[0];
  var y = square[1];
  return x >= 0 && x < GRIDSIZE && y >= 0 && y < GRIDSIZE;
}

function traverse(x0, y0, turn0) {
  var x = x0;
  var y = y0;
  var cont = false;
  var didMakeMove = false;
  var flips = [];
  var tempFlips = [];
  var directions = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
  ];
  var adjacents = [];
  var sum = 0;
  var tempSum = 0;

  directions.forEach(function(element) {
    var adjSquare = [x0 + element[0], y0 + element[1]];
    if (isSquareOnGrid(adjSquare)) {
      adjacents.push([adjSquare]);
    }
  });

  directions.forEach(function(dir) {

    do {
      x += dir[0];
      y += dir[1];
      if (isSquareOnGrid([x, y]) &&
        (board[x][y] != turn0 && board[x][y] > 0)) {
        tempFlips.push([x, y]);
        tempSum += 1;
        cont = true;
      } else if (isSquareOnGrid([x, y]) &&
        (tempSum > 0 && board[x][y] == turn0)) {

        while (tempFlips.length > 0) {
          flips.push(tempFlips.pop());
        }

        sum += tempSum;
        didMakeMove = true;
        cont = false;
      } else {
        cont = false;
      }
    } while (cont === true);

    x = x0;
    y = y0;
    tempSum = 0;
    tempFlips = [];
  });

  return [didMakeMove, flips, sum];
}

function makeMove(x, y) {
  var move = [];
  if (board[x][y] === 0) {
    move = traverse(x, y, turn);
    if (move[0]) {
      board[x][y] = turn;
      if (turn == 1) {
        player1.score += 1 + move[2];
        player2.score -= move[2];
      } else {
        player2.score += 1 + move[2];
        player1.score -= move[2];
      }

      move[1].forEach(function(square) {
        board[square[0]][square[1]] = turn;
      });

      turn = getGameState();
      return true;
    } else {
      comments.innerHTML += "No captures to be made.<br>";
      comments.scrollTop = comments.scrollHeight;
      return false;
    }
  } else {
    comments.innerHTML += "That move is not allowed.<br>";
    comments.scrollTop = comments.scrollHeight;
    return false;
  }
}

function getGameState() {
  var currentTurn = turn;
  var nextTurn = incrementTurn(turn);
  var currentCount = 0;
  var nextCount = 0;

  for (var i = 0; i < board.length; i++) {

    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        nextTurnMoves = traverse(i, j, nextTurn);
        currentTurnMoves = traverse(i, j, currentTurn);
        if (nextTurnMoves[0]) {
          nextCount++;
        }
        if (currentTurnMoves[0]) {
          currentCount++;
        }
      }
    }

  }

  if (currentCount === 0 && nextCount === 0) {
    comments.innerHTML += "Game Over!<br>";
    if (player1.score == player2.score) {
      comments.innerHTML += "It's a Tie!<br>";
    } else {
      winner = (player1.score > player2.score) ? 1 : 2;
      comments.innerHTML += "Player " + winner + " wins!<br>";
    }
    comments.scrollTop = comments.scrollHeight;
    document.getElementById("board").style.cursor = "default";
    state = false;
    return null;
  } else if (nextCount > 0) {
    comments.innerHTML += "Player " + nextTurn + " turn" + "<br>";
    comments.scrollTop = comments.scrollHeight;
    return nextTurn;
  } else {
    comments.innerHTML += "Player " + nextTurn +
      " does not have any moves.<br>Player " + turn + " turn.<br>";
    comments.scrollTop = comments.scrollHeight;
    return currentTurn;
  }

}
