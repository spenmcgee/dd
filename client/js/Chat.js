
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

class Chat {

  constructor(formEl, messagesEl, messageHandler) {
    this.formEl = formEl;
    this.messagesEl = messagesEl;
    this.id = getCookie('id');
    this.user = getCookie('user');
    this.room = getCookie('room');
    this.messageHandler = messageHandler;
  }

  _buildMessage(messageText, meta) {
    var id = this.id, room = this.room, user = this.user;
    var data = {
      id: id,
      user: user,
      room: room,
      messageText: messageText,
      meta: meta
    }
    return JSON.stringify(data);
  }

  _wireUp(socket) {
    var chat = this;
    this.formEl.onsubmit = function(e) {
      e.preventDefault();
      let messageText = this.message.value;
      var jsonStr = chat._buildMessage(messageText);
      socket.send(jsonStr);
      this.message.value = "";
      return false;
    };
    socket.onmessage = e => {
      let data = JSON.parse(e.data);
      chat.messageHandler.handleMessage(data);
      let messageElem = document.createElement('div');
      messageElem.classList.add('messages-item');
      messageElem.textContent = `${data.user}: ${data.messageText}`;
      this.messagesEl.prepend(messageElem);
    }
  }

  connect() {
    var id = this.id, room = this.root, user = this.user;
    var socket = new WebSocket(`ws://${location.hostname}:3001`);
    this.socket = socket;
    this._wireUp(socket);
    socket.onopen = e => {
      var jsonStr = this._buildMessage("joining room", "join");
      socket.send(jsonStr);
    }
  }

}

export { Chat }
