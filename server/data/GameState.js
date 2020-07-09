class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.elements = [];
  }

  hasElement(id) {
    return this.elements.reduce((o,x) => ((x.id==id)||o), false);
  }

  addElement(el) {
    if (!this.hasElement(el.id))
      this.elements.push(el);
  }

  addDM(data) {
    //noop
  }

}

module.exports = GameState;
