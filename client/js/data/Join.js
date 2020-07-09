import { Message } from './Message.js';

class Join extends Message {

  constructor() {
    super();
    this.meta = 'join';
    //this.color = color;
  }

  toString() {
    var data = {
      meta: 'join',
      id: this.id,
      room: this.room,
      user: this.user,
      //color: this.color
    }
    return JSON.stringify(data);
  }

}

export { Join }
