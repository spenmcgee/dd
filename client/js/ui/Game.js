import { Board } from '/client/js/ui/Board.js';
import { Piece } from '/client/js/data/Piece.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Movement } from '/client/js/biz/Movement.js';

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

    var messages = new Messages(this.wsClient);
    var moveControls = new MoveControls();

    this.board = new Board(this.user, this.room, "#board");
    await this.board.init(mainEl);

    var formEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    this.chat = new Chat(formEl, messagesEl, this.wsClient);

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'join',
      handler: data => {
        this.players[data.user] = data;
        //messages.addPlayer(data);
        console.log("players", Object.keys(this.players))
      }
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: this.chat
    })

    this.movement = new Movement(messages, this.board);
    this.wsClient.addMessageHandler({
      match: data => data.meta == 'move',
      handler: this.movement
    });

    moveControls.onMove(direction => {
      this.movement.move(direction);
    })

  }

}

export { Game }
