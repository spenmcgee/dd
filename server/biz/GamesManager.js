const GameState = require("../data/GameState");

class GamesManager {
  constructor() {
    this.games = {};
  }

  getGameState(room) {
    if (!(room in this.games))
      this.games[room] = new GameState(room);
    return this.games[room];
  }

}

module.exports = GamesManager;
