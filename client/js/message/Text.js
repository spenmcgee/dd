import { Cookie } from '../Cookie.js';

class Text {

  constructor(messageText) {
    this.id = Cookie.getCookie('id');
    this.user = Cookie.getCookie('user');
    this.room = Cookie.getCookie('room');
    this.messageText = messageText;
    this.meta = 'text';
  }

  toString() {
    return JSON.stringify(this);
  }

}

export { Text }
