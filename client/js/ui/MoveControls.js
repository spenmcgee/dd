class MoveControls {

  constructor() {
    this.upEl = document.getElementById('up');
    this.downEl = document.getElementById('down');
    this.leftEl = document.getElementById('left');
    this.rightEl = document.getElementById('right');

    this.upEl.addEventListener('click', this.move(1,0,0,0))
    this.downEl.addEventListener('click', this.move(0,1,0,0))
    this.leftEl.addEventListener('click', this.move(0,0,1,0))
    this.rightEl.addEventListener('click', this.move(0,0,0,1))
  }

  move(u,d,l,r) {
    return e => {
      this.cb([u,d,l,r]);
    }
  }

  onMove(cb) {
    this.cb = cb;
  }

}

export { MoveControls }
