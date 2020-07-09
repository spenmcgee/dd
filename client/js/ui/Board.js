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
    this.id2ElementTable = {};
  }

  async loadSvg(url) {
    return new Promise(r => Snap.load(url, data => r(data)));
  }

  redrawElements(elements) {
    elements.forEach(el => {
      this.transformElement(el, el.localMatrix);
    })
  }

  transformElement(p, localMatrix) {
    if (localMatrix) {
      var m = Snap.matrix(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.e, localMatrix.f);
      var el = this.id2ElementTable[p.id];
      el.transform(m);
    }
  }

  movePlayer(p, direction) {
    var x = direction[2]*-PIECE_SIZE||direction[3]*PIECE_SIZE, y = direction[0]*-PIECE_SIZE||direction[1]*PIECE_SIZE;
    var el = this.id2ElementTable[p.id];
    var m = el.transform().localMatrix;
    m.translate(x, y);
    el.transform(m);
    return m;
  }

  async drawElement(el) {
    if (el.elementType == 'player')
      return await this.drawPlayer(el);
    else if (el.elementType == 'asset')
      return await this.drawAsset(el);
  }

  async drawAsset(asset) {
    var id = asset.id;
    var url = asset.url;
    var svgData = await this.loadSvg(url);
    var el = this.paper.svg(100, 100, 30, 30)
    el.append(svgData.node);
    var group = this.paper.group(el);
    group.elementType = 'asset';
    group.id = id;
    var bb = group.getBBox();
    var max = bb.w > bb.h ? bb.w : bb.h;
    var scale = 30/max;
    group.transform(`s${scale}`);
    this.paper.append(group);
    group.altDrag();
    this.paper.zpd('save', (err, data) => {
      this.paper.zpd('destroy');
      this.paper.zpd({load:data});
    })
    this.id2ElementTable[id] = group;
    return group.transform().localMatrix;
  }

  drawPlayer(p) {
    //var text = this.paper.text(p.x+PIECE_SIZE*2, p.y+PIECE_SIZE/2, p.user);
    var circ = this.paper.circle(p.x, p.y, 10);
    circ.attr('fill', p.color);
    //var group = this.paper.group(circ, text);
    var group = this.paper.group(circ);
    group.elementType = 'player';
    group.id = p.id;
    group.user = p.user;
    group.room = p.room;
    if (this.isDM) {
      group.altDrag();
    }
    p.snapSvgGroup = group;
    this.id2ElementTable[p.id] = group;
    this.paper.zpd('save', (err, data) => {
      this.paper.zpd('destroy');
      this.paper.zpd({load:data});
      if (p.localMatrix) {
        this.transformElement(p, p.localMatrix);
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
