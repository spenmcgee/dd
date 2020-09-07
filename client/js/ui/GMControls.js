class GMControls {

  constructor(submenuEl) {

    var toggleButton = document.createElement('button');
    toggleButton.append("Asset");

    var formDiv = document.createElement('div');
    var assetUrlInput = document.createElement('input');
    var addAssetButton = document.createElement('button');
    addAssetButton.append("Add");

    //this.el = document.createElement('span');
    //this.el.className = "dm-controls";
    //this.el.append(assetUrlInput);
    //this.el.append(addAssetButton);
    //var submenuEl = document.getElementById('submenu');

    formDiv.append(assetUrlInput);
    formDiv.append(addAssetButton);
    formDiv.className = 'hidden';
    //toggleButton.append(formDiv);
    submenuEl.append(formDiv);

    addAssetButton.addEventListener('click', e => {
      var input = e.target.parentElement.children[0];
      var url = input.value;
      this.onAddAssetCallback(url, e);
    })

    toggleButton.addEventListener('click', e => {
      formDiv.classList.toggle("hidden");
    })

    this.el = toggleButton;
  }

  onAddAsset(cb) {
    this.onAddAssetCallback = cb;
  }

}

export { GMControls }
