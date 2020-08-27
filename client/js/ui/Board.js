
class Board {
  constructor(user, room, svgSelector, config) {
    this.config = config || {};
    this.user = user;
    this.room = room;
    this.isDM = user=='DM';
    this.svgSelector = svgSelector;
    this.paper = Snap(this.svgSelector);
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

  onPieceDragged(cb) {
    this.onPieceDraggedCallback = cb;
  }

}

export { Board }
