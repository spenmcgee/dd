class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.elements = {};
    this.maskRects = null;
  }

  setMask(maskRects) {
    this.maskRects = maskRects;
  }

  getMask() {
    return this.maskRects;
  }

  hasElement(id) {
    if (id in this.elements);
  }

  addElement(el) {
    if (!this.hasElement(el.id))
      this.elements[el.id] = el;
  }

  addDM(data) {
    //noop
  }

}

module.exports = GameState;
