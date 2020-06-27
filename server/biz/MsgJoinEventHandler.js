
class MsgJoinEventHandler {

  constructor(handlerCallback) {
    this.handlerCallback = handlerCallback;
  }

  handle(data, wss, client) {
    var outboundData = [Object.assign({}, data)];
    var user = {
      id: data.id,
      user: data.user,
      room: data.room,
      client: client
    }
    this.handlerCallback(user);
    outboundData.messageText = "joining room";
    return outboundData;
  }

}

module.exports = MsgJoinEventHandler;
