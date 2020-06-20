const express = require('express');
const TileLoader = require('./biz/TileLoader');
const path = require('path');
const fs = require('fs');

var router = express.Router();

router.get('/', (req, res) => res.render("home.html"));

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
   console.log("here", tileFile);
   var destFilepath = `${__dirname}/../client/img/${tileFile.name}`;
   tileFile.mv(destFilepath, function(err) {
     if (err)
       return res.status(500).send(err);
     //res.send('File uploaded!');
   });

  var room = req.params.room;
  var tiles = await TileLoader.loadTiles();
  res.render("tiles.html", {room:room, tiles:tiles});
});

module.exports = router;
