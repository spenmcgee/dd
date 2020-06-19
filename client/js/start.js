import { Board } from '/client/js/Board.js';
import { Camera } from '/client/js/Camera.js';
import { DragListener } from '/client/js/DragListener.js';

var TILE_SIZE = 500;
var TILES = ['grass1'];
var BOARD = [
  ['grass1', 'grass1', 'grass1'],
  ['grass1', 'grass1', 'grass1'],
  ['grass1', 'grass1', null],
]

var camera;

async function start() {
  console.log("Starting...");

  var cameraEl = document.getElementById("camera");

  var board = new Board(BOARD, TILE_SIZE);
  await board.init();

  var cam = new Camera(cameraEl, board.canvas);

  var dl = new DragListener(cameraEl);
  dl.onDrag(e => {
    var dx = e.detail.dx, dy = e.detail.dy;
    cam.draw(dx, dy);
  });

  cam.draw(0,0);

  //document.getElementById("main").appendChild(board.canvas);
}

export { start }
