import { Board } from '/client/js/Board.js';
import { Camera } from '/client/js/Camera.js';
import { DragListener } from '/client/js/DragListener.js';
import { DblclickListener } from '/client/js/DblclickListener.js';
import { Chat } from '/client/js/Chat.js';
import { Piece } from '/client/js/Piece.js';
import { MessageHandler } from '/client/js/MessageHandler.js';

class Game {

  constructor() {
    this.config = {};
    this.players = {};
  }

  async setup(room) {

    var boardJson = await this.loadBoard(room);
    var board = new Board();
    await board.init(boardJson);

    var cameraEl = document.getElementById("camera");
    var chatEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");

    var messageHandler = new MessageHandler();
    var cam = new Camera(cameraEl, board.canvas);
    var drag = new DragListener(cameraEl);
    var dblclick = new DblclickListener(cameraEl);
    var chat = new Chat(chatEl, messagesEl, messageHandler);

    drag.onDrag(e => {
      var dx = e.detail.dx, dy = e.detail.dy;
      cam.draw(dx, dy);
    });

    dblclick.onDoubleClick(e => {
      var x = e.detail.x, y = e.detail.y;
      var piece = new Piece("test", "red", x, y);
      board.addPiece(piece);
      cam.draw();
    });

    messageHandler.addHandler({
      match: data => data.meta == 'join',
      action: data => {
        this.players[data.user] = data;
      }
    })

    chat.connect();
    cam.draw(0, 0);

  }

  async loadBoard(name) {
    var resp = await fetch(`/api/${name}/board`, {
      method: 'get'
    })
    var json = await resp.json();
    return json;
  }

}

export { Game }
