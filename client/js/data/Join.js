import { Message } from './Message.js';

class Join extends Message {

  constructor(piece) {
    super();
    this.meta = 'join';
    this.piece = piece;
  }

  toString() {
    var data = {
      meta: 'join',
      id: this.id,
      room: this.room,
      user: this.user,
      color: this.color,
      piece: {
        color: this.piece.color,
        x: this.piece.x,
        y: this.piece.y,
        //localMatrix: this.piece.snapSvgGroup.transform().localMatrix
      }
    }
    return JSON.stringify(data);
  }

}

export { Join }
