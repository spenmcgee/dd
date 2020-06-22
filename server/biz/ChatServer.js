const WebSocket = require('ws');

class ChatServer {

  constructor(port, controller) {
    this.wss = new WebSocket.Server({ port: port });
    this.controller = controller;
    this._wireup(this.wss, this.controller);
  }

  _wireup(wss, controller) {
    wss.on('connection', function(ws) {
      ws.on('message', function(json) {
        console.log("(server#ws) incoming data", json)
        var data = JSON.parse(json);
        var outboundData = controller.dispatch(data, wss, ws);
        var outboundRoom = outboundData.room;
        if (outboundRoom in controller.rooms) {
          controller.rooms[outboundRoom].forEach(user => {
            if (user.client.readyState === WebSocket.OPEN) {
              user.client.send(JSON.stringify(outboundData));
            }
          })
        }
      })
    })
  }

}

module.exports = ChatServer;
