//const CommandParser = require('./CommandParser');

class ChatJoinEventHandler {

  constructor(chatServer, userJoinCallback) {
    //this.userJoinCallback = null;
    //this.chatServer = chatServer;
    //this.wireup(chatServer);
    this.wireup(chatServer, userJoinCallback);
  }

  wireup(chatServer, userJoinCallback) {
    chatServer.addMessageListener((data, wss, client) => {
      var outboundDataArray = [Object.assign({}, data)];
      if (data.meta) {
        if (data.meta == 'join') {
          var user = {
            id: data.id,
            user: data.user,
            room: data.room,
            client: client
          }
          if (userJoinCallback)
            userJoinCallback(user);
        }
      }
      return outboundDataArray;
    })
  }

}

module.exports = ChatJoinEventHandler;
