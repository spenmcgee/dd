class Listener {

  constructor(el) {
    this.el = el;
    this.sx = 0;
    this.sy = 0;
    this.dx = 0;
    this.dy = 0;
    this.dragging = false;

    this.el.addEventListener("mousedown", (evt) => {
      this.sx = evt.clientX, this.sy=evt.clientY;
      this.dragging = true;
    }, false);

    this.el.addEventListener("mousemove", (evt) => {
      if (this.dragging) {
        this.dx=evt.clientX-this.sx, this.dy=evt.clientY-this.sy;
        var e = new CustomEvent('drag', {detail:{dx:this.dx,dy:this.dy}});
        this.el.dispatchEvent(e);
      }
    }, false);

    this.el.addEventListener("mouseup", (evt) => {
      this.dragging = false;
    }, false);

  }

  onDrag(cb) {
    this.el.addEventListener('drag', e => {
      cb(e);
    }, false);
  }
}

export { Listener as DragListener }
