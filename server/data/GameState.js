class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.players = [];
    this.assets = [];
    this.dm = null;
  }

  hasPlayer(id) {
    return this.players.reduce((o,p) => ((p.id==id)||o), false);
  }

  addPlayer(player) {
    if (!this.hasPlayer(player.id))
      this.players.push(player);
  }

  addAsset(asset) {
    this.assets.push(asset);
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
      }
    });
  }

  // toJson() {
  //   var data = {
  //     meta: 'game-state',
  //     room: this.room,
  //     assets: this.players.map(p => {
  //       return {
  //         id: p.id,
  //         room: p.room,
  //         url: p.url,
  //         localMatrix: p.localMatrix
  //       }
  //     }),
  //     players: this.players.map(p => {
  //       return {
  //         id: p.id,
  //         user: p.user,
  //         room: p.room,
  //         color: p.color,
  //         localMatrix: p.localMatrix
  //       }
  //     })
  //   }
  //   return data;
  // }

}

module.exports = GameState;
