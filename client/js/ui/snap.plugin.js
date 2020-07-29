var onDragEndCallback = null;

function onDragEnd(cb) {
  onDragEndCallback = cb;
}

function setup() {
  eve.on("snap.drag.start", function(x, y, e) {
    e.stopPropagation();
  });
  Snap.plugin( function( Snap, Element, Paper, global ) {
    Element.prototype.altDrag = function() {
      this.drag( dragMove, dragStart, dragEnd );
      return this;
    }
    var dragStart = function ( x,y,ev ) {
      this.data('origTransform', this.transform().local );
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
      if (onDragEndCallback && this.moved) {
        onDragEndCallback(this, this.transform(), e);
      }
    }
  });
}

export default {
  setup: setup,
  onDragEnd: onDragEnd
}
