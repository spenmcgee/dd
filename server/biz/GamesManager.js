const GameState = require("./GameState");

class GamesManager {
  constructor() {
    this.games = {};
  }

  gameExists(room) {
    return room in this.games;
  }

  addGame(room, gameState) {
    if (!(room in this.games)) {
      console.log(`(GamesManager.addGame) new game ${room}`);
      this.games[room] = gameState;//new GameState(room);
    }
    return gameState;
  }

  wireupChat(chatController) {
    chatController.onUserJoin(user => {
      console.log(`(GamesManager.wireupChat) user ${user.user} joining ${user.room}`);
      var game = this.getGame(user.room);
      if (!game) {
        game = new GameState(user.room);
        this.addGame(user.room, game);
      }
      game.addPlayer(user);
    })
  }

  getGame(room) {
    return this.games[room];
  }

  addPlayer(room, player) {
    var gameState = this.getGame(room);
    if (gameState) {
      gameState.addPlayer(player);
    }
  }
}

module.exports = GamesManager;
