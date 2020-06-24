
//import Snap

class Board {
  constructor(user, room, svgSelector) {
    this.config = null;
    this.tileDim = null;
    this.pieces = [];
    this.canvas = null;
    this.context = null;
    this.user = user;
    this.room = room;
    this.svgSelector = svgSelector;
    this.paper = null;
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

  async init(el) {
    this.config = await this.getConfig(this.room);
    this.paper = Snap(this.svgSelector);
    this.paper.text(650, 100, 'drag me');

    Snap.load(`/asset/${this.config.boardSvg}`, data => {
      //console.log("here is data", data);
      this.paper.append(data.node);
      //var g = this.paper.g(data);
      //this.paper.append(g);
      this.paper.zpd({ drag: false });
    });
  }

  async getConfig(room) {
    var resp = await fetch(`/api/${room}/config`, {
      method: 'get'
    })
    var json = await resp.json();
    return json;
  }

}

export { Board }
