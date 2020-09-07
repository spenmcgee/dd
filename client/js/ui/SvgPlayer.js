import { SvgElement } from '/client/js/ui/SvgElement.js';

const PLAYER_SIZE = 20;
const MOVE_STEP_SIZE = 15;

class SvgPlayer extends SvgElement {

  constructor(elData, board, zpdGroup, config) {
    super(elData, board, zpdGroup, config);
    this.color = elData.color;
    this.playerSize = config.playerSize || PLAYER_SIZE;
    this.moveStepSize = config.moveStepSize || MOVE_STEP_SIZE;
  }

  set(elData) {
    this.color = elData.color;
    if (elData.localMatrix) {
      var lm = elData.localMatrix;
      this.localMatrix = Snap.matrix(lm.a, lm.b, lm.c, lm.d, lm.e, lm.f);
    }
  }

  move(p, direction) {
    var x = direction[2]*-this.moveStepSize||direction[3]*this.moveStepSize, y = direction[0]*-this.moveStepSize||direction[1]*this.moveStepSize;
    var m = this.el.transform().localMatrix;
    m.translate(x, y);
    this.el.transform(m);
    return m;
  }

  async draw() {
    if (this.init) {
      this.init = false;
      var circ = this.paper.circle(100, 100, this.playerSize);
      circ.attr('fill', this.color);
      var group = this.paper.group(circ);
      if (this.isGM) {
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
