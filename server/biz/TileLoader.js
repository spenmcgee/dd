var fs = require('fs');
var path = require('path');

class TileLoader {
  static async loadTiles() {
    const directoryPath = path.join(__dirname, '/../../client/img');
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, function (err, files) {
        if (err) reject('Unable to scan directory: ' + err);
        else {
          var tiles = [];
          files.forEach(function (filename) {
            if (filename == '.DS_Store') return;
            var name = filename.substring(0, filename.lastIndexOf('.')) || filename
            tiles.push(name);
          });
          resolve(tiles);
        }
      });
    })
  }
}

module.exports = TileLoader;
