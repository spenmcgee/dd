import { Element } from './Element.js';

class Asset extends Element {

  constructor(id, room, url, localMatrix, killed) {
    super();
    this.elementType = 'asset';
    this.id = id;
    this.room = room;
    this.url = url;
    this.localMatrix = localMatrix;
    this.snapSvgGroup = null;
    this.killed = killed;
  }

  toString() {
    return JSON.stringify({
      meta: this.meta,
      elementType: this.elementType,
      id: this.id,
      room: this.room,
      url: this.url,
      localMatrix: this.localMatrix,
      killed: this.killed
    });
  }

}

export { Asset }
