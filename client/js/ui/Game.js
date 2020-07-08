import { Board } from '/client/js/ui/Board.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { DMControls } from '/client/js/ui/DMControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Text } from '/client/js/data/Text.js';
import { Join } from '/client/js/data/Join.js';
import { Move } from '/client/js/data/Move.js';
import { Player } from '/client/js/data/Player.js';
import { Asset } from '/client/js/data/Asset.js';
import snapPlugin from '/client/js/ui/snap.plugin.js';

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
    this.assetCounter = 1;
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
    this.addPlayer(new Player(this.board.paper, this.id, this.user, this.room, this.color));
    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join(this.color));
      messages.sendToServer(new Text("joining room"));
    })
  }

  async setupDM(messages) {
    var menuEl = document.getElementById("menu");
    var dmControls = new DMControls();
    menuEl.append(dmControls.el);
    dmControls.onAddAsset(url => {
      var assetId = `asset${this.assetCounter++}`;
      var m = this.board.drawAsset(assetId, url);
      messages.sendToServer(new Asset(this.board.paper, assetId, this.room, url, m));
    })
    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join(this.color));
      messages.sendToServer(new Text("joining room"));
    })
  }

  async setup() {

    var messages = new Messages(this.wsClient);

    snapPlugin.setup();
    snapPlugin.onDragEnd((el,t) => { //DM override
      var localMatrix = el.transform().localMatrix
      var m = new Move(localMatrix);
      m.ddtype = el.ddtype;
      m.id = el.id;
      m.user = el.user;
      m.room = el.room;
      messages.sendToServer(m);
      messages.sendToServer(new Text(`overriding position of ${m.user}`));
    })

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
        this.addPlayer(new Player(this.board.paper, p.id, p.user, p.room, p.color, p.localMatrix));
      } else {
        this.players[p.id].color = p.color;
        this.players[p.id].localMatrix = p.localMatrix;
      }
    })
  }

}

export { Game }
