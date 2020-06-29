import { Message } from './Message.js';

class Move extends Message {

  constructor(direction, localMatrix) {
    super();
    this.meta = 'move';
    this.direction = direction;
    this.localMatrix = localMatrix;
  }

}

export { Move }
