const express = require('express');
const AssetLoader = require('./biz/AssetLoader');
const path = require('path');
const fs = require('fs');
const BoardLoader = require('./biz/BoardLoader');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';
const logger = require("./logger");

var router = express.Router();

router.get('/', (req, res) => {
  var room = req.cookies["room"];
  var user = req.cookies["user"];
  var color = req.cookies["color"];
  var email = req.cookies["email"];
  var isGM = user=='GM';
  res.render("home.html", {room:room, user:user, color:color, isGM:isGM, email:email});
});

router.post('/', (req, res) => {
  var room = req.body["room"];
  var user = req.body["user"];
  var color = req.body["color"];
  var email = req.body["email"];
  var userid = `${user}@${room}`;
  logger.info(`ROOM-ENTER ${userid} ${email}`);
  var isGM = user=='GM';
  var cookieOptions = { maxAge: 60*60*24*30*1000 };
  res.cookie("room", room, cookieOptions);
  res.cookie("user", user, cookieOptions);
  res.cookie("color", color, cookieOptions);
  res.cookie("id", userid, cookieOptions);
  res.cookie("email", email, cookieOptions);
  res.redirect(`/${room}`);
});

router.get('/test', (req, res) => {
  res.render("test.html");
});

router.get('/api/:room/config', (req, res) => {
  var room = req.params.room;
  var board = BoardLoader.getConfig(room);
  res.json(board);
})

router.get('/:room/config', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isGM = user=='GM';
  var board = BoardLoader.getConfig(room);
  res.render("config.html", {room:room, user:user, isGM:isGM, ok:true, boardJson:JSON.stringify(board, null, 2)});
});

router.post('/:room/config', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isGM = user=='GM';
  var boardJson = req.body.boardJson;
  var ok = BoardLoader.saveConfig(room, boardJson);
  res.render("config.html", {room:room, user:user, boardJson:boardJson, isGM:isGM, message:ok?'Saved ok':'Error saving, invalid json', ok:ok});
});

router.get('/:room/commands', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isGM = user=='GM';
  res.render("commands.html", {room:room, user:user, isGM:isGM});
});

router.get('/:room', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var color = req.cookies["color"];
  var isGM = user=='GM';
  res.render("room.html", {room:room, user:user, color:color, isGM:isGM});
});

router.get('/:room/asset', async function (req, res) {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isGM = user=='GM';
  var assets = await AssetLoader.loadAssets(room);
  res.render("assets.html", {room:room, user:user, assets:assets, isGM:isGM});
});

router.get('/asset/:asset/delete', async function (req, res) {
  var room = req.cookies["room"];
  var user = req.cookies["user"];
  var isGM = user=='GM';
  var asset = req.params.asset;
  AssetLoader.deleteAsset(room, asset);
  var assets = await AssetLoader.loadAssets(room);
  res.render("assets.html", {room:room, user:user, assets:assets, isGM:isGM});
});

router.post('/:room/asset', async function (req, res) {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isGM = user=='GM';
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let shared = ('shared' in req.body && req.body.shared == 'on') ? true : false;
  let assetFile = req.files.assetFile;
  let filename = `${shared?'_shared':room}-${assetFile.name}`;
  var destFilepath = path.join(DATA_ROOT, filename);
  assetFile.mv(destFilepath, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  var assets = await AssetLoader.loadAssets(room);
  res.render("assets.html", {room:room, user:user, assets:assets, isGM:isGM});
});

module.exports = router;
