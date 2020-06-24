var fs = require('fs');
var path = require('path');
var DATA_ROOT = process.env.DATA_ROOT || '/var/dd';

class BoardLoader {

  static checkBoardSyntax(jsonStr) {
    JSON.parse(jsonStr);
    return true;
  }

  static getConfig(room) {
    var board = {};
    var filepath = path.join(DATA_ROOT, `${room}-config.json`);
    try {
      var boardJson = fs.readFileSync(filepath);
      board = JSON.parse(boardJson)
    } catch {
      //noop
    }
    return board;
  }

  static saveConfig(room, json) {
    BoardLoader.checkBoardSyntax(json);
    var filepath = path.join(DATA_ROOT, `${room}-config.json`);
    fs.writeFileSync(filepath, json);
  }

}

module.exports = BoardLoader;
