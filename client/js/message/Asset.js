import { Piece } from './Piece.js';

class Asset extends Piece {

  constructor(id, room, url, localMatrix, killed) {
    super();
    this.pieceType = 'asset';
    this.id = id;
    this.room = room;
    this.url = url;
    this.localMatrix = localMatrix;
    this.snapSvgGroup = null;
    this.killed = killed;
  }

  toString() {
    return JSON.stringify({
      meta: this.meta,
      pieceType: this.pieceType,
      id: this.id,
      room: this.room,
      url: this.url,
      localMatrix: this.localMatrix,
      killed: this.killed
    });
  }

}

export { Asset }
