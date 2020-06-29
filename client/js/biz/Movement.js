import { Cookie } from '../Cookie.js';
import { Move } from '../data/Move.js';

class Movement {

  constructor(userId, messages, board, players) {
    this.messages = messages;
    this.board = board;
    this.players = players;
    this.userId = userId;
  }

  handle(data) {
    if (data.id != this.userId) {
      console.log(`player ${data.user} movement`, data);
    }
  }

  move(direction) {
    var piece = this.board.piece;
    var m = piece.transform().localMatrix;
    m.translate(0, 5);
    piece.transform(m);

    var localMatrix = piece.transform().localMatrix;
    var d = new Move(direction, localMatrix);
    this.messages.sendToServer(d);
  }

}

export { Movement }
