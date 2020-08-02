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

  transformElement(e, localMatrix) {
    if (!(e.id in this.id2ElementTable)) return; //drawAsset hasnt finished yet
    if (!localMatrix) return;
    var m = Snap.matrix(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.e, localMatrix.f);
    var element = this.id2ElementTable[e.id];
    element.transform(m);
    var marked = element.select("#killSymbol") ? true : false;
    if ((!marked) && (e.killed)) {
      this.drawKillMark(element);
    }
  }

  drawKillMark(element) {
    var bb = element.getBBox();
    var lm = element.transform().localMatrix;
    var w = bb.width/lm.a, h = bb.height/lm.a;
    var p = this.paper.path(`m 0 0 l ${w} ${h} m -${w} 0 l ${w} -${h}`)
     .attr({id:'killSymbol', stroke:'red', strokeWidth:20, opacity:0.4});
    element.add(p);
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
    var assetSize = this.config && this.config.assetSize || 40;
    var el = this.paper.svg();
    var group = this.paper.group(el);
    group.attr({width:assetSize, height:assetSize})
    group.elementType = 'asset';
    group.id = id;
    var svgData = await this.loadSvg(url);
    el.add(svgData);
    var bb = group.getBBox();
    var scale = assetSize/Math.max(bb.width, bb.height);
    el.attr({width:bb.width,height:bb.height});
    group.transform(`s ${scale}`);
    this.paper.append(group);
    if (this.isDM) {
      group.altDrag();
      this.setupKillable(group);
    }
    if (asset.killed) {
      this.drawKillMark(group);
    }
    this.paper.zpd('save', (err, data) => {
      this.paper.zpd('destroy');
      this.paper.zpd({load:data});
      this.id2ElementTable[id] = group;
    })
    return group.transform().localMatrix;
  }

  onKill(killCallback) {
    this.killCallback = killCallback;
  }

  setupKillable(group) {
    group.dblclick(e => {
      this.killCallback(group.id, group, e);
    })
  }

  drawPlayer(p) {
    var circ = this.paper.circle(p.x, p.y, 10);
    circ.attr('fill', p.color);
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
    })
    return group.transform().localMatrix;
  }

  redrawLayers(maskControls) {
    var zpdGroup = Snap.select('#snapsvg-zpd-'+this.paper.id);
    if (this.isDM)
      maskControls.drawMaskBg();
    for (var id of Object.keys(this.id2ElementTable)) {
      var el = this.id2ElementTable[id];
      if (el.elementType == 'asset') {
        zpdGroup.add(el);
      }
    }
    maskControls.drawFullMask();
    for (var id of Object.keys(this.id2ElementTable)) {
      var el = this.id2ElementTable[id];
      if (el.elementType == 'player') {
        zpdGroup.add(el);
      }
    }
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
