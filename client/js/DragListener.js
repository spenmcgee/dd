class Listener {

  constructor(el) {
    this.el = el;
    this.sx = 0;
    this.sy = 0;
    this.dx = 0;
    this.dy = 0;
    this.dragging = false;
    this.cx = 0;
    this.cy = 0;

    this.el.addEventListener("mousedown", (evt) => {
      this.sx=evt.clientX, this.sy=evt.clientY;
      this.dragging = true;
      console.log("mousedown")
    }, false);

    this.el.addEventListener("mousemove", (evt) => {
      console.log("mousemove")
      if (this.dragging) {
        this.dx=evt.clientX-this.sx, this.dy=evt.clientY-this.sy;
        var e = new CustomEvent('drag', {detail:{dx:this.dx+this.cx,dy:this.dy+this.cy}});
        this.el.dispatchEvent(e);
      }
    }, false);

    this.el.addEventListener("mouseup", (evt) => {
      this.dragging = false;
      this.cx += this.dx;
      this.cy += this.dy;
      console.log("mouseup")
    }, false);

  }

  onDrag(cb) {
    this.el.addEventListener('drag', e => {
      cb(e);
    }, false);
  }
}

export { Listener as DragListener }
