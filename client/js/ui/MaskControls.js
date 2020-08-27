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
    this.maskMode = !board.isDM;

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
      if (this.rects.length == 0) return;
      this.maskMode = !this.maskMode;
      if (this.maskMode) {
        this.viewMaskMode();
        this.applyButton.classList.add('enabled');
      } else {
        this.editMaskMode();
        this.applyButton.classList.remove('enabled');
      }
      this.applyMaskCallback(this.rects);
    })
  }

}

export { MaskControls }
