// game board
const GameBoard = (function () {
  let _gameBoard = [];

  // add to _gameBoard
  function add(mark, position) {
    _gameBoard[position] = mark;
  }

  // reset game board
  function reset() {
    _gameBoard = [];
  }

  // get board contents
  function getGameBoard() {
    return _gameBoard;
  }

  return {
    add,
    reset,
    getGameBoard,
  };
})();

// player
const playerFactory = function (name, mark) {
  const _name = name;
  const _mark = mark;

  // get name
  function getName() {
    return _name;
  }

  // get mark
  function getMark() {
    return _mark;
  }

  return {
    getName,
    getMark,
  };
};
