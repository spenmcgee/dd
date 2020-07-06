const WebSocket = require('ws');

class MsgServer {

  constructor(port) {
    this.wss = new WebSocket.Server({ port: port });
    this.messageHandlers = [];
    this.wireup(this.wss);
    this.rooms = {};
  }

  roomHasPlayer(room, id) {
    return this.rooms[room].reduce((o,p) => ((p.id==id)||o), false);
  }

  setClient(user, client) {
    if (!(user.room in this.rooms)) {
      this.rooms[user.room] = [];
    }
    if (!(this.roomHasPlayer(user.room, user.id))) {
      this.rooms[user.room].push({
        id: user.id,
        client: client
      });
    } else {
      this.rooms[user.room].forEach(p => {
        if (p.id == user.id)
          p.client = client;
      })
    }
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
        if (typeof(h.handler) == 'object')
          return h.handler.handle(data, wss, ws);
        else
          return h.handler(data, wss, ws);
      }
    })
    .flat()
    .filter(x=>x);
    outboundDataArray = outboundDataArray.map(x => x.projectForWire ? x.projectForWire() : x);
    console.log("(MsgServer.onMessage) outbound data", JSON.stringify(outboundDataArray));
    this.broadcast(outboundDataArray);
  }

  wireup(wss) {
    wss.on('connection', ws => {
      ws.on('message', json => this.onMessage(json, wss, ws));
    })
  }

}

module.exports = MsgServer;
