const GameState = require("../data/GameState");

class GamesManager {
  constructor() {
    this.games = {};
  }

  playerJoin(user) {
    var room = user.room;
    console.log(`(GamesManager.playerJoin) user ${user.user} joining ${user.room}`);
    var game = this.getGame(user.room);
    if (!game) {
      console.log(`(GamesManager.playerJoin) new game ${user.room}`);
      game = new GameState(user.room);
      this.games[room] = game;
    }
    game.addPlayer(user);
    return game;
  }

  getGame(room) {
    return this.games[room];
  }

}

module.exports = GamesManager;
