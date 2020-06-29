const WebSocket = require('ws');

class MsgServer {

  constructor(port) {
    this.wss = new WebSocket.Server({ port: port });
    this.messageHandlers = [];
    this.wireup(this.wss);
    this.rooms = {};
  }

  addClient(user) {
    if (!(user.room in this.rooms)) {
      this.rooms[user.room] = [];
    }
    this.rooms[user.room].push(user);
  }

  addHandler(handler) {
    this.messageHandlers.push(handler);
  }

  broadcast(outboundDataArray) {
    outboundDataArray.forEach(outboundData => {
      var outboundRoom = outboundData.room;
      if (outboundRoom in this.rooms) {
        this.rooms[outboundRoom].forEach(user => {
          if (user.client.readyState === WebSocket.OPEN) {
            //console.log(`(MsgServer.broadcast) sending to ${user.id}`);
            user.client.send(JSON.stringify(outboundData));
          }
        })
      }
    })
  }

  onMessage(json, wss, ws) {
    console.log("(MsgServer.onMessage) incoming data", json);
    var data = JSON.parse(json);
    var outboundDataArray = this.messageHandlers.map(h => {
      if (h.match(data)) {
        console.log("here checking", typeof(h.handler))
        if (typeof(h.handler) == 'object')
          return h.handler.handle(data, wss, ws);
        else
          return h.handler(data, wss, ws);
      }
    })
    .flat()
    .filter(x=>x);
    console.log("(MsgServer.onMessage) outbound data", outboundDataArray);
    this.broadcast(outboundDataArray);
  }

  wireup(wss) {
    wss.on('connection', ws => {
      ws.on('message', json => this.onMessage(json, wss, ws));
    })
  }

}

module.exports = MsgServer;
