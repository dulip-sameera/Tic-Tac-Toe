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

// game play

const GamePlay = (function () {
  let _xPlayer;
  let _oPlayer;

  const _winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // start game
  function start(xPlayer, oPlayer) {
    _xPlayer = playerFactory(xPlayer, "x");
    _oPlayer = playerFactory(oPlayer, "o");
    _gameBoard = GameBoard.getGameBoard();
  }

  // add mark
  function addMark(mark, position) {
    GameBoard.add(mark, position);
  }

  // check win
  function checkWin(mark) {
    const _WIN = true;
    const _LOOSE = false;

    let player = _xPlayer.getMark() === mark ? _xPlayer : _oPlayer;

    // uses an array to catch all the three positions  that in the win combo
    // has the same mark, by pushing a true value to winCombo array
    winStatus = [];

    // iterate trough the winCombos
    for (let i = 0; i < _winCombos.length; i++) {
      // check individual combo
      for (let j = 0; j < _winCombos[i].length; j++) {
        // check is there a win combo
        if (GamePlay.getGameBoard()[_winCombos[i][j]] === mark) {
          winStatus.push(_WIN);
        } else {
          winStatus.push(_LOOSE);
        }
      }

      // if there is a win combo we set winStatus true, otherwise loop again,
      // but first set the winStatus back to its original
      if (winStatus.includes(_LOOSE)) {
        winStatus = [];
        continue;
      } else {
        // if there is a winning combination in the winCombo array it will look like this [true, true, true]
        //  we wont loop again if there is a winning combination
        winStatus = _WIN;
        break;
      }
    }

    // after all the iterations if there is no winning combinations, we set the
    // winStatus to false
    if (Array.isArray(winStatus)) winStatus = _LOOSE;

    return {
      winStatus,
      player,
    };
  }

  // reset game
  function restart() {
    _xPlayer = "";
    _oPlayer = "";
    GameBoard.reset();
  }

  // get x player
  function getXPlayer() {
    return _xPlayer;
  }

  // get o player
  function getOPlayer() {
    return _oPlayer;
  }

  // get game board
  function getGameBoard() {
    return GameBoard.getGameBoard();
  }

  return {
    start,
    addMark,
    restart,
    getXPlayer,
    getOPlayer,
    getGameBoard,
    checkWin,
  };
})();
