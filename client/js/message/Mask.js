import { Message } from './Message.js';

class Mask extends Message {

  constructor(rects) {
    super();
    this.meta = 'mask';
    this.rects = rects;
  }

  toString() {
    var data = {
      meta: this.meta,
      id: this.id,
      user: this.user,
      room: this.room,
      rects: this.rects.map(r => {
        var m = r.transform().localMatrix;
        var x = parseInt(r.attr('x')) * m.a + m.e;
        var y = parseInt(r.attr('y')) * m.a + m.f;
        var w = parseInt(r.attr('width')) * m.a;
        var h = parseInt(r.attr('height')) * m.a;
        var sign = r.attr()['fill'] == '#ffffff' ? 1 : 0;
        return [x, y, w, h, sign];
      })
    }
    return JSON.stringify(data);
  }

}

export { Mask }
