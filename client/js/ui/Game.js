import { Board } from '/client/js/ui/Board.js';
import { Piece } from '/client/js/data/Piece.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Movement } from '/client/js/biz/Movement.js';
import { Text } from '/client/js/data/Text.js';
import { Join } from '/client/js/data/Join.js';

function removeFromArray(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax= arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

class Game {

  constructor(id, user, room, color, wsClient) {
    this.config = {};
    this.players = {};
    this.id = id;
    this.user = user;
    this.room = room;
    this.board = null;
    this.iAmDM = user=='DM';
    this.wsClient = wsClient;
    this.piece = new Piece(user, color, 100, 100);
    this.state = null;
  }

  async setup() {

    var mainEl = document.getElementById("main");

    var messages = new Messages(this.wsClient);
    var moveControls = new MoveControls();

    this.board = new Board(this.user, this.room, "#board");
    await this.board.init(mainEl);

    var group = this.board.addPiece(this.piece);
    this.piece.localMatrix = group.transform().localMatrix;
    this.piece.snapSvg = group;

    var formEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    this.chat = new Chat(formEl, messagesEl, this.wsClient);

    this.wsClient.onOpen(e => {
      //messages.sendToServer(new Handshake());
      messages.sendToServer(new Join(this.piece));
      messages.sendToServer(new Text("joining room"));
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'join',
      handler: data => {
        this.players[data.user] = data;//Object.assign({})
        console.log("players", this.players)
      }
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: this.chat
    })

    this.movement = new Movement(this.id, messages, this.board, this.players);
    this.wsClient.addMessageHandler({
      match: data => data.meta == 'move',
      handler: this.movement
    })

    moveControls.onMove(direction => {
      this.movement.move(direction);
    })

  }

}

export { Game }
