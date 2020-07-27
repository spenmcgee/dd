class MaskControls {
  constructor(board) {
    this.board = board;
    this.el = document.createElement('span');
    this.mode = 'none';
    this.dragMode = false;
    this.mask = null;
    this.maskbg = null;
    this.fullMask = null;
    this.rects = [];
    this.maskMode = false;

    this.maskButton = document.createElement('button');
    this.maskButton.append("mask");
    this.unmaskButton = document.createElement('button');
    this.unmaskButton.append("unmask");
    this.applyButton = document.createElement('button');
    this.applyButton.append("apply");

    this.el.append(this.maskButton);
    this.el.append(this.unmaskButton);
    this.el.append(this.applyButton);

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
    this.applyButton.addEventListener('click', e => {
      this.maskMode = !this.maskMode;
      if (this.maskMode) {
        this.viewMaskMode();
        this.applyButton.classList.add('enabled');
      } else {
        this.editMaskMode();
        this.applyButton.classList.remove('enabled');
      }
    })
  }

  editMaskMode() {
    var zpdGroup = Snap.select('#snapsvg-zpd-'+this.board.paper.id);
    this.fullMask.remove();
    this.maskbg.attr({mask:this.mask, fill:'yellow', opacity:0.3});
    zpdGroup.add(this.maskbg);
  }

  viewMaskMode() {
    var zpdGroup = Snap.select('#snapsvg-zpd-'+this.board.paper.id);
    this.buildFullMask();
  }

  buildFullMask() {
    var zpdGroup = Snap.select('#snapsvg-zpd-'+this.board.paper.id);
    var zpdCoordSpaceMatrix = Snap.matrix(this.board.paper.zpd('save'));
    var inverseCoordSpaceMatrix = zpdCoordSpaceMatrix.invert();
    var bb = this.board.paper.getBBox();
    var rect = this.board.paper.rect(bb).attr({fill:'white'});
    rect.transform(inverseCoordSpaceMatrix.toTransformString());
    var applyMask = this.board.paper.g(rect, this.maskbg);
    this.maskbg.attr({fill:'black', opacity:1});
    zpdGroup.add(applyMask);
    this.fullMask = this.board.paper.rect(rect.getBBox()).attr({mask:applyMask});
    zpdGroup.add(this.fullMask);
  }

  getMask() {
    return {
      rects: this.rects,
      mask: this.mask,
      maskbg: this.maskbg,
      fullMask: this.fullMask
    }
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
    if ((prevMode == 'none') && (mode != 'none')) { //masking, board still
      this.setupDrag(this.dragMode);
      this.boardStill();
    }
    else if ((prevMode != 'none') && (mode == 'none')) { //not masking, board moving
      this.boardMoving();
    }
  }

  boardMoving() {
    this.board.paper.undrag();
    this.board.paper.zpd('toggle');
  }

  boardStill() {
    this.board.paper.zpd('toggle');
  }

  setupPointer(mode) {
    if (mode != 'none') {
      document.getElementById('board').style.cursor = 'crosshair';
    } else {
      document.getElementById('board').style.cursor = 'auto';
    }
  }

  onMask(newMaskCallback) {
    this.newMaskCallback = newMaskCallback;
  }

  setupDrag(dragMode) {
    var rect = null;
    var self = this;
    var paper = this.board.paper;
    var zpdGroup = Snap.select('#snapsvg-zpd-'+paper.id);
    paper.drag(onmove, onstart, onend);
    function onstart(x, y, e) {
      var zpdCoordSpaceMatrix = Snap.matrix(paper.zpd('save'));
      var inverseCoordSpaceMatrix = zpdCoordSpaceMatrix.invert();
      rect = paper.rect(x,y,1,1).attr({fill:'red', opacity:0.3});
      rect.transform(inverseCoordSpaceMatrix.toTransformString());
      zpdGroup.add(rect);
    }
    function onmove(dx, dy, x, y, e) {
      var attr = {width:Math.abs(dx), height:Math.abs(dy)};
      if (dx < 0) attr.x = x;
      if (dy < 0) attr.y = y;
      rect.attr(attr);
    }
    function onend(e) {
      if (self.mode == 'mask')
        rect.attr({fill:'white', opacity:1});
      else if (self.mode == 'unmask')  {
        rect.attr({fill:'black', opacity:1});
      }
      self.rects.push(rect);
      rect.remove();
      if (self.mask) self.mask.remove();
      self.mask = paper.g(...self.rects);
      var bb = self.mask.getBBox();
      self.maskbg = paper.rect(bb).attr({mask:self.mask, fill:'yellow', opacity:0.3});
      zpdGroup.add(self.maskbg);
      self.newMaskCallback(self.rects);
    }
  }

}

export { MaskControls }
