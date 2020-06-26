import { BoardMovementControls } from '/client/js/ui/BoardMovementControls.js';
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
    this.movementControls = new BoardMovementControls(
      document.getElementById('up'),
      document.getElementById('down'),
      document.getElementById('left'),
      document.getElementById('right'),
    )
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

  async loadSvg(url) {
    return new Promise(r => Snap.load(url, data => r(data)));
  }

  async init(el) {
    this.config = await this.getConfig(this.room);
    this.paper = Snap(this.svgSelector);
    //this.paper.text(650, 100, 'drag me');
    var svgData = await this.loadSvg(`/asset/${this.config.boardSvg}`);
    this.paper.append(svgData.node);
    this.paper.zpd({drag:false});

    //var text = this.paper.text(630, 85, this.user);
    var circ = this.paper.circle(650, 100, 10);
    var piece = this.paper.group(circ);
    //piece.mouseover(e => { alert('here')})
    piece.altDrag();
    this.paper.zpd('destroy');
    this.paper.zpd();

    document.getElementById('up').onmousedown = function () {
      var m = piece.transform().localMatrix;
      m.translate(0, 5);
      piece.transform(m);
    };

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
