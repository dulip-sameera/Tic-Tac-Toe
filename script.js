// game board
const GameBoard = (function () {
  let _gameBoard = [];

  // add to _gameBoard
  function add(mark, position) {
    _gameBoard[position] = mark;
  }

  // check is full
  function isFull() {
    if (_gameBoard.length === 9) {
      for (let i = 0; i < _gameBoard.length; i++) {
        if (_gameBoard[i] === undefined) return false;
      }
      return true;
    }
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
    isFull,
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

  // check isFull the gameBoard
  function isFull() {
    return GameBoard.isFull();
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
    isFull,
    restart,
    getXPlayer,
    getOPlayer,
    getGameBoard,
    checkWin,
  };
})();

// Display Controller
const DisplayController = (function () {
  // marks
  let _xMark;
  let _oMark;
  let turn;

  // cache dom
  const startBtn = document.querySelector("#startBtn");
  const startPage = document.querySelector("#startPage");
  const inputPlayerX = document.querySelector("#xName");
  const inputPlayerO = document.querySelector("#oName");
  const gamePlayArea = document.querySelector("#gamePlayArea");
  const displayXPlayer = document.querySelector("#displayXPlayer");
  const displayOPlayer = document.querySelector("#displayOPlayer");
  const board = document.querySelector("#board");
  const cells = document.querySelectorAll(".cell");
  const resultPage = document.querySelector("#resultPage");
  const message = document.querySelector("#message");
  const restart = document.querySelector("#restart");

  // Event - start the game
  startBtn.addEventListener("click", start);

  // Event functions
  function start() {
    // get the player names
    const xPlayer = inputPlayerX.value === "" ? "John" : inputPlayerX.value;
    const oPlayer = inputPlayerO.value === "" ? "Doe" : inputPlayerO.value;

    GamePlay.start(xPlayer, oPlayer);

    //set marks flags
    _xMark = GamePlay.getXPlayer().getMark();
    _oMark = GamePlay.getOPlayer().getMark();

    // set the turn
    turn = _xMark;

    // hide starting page
    startPage.classList.toggle("hidden");
    // display game play area page
    gamePlayArea.classList.toggle("hidden");

    // set players names
    displayXPlayer.textContent = GamePlay.getXPlayer().getName();
    displayOPlayer.textContent = GamePlay.getOPlayer().getName();

    // set the board starting mark
    board.classList.add(turn);

    // set click events for all the cells
    cells.forEach((cell) => {
      cell.addEventListener("click", addMark);
    });
  }

  function addMark(e) {
    // check if the cell already selected

    if (
      !(
        e.target.classList.contains(_xMark) ||
        e.target.classList.contains(_oMark)
      )
    ) {
      // extract the position value
      const cellPosition = e.target.attributes["data-pos"].value;

      // run add mark function from game play
      GamePlay.addMark(turn, cellPosition);

      // render the game board
      render();

      // check win
      const winner = GamePlay.checkWin(turn);

      // show final result
      if (winner.winStatus) finalResult(`${winner.player.getName()} Wins!`);
      else if (GamePlay.isFull()) finalResult("Draw!");

      // change the turn
      if (turn === _xMark) turn = _oMark;
      else turn = _xMark;

      // change the board mark
      board.className = "board";
      board.classList.add(turn);
    }
  }

  // render the game board
  function render() {
    const gameBoard = GamePlay.getGameBoard();

    for (let i = 0; i < gameBoard.length; i++) {
      cells.forEach((cell) => {
        if (i == cell.attributes["data-pos"].value) {
          if (!(gameBoard[i] === undefined)) {
            cell.classList.add(gameBoard[i]);
          }
        }
      });
    }
  }

  // render final result page
  function finalResult(resultMassage) {
    gamePlayArea.classList.toggle("hidden");
    resultPage.classList.toggle("hidden");

    message.textContent = resultMassage;

    restart.addEventListener("click", reset);
  }

  // restart the game
  function reset() {
    // Hide result page
    resultPage.classList.toggle("hidden");

    // Display start page
    startPage.classList.toggle("hidden");

    // Reset Game Play
    GamePlay.restart();

    // reset game board ui
    board.className = "board";

    // reset cells ui
    cells.forEach((cell) => {
      cell.className = "cell";
    });
  }
})();
