import { Message } from './Message.js';

class Move extends Message {

  constructor(direction) {
    super();
    this.meta = 'move';
    this.direction = direction;
  }

}

export { Move }
