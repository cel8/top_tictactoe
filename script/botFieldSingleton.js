import { playerSide } from "./userFactory.js";

// Bot in X side
const botScoresX = {
  X: +1,
  O: -1,
  tie: 0
};

// Bot in O side
const botScoresO = {
  X: -1,
  O: +1,
  tie: 0
};

export const botDifficulty = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
  unbeatable: 'unbeatable'
};

class BotFieldSingleton {
  constructor() {
    // set some properties for our singleton
    this.spot = null;
    this.humanSpot = null;
    this.scores = null;
    this.difficulty = null;
  }
  setBotField(side, difficulty) {
    this.spot = side || playerSide.X;
    if(this.spot === playerSide.X) {
      this.humanSpot = playerSide.O;
      this.scores = botScoresX;
      this.difficulty = difficulty;
    } else {
      this.humanSpot = playerSide.X;
      this.scores = botScoresO;
      this.difficulty = difficulty;
    }
  }
}

// our instance holder
let instance = null;

// an emulation of static variables and methods
export const BotField = {
  // Method for getting an instance. It returns
  // a singleton instance of a singleton object
  getInstance() {
    if (instance === null) {
      instance = new BotFieldSingleton();
    }

    return instance;
  },
};
