import { PinchZoom } from '/lib/pinch-zoom-js/dist/pinch-zoom.min';

var TILES = ['grass1'];
var BOARD = [
  ['grass1', 'grass1', 'grass1'],
  ['grass1', 'grass1', 'grass1'],
  ['grass1', 'grass1', null],
]

function buildCanvas() {
  var canvas = document.getElementById("board");
  canvas.id = "board";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "0px";
  canvas.style['background-color'] = 'gray';
  var context = canvas.getContext("2d");
  return context;
}

function loadTiles() {
  return TILES.map(tileName => {
    var img = new Image();
    img.src = `client/img/${tileName}.png`;
    //img.onload = () => context.drawImage(img, 0, 0);
    return {
      name: tileName,
      img: img
    }
  })
}

function layTile(context, tileName, px, py) {
  var img = new Image();
  img.src = `client/img/${tileName}.png`;
  img.onload = () => context.drawImage(img, px, py);
}

function layTiles(context, board) {
  var scale = 500;
  var px = 0, py = 0;
  for (var row=0; row<board.length; row++) {
    py = row*scale;
    for (var col=0; col<board[row].length; col++) {
      px = col*scale;
      var tileName = board[row][col];
      console.log("loading", row, col, tileName)
      if (tileName)
        layTile(context, tileName, px, py);
    }
  }
}

function setupControls(context) {
  var el = document.getElementById("board");
  let pz = new PinchZoom(el, {
    onDragStart: function() {
      console.log("dragstart")
    }
  });
}

function main() {
  // const canvas = document.getElementById("main-canvas");
  // const context = canvas.getContext("2d");
  //
  // const img = new Image();
  // img.src = "client/img/grass1.png";
  // img.onload = () => {
  //   context.drawImage(img, 0, 0)
  // }

  var context = buildCanvas();
  //var tiles = loadTiles(context);
  layTiles(context, BOARD);
  setupControls(context);
}

document.addEventListener("DOMContentLoaded", function(event) {
  main();
});
