import { Element } from './Element.js';

class Asset extends Element {

  constructor(paper, id, room, url, localMatrix) {
    super();
    this.elementType = 'asset';
    this.paper = paper;
    this.id = id;
    this.room = room;
    this.url = url;
    this.localMatrix = localMatrix;
    this.snapSvgGroup = null;
  }

  toString() {
    return JSON.stringify({
      meta: this.meta,
      elementType: this.elementType,
      id: this.id,
      room: this.room,
      url: this.url,
      localMatrix: this.localMatrix
    });
  }

}

export { Asset }
