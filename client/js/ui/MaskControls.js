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

    function onstart(x, y, e) {
      //noop
    }
    function onmove(dx, dy, x, y, e) {
      if (path) path.remove();
      pathStr = `M ${x-dx} ${y-dy} l ${dx} 0 l 0 ${dy} l ${-1*dx} 0 l 0 ${-1*dy}`;
      path = paper.path(pathStr);
      path.attr({stroke:"blue", strokeWidth:1, fill:"red", opacity:0.3});
    }
    function canonical(items) {
      if (typeof(items[0]) == 'object') { //point
        return items.map(i => {return {x:i.x, y:i.y}})
      } else { //command
        return items.map(i => {
          if (i[0] == 'M') return {x:i[1], y:i[2]}
          else return {x:i[1], y:i[2]}
        })
      }
    }
    function commands2string(commands) {
      return commands.reduce((s,c) => {
        if (c[0] == 'M')
          s += `M ${c[1]} ${c[2]} `;
        else
          s += `L ${c[5]} ${c[6]} `;
        return s;
      }, "");
    }
    function union(p1, p2) {
      var commands1 = Snap.path.map(p1, p1.transform().localMatrix);
      var points = Snap.path.intersection(p1, p2);
      var commands2 = Snap.path.map(p2, p2.transform().localMatrix);
      console.log(commands1, points, commands2);

      if (points.length > 0) {
        
      } else {
        return commands2string(commands1) + commands2string(commands2);
      }

    }
    function onend(e) {
      path.remove();

      var finalPath = paper.path(pathStr);
      finalPath.attr({stroke:"blue", strokeWidth:1, fill:"red", opacity:0.4});

      if (!maskPath) {
        maskPath = finalPath;
        return;
      }

      maskPath.remove();
      finalPath.remove();

      //var maskPathStr = paper.union(maskPath, finalPath);
      //var maskPathStr = Snap.path.intersection(maskPath, finalPath);
      var maskPathStr = union(maskPath, finalPath);
      console.log("maskPathStr", maskPathStr);
      maskPath = paper.path(maskPathStr).attr({stroke:"red", strokeWidth:1, fill:"yellow", opacity:0.2})
    }
    paper.drag(onmove, onstart, onend);
  }

}

export { MaskControls }
