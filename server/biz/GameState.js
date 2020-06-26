class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.players = {};
  }

  addPlayer(player) {
    this.players[player.user] = player;
  }

}

module.exports = GameState;
