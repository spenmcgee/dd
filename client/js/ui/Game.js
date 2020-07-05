import { Board } from '/client/js/ui/Board.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Movement } from '/client/js/biz/Movement.js';
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
    this.iAmDM = user=='DM';
    this.wsClient = wsClient;
  }

  addPlayer(player) {
    if (!(player.id in this.players)) {
      this.players[player.id] = player;
      this.board.drawPlayer(player);
    }
  }

  async setup() {

    var mainEl = document.getElementById("main");

    var messages = new Messages(this.wsClient);
    var moveControls = new MoveControls();

    await this.board.drawBoard(mainEl);

    this.addPlayer(new Player(this.board.paper, this.id, this.room, this.color));

    var formEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    this.chat = new Chat(formEl, messagesEl, this.wsClient);

    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join(this.color));
      messages.sendToServer(new Text("joining room"));
    })

    // this.wsClient.addMessageHandler({
    //   match: data => data.meta == 'join',
    //   handler: data => {
    //     this.players[data.user] = data;//Object.assign({})
    //     console.log("players", this.players)
    //   }
    // })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: this.chat
    })

    this.movement = new Movement(this.id, messages, this.piece, this.players);
    this.wsClient.addMessageHandler({
      match: data => data.meta == 'move',
      handler: this.movement
    })

    moveControls.onMove(direction => {
      var player = this.players[this.id];
      var localMatrix = this.board.movePlayer(player, direction);
      //this.board.drawPlayer(player);

      var d = new Move(localMatrix);
      messages.sendToServer(d);
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'game-state',
      handler: data => {
        this.mergeGameState(data);
        var players = Object.keys(this.players).map(id => this.players[id]);
        console.log("addMessageHandler#game-state", players);
        this.board.redrawPlayers(players);
      }
    })

  }

  mergeGameState(data) {
    data.players.forEach(p => {
      console.log("mergeGameState", p.id, p);
      if (!(p.id in this.players)) {
        console.log("mergeGameState case1", p.id);
        this.addPlayer(new Player(this.board.paper, p.id, p.room, p.color, p.localMatrix));
      } else {
        console.log("mergeGameState case2", p.id);
        this.players[p.id].color = p.color;
        this.players[p.id].localMatrix = p.localMatrix;
      }
    })
  }

  // drawPlayers(data) {
  //   var players = Object.keys(this.players).map(id => this.players[id]);
  //   players.forEach(player => this.board.drawPlayer(player));
  // }

}

export { Game }
