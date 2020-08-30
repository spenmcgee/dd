class MaskControls {

  constructor(board) {
    this.board = board;
    this.zpdGroup = board.zpdGroup;
    this.el = document.createElement('span');
    this.mode = 'none';
    this.rects = [];
    this.mask = null;
    this.maskPositive = null;
    this.maskNegative = null;
    this.alwaysShowMaskNegative = !board.isDM;
    this.isDM = board.isDM;

    this.maskButton = document.createElement('button');
    this.maskButton.append("mask");
    this.unmaskButton = document.createElement('button');
    this.unmaskButton.append("unmask");
    this.applyButton = document.createElement('button');
    this.applyButton.append("apply");

    this.el.append(this.maskButton);
    this.el.append(this.unmaskButton);
    this.el.append(this.applyButton);

    this.wireupModes();
  }

  toggleMode(mode, prevMode) {
    if (mode == prevMode) this.mode = 'none';
    else this.mode = mode;
    this.setupMode(this.mode, prevMode);
  }

  setupMode(mode, prevMode) {
    this.setupPointer(mode);
    if ((prevMode == 'none') && (mode != 'none')) { //masking, board still
      this.setupDrag();
      this.boardStill();
    }
    else if ((prevMode != 'none') && (mode == 'none')) { //not masking, board moving
      this.boardMoving();
    }
  }

  wireupModes() {
    this.maskButton.addEventListener('click', e => {
      this.toggleMode('mask', this.mode);
      this.toggleButton(this.maskButton, this.mode);
    })
    this.unmaskButton.addEventListener('click', e => {
      this.toggleMode('unmask', this.mode);
      this.toggleButton(this.unmaskButton, this.mode);
    })
    this.applyButton.addEventListener('click', e => {
      this.toggleMode('apply', this.mode);
      this.toggleButton(this.applyButton, this.mode);
      this.applyMaskCallback(this.rects);
    })
  }

  toggleButton(btn, mode) {
    this.maskButton.classList.remove('enabled');
    this.unmaskButton.classList.remove('enabled');
    this.applyButton.classList.remove('enabled');
    if (mode != 'none')
      btn.classList.add('enabled');
  }

  setupPointer(mode) {
    if (mode != 'none') {
      document.getElementById('board').style.cursor = 'crosshair';
    } else {
      document.getElementById('board').style.cursor = 'auto';
    }
  }

  boardMoving() {
    this.board.paper.undrag();
    this.board.paper.zpd('toggle');
  }

  boardStill() {
    this.board.paper.zpd('toggle');
  }

  onMask(newMaskCallback) {
    this.newMaskCallback = newMaskCallback;
  }

  onApply(applyMaskCallback) {
    this.applyMaskCallback = applyMaskCallback;
  }

  getMask() {
    return {
      rects: this.rects,
      mask: this.mask,
      maskPositive: this.maskPositive,
      maskNegative: this.maskNegative
    }
  }

  setRects(rects) {
    if ((!rects) || (rects.length == 0)) return;
    this.rects.forEach(r => r.remove());
    if (this.mask) this.mask.remove();
    this.rects = [];
    var paper = this.board.paper;
    var zpdGroup = Snap.select('#snapsvg-zpd-'+paper.id);
    rects.forEach(r => {
      var color = r[4] ? 'white' : 'black';
      var rect = paper.rect(r[0],r[1],r[2],r[3]).attr({fill:color, opacity:1});
      zpdGroup.add(rect);
      this.rects.push(rect);
    })
    this.mask = paper.g(...this.rects);
    this.draw();
  }

  draw() {
    console.log('MaskControls.draw', this.isDM, this.mode);
    if (this.isDM) {
      if (this.mode != 'apply') {
        console.log('MaskControls.draw DONE1');
        this.drawMaskPositive();
        return
      }
    }
    console.log('MaskControls.draw DONE2');
    this.drawMaskNegative();
  }

  removeMaskPositiveElements() {
    if (this.maskPositive)
      this.maskPositive.remove();
  }

  removeMaskNegativeElements() {
    if (this.maskNegative) {
      this.universe.remove();
      this.maskPositiveBlack.remove();
      this.applyMask.remove();
      this.maskNegative.remove();
    }
  }

  drawMaskNegative() {
    if (!this.mask) return;
    this.removeMaskPositiveElements();
    var zpdGroup = this.board.zpdGroup;
    var zpdCoordSpaceMatrix = Snap.matrix(this.board.paper.zpd('save'));
    var inverseCoordSpaceMatrix = zpdCoordSpaceMatrix.invert();
    var bbUniverse = this.board.paper.getBBox();
    this.universe = this.board.paper.rect(bbUniverse).attr({fill:'white'});
    this.universe.transform(inverseCoordSpaceMatrix.toTransformString());

    var bbMask = this.mask.getBBox();
    this.maskPositiveBlack = this.board.paper.rect(bbMask)
      .attr({mask:this.mask, fill:'black', opacity:1});
    this.applyMask = this.board.paper.g(this.universe, this.maskPositiveBlack);
    this.maskNegative = this.board.paper.rect(this.universe.getBBox()).attr({mask:this.applyMask});
    this.zpdGroup.add(this.maskNegative);
  }

  drawMaskPositive() {
    if (!this.mask) return;
    this.removeMaskNegativeElements();
    var bb = this.mask.getBBox();
    this.maskPositive = this.board.paper.rect(bb)
      .attr({mask:this.mask, fill:'yellow', opacity:0.3});
    this.zpdGroup.add(this.maskPositive);
  }

  setupDrag() {
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

      //self.draw();
      self.newMaskCallback(self.rects);
    }
  }

}

export { MaskControls }
