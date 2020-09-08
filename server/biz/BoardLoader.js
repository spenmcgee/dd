var fs = require('fs');
var path = require('path');
var DATA_ROOT = process.env.DATA_ROOT || '/var/dd';
var logger = require("../logger");

class BoardLoader {

  static checkBoardSyntax(jsonStr) {
    try {
      JSON.parse(jsonStr);
    } catch (err) {
      logger.warning(`(BoardLoader) Bad json: ` + jsonStr);
      return false;
    }
    return true;
  }

  static getConfig(room) {
    var board = {};
    var filepath = path.join(DATA_ROOT, `${room}-config.json`);
    try {
      var boardJson = fs.readFileSync(filepath);
      board = JSON.parse(boardJson)
    } catch (err) {
      //noop
      logger.warning(`(BoardLoader) Bad json in room ${room}`, err);
    }
    return board;
  }

  static saveConfig(room, json) {
    var ok = BoardLoader.checkBoardSyntax(json);
    if (ok) {
      var filepath = path.join(DATA_ROOT, `${room}-config.json`);
      fs.writeFileSync(filepath, json);
    }
    return ok;
  }

}

module.exports = BoardLoader;
