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
    }
    var dragMove = function(dx, dy, ev, x, y) {
      var zoomPan = this.paper.zpd('save');
      this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx / zoomPan.a, dy / zoomPan.a]
      });
    }
    var dragEnd = function() {
    }
  });
}

export default setup;
