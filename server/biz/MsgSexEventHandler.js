const random = require('random');

var sexes = [
  'some dildos fall off the shelf',
  'immediate boner',
  'glances sexily',
  'eskimo kisses you gently',
  'performs an attitude pose',
  'kisses your neck tenderly',
  'you have sex but get crabs'
]
var rand = random.uniformInt(min = 0, max = sexes.length-1);

class MsgSexEventHandler {

  constructor() {
  }

  handle(data, wss, ws) {
    var messageText = data.messageText;
    var cmd = this.parse(messageText);
    if (cmd) {
      var results = this.execute(cmd, data);
      return Object.assign({}, data, results);
    }
    return null;
  }

  execute(cmd, data) {
    if (cmd.method == 'sex') {
      var text = sexes[rand()];
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
    if (cmd == 'sex') {
      return {
        method: 'sex'
      }
    }
    return null;
  }

}

module.exports = MsgSexEventHandler;
