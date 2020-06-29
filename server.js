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
const MsgJoinEventHandler = require('./server/biz/MsgJoinEventHandler');
const MsgRollEventHandler = require('./server/biz/MsgRollEventHandler');
const MsgTextEventHandler = require('./server/biz/MsgTextEventHandler');
const MsgMoveEventHandler = require('./server/biz/MsgMoveEventHandler');
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
var msgServer = new MsgServer(3001);
msgServer.addHandler({
  match: data => data.meta == 'join',
  handler: (data, wss, client) => {
    data.client = client;
    var gameState = gm.playerJoin(data);
    msgServer.addClient(data);
    return [gameState];
  }
})
msgServer.addHandler({
  match: data => data.meta == 'text',
  handler: new MsgRollEventHandler()
})
msgServer.addHandler({
  match: data => data.meta == 'text',
  handler: new MsgTextEventHandler()
})
msgServer.addHandler({
  match: data => data.meta == 'move',
  handler: new MsgMoveEventHandler()
})

console.log("(server) DATA_ROOT", DATA_ROOT);
app.listen(3000, () => console.log(`Listening on 3000 and 3001`));
