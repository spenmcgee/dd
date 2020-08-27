import { Message } from './Message.js';

class Kill extends Message {

  constructor(id) {
    super();
    this.meta = 'kill';
    this.id = id;
  }

  toString() {
    var data = {
      meta: 'kill',
      id: this.id,
      room: this.room,
      user: this.user,
    }
    return JSON.stringify(data);
  }

}

export { Kill }
