const multiplierEl = document.getElementById('multiplier');
const plane = document.getElementById('plane');
const betInput = document.getElementById('betAmount');
const startBtn = document.getElementById('startBtn');
const cashoutBtn = document.getElementById('cashoutBtn');
const resultMessage = document.getElementById('resultMessage');
const balanceEl = document.getElementById('balance');
const crashSound = document.getElementById('crashSound');

let balance = localStorage.getItem('aviatorBalance') || 1000;
balance = parseFloat(balance);
let gameInterval, multiplier = 1.00;
let crashedAt = 0;
let isPlaying = false;
let hasCashedOut = false;

balanceEl.textContent = balance.toFixed(2);

function startGame() {
  let bet = parseFloat(betInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    alert("Invalid bet amount");
    return;
  }

  balance -= bet;
  balanceEl.textContent = balance.toFixed(2);
  localStorage.setItem('aviatorBalance', balance);

  isPlaying = true;
  hasCashedOut = false;
  multiplier = 1.00;
  crashedAt = (Math.random() * 5 + 1).toFixed(2); // Crash at 1.00 to 6.00x
  resultMessage.textContent = "";

  startBtn.disabled = true;
  cashoutBtn.disabled = false;
  betInput.disabled = true;

  plane.style.top = "80%";
  gameInterval = setInterval(runGame, 100);
}

function runGame() {
  multiplier += 0.05;
  multiplierEl.textContent = multiplier.toFixed(2) + "x";

  const topPercent = parseFloat(plane.style.top);
  plane.style.top = (topPercent - 0.5) + "%";

  if (multiplier >= crashedAt) {
    crash();
  }
}

function crash() {
  clearInterval(gameInterval);
  isPlaying = false;
  crashSound.play();
  resultMessage.textContent = "Crashed at " + multiplier.toFixed(2) + "x";

  if (!hasCashedOut) {
    // Player loses bet
  }

  resetButtons();
}

function cashOut() {
  if (!isPlaying || hasCashedOut) return;

  hasCashedOut = true;
  clearInterval(gameInterval);

  let bet = parseFloat(betInput.value);
  let winAmount = bet * multiplier;
  balance += winAmount;

  resultMessage.textContent = `Cashed out at ${multiplier.toFixed(2)}x – You won ${winAmount.toFixed(2)} BDT!`;
  balanceEl.textContent = balance.toFixed(2);
  localStorage.setItem('aviatorBalance', balance);

  crashSound.play();
  resetButtons();
}

function resetButtons() {
  startBtn.disabled = false;
  cashoutBtn.disabled = true;
  betInput.disabled = false;
}

startBtn.addEventListener('click', startGame);
cashoutBtn.addEventListener('click', cashOut);
