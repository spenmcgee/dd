import { Board } from '/client/js/ui/Board.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Text } from '/client/js/data/Text.js';
import { Join } from '/client/js/data/Join.js';
import { Move } from '/client/js/data/Move.js';
import { Player } from '/client/js/data/Player.js';

class Game {

  constructor(id, user, room, color, wsClient) {
    this.config = {};
    this.id = id;
    this.user = user;
    this.room = room;
    this.color = color;
    this.players = {};
    this.board = new Board(this.user, this.room, "#board");
    this.isDM = user=='DM';
    this.wsClient = wsClient;
  }

  addPlayer(player) {
    if (!(player.id in this.players)) {
      this.players[player.id] = player;
      this.board.drawPlayer(player);
    }
  }

  async setupPlayer(messages) {
    var menuEl = document.getElementById("menu");
    var moveControls = new MoveControls();
    menuEl.append(moveControls.el);
    moveControls.onMove(direction => {
      var player = this.players[this.id];
      var localMatrix = this.board.movePlayer(player, direction);
      var d = new Move(localMatrix);
      messages.sendToServer(d);
    })
    this.addPlayer(new Player(this.board.paper, this.id, this.room, this.color));
    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join(this.color));
      messages.sendToServer(new Text("joining room"));
    })
  }

  async setupDM(messages) {
    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join(this.color));
      messages.sendToServer(new Text("joining room"));
    })
  }

  async setup() {

    var messages = new Messages(this.wsClient);

    var mainEl = document.getElementById("main");
    await this.board.drawBoard(mainEl);

    var formEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    this.chat = new Chat(formEl, messagesEl, this.wsClient);

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: this.chat
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'game-state',
      handler: data => {
        this.mergeGameState(data);
        var players = Object.keys(this.players).map(id => this.players[id]);
        this.board.redrawPlayers(players);
      }
    })

    if (this.isDM) {
      await this.setupDM(messages);
    } else {
      await this.setupPlayer(messages);
    }

  }

  mergeGameState(data) {
    data.players.forEach(p => {
      if (!(p.id in this.players)) {
        this.addPlayer(new Player(this.board.paper, p.id, p.room, p.color, p.localMatrix));
      } else {
        this.players[p.id].color = p.color;
        this.players[p.id].localMatrix = p.localMatrix;
      }
    })
  }

}

export { Game }
