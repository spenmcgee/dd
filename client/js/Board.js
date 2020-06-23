class Board {
  constructor(tiles) {
    this.tiles = tiles;
    this.tileDim = null;
    this.pieces = [];
    this.canvas = null;
    this.context = null;
  }

  addPiece(piece) {
    this.pieces.push(piece);
    this.context.fillStyle = piece.color;
    this.context.fillRect(piece.x, piece.y, 20, 20);
  }

  async getTileDimentions(tiles) {
    var tile0 = tiles[0][0];
    var img = new Image();
    img.src = `/tile/${tile0}.png`;
    return new Promise(r => {
      img.onload = function() {
        r({width:this.width, height:this.height});
      }
    })
  }

  async init(tiles) {
    if (tiles) this.tiles = tiles;
    this.tileDim = await this.getTileDimentions(this.tiles);
    let { canvas, context } = this.buildCanvas(this.tiles.length, this.tileDim);
    this.canvas = canvas;
    this.context = context;
    await this.layTiles(this.context);
  }

  buildCanvas(numTiles, tileDim) {
    var canvas = document.createElement("canvas");
    canvas.id = "board";
    canvas.width = numTiles*tileDim.width;
    canvas.height = numTiles*tileDim.height;
    //canvas.style.zIndex = 8;
    //canvas.style.position = "absolute";
    //canvas.style.border = "0px";
    canvas.style['background-color'] = 'gray';
    var context = canvas.getContext("2d");
    return { canvas, context };
  }

  async layTile(ctx, tileName, px, py) {
    var img = new Image();
    img.src = `/tile/${tileName}.png`;
    return new Promise(r => {
      img.onload = () => {
        ctx.drawImage(img, px, py);
        r();
      };
    })
  }

  async layTiles(ctx) {
    var scaleW = this.tileDim.width, scaleH = this.tileDim.height;
    var px = 0, py = 0;
    var proms = [];
    for (var row=0; row<this.tiles.length; row++) {
      py = row*scaleW;
      for (var col=0; col<this.tiles[row].length; col++) {
        px = col*scaleH;
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
