class Player {

  constructor(id, user, room, color, client) {
    this.id = id;
    this.user = user;
    this.room = room;
    this.color = color;
    this.client = client;
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      user: this.user,
      room: this.room,
      color: this.color
    });
  }

}

module.exports = Player;
