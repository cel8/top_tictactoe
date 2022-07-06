// Imports

import { BotField } from './botFieldSingleton.js'

export class GameController {
  constructor() {
    this.resetBoard();
    this.displayController = null;
    this.botField = null;
  }
  isAvailableSpot() {
    return this.board.some(row => row.includes(''));
  }
  equals3(a,b,c) {
    return ((a === b) && (a === c));
  }
  resetBoard() {
    this.board = [
      ['','',''],
      ['','',''],
      ['','','']
    ];
  }
  setDisplayController(displayController) {
    this.displayController = displayController;
  }
  setBotField(botSpot) {
    this.botField = BotField.getInstance();
    this.botField.setBotField(botSpot);
  }
  startRound() {
    const player = this.displayController.getCurrentPlayer();
    if(player.type === 'bot') {
      this.playBotRound();
    }
  }
  playRound(x = -1, y = -1) {
    const player = this.displayController.getCurrentPlayer();
    if(player.type === 'bot') {
      this.playBotRound();
    } else {
      this.playUserRound(x,y);
    }
  }
  resetGame() {
    this.displayController.resetSlots();
    this.resetBoard();
  }
  restartGame() {
    this.resetGame();
    this.displayController.resetScore();
  }
  playNextRound() {
    const winner = this.checkWinner();
    if(winner === null) {
      this.displayController.toggleCurrentPlayer();
      const player = this.displayController.getCurrentPlayer();
      if(player.type === 'bot') {
        this.playRound();
      }
    } else {
      this.displayController.showWinner(winner);
    }
  }
  playUserRound(x,y) {
    if(this.checkAvailable(x,y)) {
      const player = this.displayController.getCurrentPlayer();
      this.setBusy(player.side, x, y);
      this.playNextRound();
    }
  }
  playBotRound() {
    // AI best score
    let bestScore = -Infinity;
    // Move spot 
    let move;
    for(let i = 0; i < 3; ++i) {
      for(let j = 0; j < 3; ++j) {
        if(this.checkAvailable(i,j)) {
          this.board[i][j] = this.botField.spot;
          let score = this.minimax(this.board, 0, false);
          this.board[i][j] = '';
          if(score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    this.setBusy(this.botField.spot, move.i, move.j);
    this.playNextRound();
  }
  minimax(board, depth, isMaximizing) {
    let result = this.checkWinner();
    if(result !== null) {
      return this.botField.scores[result];
    }
    if(isMaximizing) {
      let bestScore = -Infinity;
      for(let i = 0; i < 3; ++i) {
        for(let j = 0; j < 3; ++j) {
          if(this.checkAvailable(i,j)) {
            board[i][j] = this.botField.spot;
            let score = this.minimax(board, depth + 1, false);
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for(let i = 0; i < 3; ++i) {
        for(let j = 0; j < 3; ++j) {
          if(this.checkAvailable(i,j)) {
            board[i][j] = this.botField.humanSpot;
            let score = this.minimax(board, depth + 1, true);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  checkAvailable(x, y) {
    return (this.board[x][y] === '');
  }
  setBusy(side, x, y) {
    this.displayController.setSlot(x, y, side);
    this.board[x][y] = side;
  }
  checkWinner() {
    let winner = null;
    // Rows
    for(let i = 0; i < 3; ++i) {
      if(this.board[i][0] === '') {
        continue;
      } else {
        if(this.equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
          winner = this.board[i][0];
          break;
        }
      }
    }
    // Columns
    for(let i = 0; i < 3; ++i) {
      if(this.board[0][i] === '') {
        continue;
      } else {
        if(this.equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
          winner = this.board[0][i];
          break;
        }
      }
    }
    // Diagonal
    if(this.board[1][1] !== '') {
      // Primary
      if(this.equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
        // Primary diagonal
        winner = this.board[0][0];
      } else if(this.equals3(this.board[0][2], this.board[1][1], this.board[2][0])) { 
        // Secondary diagonal
        winner = this.board[1][1];
      }
    } 

    // Tie
    if(winner === null && !this.isAvailableSpot()) {
      winner = 'tie';
    }
    return winner;
  }
}