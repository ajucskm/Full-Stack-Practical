const boardEl = document.getElementById('board');
const statusText = document.getElementById('status-text');
const diceDisplay = document.getElementById('dice-display');
const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-btn');

// Snakes (head -> tail) & Ladders (bottom -> top)
const snakes = {
  99: 54,
  95: 75,
  92: 88,
  89: 68,
  74: 53,
  64: 60,
  62: 19,
  49: 11,
  46: 25,
  16: 6
};

const ladders = {
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  78: 98,
  87: 94
};

let positions = Array.of(1, 1);
let currentPlayer = 0; // 0 = Player 1, 1 = Player 2
let gameOver = false;

// Build 10x10 Zig-Zag Board (100 down to 1)
function createBoard() {
  boardEl.innerHTML = '';

  for (let row = 9; row >= 0; row--) {
    const isLeftToRight = row % 2 === 0;
    for (let col = 0; col < 10; col++) {
      const actualCol = isLeftToRight ? col : 9 - col;
      const cellNumber = row * 10 + actualCol + 1;

      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `cell-${cellNumber}`;

      if (snakes[cellNumber]) cell.classList.add('snake-head');
      if (ladders[cellNumber]) cell.classList.add('ladder-base');

      const numSpan = document.createElement('span');
      numSpan.textContent = cellNumber;

      const tokenContainer = document.createElement('div');
      tokenContainer.className = 'tokens';
      tokenContainer.id = `tokens-${cellNumber}`;

      cell.appendChild(numSpan);
      cell.appendChild(tokenContainer);
      boardEl.appendChild(cell);
    }
  }
}

// Get exact pixel center of any cell (1-100) relative to the board
function getCellPixelCenter(num, width, height) {
  const index = num - 1;
  const rowFromBottom = Math.floor(index / 10);
  const colInRow = index % 10;
  const actualCol = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow;
  const rowFromTop = 9 - rowFromBottom;

  const cellW = width / 10;
  const cellH = height / 10;

  return {
    x: actualCol * cellW + cellW / 2,
    y: rowFromTop * cellH + cellH / 2
  };
}

// Draw Snakes and Ladders on an HTML5 Canvas
function drawSnakesAndLadders() {
  const wrapper = document.querySelector('.board-wrapper');
  if (!wrapper) return;

  // Remove old overlay/canvas if present
  const oldOverlay = document.getElementById('overlay');
  if (oldOverlay) oldOverlay.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'overlay';
  const size = wrapper.clientWidth || 480;
  canvas.width = size;
  canvas.height = size;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';

  wrapper.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // 1. Draw Ladders (Green double rails + rungs)
  for (const [start, end] of Object.entries(ladders)) {
    const p1 = getCellPixelCenter(Number(start), size, size);
    const p2 = getCellPixelCenter(Number(end), size, size);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * 7;
    const ny = (dx / len) * 7;

    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Left rail
    ctx.beginPath();
    ctx.moveTo(p1.x + nx, p1.y + ny);
    ctx.lineTo(p2.x + nx, p2.y + ny);
    ctx.stroke();

    // Right rail
    ctx.beginPath();
    ctx.moveTo(p1.x - nx, p1.y - ny);
    ctx.lineTo(p2.x - nx, p2.y - ny);
    ctx.stroke();

    // Rungs
    ctx.lineWidth = 3;
    const steps = Math.max(3, Math.floor(len / 18));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const rx = p1.x + dx * t;
      const ry = p1.y + dy * t;
      ctx.beginPath();
      ctx.moveTo(rx + nx, ry + ny);
      ctx.lineTo(rx - nx, ry - ny);
      ctx.stroke();
    }
  }

  // 2. Draw Curved Snakes (Red S-curves with head & eyes)
  for (const [head, tail] of Object.entries(snakes)) {
    const p1 = getCellPixelCenter(Number(head), size, size);
    const p2 = getCellPixelCenter(Number(tail), size, size);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * 24;
    const ny = (dx / len) * 24;

    const cx1 = p1.x + dx * 0.33 + nx;
    const cy1 = p1.y + dy * 0.33 + ny;
    const cx2 = p1.x + dx * 0.66 - nx;
    const cy2 = p1.y + dy * 0.66 - ny;

    // Snake Body
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.85)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, p2.x, p2.y);
    ctx.stroke();

    // Snake Head
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Snake Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p1.x - 3, p1.y - 2, 2.2, 0, Math.PI * 2);
    ctx.arc(p1.x + 3, p1.y - 2, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Render player tokens on their current squares
function renderPlayers() {
  document.querySelectorAll('.tokens').forEach(el => (el.innerHTML = ''));

  positions.forEach((pos, idx) => {
    const container = document.getElementById(`tokens-${pos}`);
    if (container) {
      const token = document.createElement('div');
      token.className = `token p${idx + 1}-token`;
      token.title = `Player ${idx + 1}`;
      container.appendChild(token);
    }
  });
}

// Roll Dice & Move Logic
function rollDice() {
  if (gameOver) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  const diceFaces = Array.of('⚀', '⚁', '⚂', '⚃', '⚄', '⚅');
  diceDisplay.textContent = diceFaces.at(roll - 1);

  let nextPos = positions.at(currentPlayer) + roll;
  let message = `Player ${currentPlayer + 1} rolled a ${roll}. `;

  if (nextPos > 100) {
    message += `Need exact roll to finish!`;
  } else {
    positions.splice(currentPlayer, 1, nextPos);

    if (ladders[nextPos]) {
      positions.splice(currentPlayer, 1, ladders[nextPos]);
      message += `Climbed a ladder to ${positions.at(currentPlayer)}!`;
    } else if (snakes[nextPos]) {
      positions.splice(currentPlayer, 1, snakes[nextPos]);
      message += `Bitten by a snake! Slid to ${positions.at(currentPlayer)}.`;
    }
  }

  renderPlayers();

  if (positions.at(currentPlayer) === 100) {
    statusText.textContent = `🎉 Player ${currentPlayer + 1} Wins!`;
    gameOver = true;
    rollBtn.disabled = true;
    return;
  }

  currentPlayer = currentPlayer === 0 ? 1 : 0;
  statusText.textContent = `${message} Player ${currentPlayer + 1}'s Turn.`;
}

function resetGame() {
  positions = Array.of(1, 1);
  currentPlayer = 0;
  gameOver = false;
  rollBtn.disabled = false;
  diceDisplay.textContent = '🎲';
  statusText.textContent = "Player 1's Turn";
  renderPlayers();
}

rollBtn.addEventListener('click', rollDice);
resetBtn.addEventListener('click', resetGame);
window.addEventListener('resize', drawSnakesAndLadders);

// Initialize Game
createBoard();
drawSnakesAndLadders();
renderPlayers();
