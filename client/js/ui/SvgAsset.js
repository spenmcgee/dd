import { SvgElement } from '/client/js/ui/SvgElement.js';

class SvgAsset extends SvgElement {

  constructor(elData, board, zpdGroup, config) {
    super(elData, board, zpdGroup, config);
    this.url = elData.url;
  }

  async loadSvg(url) {
    return new Promise(r => Snap.load(url, data => r(data)));
  }

  async draw() {
    var assetSize = this.config && this.config.assetSize || 40;
    if (this.init) {
      this.init = false;
      var el = this.paper.svg();
      var group = this.paper.group(el);
      group.attr({width:assetSize, height:assetSize, id:this.id})
      group.elementType = 'asset';
      group.id = this.id;
      var svgData = await this.loadSvg(this.url);
      el.add(svgData);
      var bb = group.getBBox();
      var scale = assetSize/Math.max(bb.width, bb.height);
      el.attr({width:bb.width,height:bb.height});
      group.transform(`s ${scale}`);
      if (this.isDM) {
        this.setupDraggable(group);
        //this.setupKillable(group);
      }
      this.zpdGroup.add(group);
      this.el = group;
    } else {
      //translate and maybe scale
    }
    // if (asset.killed) {
    //   this.drawKillMark(group);
    // }

  }

}

export { SvgAsset }
