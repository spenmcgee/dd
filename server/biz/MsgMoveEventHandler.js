const random = require('random');

class MsgMoveEventHandler {

  constructor() {
  }

  handle(data, wss, ws) {
    var outboundData = [Object.assign({}, data)];
    return outboundData;
  }

}

module.exports = MsgMoveEventHandler;
