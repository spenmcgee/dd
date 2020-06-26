const WebSocket = require('ws');

class ChatServer {

  constructor(port) {
    this.wss = new WebSocket.Server({ port: port });
    this.messageListeners = [];
    this._wireup(this.wss);
    this.rooms = {};
  }

  playerJoin(user) {
    if (!(user.room in this.rooms)) {
      this.rooms[user.room] = [];
    }
    this.rooms[user.room].push(user);
  }

  addMessageListener(cb) {
    //this.onMessageCallback = cb;
    this.messageListeners.push(cb);
  }

  _wireup(wss) {
    var server = this;
    wss.on('connection', function(ws) {
      ws.on('message', function(json) {
        console.log("(server#ws) incoming data", json);
        var data = JSON.parse(json);
        var outboundDataArray = server.messageListeners.map(cb => cb(data, wss, ws)).flat().filter(x=>x);
        console.log("(server#ws) outbound data", outboundDataArray);
        outboundDataArray.forEach(outboundData => {
          var outboundRoom = outboundData.room;
          if (outboundRoom in server.rooms) {
            server.rooms[outboundRoom].forEach(user => {
              if (user.client.readyState === WebSocket.OPEN) {
                user.client.send(JSON.stringify(outboundData));
              }
            })
          }
        })
      })
    })
  }

}

module.exports = ChatServer;
