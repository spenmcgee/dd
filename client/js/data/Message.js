import { Cookie } from '../Cookie.js';

class Message {

  constructor() {
    this.id = Cookie.getCookie('id');
    this.user = Cookie.getCookie('user');
    this.room = Cookie.getCookie('room');
    this.meta = 'text';
  }

  toString() {
    return JSON.stringify(this);
  }

}

export { Message }
