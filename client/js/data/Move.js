import { Message } from './Message.js';

class Move extends Message {

  constructor(localMatrix) {
    super();
    this.meta = 'move';
    this.localMatrix = localMatrix;
  }

  toString() {
    var data = {
      meta: 'move',
      id: this.id,
      user: this.user,
      room: this.room,
      localMatrix: this.localMatrix
    }
    return JSON.stringify(data);
  }

}

export { Move }
