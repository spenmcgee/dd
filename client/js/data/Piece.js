import { Cookie } from '../Cookie.js';

class Piece {

  constructor(name, color, x, y, localMatrix) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.localMatrix = localMatrix;
    this.snapSvgGroup = null;
  }

  toString() {
    var data = {
      name: this.name,
      color: this.color,
      x: this.x,
      y: this.y,
      localMatrix: this.snapSvgGroup.transform().localMatrix
    }
    return JSON.stringify(data);
  }

}

export { Piece }
