var fs = require('fs');
var path = require('path');

const BOARD1 = [
  ['grass1', 'grass2'],
  ['grass3', 'grass4']
]

class BoardLoader {

  static checkBoardSyntax(jsonStr) {
    JSON.parse(jsonStr);
    return true;
  }

  static getBoard(name) {
    var board = BOARD1;
    var filepath = path.join(`${__dirname}/../../board/${name}.json`);
    try {
      var boardJson = fs.readFileSync(filepath);
      board = JSON.parse(boardJson)
    } catch {
      //noop
    }
    return board;
  }

  static saveBoard(name, json) {
    BoardLoader.checkBoardSyntax(json);
    var filepath = path.join(`${__dirname}/../../board/${name}.json`);
    fs.writeFileSync(filepath, json);
  }

}

module.exports = BoardLoader;
