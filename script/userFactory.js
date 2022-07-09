export const playerType = {
  human: 'human',
  ai: 'bot'
};

export const playerSide = {
  X: 'X',
  O: 'O'
};

class Player {
  constructor({
    name,
    leftSide
  }) {
    this.name = name || 'Unknown';
    this.side = (leftSide ? playerSide.X : playerSide.O);
    this.score = 0;
    this.type = playerType.human;
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
    this.side = (leftSide ? playerSide.X : playerSide.O);
    this.score = 0;
    this.type = playerType.ai;
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
      case playerType.human:
        this.playerClass = Player;
        break;
      case playerType.ai:
        this.playerClass = Bot;
        break;
    }
    return new this.playerClass(options);
  }
}
