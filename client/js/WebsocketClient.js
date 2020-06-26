import { Cookie } from './Cookie.js';
import { Text } from './data/Text.js';
import { Join } from './data/Join.js';

class WebsocketClient {

  constructor(messageHandler) {
    this.id = Cookie.getCookie('id');
    this.user = Cookie.getCookie('user');
    this.room = Cookie.getCookie('room');
    this.messageHandlers = [];
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  send(data) {
    this.socket.send(data);
  }

  connect() {
    var id = this.id, room = this.root, user = this.user;
    var socket = new WebSocket(`ws://${location.hostname}:3001`);
    this.socket = socket;
    socket.onmessage = e => {
      let data = JSON.parse(e.data);
      console.log(`(WebsocketClient#socket.onmessage) incoming ${data.meta}`);
      this.messageHandlers.map(mh => {
        if (mh.match(data)) {
          if (typeof(mh.handler) == 'object')
            mh.handler.handle(data);
          else
            mh.handler(data);
        }
      })
    }
    socket.onopen = e => {
      this.send(new Join());
      this.send(new Text("joining room"));
    }
  }

}

export { WebsocketClient }
