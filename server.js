const http = require('http');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const router = require('./server/router');
const nunjucks = require('nunjucks');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';
const MsgServer = require('./server/biz/MsgServer');
const MsgRollEventHandler = require('./server/biz/MsgRollEventHandler');
const MsgSexEventHandler = require('./server/biz/MsgSexEventHandler');
const GamesManager = require('./server/biz/GamesManager');

var app = express();
var httpServer = http.createServer(app);
app.use(fileUpload());
app.use(cookieParser());
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));

nunjucks.configure('./server/view', { express: app, noCache: true });
app.set('view engine', 'html');
app.use('/', router);
app.use('/client', express.static('client'));
app.use('/lib', express.static('node_modules'));
app.use('/asset', express.static(DATA_ROOT));

var gm = new GamesManager();

router.post('/:room/reset', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isDM = user=='DM';
  if (isDM) {
    gm.deleteGame(room);
  }
  res.redirect('/');
})

var msgServer = new MsgServer(3001);
msgServer.addHandler({
  match: data => data.meta == 'join',
  handler: (data, wss, client) => {
    msgServer.setClient(data, client);
    var gs = gm.getGameState(data.room);
    return [gs, {room:gs.room, user:data.user, meta:'mask', rects:gs.maskRects}];
  }
})
msgServer.addHandler({
  match: data => data.meta == 'element',
  handler: data => {
    var gs = gm.getGameState(data.room);
    gs.addElement(data);
    return [gs];
  }
})
msgServer.addHandler({
  match: data => data.meta == 'text',
  handler: (data, wss, ws) => {
    return [Object.assign({}, data)];
  }
})
msgServer.addHandler({
  match: data => data.meta == 'mask', //simple rebroadcast
  handler: (data, wss, ws) => {
    var gs = gm.getGameState(data.room);
    gs.setMask(data.rects);
    return [Object.assign({}, data)];
  }
})
msgServer.addHandler({
  match: data => data.meta == 'text',
  handler: new MsgRollEventHandler()
})
msgServer.addHandler({
  match: data => data.meta == 'text',
  handler: new MsgSexEventHandler()
})
msgServer.addHandler({
  match: data => data.meta == 'move',
  handler: (data, wss, ws) => {
    var gs = gm.getGameState(data.room);
    gs.elements.forEach(el => { //apply move to element
      if (el.id == data.id) {
        el.localMatrix = data.localMatrix;
      }
    });
    return [gs];
  }
})
msgServer.addHandler({
  match: data => data.meta == 'kill',
  handler: (data, wss, ws) => {
    var gs = gm.getGameState(data.room);
    gs.elements.forEach(el => { //apply move to element
      if (el.id == data.id) {
        el.killed = true;
      }
    });
    return [gs];
  }
})

console.log("(server) DATA_ROOT", DATA_ROOT);
app.listen(3000, () => console.log(`Listening on 3000 and 3001`));
