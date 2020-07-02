import { Message } from './Message.js';

class Move extends Message {

  constructor(localMatrix) {
    super();
    this.meta = 'move';
    this.localMatrix = localMatrix;
  }

}

export { Move }
