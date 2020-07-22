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
    var maskPath = null;
    var mask = null, maskbg = null;
    var rects = [];

    function onstart(x, y, e) {
      rect = this.paper.rect(x,y,1,1).attr({fill:'red', opacity:0.3});
    }
    function onmove(dx, dy, x, y, e) {
      var attr = {width:Math.abs(dx), height:Math.abs(dy)};
      if (dx < 0) attr.x = x;
      if (dy < 0) attr.y = y;
      rect.attr(attr);
    }
    function onend(e) {
      rect.attr({fill:'white', opacity:1});
      rects.push(rect);
      rect.remove();
      mask = paper.g(...rects);
      var bb = mask.getBBox();
      if (maskbg) maskbg.remove();
      maskbg = paper.rect(bb).attr({fill:'yellow', mask:mask, opacity:0.5})
    }
    paper.drag(onmove, onstart, onend);
  }

}

export { MaskControls }
