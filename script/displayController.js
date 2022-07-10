// Imports

import { playerSide, playerType } from './userFactory.js'

// Variables

const svgPath = './resources/images/svg/';
const boardPlayerA = document.querySelector('#boardPlayerA');
const boardPlayerB = document.querySelector('#boardPlayerB');
const divOverlayWinner = document.querySelector('#overlayWinner');
const divGameContainer = document.querySelector('.gamecontainer');
const divGameBoard = document.querySelector('.gameboard');
const divWinner = document.querySelector('.winnerDiv');
const divUserRound = document.querySelector('.userRound');

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

export const resultTie = 'tie';

export class DisplayController {
  constructor(playerA, playerB) {
    this.playerA = playerA || undefined;
    this.playerB = playerB || undefined;
    this.currentPlayer = null;
  }
  setPlayerA(playerA) {
    this.playerA = playerA;
  }
  setPlayerB(playerB) {
    this.playerB = playerB;
  }
  incPlayerScore(winnerSide) {
    const winnerPlayer = (winnerSide === this.playerA.side ? this.playerA
                                                           : this.playerB);
    const divBoardPlayerId = (winnerSide === playerSide.X ? '#boardPlayerA'
                                                          : '#boardPlayerB');
    const boardPlayer = document.querySelector(divBoardPlayerId);
    const score = boardPlayer.querySelector('.score');
    winnerPlayer.increaseScore();
    score.textContent = winnerPlayer.score;
  }
  resetScore() {
    const scoreA = boardPlayerA.querySelector('.score');
    const scoreB = boardPlayerB.querySelector('.score');
    this.playerA.score = 0;
    scoreA.textContent = '0';
    this.playerB.score = 0;
    scoreB.textContent = '0';
  }
  loadLeftPlayer(playerName, icon) {
    const img = boardPlayerA.querySelector('.icon');
    const name = boardPlayerA.querySelector('.playerName');
    const scoreContainer = boardPlayerA.querySelector('.scoreContainer');
    const score = boardPlayerA.querySelector('.score');
    img.setAttribute('src', svgPath + icon);
    name.textContent = playerName;
    scoreContainer.style.display = 'block';
    score.textContent = '0';
  }
  loadRightPlayer(playerName, icon) {
    const img = boardPlayerB.querySelector('.icon');
    const name = boardPlayerB.querySelector('.playerName');
    const scoreContainer = boardPlayerB.querySelector('.scoreContainer');
    const score = boardPlayerB.querySelector('.score');
    img.setAttribute('src', svgPath + icon);
    name.textContent = playerName;
    scoreContainer.style.display = 'block';
    score.textContent = '0';
  }
  unloadLeftPlayer() {
    const img = boardPlayerA.querySelector('.icon');
    const name = boardPlayerA.querySelector('.playerName');
    const scoreContainer = boardPlayerA.querySelector('.scoreContainer');
    const score = boardPlayerA.querySelector('.score');
    img.removeAttribute('src');
    name.textContent = '';
    scoreContainer.style.display = 'none';
    score.textContent = '';
  }
  unloadRightPlayer() {
    const img = boardPlayerB.querySelector('.icon');
    const name = boardPlayerB.querySelector('.playerName');
    const scoreContainer = boardPlayerB.querySelector('.scoreContainer');
    const score = boardPlayerB.querySelector('.score');
    img.removeAttribute('src');
    scoreContainer.style.display = 'none';
    name.textContent = '';
    score.textContent = '';
  }
  toggleCurrentPlayer() {
    this.currentPlayer = (this.currentPlayer === this.playerA ? this.playerB 
                                                              : this.playerA);
    this.loadPlayerRound(this.currentPlayer.name, this.currentPlayer.side);
  }
  showWinner(winner) {
    divGameContainer.style.webkitFilter = "blur(0.1rem)";
    divOverlayWinner.style.display = 'block';
    const img = divWinner.querySelector('img');
    const text = divWinner.querySelector('p');
    if(winner !== resultTie) {
      const winnerPlayer = (winner === this.playerA.side ? this.playerA
                                                         : this.playerB);
      this.incPlayerScore(winner);
      const svgName = (winnerPlayer.type === playerType.ai ? 'robot-love-outline.svg' 
                                                           : 'account-heart-outline.svg');
      img.setAttribute('src', svgPath + svgName);
      text.textContent = `The winner is ${winnerPlayer.name}`;
    } else {
      img.removeAttribute('src');
      text.textContent = `It's a ${resultTie}`
    }
  }
  createSlots(freeSpotText, boardSize, buttonEventCb) {
    // Remove all child of gameboard
    removeAllChildNodes(divGameBoard);
    divGameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 5rem)`;
    divGameBoard.style.gridTemplateRows = `repeat(${boardSize}, 5rem)`;
    // Create gameboard child
    for(let i = 0; i < boardSize; ++i) {
      for(let j = 0; j < boardSize; ++j) {
        const button = document.createElement("button");
        button.textContent = freeSpotText;
        button.dataset.x = i;
        button.dataset.y = j;
        button.classList.add('grid');
        button.addEventListener('click', buttonEventCb);
        if(i === (boardSize - 1)) {
          button.classList.add('nob');
        }
        if(j === (boardSize - 1)) {
          button.classList.add('nor');
        }
        divGameBoard.appendChild(button);
      }
    }
  }
  setSlot(x, y, side) {
    const target = divGameBoard.querySelector(`[data-x='${x}'][data-y='${y}']`);
    target.textContent = side;
  }
  resetSlots(freeSpotText) {
    const targets = divGameBoard.querySelectorAll('.grid');
    targets.forEach(target => {
      target.textContent = freeSpotText;
    });
  }
  removeSlots() {
    // Remove all child of gameboard
    removeAllChildNodes(divGameBoard);
  }
  showPlayers() {
    function getIconName(player) {
      return (player.type === playerType.ai ? 'robot-angry-outline.svg' 
                                            : 'account-outline.svg');
    }
    if(this.playerA.side === playerSide.X) {
      const leftSvgName = getIconName(this.playerA);
      const rightSvgName = getIconName(this.playerB);
      this.loadLeftPlayer(this.playerA.name, leftSvgName);
      this.loadRightPlayer(this.playerB.name, rightSvgName);
      this.currentPlayer = this.playerA;
    } else {
      const leftSvgName = getIconName(this.playerB);
      const rightSvgName = getIconName(this.playerA);
      this.loadLeftPlayer(this.playerB.name, leftSvgName);
      this.loadRightPlayer(this.playerA.name, rightSvgName);
      this.currentPlayer = this.playerB;
    }
    this.loadPlayerRound(this.currentPlayer.name, this.currentPlayer.side);
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  loadPlayerRound(playerName, playerSide) {
    divUserRound.textContent = `${playerName}'s ${playerSide} round`;
  }
  unloadPlayers() {
    divUserRound.textContent = '';
    this.unloadLeftPlayer();
    this.unloadRightPlayer();
    this.playerA = undefined;
    this.playerB = undefined;
  }
}