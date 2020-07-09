import { Element } from './Element.js';

class Player extends Element {

  constructor(paper, id, user, room, color, localMatrix) {
    super();
    this.elementType = 'player';
    this.paper = paper;
    this.id = id;
    this.user = user;
    this.room = room;
    this.color = color;
    this.x = 100;
    this.y = 100;
    this.localMatrix = localMatrix;
    this.snapSvgGroup = null;
  }

  toString() {
    return JSON.stringify({
      meta: this.meta,
      elementType: this.elementType,
      id: this.id,
      user: this.user,
      room: this.room,
      color: this.color
    });
  }

}

export { Player }
