import { Board } from '/client/js/ui/Board.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Roster } from '/client/js/ui/Roster.js';
import { MaskControls } from '/client/js/ui/MaskControls.js';
import { DMControls } from '/client/js/ui/DMControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Text } from '/client/js/data/Text.js';
import { Join } from '/client/js/data/Join.js';
import { Move } from '/client/js/data/Move.js';
import { Mask } from '/client/js/data/Mask.js';
import { Player } from '/client/js/data/Player.js';
import { Asset } from '/client/js/data/Asset.js';
import { Kill } from '/client/js/data/Kill.js';
import { NameGenerator } from '/client/js/biz/NameGenerator.js';
import snapPlugin from '/client/js/ui/snap.plugin.js';

class Game {

  constructor(id, user, room, color, wsClient) {
    this.config = {};
    this.id = id;
    this.user = user;
    this.room = room;
    this.color = color;
    this.elements = {};
    this.isDM = user=='DM';
    this.wsClient = wsClient;
    this.messages = new Messages(wsClient);
  }

  async getConfig(room) {
    var resp = await fetch(`/api/${room}/config`, {
      method: 'get'
    })
    var json = await resp.json();
    return json;
  }

  async setupDM() {
    this.wsClient.onOpen(e => {
      this.messages.sendToServer(new Join());
      this.messages.sendToServer(new Text("joining room"));
this.addAsset('/asset/fartlips-mime.svg', "zipdoo");
    })
  }

  async setupPlayer() {
    var menuEl = document.getElementById("menu");
    var moveControls = new MoveControls();
    menuEl.append(moveControls.el);
    moveControls.onMove(direction => {
      var player = this.elements[this.id];
      var localMatrix = this.board.movePlayer(player, direction);
      var d = new Move(localMatrix);
      this.messages.sendToServer(d);
    })
    var p = new Player(this.board.paper, this.id, this.user, this.room, this.color);
    this.newElement(p);
    this.wsClient.onOpen(e => {
      this.messages.sendToServer(new Join());
      this.messages.sendToServer(p);
      this.messages.sendToServer(new Text("joining room"));
    })
  }

  addAsset(url, id) {
    var assetId = id || NameGenerator.generate();
    this.messages.sendToServer(new Asset(assetId, this.room, url, null, false));
  }

  setupElementMovedEvent() {
    this.board.onElementMoved((svgElement, transform) => {
      //var localMatrix = el.transform().localMatrix
      var m = new Move(transform.localMatrix);
      m.elementType = svgElement.elementType;
      m.id = svgElement.id;
      this.messages.sendToServer(m);
      if (svgElement.elementType == 'player')
        this.messages.sendToServer(new Text(`overriding position of ${svgElement.user}`));
    })
  }

  setupGameStateEvent() {
    this.wsClient.addMessageHandler({
      match: data => data.meta == 'game-state',
      handler: async data => {
        await this.mergeGameState(data);
        this.board.redrawElements(this.elements);
      }
    })
  }

  async mergeElement(element) {
    if (element.elementType == 'player')
      await this.mergePlayer(element);
    else if (element.elementType == 'asset')
      await this.mergeAsset(element);
  }

  async mergePlayer(p) {
    if (!(p.id in this.elements)) {
      await this.newElement(new Player(p.id, p.user, p.room, p.color, p.localMatrix));
    } else {
      this.elements[p.id].color = p.color;
      this.elements[p.id].localMatrix = p.localMatrix;
    }
  }

  async mergeAsset(a) {
    if (!(a.id in this.elements)) {
      await this.newElement(new Asset(a.id, a.room, a.url, a.localMatrix, a.killed));
    } else {
      this.elements[a.id].url = a.url;
      this.elements[a.id].localMatrix = a.localMatrix;
      this.elements[a.id].killed = a.killed;
    }
  }

  async mergeGameState(data) {
    for (var el of Object.values(data.elements)) {
      await this.mergeElement(el);
    }
  }

  async newElement(el) {
    if (!(el.id in this.elements)) {
      this.elements[el.id] = el;
    }
  }

  async setup() {
    this.config = await this.getConfig(this.room);
    this.board = new Board(this.user, this.room, "#board", this.config);
    await this.board.draw(document.getElementById("main"), this.config.boardSvgUrl);

    this.setupGameStateEvent();
    this.setupElementMovedEvent();

    if (this.isDM) {
      await this.setupDM();
    } else {
      await this.setupPlayer();
    }

  }

}

export { Game }
