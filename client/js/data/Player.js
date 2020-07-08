class Player {

  constructor(paper, id, user, room, color, localMatrix) {
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
      id: this.id,
      user: this.user,
      room: this.room,
      color: this.color
    });
  }

}

export { Player }
