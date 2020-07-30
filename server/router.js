const express = require('express');
const AssetLoader = require('./biz/AssetLoader');
const path = require('path');
const fs = require('fs');
const BoardLoader = require('./biz/BoardLoader');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';

var router = express.Router();

router.get('/', (req, res) => {
  var room = req.cookies["room"];
  var user = req.cookies["user"];
  var color = req.cookies["color"];
  var isDM = user=='DM';
  res.render("home.html", {room:room, user:user, color:color, isDM:isDM});
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
  var isDM = user=='DM';
  var board = BoardLoader.getConfig(room);
  res.render("config.html", {room:room, user:user, isDM:isDM, boardJson:JSON.stringify(board, null, 2)});
});

router.post('/:room/config', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isDM = user=='DM';
  var boardJson = req.body.boardJson;
  var board = BoardLoader.saveConfig(room, boardJson);
  res.render("config.html", {room:room, user:user, boardJson:boardJson, isDM:isDM});
});

router.get('/:room/commands', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isDM = user=='DM';
  res.render("commands.html", {room:room, user:user, isDM:isDM});
});

router.get('/:room', (req, res) => {
  var room = req.params.room;
  var user = req.cookies["user"];
  var color = req.cookies["color"];
  var isDM = user=='DM';
  res.render("room.html", {room:room, user:user, color:color, isDM:isDM});
});

router.get('/:room/asset', async function (req, res) {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isDM = user=='DM';
  var assets = await AssetLoader.loadAssets(room);
  res.render("assets.html", {room:room, user:user, assets:assets, isDM:isDM});
});

router.get('/asset/:asset/delete', async function (req, res) {
  var room = req.cookies["room"];
  var user = req.cookies["user"];
  var isDM = user=='DM';
  var asset = req.params.asset;
  AssetLoader.deleteAsset(room, asset);
  var assets = await AssetLoader.loadAssets(room);
  res.render("assets.html", {room:room, user:user, assets:assets, isDM:isDM});
});

router.post('/:room/asset', async function (req, res) {
  var room = req.params.room;
  var user = req.cookies["user"];
  var isDM = user=='DM';
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let assetFile = req.files.assetFile;
  let filename = `${room}-${assetFile.name}`;
  var destFilepath = path.join(DATA_ROOT, filename);
  assetFile.mv(destFilepath, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  var assets = await AssetLoader.loadAssets(room);
  res.render("assets.html", {room:room, user:user, assets:assets, isDM:isDM});
});

module.exports = router;
