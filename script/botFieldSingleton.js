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

class BotFieldSingleton {
  constructor() {
    // set some properties for our singleton
    this.spot = null;
    this.humanSpot = null;
    this.scores = null;
  }
  setBotField(side) {
    this.spot = side || 'X';
    if(this.spot === 'X') {
      this.humanSpot = 'O';
      this.scores = botScoresX;
    } else {
      this.humanSpot = 'X';
      this.scores = botScoresO;
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
