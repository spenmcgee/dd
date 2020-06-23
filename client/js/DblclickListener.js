class Listener {

  constructor(el) {
    this.el = el;

    this.el.addEventListener("dblclick", (evt) => {
      var x=evt.clientX, y=evt.clientY;
      var e = new CustomEvent('doubleclick', {detail:{x:x,y:y}});
      this.el.dispatchEvent(e);
    }, false);

  }

  onDoubleClick(cb) {
    this.el.addEventListener('doubleclick', e => {
      cb(e);
    }, false);
  }

}

export { Listener as DblclickListener }
