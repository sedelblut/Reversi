/* @flow */

Array.matrix = function(numrows, numcols, init) {
  var arr = [];

  for (var i = 0; i < numrows; ++i) {
    var columns = [];

    for (var j = 0; j < numcols; ++j) {
      columns[j] = init;
    }

    arr[i] = columns;
  }

  return arr;
};

function incrementTurn(turn) {
  return (turn == 1) ? 2 : 1;
}

function sleep(milliseconds) {
  var start = new Date().getTime();

  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }

}
