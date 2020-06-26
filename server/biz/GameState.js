class GameState {

  constructor(room) {
    this.room = room;
    this.players = {};
  }

  addPlayer(player) {
    this.players[player.user] = player;
  }

}

module.exports = GameState;
