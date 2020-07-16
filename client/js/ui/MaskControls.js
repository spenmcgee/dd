class MaskControls {
  constructor(board) {
    this.board = board;
    this.zpdData = null;
    this.el = document.createElement('span');
    this.mode = 'none';

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
    if (mode == 'mask') {
      this.maskButton.classList.add('enabled');
    } else if (mode == 'unmask') {
      this.unmaskButton.classList.add('enabled');
    }
    this.setupPointer(mode);
    if ((prevMode == 'none') && (mode != 'none'))
      this.board.paper.zpd('toggle');
    if ((prevMode != 'none') && (mode == 'none'))
      this.board.paper.zpd('toggle');
  }

  setupPointer(mode) {
    if (mode != 'none') {
      document.getElementById('board').style.cursor = 'crosshair';
    } else {
      document.getElementById('board').style.cursor = 'auto';
    }
  }
}

export { MaskControls }
