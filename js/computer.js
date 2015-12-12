/*jshint esnext: true */
/* @flow */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function computerMove(player) {
  var move = [];
  var possibleMoves = [];
  var possibleCornerMoves = [];
  var corners = [
    [0, 0],
    [7, 0],
    [7, 7],
    [0, 7]
  ];

  for (var i = 0; i < board.length; i++) {

    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        move = traverse(i, j, turn);
        if (move[0]) {
          possibleMoves.push(new Array([move[2],
            [i, j]
          ]));
        }
      }
    }

  }

  if (player.strategies.cornerMoves) {
    possibleMoves.forEach(function(possibleElement) {
      corners.forEach(function(cornerElement) {
        if (possibleElement[0][1].toString() === cornerElement.toString()) {
          possibleCornerMoves.push(possibleElement);
        }
      });
    });
    if (possibleCornerMoves.length > 0) {
      possibleMoves = possibleCornerMoves;
    }
  }

  if (player.strategies.mostCaptures) {
    var mostCaptures = Math.max.apply(Math, possibleMoves.map(function(value) {
      return value[0][0];
    }));
    possibleMoves = possibleMoves.filter(function(value) {
      return value[0][0] == mostCaptures;
    });
  }

  var randomMoveIndex = randomNumber(0, possibleMoves.length - 1);
  makeMove(...possibleMoves[randomMoveIndex][0][1]);
}
