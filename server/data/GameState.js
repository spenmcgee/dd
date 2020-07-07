class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.players = [];
    this.dm = null;
  }

  hasPlayer(id) {
    return this.players.reduce((o,p) => ((p.id==id)||o), false);
  }

  addPlayer(player) {
    if (!this.hasPlayer(player.id))
      this.players.push(player);
  }

  addDM(data) {
    this.dm = data;
  }

  applyMove(data) {
    var direction = data.direction;
    var id = data.id;
    this.players.forEach(player => {
      if (player.id == id) {
        player.localMatrix = data.localMatrix;
        // if (direction[0]) {
        //   player.piece.y -= 5;
        // } else if (direction[1]) {
        //   player.piece.x += 5;
        // } else if (direction[2]) {
        //   player.piece.y += 5;
        // } else if (direction[3]) {
        //   player.piece.x -= 5;
        // }
      }
    });
  }

  toJson() {
    var data = {
      meta: 'game-state',
      room: this.room,
      players: this.players.map(p => {
        return {
          id: p.id,
          user: p.user,
          room: p.room,
          piece: {
            color: p.piece.color,
            x: p.piece.x,
            y: p.piece.y,
            localMatrix: p.piece.localMatrix
          }
        }
      })
    }
    return data;
  }

}

module.exports = GameState;
