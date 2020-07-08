class Asset {

  constructor(paper, id, room, url, localMatrix) {
    this.paper = paper;
    this.id = id;
    this.room = room;
    this.url = url;
    this.localMatrix = localMatrix;
    this.snapSvgGroup = null;
    this.meta = 'asset';
  }

  toString() {
    return JSON.stringify({
      meta: this.meta,
      id: this.id,
      room: this.room,
      url: this.url
    });
  }

}

export { Asset }
