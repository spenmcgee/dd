const CommandParser = require('./CommandParser');

class ChatController {

  constructor() {
    this.users = {};
    this.rooms = {};
  }

  dispatch(data, wss, client) {
    var outboundDataArray = [Object.assign({}, data)];

    if (data.meta) {
      if (data.meta == 'join') {
        var user = {
          id: data.id,
          user: data.user,
          room: data.room,
          client: client
        }
        this.users[data.id] = user;
        if (!(data.room in this.rooms)) this.rooms[data.room] = [];
        this.rooms[data.room].push(user);
      }
    }

    var messageText = data.messageText;
    var parser = new CommandParser(messageText);
    var cmd = parser.parse(messageText);
    if (cmd) {
      var results = parser.execute(cmd);
      var resultData = Object.assign(data, results);
      outboundDataArray.push(resultData);
    }

    return outboundDataArray;
  }

}

module.exports = ChatController;
