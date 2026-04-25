/* =========================================================
   Minesweeper — The Oragon Gazette
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────── */
  const DIFFICULTIES = {
    easy:   { rows: 9,  cols: 9,  mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard:   { rows: 16, cols: 30, mines: 99 },
  };

  /* ── State ──────────────────────────────────────────── */
  let rows, cols, totalMines;
  let grid       = [];   // flat array of cell objects
  let gameOver   = false;
  let gameWon    = false;
  let firstClick = true;
  let flagMode   = false;
  let timerInterval = null;
  let startTime     = null;
  let elapsedSecs   = 0;
  let flagCount     = 0;

  /* ── DOM refs ───────────────────────────────────────── */
  const boardEl      = document.getElementById('ms-board');
  const mineCountEl  = document.getElementById('ms-mines');
  const timerEl      = document.getElementById('ms-timer');
  const statusEl     = document.getElementById('ms-status');
  const diffSelect   = document.getElementById('ms-difficulty');
  const newBtn       = document.getElementById('ms-new');
  const flagBtn      = document.getElementById('ms-flagmode');
  const dateEl       = document.getElementById('ms-date');

  /* ── Date ───────────────────────────────────────────── */
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  /* ── Helpers ────────────────────────────────────────── */
  function idx(r, c) { return r * cols + c; }

  function neighbors(r, c) {
    const result = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          result.push(idx(nr, nc));
        }
      }
    }
    return result;
  }

  function padTime(n) { return n < 10 ? '0' + n : '' + n; }

  /* ── Timer ──────────────────────────────────────────── */
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function () {
      elapsedSecs = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(elapsedSecs / 60);
      const s = elapsedSecs % 60;
      timerEl.textContent = m + ':' + padTime(s);
    }, 500);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  /* ── Mine placement (safe first click) ─────────────── */
  function placeMines(safeIdx) {
    const forbidden = new Set([safeIdx, ...neighbors(
      Math.floor(safeIdx / cols), safeIdx % cols
    )]);

    let placed = 0;
    while (placed < totalMines) {
      const r = Math.random() * rows | 0;
      const c = Math.random() * cols | 0;
      const i = idx(r, c);
      if (!grid[i].mine && !forbidden.has(i)) {
        grid[i].mine = true;
        placed++;
      }
    }

    // Compute neighbor counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[idx(r, c)].mine) continue;
        grid[idx(r, c)].count = neighbors(r, c).filter(function (i) {
          return grid[i].mine;
        }).length;
      }
    }
  }

  /* ── Build empty grid ───────────────────────────────── */
  function buildGrid() {
    grid = [];
    for (let i = 0; i < rows * cols; i++) {
      grid.push({ mine: false, revealed: false, flagged: false, count: 0 });
    }
  }

  /* ── Render all cells ───────────────────────────────── */
  function render() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[idx(r, c)];
        const btn  = document.createElement('button');
        btn.className = 'ms-cell';
        btn.setAttribute('role', 'gridcell');
        btn.setAttribute('aria-label', 'Row ' + (r + 1) + ' Col ' + (c + 1));
        btn.dataset.r = r;
        btn.dataset.c = c;

        if (cell.revealed) {
          btn.classList.add('ms-cell--revealed');
          if (cell.mine) {
            btn.classList.add('ms-cell--exploded');
            btn.textContent = '💣';
          } else if (cell.count > 0) {
            btn.dataset.n = cell.count;
            btn.textContent = cell.count;
          }
        } else if (cell.flagged) {
          btn.classList.add('ms-cell--flagged');
          btn.textContent = '🚩';
        } else {
          btn.classList.add('ms-cell--hidden');
        }

        btn.addEventListener('click', handleClick);
        btn.addEventListener('contextmenu', handleRightClick);

        boardEl.appendChild(btn);
      }
    }
  }

  /* ── Flood-fill reveal ──────────────────────────────── */
  function floodReveal(startR, startC) {
    const queue = [idx(startR, startC)];
    const visited = new Set(queue);

    while (queue.length) {
      const i = queue.shift();
      const cell = grid[i];
      if (cell.flagged || cell.revealed) continue;
      cell.revealed = true;

      if (cell.count === 0 && !cell.mine) {
        const r = Math.floor(i / cols), c = i % cols;
        neighbors(r, c).forEach(function (ni) {
          if (!visited.has(ni) && !grid[ni].flagged && !grid[ni].revealed) {
            visited.add(ni);
            queue.push(ni);
          }
        });
      }
    }
  }

  /* ── Win check ──────────────────────────────────────── */
  function checkWin() {
    const unrevealed = grid.filter(function (c) { return !c.revealed; }).length;
    return unrevealed === totalMines;
  }

  /* ── Lose: show all mines ───────────────────────────── */
  function revealAll(triggerIdx) {
    grid.forEach(function (cell, i) {
      if (cell.mine && !cell.flagged) cell.revealed = true;
      if (cell.flagged && !cell.mine) cell.wrongFlag = true;
    });
    grid[triggerIdx].exploded = true;
  }

  /* ── Update mine counter display ────────────────────── */
  function updateMineCount() {
    mineCountEl.textContent = Math.max(0, totalMines - flagCount);
  }

  /* ── Click handler ──────────────────────────────────── */
  function handleClick(e) {
    if (gameOver || gameWon) return;
    const r = +e.currentTarget.dataset.r;
    const c = +e.currentTarget.dataset.c;
    const i = idx(r, c);
    const cell = grid[i];

    if (flagMode) {
      toggleFlag(r, c, i, cell);
      return;
    }

    if (cell.flagged || cell.revealed) {
      // Chord: revealed number + matching flags → clear safe neighbors
      if (cell.revealed && cell.count > 0) {
        const ns = neighbors(r, c);
        const flaggedNeighbors = ns.filter(function (ni) { return grid[ni].flagged; }).length;
        if (flaggedNeighbors === cell.count) {
          ns.forEach(function (ni) {
            if (!grid[ni].flagged && !grid[ni].revealed) {
              chordReveal(Math.floor(ni / cols), ni % cols, ni);
            }
          });
        }
      }
      return;
    }

    if (firstClick) {
      firstClick = false;
      placeMines(i);
      startTimer();
    }

    if (cell.mine) {
      cell.revealed = true;
      cell.exploded = true;
      revealAll(i);
      gameOver = true;
      stopTimer();
      renderPost('lose');
      return;
    }

    floodReveal(r, c);

    if (checkWin()) {
      gameWon = true;
      stopTimer();
      // Flag remaining mines
      grid.forEach(function (cl) { if (cl.mine) cl.flagged = true; });
      flagCount = totalMines;
      updateMineCount();
      renderPost('win');
      return;
    }

    render();
  }

  function chordReveal(r, c, i) {
    const cell = grid[i];
    if (cell.mine) {
      cell.revealed = true;
      cell.exploded = true;
      revealAll(i);
      gameOver = true;
      stopTimer();
      renderPost('lose');
      return true;
    }
    floodReveal(r, c);
    return false;
  }

  /* ── Right-click / flag ─────────────────────────────── */
  function handleRightClick(e) {
    e.preventDefault();
    if (gameOver || gameWon) return;
    const r = +e.currentTarget.dataset.r;
    const c = +e.currentTarget.dataset.c;
    const i = idx(r, c);
    toggleFlag(r, c, i, grid[i]);
  }

  function toggleFlag(r, c, i, cell) {
    if (cell.revealed) return;
    if (firstClick) return; // don't flag before game starts
    cell.flagged = !cell.flagged;
    flagCount += cell.flagged ? 1 : -1;
    updateMineCount();
    render();
  }

  /* ── Render win/lose state ──────────────────────────── */
  function renderPost(result) {
    // Re-render with full state visible
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[idx(r, c)];
        const btn  = document.createElement('button');
        btn.className = 'ms-cell';
        btn.setAttribute('role', 'gridcell');
        btn.dataset.r = r;
        btn.dataset.c = c;
        btn.disabled = true;

        if (cell.exploded) {
          btn.classList.add('ms-cell--exploded');
          btn.textContent = '💣';
        } else if (cell.revealed && cell.mine) {
          btn.classList.add('ms-cell--mine-shown');
          btn.textContent = '💣';
        } else if (cell.wrongFlag) {
          btn.classList.add('ms-cell--wrong-flag');
          btn.textContent = '❌';
        } else if (cell.flagged) {
          btn.classList.add('ms-cell--flagged');
          btn.textContent = '🚩';
        } else if (cell.revealed) {
          btn.classList.add('ms-cell--revealed');
          if (cell.count > 0) {
            btn.dataset.n = cell.count;
            btn.textContent = cell.count;
          }
        } else {
          btn.classList.add('ms-cell--hidden');
        }

        boardEl.appendChild(btn);
      }
    }

    if (result === 'win') {
      statusEl.className = 'ms-status ms-status--win';
      const m = Math.floor(elapsedSecs / 60);
      const s = elapsedSecs % 60;
      statusEl.textContent =
        '✦ Field cleared! All ' + totalMines + ' mines located in ' +
        m + ':' + padTime(s) + '. — EXTRA! EXTRA! ✦';
    } else {
      statusEl.className = 'ms-status ms-status--lose';
      statusEl.textContent = '☠ The mine has spoken. Better luck next edition.';
    }
  }

  /* ── New game ───────────────────────────────────────── */
  function newGame() {
    stopTimer();
    const cfg = DIFFICULTIES[diffSelect.value] || DIFFICULTIES.medium;
    rows       = cfg.rows;
    cols       = cfg.cols;
    totalMines = cfg.mines;
    flagCount  = 0;
    gameOver   = false;
    gameWon    = false;
    firstClick = true;
    elapsedSecs = 0;
    timerEl.textContent = '0:00';
    statusEl.textContent = '';
    statusEl.className = 'ms-status';

    buildGrid();
    updateMineCount();
    render();
  }

  /* ── Flag mode toggle ───────────────────────────────── */
  flagBtn.addEventListener('click', function () {
    flagMode = !flagMode;
    flagBtn.setAttribute('aria-pressed', flagMode ? 'true' : 'false');
  });

  /* ── Keyboard shortcut: F = flag mode ──────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'f' || e.key === 'F') {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      flagMode = !flagMode;
      flagBtn.setAttribute('aria-pressed', flagMode ? 'true' : 'false');
    }
    if (e.key === 'n' || e.key === 'N') {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      newGame();
    }
  });

  /* ── Wiring ─────────────────────────────────────────── */
  newBtn.addEventListener('click', newGame);
  diffSelect.addEventListener('change', newGame);

  /* ── Boot ───────────────────────────────────────────── */
  newGame();

}());
