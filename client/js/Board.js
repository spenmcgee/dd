class Board {
  constructor(tiles, tileSize) {
    this.tiles = tiles;
    this.tileSize = tileSize;
    let { canvas, context } = this.buildCanvas(tiles.length, tileSize);
    this.canvas = canvas;
    this.context = context;
  }

  async init() {
    await this.layTiles(this.context);
  }

  buildCanvas(numTiles, tileSize) {
    var canvas = document.createElement("canvas");
    canvas.id = "board";
    canvas.width = numTiles*tileSize;
    canvas.height = numTiles*tileSize;
    //canvas.style.zIndex = 8;
    //canvas.style.position = "absolute";
    //canvas.style.border = "0px";
    canvas.style['background-color'] = 'gray';
    var context = canvas.getContext("2d");
    return { canvas, context };
  }

  async layTile(ctx, tileName, px, py) {
    var img = new Image();
    img.src = `client/img/${tileName}.png`;
    return new Promise(r => {
      img.onload = () => {
        ctx.drawImage(img, px, py);
        r();
      };
    })
  }

  async layTiles(ctx) {
    var scale = this.tileSize;
    var px = 0, py = 0;
    var proms = [];
    for (var row=0; row<this.tiles.length; row++) {
      py = row*scale;
      for (var col=0; col<this.tiles[row].length; col++) {
        px = col*scale;
        var tileName = this.tiles[row][col];
        if (tileName) {
          var p = this.layTile(ctx, tileName, px, py);
          proms.push(p);
        }
      }
    }
    return Promise.all(proms);
  }

}

export { Board }
