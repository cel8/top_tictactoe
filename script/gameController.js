export class GameController {
  constructor() {
    this.resetBoard();
    this.displayController = null;
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
  playUserRound(x,y) {
    if(this.checkAvailable(x,y)) {
      const player = this.displayController.getCurrentPlayer();
      this.displayController.setSlot(x, y, player.side);
      this.setBusy(player.side, x, y);
      const winner = this.checkWinner();
      if(winner === null) {
        this.displayController.toggleCurrentPlayer();
      } else {
        this.displayController.showWinner(winner);
      }
    }
  }
  playBotRound() {

  }
  checkAvailable(x, y) {
    return (this.board[x][y] === '');
  }
  setBusy(value, x, y) {
    this.board[x][y] = value;
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
      winner = 'Tie';
    }
    console.log(winner);
    return winner;
  }
}