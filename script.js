let currentPlayer = "X";
let gameOver = false;
let moveIndex = 1;
let boardSize = 3;
let board = [];
let score = { X: 0, O: 0 };

const boardContainer = document.querySelector(".board");
const resetBtn = document.querySelector(".reset");
const scoreboard = document.querySelector(".scoreboard");
const historyList = document.querySelector(".history ul");
const startBtn = document.getElementById("startBtn");
const sizeInput = document.getElementById("size");

// --- LocalStorage Functions ---
function loadScore() {
  const savedScore = localStorage.getItem("ticTacToeScore");
  if (savedScore) {
    score = JSON.parse(savedScore);
  } else {
    score = { X: 0, O: 0 };
  }
  updateScoreboard();
}

function saveScore() {
  localStorage.setItem("ticTacToeScore", JSON.stringify(score));
}

// --- Create board HTML dynamically ---
function createBoardHTML() {
  boardContainer.innerHTML = "";
  boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;
  boardContainer.style.gridTemplateRows = `repeat(${boardSize}, 80px)`;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      boardContainer.appendChild(cell);
    }
  }

  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.addEventListener("click", handleClick));
}

// --- Initialize board array ---
function initializeBoard() {
  board = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push("-");
    }
    board.push(row);
  }

  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });

  gameOver = false;
  currentPlayer = "X";
  moveIndex = 1;
}

// --- Handle cell click ---
function handleClick(e) {
  if (gameOver) return;

  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (board[row][col] !== "-") return;

  board[row][col] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner(row, col)) {
    gameOver = true;
    score[currentPlayer]++;
    updateScoreboard();
    addToHistory(`${currentPlayer} wins`);
    saveScore();
    return;
  }

  if (moveIndex === boardSize * boardSize) {
    gameOver = true;
    addToHistory("Draw");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  moveIndex++;
}

// --- Check winner using Set logic ---
function checkWinner(row, col) {
  let rowValues = new Set();
  let columnValues = new Set();
  let diagonal1Values = new Set();
  let diagonal2Values = new Set();

  for (let i = 0; i < boardSize; i++) {
    rowValues.add(board[row][i]);
    columnValues.add(board[i][col]);
    diagonal1Values.add(board[i][i]);
    diagonal2Values.add(board[i][boardSize - 1 - i]);
  }

  if ((rowValues.size === 1 && !rowValues.has("-")) ||
      (columnValues.size === 1 && !columnValues.has("-")) ||
      (diagonal1Values.size === 1 && !diagonal1Values.has("-")) ||
      (diagonal2Values.size === 1 && !diagonal2Values.has("-"))) {
    return true;
  }

  return false;
}

// --- Update scoreboard ---
function updateScoreboard() {
  scoreboard.innerHTML = `
    <div>Player 1 (X): ${score.X}</div>
    <div>Player 2 (O): ${score.O}</div>
  `;
}

// --- Add to history ---
function addToHistory(result) {
  const li = document.createElement("li");
  li.textContent = result;
  historyList.appendChild(li);
}

// --- Reset button ---
resetBtn.addEventListener("click", () => {
  initializeBoard();
});

// --- Start button (change size) ---
startBtn.addEventListener("click", () => {
  let size = parseInt(sizeInput.value);
  if (isNaN(size) || size < 3) size = 3;
  boardSize = size;
  createBoardHTML();
  initializeBoard();
  loadScore();
});

// --- Default init 3x3 on page load ---
window.addEventListener("DOMContentLoaded", () => {
  sizeInput.value = 3;
  createBoardHTML();
  initializeBoard();
  loadScore();
});
