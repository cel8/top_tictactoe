// Variables

const svgPath = './../resources/images/svg/';
const boardPlayerA = document.querySelector('#boardPlayerA');
const boardPlayerB = document.querySelector('#boardPlayerB');
const overlayWinner = document.querySelector('#overlayWinner');
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
  loadLeftPlayer(playerName, icon) {
    const img = boardPlayerA.querySelector('.icon');
    const name = boardPlayerA.querySelector('.playerName');
    img.setAttribute('src', svgPath + icon);
    name.textContent = playerName;
  }
  loadRightPlayer(playerName, icon) {
    const img = boardPlayerB.querySelector('.icon');
    const name = boardPlayerB.querySelector('.playerName');
    img.setAttribute('src', svgPath + icon);
    name.textContent = playerName;
  }
  unloadLeftPlayer() {
    const img = boardPlayerA.querySelector('.icon');
    const name = boardPlayerA.querySelector('.playerName');
    img.removeAttribute('src');
    name.textContent = '';
  }
  unloadRightPlayer() {
    const img = boardPlayerB.querySelector('.icon');
    const name = boardPlayerB.querySelector('.playerName');
    img.removeAttribute('src');
    name.textContent = '';
  }
  toggleCurrentPlayer() {
    this.currentPlayer = (this.currentPlayer === this.playerA ? this.playerB 
                                                              : this.playerA);
    this.loadPlayerRound(this.currentPlayer.name);
  }
  showWinner(winner) {
    divGameContainer.style.webkitFilter = "blur(0.1rem)";
    overlayWinner.style.display = 'block';
    const text = divWinner.querySelector('p');
    if(winner !== 'Tie') {
      const winnerPlayer = (winner === this.playerA.side ? this.playerA
                                                         : this.playerB);
      const img = divWinner.querySelector('img');
      const svgName = (winnerPlayer.type === 'bot' ? 'robot-love-outline.svg' 
                                                   : 'account-heart-outline.svg');
      img.setAttribute('src', svgPath + svgName);
      text.textContent = `The winner is ${winnerPlayer.name}.`;
    } else {
      text.textContent = `It's a tie.`
    }
  }
  showPlayers() {
    function getIconName(player) {
      return (player.type === 'bot' ? 'robot-angry-outline.svg' 
                                    : 'account-outline.svg');
    }
    if(this.playerA.side === 'X') {
      const leftSvgName = getIconName(this.playerA.name);
      const rightSvgName = getIconName(this.playerB.name);
      this.loadLeftPlayer(this.playerA.name, leftSvgName);
      this.loadRightPlayer(this.playerB.name, rightSvgName);
      this.loadPlayerRound(this.playerA.name);
    } else {
      const leftSvgName = getIconName(this.playerB.name);
      const rightSvgName = getIconName(this.playerA.name);
      this.loadLeftPlayer(this.playerB.name, leftSvgName);
      this.loadRightPlayer(this.playerA.name, rightSvgName);
      this.loadPlayerRound(this.playerB.name);
    }
    this.currentPlayer = this.playerA;
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  loadPlayerRound(playerName) {
    divUserRound.textContent = `${playerName} round.`;
  }
  unloadPlayers() {
    divUserRound.textContent = '';
    this.unloadLeftPlayer();
    this.unloadRightPlayer();
    this.playerA = undefined;
    this.playerB = undefined;
  }
}