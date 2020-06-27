import { Player } from '/client/js/data/Player.js';
//import Snap

class Board {
  constructor(user, room, svgSelector) {
    this.config = null;
    this.pieces = [];
    this.user = user;
    this.players = {};
    this.room = room;
    this.svgSelector = svgSelector;
    this.paper = null;
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

    this.players[this.user] = new Player(this.user, piece);

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
