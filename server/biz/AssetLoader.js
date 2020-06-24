const fs = require('fs');
const path = require('path');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';

class AssetLoader {

  static async loadAssets() {
    const directoryPath = path.join(DATA_ROOT);
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, function (err, files) {
        if (err) reject('Unable to scan directory: ' + err);
        else {
          var assets = [];
          files.forEach(function (filename) {
            if (filename == '.DS_Store') return;
            //var filename = filename.substring(0, filename.lastIndexOf('.')) || filename
            assets.push(filename);
          });
          resolve(assets);
        }
      });
    })
  }

}

module.exports = AssetLoader;
