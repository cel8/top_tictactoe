class Player {
  constructor({
    name,
    leftSide
  }) {
    this.name = name || 'Unkown';
    this.side = (leftSide ? 'X' : 'O');
    this.score = 0;
    this.type = 'human';
  }
  increaseScore() {
    this.score++;
  }
  resetScore() {
    this.score = 0;
  }
}

class Bot {
  constructor({
    leftSide
  }) {
    this.name = 'AI';
    this.side = (leftSide ? 'X' : 'O');
    this.score = 0;
    this.type = 'bot';
  }
  increaseScore() {
    this.score++;
  }
  resetScore() {
    this.score = 0;
  }
}

export class PlayerFactory {
  constructor() {
    this.playerClass = Player;
  }
  createPlayer(options) {
    switch(options.playerType) {
      case 'player':
        this.playerClass = Player;
        break;
      case 'bot':
        this.playerClass = Bot;
        break;
    }
    return new this.playerClass(options);
  }
}
