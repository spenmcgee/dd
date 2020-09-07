import { SvgElement } from '/client/js/ui/SvgElement.js';

const ASSET_SIZE = 100;

class SvgAsset extends SvgElement {

  constructor(elData, board, zpdGroup, config) {
    super(elData, board, zpdGroup, config);
    this.url = elData.url;
    this.killed = elData.killed;
  }

  set(elData) {
    this.url = elData.url;
    this.killed = elData.killed;
    if (elData.localMatrix) {
      var lm = elData.localMatrix;
      this.localMatrix = Snap.matrix(lm.a, lm.b, lm.c, lm.d, lm.e, lm.f);
    }
  }

  async loadSvg(url) {
    return new Promise(r => Snap.load(url, data => r(data)));
  }

  async draw() {
    var assetSize = this.config && this.config.assetSize || ASSET_SIZE;
    if (this.init) {
      this.init = false;
      var group = this.el = this.paper.group();
      var svgData = await this.loadSvg(this.url);
      group.add(svgData);
      this.zpdGroup.add(group);

      var bb = group.getBBox();
      var scale = assetSize/Math.max(bb.width, bb.height);
      this.el.transform(`s${scale}`);

      if (this.isGM) {
        this.setupDraggable(this.el);
      }
      // if (asset.killed) {
        //this.drawKillMark(this.el);
      // }
    }
    if (this.localMatrix) {
      this.el.transform(this.localMatrix);
    }

  }

  drawKillMark(element) {
    console.log("here")
    var bb = element.getBBox();
    var lm = element.transform().localMatrix;
    var w = bb.width/lm.a, h = bb.height/lm.a;
    //var p = this.paper.path(`m 0 0 l ${w} ${h} m -${w} 0 l ${w} -${h}`)
    // .attr({id:'killSymbol', stroke:'red', strokeWidth:20, opacity:0.4});
    var p = this.paper.rect(0, 0, w, h).attr({fill:'red', opacity:0.4})
    element.add(p);
  }

}

export { SvgAsset }
