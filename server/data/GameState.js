class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.elements = [];
    this.maskRects = null;
  }

  setMask(maskRects) {
    this.maskRects = maskRects;
  }

  getMask() {
    return this.maskRects;
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
