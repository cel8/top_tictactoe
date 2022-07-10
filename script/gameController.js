// Imports

import { BotField, botDifficulty } from './botFieldSingleton.js'
import { DisplayController, resultTie } from './displayController.js'
import { PlayerFactory, playerType } from './userFactory.js'

// Variables

export const MIN_BOARD_SIZE = 3;
export const MAX_BOARD_SIZE = 6;
const FREE_SPOT = '';
const THINK_TIME = 500; // ms
let BOARD_SIZE = MIN_BOARD_SIZE;

// Game controller class

export class GameController {
  constructor() {
    this.board = [];
    this.displayController = new DisplayController();
    this.playerFactory = new PlayerFactory();
    this.botField = null;
  }
  isAvailableSpot() {
    return this.board.some(row => row.includes(FREE_SPOT));
  }
  resetBoard() {
    this.board = [];
    for(let i = 0; i < BOARD_SIZE; ++i) {
      let row = [];
      for(let i = 0; i < BOARD_SIZE; ++i) {
        row.push(FREE_SPOT);
      }
      this.board.push(row);
    }
  }
  setBotField(botSpot, difficulty) {
    this.botField = BotField.getInstance();
    this.botField.setBotField(botSpot, difficulty);
  }
  startRound() {
    const player = this.displayController.getCurrentPlayer();
    if(player.type === playerType.ai) {
      this.playBotRound();
    }
  }
  playRound(x = -1, y = -1) {
    const player = this.displayController.getCurrentPlayer();
    if(player.type === playerType.ai) {
      setTimeout(() => {
        this.playBotRound();
      }, THINK_TIME);      
    } else {
      this.playUserRound(x,y);
    }
  }
  resetGame() {
    this.displayController.resetSlots(FREE_SPOT);
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
      if(player.type === playerType.ai) {
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
  setFirstPlayer(name, side) {
    this.displayController.setPlayerA(this.generatePlayer(name, side));
  }
  setSecondPlayer(name, side, isBot = false, difficulty = undefined) {
    if(isBot) {
      const bot = this.generateBot(side);
      this.displayController.setPlayerB(bot);
      this.setBotField(bot.side, difficulty);
    } else {
      this.displayController.setPlayerB(this.generatePlayer(name, side));
    }
  }
  showGameBoard(boardSize, buttonEventCb) {
    BOARD_SIZE = boardSize;
    this.resetBoard();
    this.displayController.createSlots(FREE_SPOT, BOARD_SIZE, buttonEventCb);
    this.displayController.showPlayers();
  }
  hideGameBoard() {
    this.displayController.removeSlots();
    this.displayController.unloadPlayers();
  }
  getRandomSpot() {
    let i, j;
    const getRandomSpot = () => Math.floor(Math.random() * BOARD_SIZE);
    do {
      i = getRandomSpot();
      j = getRandomSpot();
    } while(!this.checkAvailable(i,j));
    return { i, j };
  }
  getMinimaxSpot() {
    // Move spot 
    let move;
    // AI best score
    let bestScore = -Infinity;
    for(let i = 0; i < BOARD_SIZE; ++i) {
      for(let j = 0; j < BOARD_SIZE; ++j) {
        if(this.checkAvailable(i,j)) {
          this.board[i][j] = this.botField.spot;
          let score = this.minimax(this.board, 0, false);
          this.board[i][j] = FREE_SPOT;
          if(score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    return move;
  }
  playBotRound() {
    const difficulty = this.botField.difficulty;
    // Move spot 
    let move;
    // Choose bot difficulty
    if(difficulty === botDifficulty.easy) {
      // Easy make random move
      move = this.getRandomSpot();
    } else if(difficulty === botDifficulty.medium) {
      const badSpot = Math.random() < 0.5;
      move = badSpot ? this.getRandomSpot() : this.getMinimaxSpot(); 
    } else if(difficulty === botDifficulty.hard) {
      const badSpot = (Math.random() * 100) < 35;
      move = badSpot ? this.getRandomSpot() : this.getMinimaxSpot(); 
    } else {
      move = this.getMinimaxSpot();
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
      for(let i = 0; i < BOARD_SIZE; ++i) {
        for(let j = 0; j < BOARD_SIZE; ++j) {
          if(this.checkAvailable(i,j)) {
            board[i][j] = this.botField.spot;
            let score = this.minimax(board, depth + 1, false);
            board[i][j] = FREE_SPOT;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for(let i = 0; i < BOARD_SIZE; ++i) {
        for(let j = 0; j < BOARD_SIZE; ++j) {
          if(this.checkAvailable(i,j)) {
            board[i][j] = this.botField.humanSpot;
            let score = this.minimax(board, depth + 1, true);
            board[i][j] = FREE_SPOT;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  checkAvailable(x, y) {
    return (this.board[x][y] === FREE_SPOT);
  }
  setBusy(side, x, y) {
    this.displayController.setSlot(x, y, side);
    this.board[x][y] = side;
  }
  equalsAll(row) {
    return row.every((value, _, array) => {
      return (value !== FREE_SPOT) && (array[0] === value);
    });
  }
  checkWinnerDiagonal(board, reverse = false) {
    const getDiagonal = (matrix) => matrix.map((row, index, _) => row[index]);
    const getReverseDiagonal = (matrix) => matrix.map((row, index, self) => row[self.length - 1 - index]);
    const row = (!reverse ? getDiagonal(board) : getReverseDiagonal(board));
    if(this.equalsAll(row)) {
      return row[0];
    }
    return null;
  }
  checkWinnerRowCombo(board, column = false) {
    const arrayColumn = (array, n) => array.map((x) => x[n]);
    for(let i = 0; i < BOARD_SIZE; ++i) {
      const row = (!column ? board[i] : arrayColumn(board, i));
      if(this.equalsAll(row)) {
        return row[0];
      }
    }
    return null;
  }
  generatePlayer(playerName, playerSide) {
    return this.playerFactory.createPlayer({
      playerType: playerType.human,
      name: playerName,
      leftSide: playerSide
    });
  }
  generateBot(playerSide) {
    return this.playerFactory.createPlayer({
      playerType: playerType.ai,
      leftSide: playerSide
    });
  }
  checkWinner() {
    let winner = null;
    // Rows
    if(null !== (winner = this.checkWinnerRowCombo(this.board))) {
      return winner;
    }
    // Columns
    if(null !== (winner = this.checkWinnerRowCombo(this.board, true))) {
      return winner;
    }
    // Diagonal
    if(null !== (winner = this.checkWinnerDiagonal(this.board))) {
      return winner;
    }
    // Reverse diagonal
    if(null !== (winner = this.checkWinnerDiagonal(this.board, true))) {
      return winner;
    }
    // Tie
    if(!this.isAvailableSpot()) {
      return resultTie;
    }
    return null;
  }
}