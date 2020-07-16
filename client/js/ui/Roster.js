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
    data.elements.forEach(e => {
      if (e.elementType == 'player') {
        this.add(e);
      }
    })
  }

}

export { Roster }
