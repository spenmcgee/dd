import { SvgElement } from '/client/js/ui/SvgElement.js';

const PIECE_SIZE = 5;

class SvgPlayer extends SvgElement {

  constructor(elData, board, zpdGroup, config) {
    super(elData, board, zpdGroup, config);
    this.color = elData.color;
  }

  set(elData) {
    this.color = elData.color;
    if (elData.localMatrix) {
      var lm = elData.localMatrix;
      this.localMatrix = Snap.matrix(lm.a, lm.b, lm.c, lm.d, lm.e, lm.f);
    }
  }

  move(p, direction) {
    var x = direction[2]*-PIECE_SIZE||direction[3]*PIECE_SIZE, y = direction[0]*-PIECE_SIZE||direction[1]*PIECE_SIZE;
    var m = this.el.transform().localMatrix;
    m.translate(x, y);
    this.el.transform(m);
    return m;
  }

  async draw() {
    if (this.init) {
      this.init = false;
      var circ = this.paper.circle(100, 100, 10);
      circ.attr('fill', this.color);
      var group = this.paper.group(circ);
      if (this.isDM) {
        this.setupDraggable(group);
      }
      this.el = group;
      this.board.zpdGroup.add(this.el);
    }
    if (this.localMatrix) {
      this.el.transform(this.localMatrix);
    }
  }

}

export { SvgPlayer }