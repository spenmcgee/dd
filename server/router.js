const express = require('express');
const TileLoader = require('./biz/TileLoader');
const path = require('path');
const fs = require('fs');
const BoardLoader = require('./biz/BoardLoader');
const DATA_ROOT = process.env.DATA_ROOT || '/var/dd';

var router = express.Router();

router.get('/', (req, res) => res.render("home.html"));

router.get('/api/:room/board', (req, res) => {
  var room = req.params.room;
  var board = BoardLoader.getBoard(room);
  res.json(board);
})

router.get('/:room/board', (req, res) => {
  var room = req.params.room;
  var board = BoardLoader.getBoard(room);
  res.render("board.html", {room:room, boardJson:JSON.stringify(board, null, 2)});
});

router.post('/:room/board', (req, res) => {
  var room = req.params.room;
  var boardJson = req.body.boardJson;
  var board = BoardLoader.saveBoard(room, boardJson);
  res.render("board.html", {room:room, boardJson:boardJson});
});

router.get('/:room', (req, res) => {
  var room = req.params.room;
  res.render("room.html", {room:room});
});

router.get('/:room/tiles', async function (req, res) {
  var room = req.params.room;
  var tiles = await TileLoader.loadTiles();
  res.render("tiles.html", {room:room, tiles:tiles});
});

router.post('/:room/tiles', async function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let tileFile = req.files.tileFile;
  var destFilepath = `${DATA_ROOT}/tile/${tileFile.name}`;
  tileFile.mv(destFilepath, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  var room = req.params.room;
  var tiles = await TileLoader.loadTiles();
  res.render("tiles.html", {room:room, tiles:tiles});
});

module.exports = router;
