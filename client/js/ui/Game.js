import { Board } from '/client/js/ui/Board.js';
import { Chat } from '/client/js/ui/Chat.js';
import { MoveControls } from '/client/js/ui/MoveControls.js';
import { Roster } from '/client/js/ui/Roster.js';
import { MaskControls } from '/client/js/ui/MaskControls.js';
import { DMControls } from '/client/js/ui/DMControls.js';
import { Messages } from '/client/js/biz/Messages.js';
import { Join as MsgJoin } from '/client/js/message/Join.js';
import { Text as MsgText } from '/client/js/message/Text.js';
import { Move as MsgMove } from '/client/js/message/Move.js';
import { Mask as MsgMask } from '/client/js/message/Mask.js';
import { Kill as MsgKill } from '/client/js/message/Kill.js';
import { Asset as MsgAsset } from '/client/js/message/Asset.js';
import { Player as MsgPlayer } from '/client/js/message/Player.js';
import { SvgPlayer } from '/client/js/ui/SvgPlayer.js';
import { SvgAsset } from '/client/js/ui/SvgAsset.js';
import { NameGenerator } from '/client/js/biz/NameGenerator.js';

class Game {

  constructor(id, user, room, color, wsClient) {
    this.config = {};
    this.id = id;
    this.user = user;
    this.room = room;
    this.color = color;
    this.svgPieces = {};
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
      this.messages.sendToServer(new MsgJoin());
      this.messages.sendToServer(new MsgText("joining room"));
this.addAsset('/asset/fartlips-mime.svg', "zipdoo");
    })
    var menuEl = document.getElementById("menu");
    var dmControls = new DMControls();
    menuEl.append(dmControls.el);
    dmControls.onAddAsset(async url => {
      var assetId = NameGenerator.generate();
      this.addAsset(url, assetId);
    })
  }

  async setupPlayer() {
    var menuEl = document.getElementById("menu");
    var moveControls = new MoveControls();
    menuEl.append(moveControls.el);
    moveControls.onMove(direction => {
      var player = this.svgPieces[this.id];
      var localMatrix = player.move(player, direction);
      var d = new MsgMove(localMatrix);
      this.messages.sendToServer(d);
    })
    this.wsClient.onOpen(e => {
      this.messages.sendToServer(new MsgJoin());
      this.messages.sendToServer(new MsgPlayer(this.id, this.user, this.room, this.color));
      this.messages.sendToServer(new MsgText("joining room"));
    })
  }

  addAsset(url, id) {
    var assetId = id || NameGenerator.generate();
    this.messages.sendToServer(new MsgAsset(assetId, this.room, url, null, false));
  }

  setupPieceDraggedEvent(svgPiece) {
    svgPiece.onDragEnd(transform => {
      var m = new MsgMove(transform.localMatrix);
      m.pieceType = svgPiece.pieceType;
      m.id = svgPiece.id;
      this.messages.sendToServer(m);
      if (svgPiece.pieceType == 'player')
        this.messages.sendToServer(new Text(`overriding position of ${svgPiece.user}`));
    })
  }

  setupGameStateEvent() {
    this.wsClient.addMessageHandler({
      match: data => data.meta == 'game-state',
      handler: async data => {
        await this.mergeGameState(data);
        this.redrawPieces(this.svgPieces);
      }
    })
  }

  setupTextEvent() {
    this.wsClient.addMessageHandler({
      match: data => data.meta == 'text',
      handler: async data => {
        this.chat.handle(data);
      }
    })
  }

  redrawPieces(svgPieces) {
    Object.values(svgPieces).forEach(svgPiece => {
      svgPiece.draw();
    })
  }

  mergePiece(piece) {
    if (piece.pieceType == 'player')
      this.mergePlayer(piece);
    else if (piece.pieceType == 'asset')
      this.mergeAsset(piece);
  }

  mergePlayer(p) {
    var player = null;
    if (p.id in this.svgPieces) {
      player = this.svgPieces[p.id];
    } else {
      player = new SvgPlayer(p, this.board, this.board.zpdGroup, this.config);
      this.svgPieces[p.id] = player;
      this.setupPieceDraggedEvent(player);
    }
    player.set(p);
    return player;
  }

  mergeAsset(a) {
    var asset = null;
    if (a.id in this.svgPieces) {
      asset = this.svgPieces[a.id];
    } else {
      asset = new SvgAsset(a, this.board, this.board.zpdGroup, this.config);
      this.svgPieces[a.id] = asset;
      this.setupPieceDraggedEvent(asset);
    }
    asset.set(a);
    return asset;
  }

  async mergeGameState(data) {
    for (var el of Object.values(data.pieces)) {
      await this.mergePiece(el);
    }
  }

  async setup() {
    this.config = await this.getConfig(this.room);
    this.board = new Board(this.user, this.room, "#board", this.config);
    await this.board.draw(this.config.boardSvgUrl);

    this.setupGameStateEvent();
    this.setupTextEvent();

    if (this.isDM) {
      await this.setupDM();
    } else {
      await this.setupPlayer();
    }

    this.chat = new Chat(
      document.getElementById('chat'),
      document.getElementById('messages'),
      this.wsClient
    );

  }

}

export { Game }
