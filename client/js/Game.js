import { Board } from '/client/js/Board.js';
import { Camera } from '/client/js/Camera.js';
import { DragListener } from '/client/js/DragListener.js';
import { DblclickListener } from '/client/js/DblclickListener.js';
import { Chat } from '/client/js/Chat.js';
import { Piece } from '/client/js/Piece.js';
import { MessageHandler } from '/client/js/MessageHandler.js';

class Game {

  constructor(id, user, room) {
    this.config = {};
    this.players = {};
    this.id = id;
    this.user = user;
    this.room = room;
    this.board = null;
    this.iAmDM = user=='DM';
  }

  setupChat(chatEl, messagesEl) {
    var messageHandler = new MessageHandler();
    var chat = new Chat(chatEl, messagesEl, messageHandler);
    chat.connect();
    messageHandler.addHandler({
      match: data => data.meta == 'join',
      action: data => {
        this.players[data.user] = data;
        console.log("players", Object.keys(this.players))
      }
    })
  }

  async setup(room) {

    var chatEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    var mainEl = document.getElementById("main");

    this.board = new Board(this.user, this.room, "#board");
    await this.board.init(mainEl);

    this.setupChat(chatEl, messagesEl);

  }

}

export { Game }
