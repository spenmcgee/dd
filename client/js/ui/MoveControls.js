class MoveControls {

  constructor() {
    var upEl = document.createElement('button');
    var downEl = document.createElement('button');
    var leftEl = document.createElement('button');
    var rightEl = document.createElement('button');

    upEl.append("up");
    downEl.append("down");
    leftEl.append("left");
    rightEl.append("right");

    this.el = document.createElement('span');
    this.el.append(upEl);
    this.el.append(downEl);
    this.el.append(leftEl);
    this.el.append(rightEl);

    upEl.addEventListener('click', this.move(1,0,0,0));
    downEl.addEventListener('click', this.move(0,1,0,0));
    leftEl.addEventListener('click', this.move(0,0,1,0));
    rightEl.addEventListener('click', this.move(0,0,0,1));

    document.addEventListener('keydown', e => {
      if (e.keyCode == 38) { //up
        this.cb([1,0,0,0]);
      } else if (e.keyCode == 40) { //down
        this.cb([0,1,0,0]);
      } else if (e.keyCode == 37) { //left
         this.cb([0,0,1,0]);
      } else if (e.keyCode == 39) { //right
         this.cb([0,0,0,1]);
      }
    })
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
