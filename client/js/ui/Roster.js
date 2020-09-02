class Roster {

  constructor() {
    this.el = document.createElement('span');
    this.players = {};
  }

  add(player) {
    if (!(player.id in this.players)) {
      var playerEl = document.createElement('span');
      playerEl.style.cssText = `background-color: ${player.color}`;
      playerEl.append(player.user);
      this.el.append(playerEl);
      this.players[player.id] = player;
    }
  }

  mergeGameState(data) {
    Object.values(data.pieces).forEach(e => {
      if (e.pieceType == 'player') {
        this.add(e);
      }
    })
  }

}

export { Roster }
