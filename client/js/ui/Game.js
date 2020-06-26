import { Board } from '/client/js/ui/Board.js';
import { Piece } from '/client/js/data/Piece.js';
import { Chat } from '/client/js/ui/Chat.js';

class Game {

  constructor(id, user, room, wsClient) {
    this.config = {};
    this.players = {};
    this.id = id;
    this.user = user;
    this.room = room;
    this.board = null;
    this.iAmDM = user=='DM';
    this.wsClient = wsClient;
  }

  async setup() {

    var mainEl = document.getElementById("main");

    this.board = new Board(this.user, this.room, "#board");
    await this.board.init(mainEl);

    var formEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    this.chat = new Chat(formEl, messagesEl, this.wsClient);

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'join',
      handler: data => {
        this.players[data.user] = data;
        console.log("players", Object.keys(this.players))
      }
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: this.chat
    })

  }

}

export { Game }
