
let currentPlayer = 'X';
let board = [];
let isGameOver = false;
let moveCount = 0;
let boardSize = 3;

// Elements
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const sizeInputEl = document.getElementById('board-size');
const applySizeBtn = document.getElementById('apply-size');
const newGameBtn = document.getElementById('new-game');
const resetBtn = document.getElementById('reset');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');
const historyListEl = document.getElementById('history-list');

// Scores and history
let scores = { X: 0, O: 0, D: 0 };
let historyItems = [];

// Storage keys
const STORAGE_KEYS = {
  size: 'ttt_size_v1',
  scores: 'ttt_scores_v1',
  history: 'ttt_history_v1'
};

// ========== Storage Helpers ==========
function saveSize(value) {
  try {
    localStorage.setItem(STORAGE_KEYS.size, String(value));
  } catch (e) {}
}

function loadSize() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.size);
    const n = Number(raw);
    if (!Number.isNaN(n) && n >= 3 && n <= 10) {
      boardSize = n;
    }
  } catch (e) {}
}

function saveScores() {
  try {
    localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(scores));
  } catch (e) {}
}

function loadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.scores);
    if (raw) {
      const data = JSON.parse(raw);
      scores.X = Number(data.X) || 0;
      scores.O = Number(data.O) || 0;
      scores.D = Number(data.D) || 0;
    }
  } catch (e) {}
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyItems));
  } catch (e) {}
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        historyItems = arr;
      }
    }
  } catch (e) {}
}

// ========== UI Helpers ==========
function updateStatus(text) {
  if (text) {
    statusEl.textContent = text;
  } else {
    statusEl.textContent = "Player " + currentPlayer + "'s turn";
  }
}

function updateScoresUI() {
  scoreXEl.textContent = String(scores.X);
  scoreOEl.textContent = String(scores.O);
  scoreDrawEl.textContent = String(scores.D);
}

function addHistory(text) {
  const entry = new Date().toLocaleTimeString() + ' - ' + text;
  historyItems.push(entry);
  saveHistory();

  const li = document.createElement('li');
  li.textContent = entry;
  historyListEl.prepend(li);
}

function renderHistory() {
  historyListEl.innerHTML = '';
  // Show newest first
  for (let i = historyItems.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.textContent = historyItems[i];
    historyListEl.appendChild(li);
  }
}

// ========== Game Setup & Rendering ==========
function makeEmptyBoard(size) {
  board = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push('-');
    }
    board.push(row);
  }
}

function renderBoard(size) {
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = 'repeat(' + size + ', minmax(36px, 1fr))';
  boardEl.style.gridTemplateRows = 'repeat(' + size + ', minmax(36px, 1fr))';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', 'Row ' + (r + 1) + ' Column ' + (c + 1));
      btn.dataset.row = String(r);
      btn.dataset.col = String(c);
      btn.textContent = board[r][c] === '-' ? '' : board[r][c];
      btn.addEventListener('click', onCellClick);
      boardEl.appendChild(btn);
    }
  }
}

function startNewGame(size) {
  boardSize = size;
  saveSize(boardSize);
  currentPlayer = 'X';
  isGameOver = false;
  moveCount = 0;
  makeEmptyBoard(boardSize);
  renderBoard(boardSize);
  updateStatus();
}

// ========== Game Logic ==========
function onCellClick(e) {
  if (isGameOver) return;
  const cell = e.currentTarget;
  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);

  if (board[r][c] !== '-') return;

  board[r][c] = currentPlayer;
  cell.textContent = currentPlayer;
  moveCount++;

  if (checkWin(r, c)) {
    isGameOver = true;
    scores[currentPlayer] = (scores[currentPlayer] || 0) + 1;
    saveScores();
    updateScoresUI();
    addHistory('Winner is ' + currentPlayer);
    updateStatus('Winner is ' + currentPlayer);
    return;
  }

  if (moveCount === boardSize * boardSize) {
    isGameOver = true;
    scores.D = (scores.D || 0) + 1;
    saveScores();
    updateScoresUI();
    addHistory('Draw');
    updateStatus('It is a draw');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
}

function checkWin(r, c) {
  // Check row r
  let allSame = true;
  for (let i = 0; i < boardSize; i++) {
    if (board[r][i] !== currentPlayer) {
      allSame = false;
      break;
    }
  }
  if (allSame) return true;

  // Check column c
  allSame = true;
  for (let i = 0; i < boardSize; i++) {
    if (board[i][c] !== currentPlayer) {
      allSame = false;
      break;
    }
  }
  if (allSame) return true;

  // Check main diagonal
  if (r === c) {
    allSame = true;
    for (let i = 0; i < boardSize; i++) {
      if (board[i][i] !== currentPlayer) {
        allSame = false;
        break;
      }
    }
    if (allSame) return true;
  }

  // Check anti-diagonal
  if (r + c === boardSize - 1) {
    allSame = true;
    for (let i = 0; i < boardSize; i++) {
      if (board[i][boardSize - 1 - i] !== currentPlayer) {
        allSame = false;
        break;
      }
    }
    if (allSame) return true;
  }

  return false;
}

// ========== Controls ==========
function onApplySize() {
  let s = Number(sizeInputEl.value);
  if (Number.isNaN(s)) s = 3;
  if (s < 3) s = 3;
  if (s > 10) s = 10;
  sizeInputEl.value = String(s);
  addHistory('Applied size: ' + s + 'x' + s);
  startNewGame(s);
}

function onNewGame() {
  addHistory('New game started');
  startNewGame(boardSize);
}

function onReset() {
  scores = { X: 0, O: 0, D: 0 };
  saveScores();
  updateScoresUI();
  addHistory('History cleared');
  historyItems = [];
  saveHistory();
  renderHistory();
}

// ========== Init ==========
function init() {
  loadSize();
  loadScores();
  loadHistory();

  sizeInputEl.value = String(boardSize);
  updateScoresUI();
  renderHistory();
  startNewGame(boardSize);

  applySizeBtn.addEventListener('click', onApplySize);
  newGameBtn.addEventListener('click', onNewGame);
  resetBtn.addEventListener('click', onReset);
}

init();
