import { Cookie } from '../Cookie.js';
import { Move } from '../data/Move.js';

class Movement {

  constructor(userId, messages, piece, players) {
    this.messages = messages;
    this.piece = piece;
    this.players = players;
    this.userId = userId;
  }

  handle(data) {
    if (data.id != this.userId) {
      console.log(`player ${data.user} movement`, data);
    }
  }

  move(direction) {
    var piece = this.piece;
    var m = piece.snapSvgGroup.transform().localMatrix;
    m.translate(0, 5);
    piece.snapSvgGroup.transform(m);

    var d = new Move(direction, m);
    this.messages.sendToServer(d);
  }

}

export { Movement }
