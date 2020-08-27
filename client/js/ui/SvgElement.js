class SvgElement {

  constructor(elData, board, zpdGroup, config) {
    this.id = elData.id;
    this.board = board;
    this.paper = board.paper;
    this.config = config;
    this.init = true;
    this.el = null;
    this.zpdGroup = zpdGroup;
    this.isDM = board.isDM;
    this.elementType = elData.elementType;
    this.user = elData.user;
    this.room = elData.room;
    this.localMatrix = elData.localMatrix;
  }

  onDragEnd(onDragEndCallback) {
    this.onDragEndCallback = onDragEndCallback;
  }

  setupDraggable(group) {
    var self = this;
    eve.on("snap.drag.start", function(x, y, e) { //a snapsvg global thing i guess
      e.stopPropagation();
    });
    var dragStart = function (x, y, ev) {
      this.data('origTransform', this.transform().local);
      this.moved = false;
    }
    var dragMove = function(dx, dy, ev, x, y) {
      this.moved = true;
      var zoomPan = this.paper.zpd('save');
      this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx / zoomPan.a, dy / zoomPan.a]
      });
    }
    var dragEnd = function(e) {
      if (self.onDragEndCallback && this.moved) {
        self.onDragEndCallback(this.transform(), self, e);
      }
    }
    group.drag(dragMove, dragStart, dragEnd);
  }

}

export { SvgElement }
