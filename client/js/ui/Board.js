import { Player } from '/client/js/data/Player.js';
import { SvgAsset } from '/client/js/ui/SvgAsset.js';
import { SvgPlayer } from '/client/js/ui/SvgPlayer.js';

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

  async draw(boardSvgUrl) {
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

  onElementDragged(cb) {
    this.onElementDraggedCallback = cb;
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
      else if (el.elementType == 'player')
        svgElement = new SvgPlayer(el, this, this.zpdGroup, this.config);
      this.svgElements[id] = svgElement;
      svgElement.onDragEnd(this.onElementDraggedCallback);
    }
    svgElement.draw(el);
    return svgElement;
  }

}

export { Board }
