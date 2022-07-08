// Variables

const svgPath = './resources/images/svg/';
const boardPlayerA = document.querySelector('#boardPlayerA');
const boardPlayerB = document.querySelector('#boardPlayerB');
const divOverlayWinner = document.querySelector('#overlayWinner');
const divGameContainer = document.querySelector('.gamecontainer');
const divWinner = document.querySelector('.winnerDiv');
const divUserRound = document.querySelector('.userRound');

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
    const divBoardPlayerId = (winnerSide === 'X' ? '#boardPlayerA'
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
    if(winner !== 'tie') {
      const winnerPlayer = (winner === this.playerA.side ? this.playerA
                                                         : this.playerB);
      this.incPlayerScore(winner);
      const svgName = (winnerPlayer.type === 'bot' ? 'robot-love-outline.svg' 
                                                   : 'account-heart-outline.svg');
      img.setAttribute('src', svgPath + svgName);
      text.textContent = `The winner is ${winnerPlayer.name}`;
    } else {
      img.removeAttribute('src');
      text.textContent = `It's a tie`
    }
  }
  setSlot(x, y, side) {
    const target = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    target.textContent = side;
  }
  resetSlots() {
    const targets = document.querySelectorAll('.grid');
    targets.forEach(target => {
      target.textContent = '';
    });
  }
  showPlayers() {
    function getIconName(player) {
      return (player.type === 'bot' ? 'robot-angry-outline.svg' 
                                    : 'account-outline.svg');
    }
    if(this.playerA.side === 'X') {
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