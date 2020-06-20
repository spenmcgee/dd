class Menu {
  constructor() {
    var url = new URL(window.location.href);
    this.roomName = url.pathname.substr(1) || '???';
  }

  render(conf) {
    //var url = new URL(window.location.href);
    //console.log("here is the name", url)
    //console.log("hereeee", conf.currentRoomNameEl);
    //this.currentRoomNameEl = conf.currentRoomNameEl;
    //this.currentRoomNameEl.appendChild(document.createTextNode(this.roomName))
  }
}

export { Menu }
