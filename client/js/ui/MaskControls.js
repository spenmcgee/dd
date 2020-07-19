class MaskControls {
  constructor(board) {
    this.board = board;
    this.zpdData = null;
    this.el = document.createElement('span');
    this.mode = 'none';
    this.dragMode = false;

    this.maskButton = document.createElement('button');
    this.maskButton.append("mask");
    this.unmaskButton = document.createElement('button');
    this.unmaskButton.append("unmask");

    this.el.append(this.maskButton);
    this.el.append(this.unmaskButton);

    this.maskButton.addEventListener('click', e => {
      if (this.mode == 'mask')
        this.setupMode('none', this.mode);
      else
        this.setupMode('mask', this.mode);
    })
    this.unmaskButton.addEventListener('click', e => {
      if (this.mode == 'unmask')
        this.setupMode('none', this.mode);
      else
        this.setupMode('unmask', this.mode);
    })
  }

  setupMode(mode, prevMode) {
    this.mode = mode;
    this.maskButton.classList.remove('enabled');
    this.unmaskButton.classList.remove('enabled');
    this.dragMode = false;
    if (mode == 'mask') {
      this.maskButton.classList.add('enabled');
      this.dragMode = true;
    } else if (mode == 'unmask') {
      this.unmaskButton.classList.add('enabled');
      this.dragMode = true;
    }
    this.setupPointer(mode);
    if ((prevMode == 'none') && (mode != 'none'))
      this.board.paper.zpd('toggle');
    if ((prevMode != 'none') && (mode == 'none'))
      this.board.paper.zpd('toggle');

    this.setupDrag(this.dragMode);
  }

  setupPointer(mode) {
    if (mode != 'none') {
      document.getElementById('board').style.cursor = 'crosshair';
    } else {
      document.getElementById('board').style.cursor = 'auto';
    }
  }

  setupDrag(dragMode) {
    var paper = this.board.paper;
    var rect = null;
    var path = null;
    var pathStr = null;
    function onstart(x, y, e) {
      //noop
    }
    function onmove(dx, dy, x, y, e) {
      if (path) path.remove();
      pathStr = `m ${x-dx} ${y-dy} l ${dx} 0 l 0 ${dy} l ${-1*dx} 0 l 0 ${-1*dy}`;
      path = paper.path(pathStr);
      path.attr({stroke:"blue", strokeWidth:1, fill:"red", opacity:0.3});
      console.log("pathStr", pathStr)
    }
    function onend(e) {
      var finalPath = paper.path(pathStr);
      finalPath.attr({stroke:"blue", strokeWidth:1, fill:"red", opacity:0.4});
    }
    paper.drag(onmove, onstart, onend);
  }

}

export { MaskControls }
