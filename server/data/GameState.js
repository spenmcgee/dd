class GameState {

  constructor(room) {
    this.meta = 'game-state';
    this.room = room;
    this.pieces = {};
    this.maskRects = null;
  }

  setMask(maskRects) {
    this.maskRects = maskRects;
  }

  getMask() {
    return this.maskRects;
  }

  hasPiece(id) {
    return (id in this.pieces);
  }

  addPiece(el) {
    if (!this.hasPiece(el.id))
      this.pieces[el.id] = el;
  }

  addGM(data) {
    //noop
  }

}

module.exports = GameState;
