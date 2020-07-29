const fs = require('fs');
const path = require('path');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';

class AssetLoader {

  static deleteAsset(room, filename) {
    var assetFilepath = path.join(DATA_ROOT, filename);
    console.log("(AssetLoader) Deleting asset", assetFilepath);
    fs.unlinkSync(assetFilepath);
  }

  static async loadAssets(room) {
    const directoryPath = path.join(DATA_ROOT);
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, function (err, files) {
        if (err) reject('Unable to scan directory: ' + err);
        else {
          var assets = [];
          files.forEach(function (filename) {
            if (filename == '.DS_Store') return;
            if (filename == `${room}-config.json`) return;
            if (filename.substr(0, room.length) == room)
              assets.push(filename);
          });
          resolve(assets);
        }
      });
    })
  }

}

module.exports = AssetLoader;
