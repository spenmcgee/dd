import { Cookie } from '../Cookie.js';

class Messages {

  constructor(wsClient) {
    this.id = Cookie.getCookie('id');
    this.user = Cookie.getCookie('user');
    this.room = Cookie.getCookie('room');
    this.client = wsClient;
  }

  buildData(data) {
    var clone = Object.assign({}, data);
    clone.id = this.id;
    clone.user = this.user;
    clone.room = this.room;
    return clone;
  }

  sendToServer(data) {
    return this.client.send(`${data}`);
  }

}

export { Messages }
