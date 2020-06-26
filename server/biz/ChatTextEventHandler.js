
class ChatTextEventHandler {

  constructor() {
  }

  handle(data) {
    var outboundData = [Object.assign({}, data)];
    return outboundData;
  }

}

module.exports = ChatTextEventHandler;
