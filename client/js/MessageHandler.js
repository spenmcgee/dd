class MessageHandler {

  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  handleMessage(data) {
    this.handlers.forEach(handler => {
      if (handler.match(data)) {
        handler.action(data);
      }
    })
  }

}

export { MessageHandler }
