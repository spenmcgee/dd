import { Player } from '/client/js/data/Player.js';
//import Snap

class Board {
  constructor(user, room, svgSelector) {
    this.config = null;
    this.room = room;
    this.svgSelector = svgSelector;
    this.paper = Snap(this.svgSelector);
    this.playerSvgTable = {};
  }

  async loadSvg(url) {
    return new Promise(r => Snap.load(url, data => r(data)));
  }

  redrawPlayers(players) {
    players.forEach(player => {
      console.log("(Board.redrawPlayers) redrawing", player.id, player.localMatrix);
      this.transformPlayer(player, player.localMatrix);
    })
  }

  transformPlayer(p, localMatrix) {
    if (localMatrix) {
      var m = Snap.matrix(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.e, localMatrix.f);
      var piece = this.playerSvgTable[p.id];
      piece.transform(m);
    }
  }

  movePlayer(p, direction) {
    var x = direction[2]*-5||direction[3]*5, y = direction[0]*-5||direction[1]*5;
    var piece = this.playerSvgTable[p.id];
    var m = piece.transform().localMatrix;
    console.log("here moving, localMatrix is ", m);
    m.translate(x, y);
    piece.transform(m);
    return m;
  }

  async drawPlayer(p) {
    var text = this.paper.text(p.x-20, p.y-10, p.user);
    var circ = this.paper.circle(p.x, p.y, 10);
    console.log("here we draw player", p);
    circ.attr('fill', p.color);
    var group = this.paper.group(circ, text);
    group.altDrag();
    p.snapSvgGroup = group;
    this.playerSvgTable[p.id] = group;
    this.paper.zpd('save', (err, data) => {
      this.paper.zpd('destroy');
      this.paper.zpd({load:data});
      if (p.localMatrix) {
        this.transformPlayer(p, p.localMatrix);
      } else {
        p.localMatrix = group.transform().localMatrix;
      }
      return group;
    })
  }

  async drawBoard(el) {
    this.config = await this.getConfig(this.room);
    //this.paper.text(650, 100, 'drag me');
    var svgData = await this.loadSvg(this.config.boardSvg);
    this.paper.append(svgData.node);
    this.paper.zpd({drag:false});
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
