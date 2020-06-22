class ChatController {

  constructor() {
    this.users = {};
    this.rooms = {};
  }

  dispatch(data, wss, client) {
    if (data.command) {
      if (data.command == 'join') {
        var user = {
          id: data.id,
          user: data.user,
          room: data.room,
          client: client
        }
        this.users[data.id] = user;
        if (!(data.room in this.rooms)) this.rooms[data.room] = [];
        this.rooms[data.room].push(user);
      }
    }
    //console.log("dispatch", this.rooms);
    return data;
  }

}

module.exports = ChatController;
