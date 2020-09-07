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

  deleteGame(room) {
    console.log(`(GamesManager) Deleting game ${room}`);
    delete this.games[room];
  }

  getStats() {
    return {
      games: Object.keys(this.games),
      players: Object.values(this.games).reduce((players,gs) => players.concat(Object.values(gs.pieces).map(p=>p.id)), []),
      numGames: Object.keys(this.games).length,
      numPlayers: Object.values(this.games).reduce((count,gs) => count+Object.keys(gs.pieces).length, 0)
    }
  }

}

module.exports = GamesManager;
