const random = require('random');

class MsgRollEventHandler {

  constructor() {
  }

  handle(data, wss, ws) {
    var messageText = data.messageText;
    var cmd = this.parse(messageText);
    if (cmd) {
      var results = this.execute(cmd);
      return Object.assign({}, data, results);
    }
    return null;
  }

  execute(cmd) {
    if (cmd.method == 'roll') {
      var text = `${cmd.params.dieCount}d${cmd.params.dieSize} roll yeilds `;
      var total = 0;
      for (var i=1; i<=cmd.params.dieCount; i++) {
        var gen = random.uniformInt(1, cmd.params.dieSize);
        var r = gen();
        text += `${r}+`;
        total += r;
      }
      text = text.substr(0, text.length-1);
      text += ` = ${total}`;
      cmd.messageText = text;
    }
    return cmd;
  }

  parse(msg) {
    var cmd = null;
    var matches = msg.match(/\*([a-z]+)/);
    if (matches) {
      cmd = matches[1];
    }
    if (cmd == 'roll') {
      //return this.parseRoll(msg);
      var matches = msg.match(/\*roll(\((([1-9])d([0-9]+))\)){0,1}/);
      if (matches[3] && matches[4]) {
        return {
          method: 'roll',
          params: {
            dieCount: parseInt(matches[3]),
            dieSize: parseInt(matches[4])
          }
        }
      } else {
        return {
          method: 'roll',
          params: {
            dieCount: 1,
            dieSize: 6
          }
        }
      }
    }
    return null;
  }

}

module.exports = MsgRollEventHandler;
