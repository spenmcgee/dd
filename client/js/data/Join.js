import { Message } from './Message.js';

class Join extends Message {

  constructor() {
    super();
    this.meta = 'join';
  }

}

export { Join }
