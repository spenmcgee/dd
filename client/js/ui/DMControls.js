class DMControls {

  constructor() {
    var assetUrlInput = document.createElement('input');
    var addAssetButton = document.createElement('button');

    addAssetButton.append("Add");

    this.el = document.createElement('span');
    this.el.className = "dm-controls";
    this.el.append(assetUrlInput);
    this.el.append(addAssetButton);

    addAssetButton.addEventListener('click', e => {
      var input = e.target.parentElement.children[0];
      var url = input.value;
      this.onAddAssetCallback(url, e);
    })
  }

  onAddAsset(cb) {
    this.onAddAssetCallback = cb;
  }

}

export { DMControls }
