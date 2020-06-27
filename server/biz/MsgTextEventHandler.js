
class MsgTextEventHandler {

  constructor() {
  }

  handle(data) {
    var outboundData = [Object.assign({}, data)];
    return outboundData;
  }

}

module.exports = MsgTextEventHandler;
