class MaskControls {
  constructor(board) {
    this.board = board;
    this.zpdData = null;
    this.el = document.createElement('span');
    this.mode = 'none';
    this.dragMode = false;
    this.mask = null;

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
      this.applyMask();
    })
  }

  applyMask() {

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
    var zoomPan = this.board.paper.zpd('save');
    console.log("zoomPan", zoomPan)
    console.log("before mask transform", this.mask.transform())
    this.board.paper.zpd('destroy');

    var m = zoomPan.inverse();
    // console.log("inverse", m)
    // var tstr = `t${m.a}`; //T${m.e},${m.f}`;
    // console.log("tstr", tstr)
    // this.mask.transform(tstr);
    // this.maskbg.transform(tstr);

    this.board.paper.zpd({load:zoomPan});

    //var tx = m.e/zoomPan.a, ty=m.f/zoomPan.a;
    //this.mask.transform(`S${zoomPan.a}`);//` t${tx},${ty}`);
    //this.mask.transform(`t${tx},${ty}`);
  }

  boardStill() {
    this.board.paper.zpd('toggle');
    var zpd = this.board.paper.zpd('save');
    console.log("start", zpd);
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
    var self = this;

    var startx = null, starty = null;

    function onstart(x, y, e) {
      var zpdData = paper.zpd('save');
      console.log("zpdData", zpdData);
      rect = this.paper.rect((x-zpdData.e)/zpdData.a,(y-zpdData.f)/zpdData.a,10,10).attr({fill:'red', opacity:0.3});

      var zpdGroup = Snap.select('#snapsvg-zpd-'+paper.id);
      console.log("here is zpdGroup", zpdGroup.transform())
      zpdGroup.add(rect);
      startx = x, starty = y;
    }
    function onmove(dx, dy, x, y, e) {
      var attr = {width:Math.abs(dx), height:Math.abs(dy)};
      if (dx < 0) attr.x = x;
      if (dy < 0) attr.y = y;
      rect.attr(attr);
    }
    function onend(e) {
      //rect.attr({fill:'white', opacity:1});
      rects.push(rect);
      // rect.remove();
      // mask = paper.g(...rects);
      // var bb = mask.getBBox();
      // if (maskbg) maskbg.remove();
      // maskbg = paper.rect(bb).attr({fill:'yellow', mask:mask, opacity:0.5})
      // self.mask = mask;
      // self.maskbg = maskbg;
      self.mask = rect;
    }
    paper.drag(onmove, onstart, onend);
  }

}

export { MaskControls }
