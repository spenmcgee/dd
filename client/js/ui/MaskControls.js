class MaskControls {

  constructor(board, submenuEl) {
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

    var toggleMenuButton = document.createElement('button');
    toggleMenuButton.append("Mask");
    var buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'hidden';

    this.maskButton = document.createElement('button');
    this.maskButton.append("mask");
    this.unmaskButton = document.createElement('button');
    this.unmaskButton.append("unmask");
    this.applyButton = document.createElement('button');
    this.applyButton.append("apply");
    this.clearButton = document.createElement('button');
    this.clearButton.append("clear");

    buttonsDiv.append(this.maskButton);
    buttonsDiv.append(this.unmaskButton);
    buttonsDiv.append(this.applyButton);
    buttonsDiv.append(this.clearButton);
    this.el.append(toggleMenuButton);
    submenuEl.append(buttonsDiv);

    toggleMenuButton.addEventListener('click', e => {
      buttonsDiv.classList.toggle("hidden");
    })

    this.clearButton.addEventListener('click', e => {
      this.newMaskCallback([]);
    })

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
    if (!rects) rects = [];
    this.rects.forEach(r => r.remove());
    if (this.mask) this.mask.remove();
    this.rects = [];
    if (rects.length == 0) {
      this.mask = null;
      return;
    }
    var paper = this.board.paper;
    var zpdGroup = this.board.zpdGroup;
    rects.forEach(r => {
      var color = r[4] ? 'white' : 'black';
      var rect = paper.rect(r[0],r[1],r[2],r[3]).attr({fill:color});
      zpdGroup.add(rect);
      this.rects.push(rect);
    })
    this.mask = paper.g(...this.rects);
    zpdGroup.add(this.mask);
  }

  draw() {
    if (this.isDM) {
      if (this.mode != 'apply') {
        this.drawMaskPositive();
        return
      }
    }
    this.drawMaskNegative();
  }

  removeMaskElements() {
    if (this.maskPositive)
      this.maskPositive.remove();
    if (this.maskNegative) {
      this.universe.remove();
      this.maskPositiveBlack.remove();
      this.applyMask.remove();
      this.maskNegative.remove();
    }
  }

  drawMaskNegative() {
    this.removeMaskElements();
    if (!this.mask) return;
    var zpdGroup = this.board.zpdGroup;
    var zpdCoordSpaceMatrix = Snap.matrix(this.board.paper.zpd('save'));
    var inverseCoordSpaceMatrix = zpdCoordSpaceMatrix.invert();
    var bbUniverse = this.board.paper.getBBox();
    this.universe = this.board.paper.rect(bbUniverse).attr({fill:'white'});
    this.universe.transform(inverseCoordSpaceMatrix.toTransformString());
    zpdGroup.add(this.universe);

    var bbMask = this.mask.getBBox();
    this.maskPositiveBlack = this.board.paper.rect(bbMask).attr({mask:this.mask, fill:'black'})
    zpdGroup.add(this.maskPositiveBlack);
    this.applyMask = this.board.paper.g(this.universe, this.maskPositiveBlack);
    zpdGroup.add(this.applyMask);
    this.maskNegative = this.board.paper.rect(this.universe.getBBox()).attr({mask:this.applyMask});
    zpdGroup.add(this.maskNegative);
  }

  drawMaskPositive() {
    this.removeMaskElements();
    if (!this.mask) return;
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
      self.mask.remove()

      //self.draw();
      self.newMaskCallback(self.rects);
    }
  }

}

export { MaskControls }
