import { Move } from '../data/Move.js';

class Movement {

  constructor(messages, board) {
    this.messages = messages;
    this.board = board;
  }

  handle(data) {

  }

  move(direction) {
    var d = new Move(direction);
    this.messages.sendToServer(d);
  }

}

export { Movement }
