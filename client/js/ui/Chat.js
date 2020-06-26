import { Text } from '/client/js/data/Text.js';

class Chat {

  constructor(formEl, messagesEl, wsClient) {
    this.formEl = formEl;
    this.messagesEl = messagesEl;
    this.wsClient = wsClient;
    this.wireup();
  }

  wireup() {
    var chat = this;
    this.formEl.onsubmit = function(e) {
      e.preventDefault();
      let messageText = this.message.value;
      var text = new Text(messageText);
      chat.wsClient.send(text);
      this.message.value = "";
      return false;
    };
  }

  handle(data) {
    let messageElem = document.createElement('div');
    messageElem.classList.add('messages-item');
    messageElem.textContent = `${data.user}: ${data.messageText}`;
    this.messagesEl.prepend(messageElem);
  }

}

export { Chat }
