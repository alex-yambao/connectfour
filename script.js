//state
const STATE = {
  gameBoard: createGameBoard(7, 7),
  currentPlayer: null,
  playerOne: null,
  playerTwo: null,
};
const gameState = STATE.gameBoard;
const gameBoard = $(".board");

createGameBoard(7, 7);
function createGameBoard(rows, columns) {
  const gameBoard = [];
  for (let i = 0; i < rows; i++) {
    gameBoard.push([]);
    for (let j = 0; j < columns; j++) {
      gameBoard[i].push(`${i}.${j}`);
    }
  }
  return gameBoard;
}

//render
function renderBoard() {
  gameState.forEach((index, value) =>
    $(".board").append(`<div class="column" data-col="${value}">`)
  );
  gameState.forEach((index, value) =>
    $(".column").append(`<div class="cell empty" data-cell="${value}">`)
  );
}

function renderPlayerDisplay() {
  if (STATE.currentPlayer !== null) {
    switchPlayer();
    $("#status").css("display", "flex");
    $(".turn").text(`TURN: ${STATE.currentPlayer}`);
    $(".currentPlayers").text("CURRENT PLAYERS");
    $(".player-one").text(`${STATE.playerOne.name} / ${STATE.playerOne.color}`);
    $(".player-two").text(`${STATE.playerTwo.name} / ${STATE.playerTwo.color}`);
  }
}

//user interactions
$(".submit-info").on("click", function (e) {
  e.preventDefault();
  STATE.playerOne =
    $("#player-red").val() === "Enter Name Here" || null
      ? { name: "Player Red", color: "red" }
      : { name: $("#player-red").val(), color: "red" };
  if ($(".computerswitch").is(":checked") === true) {
    STATE.playerTwo = { name: "Computer", color: "yellow" };
    setInterval(computerMode, 10000);
  } else {
    STATE.playerTwo =
      $("#player-yellow").val() === "Enter Name Here" || null
        ? { name: "Player Yellow", color: "yellow" }
        : { name: $("#player-yellow").val(), color: "yellow" };
  }
  switchPlayer();
  $("#info-form").css("display", "none");
  render();
});


$("#player-red").focus((e) => $(e.target).val(" "));

$("#player-yellow").focus((e) => $(e.target).val(" "));

$(".switch").on("input", "input", function (e) {
  $(e.target).is(":checked") === true
    ? (STATE.currentPlayer = "red")
    : (STATE.currentPlayer = "yellow");
  $(".currentPlayer").text(`Current Player is : ${STATE.currentPlayer}`);
  $(".info").css("background", STATE.currentPlayer);
});

gameBoard.on("mouseenter", ".column", function (e) {
  const col = $(e.target).data("col");
  const lastEmpty = isFilled(col);
  $(lastEmpty).addClass("highlight");
});

gameBoard.on("mouseleave", ".column", function (e) {
  const col = $(e.target).data("col");
  const lastEmpty = isFilled(col);
  $(lastEmpty).removeClass("highlight");
});

function isFilled(col) {
  const cells = $(`.column[data-col="${col}"] > .empty`);
  for (let i = cells.length - 1; i >= 0; i--) {
    const lastCell = $(cells[i]);
    if (lastCell.hasClass("empty")) {
      return lastCell;
    }
  }
  return null;
}

gameBoard.on("click", ".column", function (e) {
  const column = $(this).data("col");
  const fillTarget = $(`.column > .highlight`);
  const cell = fillTarget.data("cell");
  fillTarget
    .addClass(`cell-${STATE.currentPlayer}`)
    .removeClass("empty highlight");
  gameState[column][cell] = STATE.currentPlayer;
  checkWinner(STATE.currentPlayer, cell, column);
  switchPlayer();
});

function switchPlayer() {
  STATE.currentPlayer = STATE.currentPlayer === "red" ? "yellow" : "red";
  $(".switch").trigger("click");
  $(".turn").text(`${STATE.currentPlayer}'s turn`);
}

$(".reset").on("click", function () {
  location.reload();
});

//COMPUTER OPPONENT
function findsCell(col) {
  const cells = $(`.column[data-col="${col}"] > .empty`);
  for (let i = cells.length - 1; i >= 0; i--) {
    let lastCell = $(cells[i]);
    if (lastCell.hasClass("empty")) {
      return lastCell;
    } else {
      return null;
    }
  }
}

function makeMove() {
  const col = Math.floor(Math.random() * (6 - 0) + 0);
  const cell = findsCell(col);
  const cellData = cell.data("cell");
  $(cell)
    .addClass(`cell-${STATE.currentPlayer}`)
    .removeClass("empty highlight");
  gameState[col][cellData] = STATE.currentPlayer;
  checkWinner(STATE.currentPlayer, cellData, col);
  switchPlayer();
}

function computerMode() {
  if (STATE.currentPlayer === "yellow") {
    makeMove();
  } 
  else null;
}


//WIN CONDITIONS CHECK
function checkSlices(arr, player) {
  let count = 0;
  arr.forEach(function (value) {
    if (value === player) {
      count++;
    } else {
      return null;
    }
    checksCount(count);
  });
}

function checksCount(count) {
  if (count === 4) {
    return alert(`${STATE.currentPlayer} Wins`);
  } else {
    return null;
  }
}

function checkSouth(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const start = cell;
  const downOne = start + 1;
  const downTwo = start + 2;
  const downThree = start + 3;
  const downFour = start + 4;
  const one = gameState[colStart].slice(downOne, downTwo);
  const two = gameState[colStart].slice(downTwo, downThree);
  const three = gameState[colStart].slice(downThree, downFour);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkSouthWest(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const downTwo = rowStart + 2;
  const downOne = rowStart + 1;
  const downThree = rowStart + 3;
  const downFour = rowStart + 4;
  const leftOne = colStart - 1;
  const leftTwo = colStart - 2;
  const leftThree = colStart - 3;
  const one =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(downOne, downTwo);
  const two =
    gameState[leftTwo] === undefined
      ? null
      : gameState[leftTwo].slice(downTwo, downThree);
  const three =
    gameState[leftThree] === undefined
      ? null
      : gameState[leftThree].slice(downThree, downFour);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkSouthWestPlusOneNE(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const downTwo = rowStart + 2;
  const downOne = rowStart + 1;
  const downThree = rowStart + 3;
  const leftOne = colStart - 1;
  const leftTwo = colStart - 2;
  const rightOne = colStart + 1;
  const upOne = rowStart - 1;
  const one =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(downOne, downTwo);
  const two =
    gameState[leftTwo] === undefined
      ? null
      : gameState[leftTwo].slice(downTwo, downThree);
  const three =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(upOne, rowStart);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkSouthEast(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const downOne = rowStart + 1;
  const downTwo = rowStart + 2;
  const downThree = rowStart + 3;
  const downFour = rowStart + 4;
  const rightOne = colStart + 1;
  const rightTwo = colStart + 2;
  const rightThree = colStart + 3;
  const one =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(downOne, downTwo);
  const two =
    gameState[rightTwo] === undefined
      ? null
      : gameState[rightTwo].slice(downTwo, downThree);
  const three =
    gameState[rightThree] === undefined
      ? null
      : gameState[rightThree].slice(downThree, downFour);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkSouthEastPlusOneNW(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const downOne = rowStart + 1;
  const downTwo = rowStart + 2;
  const downThree = rowStart + 3;
  const rightOne = colStart + 1;
  const rightTwo = colStart + 2;
  const leftOne = colStart - 1;
  const upOne = colStart - 1;
  const one =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(downOne, downTwo);
  const two =
    gameState[rightTwo] === undefined
      ? null
      : gameState[rightTwo].slice(downTwo, downThree);
  const three =
    gameState[upOne] === undefined
      ? null
      : gameState[upOne].slice(upOne, rowStart);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkEast(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const rightOne = colStart + 1;
  const rightTwo = colStart + 2;
  const rightThree = colStart + 3;
  const rowPlusOne = cell + 1;
  const one =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(rowStart, rowPlusOne);
  const two =
    gameState[rightTwo] === undefined
      ? null
      : gameState[rightTwo].slice(rowStart, rowPlusOne);
  const three =
    gameState[rightThree] === undefined
      ? null
      : gameState[rightThree].slice(rowStart, rowPlusOne);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkEastPlusOneWest(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const rightOne = colStart + 1;
  const rightTwo = colStart + 2;
  const rowPlusOne = cell + 1;
  const leftOne = colStart - 1;
  const one =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(rowStart, rowPlusOne);
  const two =
    gameState[rightTwo] === undefined
      ? null
      : gameState[rightTwo].slice(rowStart, rowPlusOne);
  const three =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(rowStart, rowPlusOne);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkWest(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const leftOne = colStart - 1;
  const leftTwo = colStart - 2;
  const leftThree = colStart - 3;
  const rowPlusOne = cell + 1;
  const one =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(rowStart, rowPlusOne);
  const two =
    gameState[leftTwo] === undefined
      ? null
      : gameState[leftTwo].slice(rowStart, rowPlusOne);
  const three =
    gameState[leftThree] === undefined
      ? null
      : gameState[leftThree].slice(rowStart, rowPlusOne);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkWestPlusOneEast(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const leftOne = colStart - 1;
  const leftTwo = colStart - 2;
  const rowPlusOne = cell + 1;
  const rightOne = colStart + 1;
  const one =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(rowStart, rowPlusOne);
  const two =
    gameState[leftTwo] === undefined
      ? null
      : gameState[leftTwo].slice(rowStart, rowPlusOne);
  const three =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(rowStart, rowPlusOne);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkNorthWest(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const upOne = rowStart - 1;
  const upTwo = rowStart - 2;
  const upThree = rowStart - 3;
  const upFour = rowStart - 4;
  const leftOne = colStart - 1;
  const leftTwo = colStart - 2;
  const leftThree = colStart - 3;
  const one =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(upOne, rowStart);
  const two =
    gameState[leftTwo] === undefined
      ? null
      : gameState[leftTwo].slice(upTwo, upOne);
  const three =
    gameState[leftThree] === undefined
      ? null
      : gameState[leftThree].slice(upThree, upTwo);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkNorthWestPlusOneSE(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const upOne = rowStart - 1;
  const upTwo = rowStart - 2;
  const upFour = rowStart - 4;
  const leftOne = colStart - 1;
  const leftTwo = colStart - 2;
  const downOne = rowStart + 1;
  const downTwo = rowStart + 2;
  const rightOne = colStart + 1;
  const one =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(upOne, rowStart);
  const two =
    gameState[leftTwo] === undefined
      ? null
      : gameState[leftTwo].slice(upTwo, upOne);
  const three =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(downOne, downTwo);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkNorthEast(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const upOne = rowStart - 1;
  const upTwo = rowStart - 2;
  const upThree = rowStart - 3;
  const upFour = rowStart - 4;
  const rightOne = colStart + 1;
  const rightTwo = colStart + 2;
  const rightThree = colStart + 3;
  const one =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(upOne, rowStart);
  const two =
    gameState[rightTwo] === undefined
      ? null
      : gameState[rightTwo].slice(upTwo, upOne);
  const three =
    gameState[rightThree] === undefined
      ? null
      : gameState[rightThree].slice(upThree, upTwo);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkNorthEastPlusOneSW(player, cell, column) {
  const colStart = column;
  const holdsVal = [player];
  const rowStart = cell;
  const upOne = rowStart - 1;
  const upTwo = rowStart - 2;
  const upFour = rowStart - 4;
  const rightOne = colStart + 1;
  const rightTwo = colStart + 2;
  const leftOne = colStart - 1;
  const downOne = rowStart + 1;
  const downTwo = rowStart + 2;
  const one =
    gameState[rightOne] === undefined
      ? null
      : gameState[rightOne].slice(upOne, rowStart);
  const two =
    gameState[rightTwo] === undefined
      ? null
      : gameState[rightTwo].slice(upTwo, upOne);
  const three =
    gameState[leftOne] === undefined
      ? null
      : gameState[leftOne].slice(downOne, downTwo);
  const finalVal = holdsVal.concat(one, two, three);
  checkSlices(finalVal, player);
}

function checkWinner(player, cell, column) {
  checkSouth(player, cell, column);
  checkWest(player, cell, column);
  checkEast(player, cell, column);
  checkNorthEast(player, cell, column);
  checkNorthEastPlusOneSW(player, cell, column);
  checkNorthWest(player, cell, column);
  checkNorthWestPlusOneSE(player, cell, column);
  checkSouthEast(player, cell, column);
  checkSouthWest(player, cell, column);
  checkWestPlusOneEast(player, cell, column);
  checkEastPlusOneWest(player, cell, column);
  checkSouthEastPlusOneNW(player, cell, column);
  checkSouthWestPlusOneNE(player, cell, column);
}

function render() {
  renderBoard();
  renderPlayerDisplay();
}
