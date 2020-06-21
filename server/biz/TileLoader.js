const fs = require('fs');
const path = require('path');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';

class TileLoader {

  static async loadTiles() {
    const directoryPath = path.join(DATA_ROOT, 'tile');
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
