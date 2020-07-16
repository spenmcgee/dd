import { Board } from '/client/js/ui/Board.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Roster } from '/client/js/ui/Roster.js';
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
    this.elements = {};
    this.board = new Board(this.user, this.room, "#board");
    this.isDM = user=='DM';
    this.wsClient = wsClient;
    this.elementCounter = 1;
  }

  async setupPlayer(messages) {
    var menuEl = document.getElementById("menu");
    var moveControls = new MoveControls();
    menuEl.append(moveControls.el);
    moveControls.onMove(direction => {
      var player = this.elements[this.id];
      var localMatrix = this.board.movePlayer(player, direction);
      var d = new Move(localMatrix);
      messages.sendToServer(d);
    })
    var p = new Player(this.board.paper, this.id, this.user, this.room, this.color);
    this.newElement(p);
    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join());
      messages.sendToServer(p);
      messages.sendToServer(new Text("joining room"));
    })
  }

  async setupDM(messages) {
    var menuEl = document.getElementById("menu");
    var dmControls = new DMControls();
    menuEl.append(dmControls.el);
    dmControls.onAddAsset(async url => {
      var assetId = `asset${this.elementCounter++}`;
      var m = await this.board.drawElement({elementType:'asset', id:assetId, url:url});
      messages.sendToServer(new Asset(this.board.paper, assetId, this.room, url, m));
    })
    this.wsClient.onOpen(e => {
      messages.sendToServer(new Join());
      messages.sendToServer(new Text("joining room"));
    })
  }

  async setup() {

    var messages = new Messages(this.wsClient);

    snapPlugin.setup();
    snapPlugin.onDragEnd((el,t) => { //DM override
      var localMatrix = el.transform().localMatrix
      var m = new Move(localMatrix);
      m.elementType = el.elementType;
      m.id = el.id;
      //m.user = el.user;
      //m.room = el.room;
      messages.sendToServer(m);
      if (el.elementType == 'player')
        messages.sendToServer(new Text(`overriding position of ${el.user}`));
    })

    var mainEl = document.getElementById("main");
    await this.board.drawBoard(mainEl);

    var formEl = document.getElementById("chat");
    var messagesEl = document.getElementById("messages");
    this.chat = new Chat(formEl, messagesEl, this.wsClient);

    this.roster = new Roster();
    var rosterEl = document.getElementById("roster");
    rosterEl.append(this.roster.el);

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: this.chat
    })

    this.wsClient.addMessageHandler({
      match: data => data.meta == 'game-state',
      handler: async data => {
        await this.mergeGameState(data);
        var elements = Object.keys(this.elements).map(id => this.elements[id]);
        this.board.redrawElements(elements);
        this.roster.mergeGameState(data);
      }
    })

    if (this.isDM) {
      await this.setupDM(messages);
    } else {
      await this.setupPlayer(messages);
    }

  }

  async newElement(el) {
    if (!(el.id in this.elements)) {
      this.elements[el.id] = el;
      await this.board.drawElement(el);
    }
  }

  async mergeElement(element) {
    if (element.elementType == 'player')
      await this.mergePlayer(element);
    else if (element.elementType == 'asset')
      await this.mergeAsset(element);
  }

  async mergePlayer(p) {
    if (!(p.id in this.elements)) {
      await this.newElement(new Player(this.board.paper, p.id, p.user, p.room, p.color, p.localMatrix));
    } else {
      this.elements[p.id].color = p.color;
      this.elements[p.id].localMatrix = p.localMatrix;
    }
  }

  async mergeAsset(a) {
    if (!(a.id in this.elements)) {
      await this.newElement(new Asset(this.board.paper, a.id, a.room, a.url, a.localMatrix));
    } else {
      this.elements[a.id].url = a.url;
      this.elements[a.id].localMatrix = a.localMatrix;
    }
  }

  async mergeGameState(data) {
    for (var el of data.elements) {
      await this.mergeElement(el);
    }
  }

}

export { Game }
