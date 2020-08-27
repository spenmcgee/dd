import { Piece } from './Piece.js';

class Player extends Piece {

  constructor(id, user, room, color, localMatrix) {
    super();
    this.pieceType = 'player';
    this.id = id;
    this.user = user;
    this.room = room;
    this.color = color;
    //this.x = 100;
    //this.y = 100;
    this.localMatrix = localMatrix;
  }

  toString() {
    return JSON.stringify({
      meta: this.meta,
      pieceType: this.pieceType,
      id: this.id,
      user: this.user,
      room: this.room,
      color: this.color,
      localMatrix: this.localMatrix
    });
  }

}

export { Player }
