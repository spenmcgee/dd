import { Cookie } from '../Cookie.js';

class Join {

  constructor() {
    this.id = Cookie.getCookie('id');
    this.user = Cookie.getCookie('user');
    this.room = Cookie.getCookie('room');
    this.meta = 'join';
  }

  toString() {
    return JSON.stringify(this);
  }

}

export { Join }
