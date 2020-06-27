import { Cookie } from '../Cookie.js';

class Messages {

  constructor(wsClient) {
    this.id = Cookie.getCookie('id');
    this.user = Cookie.getCookie('user');
    this.room = Cookie.getCookie('room');
    this.client = wsClient;
    this.players = [];
    this.rooms = {};
  }

  buildData(data) {
    var clone = Object.assign({}, data);
    clone.id = this.id;
    clone.user = this.user;
    clone.room = this.room;
    return clone;
  }

  addPlayer(user) {
    if (!(user.room in this.rooms))
      this.rooms[user.room] = [];
    this.rooms[user.room].push(user);
    this.players.push(user);
  }

  sendToServer(data) {
    return this.client.send(`${data}`);
  }

}

export { Messages }
