import { Message } from './Message.js';

class Join extends Message { //connects wsclient to server

  constructor() {
    super();
    this.meta = 'join';
  }

  toString() {
    var data = {
      meta: 'join',
      id: this.id,
      room: this.room,
      user: this.user
    }
    return JSON.stringify(data);
  }

}

export { Join }
