import { Player } from '/client/js/data/Player.js';
const PIECE_SIZE = 5;

class Board {
  constructor(user, room, svgSelector) {
    this.config = null;
    this.user = user;
    this.room = room;
    this.isDM = user=='DM';
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
    var x = direction[2]*-PIECE_SIZE||direction[3]*PIECE_SIZE, y = direction[0]*-PIECE_SIZE||direction[1]*PIECE_SIZE;
    var piece = this.playerSvgTable[p.id];
    var m = piece.transform().localMatrix;
    console.log("here moving, localMatrix is ", m);
    m.translate(x, y);
    piece.transform(m);
    return m;
  }

  drawPlayer(p) {
    //var text = this.paper.text(p.x+PIECE_SIZE*2, p.y+PIECE_SIZE/2, p.user);
    var circ = this.paper.circle(p.x, p.y, 10);
    circ.attr('fill', p.color);
    //var group = this.paper.group(circ, text);
    var group = this.paper.group(circ);
    group.id = p.id;
    group.user = p.user;
    group.room = p.room;
    if (this.isDM) {
      group.altDrag();
    }
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
