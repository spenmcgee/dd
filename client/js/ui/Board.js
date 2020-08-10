import { Player } from '/client/js/data/Player.js';
import { SvgAsset } from '/client/js/ui/SvgAsset.js';

class Board {
  constructor(user, room, svgSelector, config) {
    this.config = config || {};
    this.user = user;
    this.room = room;
    this.isDM = user=='DM';
    this.svgSelector = svgSelector;
    this.paper = Snap(this.svgSelector);
    this.svgElements = {};
    this.zpdGroup = null;
  }

  async loadSvg(url) {
    return new Promise(r => Snap.load(url, data => r(data)));
  }

  async draw(el, boardSvgUrl) {
    var svgData = await this.loadSvg(boardSvgUrl);
    this.paper.append(svgData);
    this.paper.zpd({drag:false});
    this.zpdGroup = Snap.select('#snapsvg-zpd-'+this.paper.id);
  }

  redrawElements(elementTable) {
    var elements = Object.keys(elementTable).map(id => elementTable[id]);
    elements.forEach(el => {
      this.redrawElement(el);
    })
  }

  onElementMoved(cb) {
    this.onElementMovedCallback = cb;
    console.log("setup", this.onElementMovedCallback)
  }

  async redrawElement(el) {
    var id = el.id;
    var svgElement;
    if (id in this.svgElements) {
      svgElement = this.svgElements[id];
    } else {
      var svgElement = null;
      if (el.elementType == 'asset')
        svgElement = new SvgAsset(el, this, this.zpdGroup, this.config);
      this.svgElements[id] = svgElement;
      svgElement.onDragEnd(this.onElementMovedCallback);
    }
    svgElement.draw(el);
  }

}

export { Board }
