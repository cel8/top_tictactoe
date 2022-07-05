// Imports

import { PlayerFactory } from './userFactory.js'
import { DisplayController } from './displayController.js'
import { GameController } from './gameController.js'

// Variables

const inputs = document.querySelectorAll('input');
const cellsGridBoard = document.querySelectorAll('.grid');
const btnPlayers = document.querySelector('#players');
const btnBot = document.querySelector('#bot');
const btnBack = document.querySelector('#back');
const btnPlayAgain = document.querySelector('#btnPlayAgain');
const btnReset = document.querySelector('#btnReset');
const frmPlayers = document.querySelector('.playerForm');
const divGameContainer = document.querySelector('.gamecontainer');
const divWinner = document.querySelector('.winnerDiv');
const divOverlay = document.querySelector('#overlay');
const divOverlayWinner = document.querySelector('#overlayWinner');

const patterns = {
  playerA: /^[a-z\s']{2,30}$/i,
  playerB: /^[a-z\s']{2,30}$/i,
}

const playerFactory = new PlayerFactory();
const displayController = new DisplayController();
const gameController = new GameController();

function validate(field, regex) {
  if (regex.test(field.value)) {
    field.setCustomValidity('');
  } else {
    field.setCustomValidity('invalid');
  }
}

inputs.forEach((input) => {
  input.addEventListener('keyup', (e) => {
    if (undefined != e.target.attributes.name) {
      validate(e.target, patterns[e.target.attributes.name.value]);
    }
  });
});

cellsGridBoard.forEach((cell) => {
  cell.addEventListener('click', onGridCellPresses);
});

btnPlayers.onclick = (e) => {
  // Display form
  const labPlayerA = frmPlayers.querySelector('#labelA');
  const labPlayerB = frmPlayers.querySelector('#labelB');
  const iptPlayerA = frmPlayers.querySelector('#playerA');
  const iptPlayerB = frmPlayers.querySelector('#playerB');
  labPlayerA.textContent = 'First player name';
  iptPlayerA.placeholder = 'First player';
  iptPlayerA.required = true;
  iptPlayerB.required = true;
  labPlayerB.style.display = 'block';
  iptPlayerB.style.display = 'block';
  frmPlayers.style.display = 'grid';
  // Hidden bot button and disable current button
  btnPlayers.disabled = true;
  btnBot.style.display = 'none';
}

btnBot.onclick = (e) => {
  // Display form
  const labPlayerA = frmPlayers.querySelector('#labelA');
  const labPlayerB = frmPlayers.querySelector('#labelB');
  const iptPlayerA = frmPlayers.querySelector('#playerA');
  const iptPlayerB = frmPlayers.querySelector('#playerB');
  labPlayerA.textContent = 'Player name';
  iptPlayerA.placeholder = 'Player name';
  iptPlayerA.required = true;
  labPlayerB.style.display = 'none';
  iptPlayerB.style.display = 'none';
  iptPlayerB.required = false;
  frmPlayers.style.display = 'grid';
  // Hidden players button and disable current button
  btnBot.disabled = true;
  btnPlayers.style.display = 'none';
}

btnPlayAgain.onclick = (e) => {
  setStartGameForeground();
}

btnBack.onclick = (e) => {
  restoreForm();
}

btnReset.onclick = (e) => {
  gameController.restartGame();
  btnReset.style.display = 'none';
}

divWinner.onclick = (e) => {
  gameController.resetGame();
  setGameBoardForeground();
  btnReset.style.display = 'block';
}

frmPlayers.onsubmit = (e) => {
  e.preventDefault();
  const iptPlayerA = frmPlayers.querySelector('#playerA');
  const firstPlayerSide = Math.random() < 0.5;
  const secondPlayerSide = !firstPlayerSide;
  displayController.setPlayerA(generatePlayer(iptPlayerA.value, firstPlayerSide));
  if (btnPlayers.style.display === 'none') {
    displayController.setPlayerB(generateBot(secondPlayerSide));
  } else {
    const iptPlayerB = frmPlayers.querySelector('#playerB');
    displayController.setPlayerB(generatePlayer(iptPlayerB.value, secondPlayerSide));
  }
  displayController.showPlayers();
  gameController.setDisplayController(displayController);
  // Restore form
  restoreForm();
  setGameBoardForeground();
}

function generatePlayer(playerName, playerSide) {
  return playerFactory.createPlayer({
    playerType: 'player',
    name: playerName,
    leftSide: playerSide
  });
}

function generateBot(playerSide) {
  return playerFactory.createPlayer({
    playerType: 'bot',
    leftSide: playerSide
  });
}

function restoreForm() {
  // Disable form
  const iptPlayerA = frmPlayers.querySelector('#playerA');
  const iptPlayerB = frmPlayers.querySelector('#playerB');
  frmPlayers.style.display = 'none';
  btnPlayers.style.display = 'flex';
  btnBot.style.display = 'flex';
  iptPlayerA.value = '';
  iptPlayerB.value = '';
  iptPlayerA.required = false;
  iptPlayerB.required = false;
  btnPlayers.disabled = false;
  btnBot.disabled = false;
}

function onGridCellPresses(e) {
  const target = e.target;
  const x = +target.dataset.x;
  const y = +target.dataset.y;
  gameController.playRound(x, y);
}

function setGameBoardForeground() {
  divGameContainer.style.webkitFilter = "blur(0rem)";
  divOverlay.style.display = 'none';
  divOverlayWinner.style.display = 'none';
  btnPlayAgain.style.display = 'block';
}

function setStartGameForeground() {
  displayController.unloadPlayers();
  divGameContainer.style.webkitFilter = "blur(0.1rem)";
  divOverlay.style.display = 'block';
  btnPlayAgain.style.display = 'none';
  btnReset.style.display = 'none';
}