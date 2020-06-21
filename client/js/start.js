import { Board } from '/client/js/Board.js';
import { Camera } from '/client/js/Camera.js';
import { DragListener } from '/client/js/DragListener.js';
import { BoardLoader } from '/client/js/BoardLoader.js';
import Navigo from '/lib/navigo/lib/navigo.es.js';

var TILE_SIZE = 500;

async function boardStart(room) {
  var boardJson = await BoardLoader.loadBoard(room);
  var board = new Board(boardJson, TILE_SIZE);
  await board.init();
  var cameraEl = document.getElementById("camera");
  var cam = new Camera(cameraEl, board.canvas);
  var dl = new DragListener(cameraEl);
  dl.onDrag(e => {
    var dx = e.detail.dx, dy = e.detail.dy;
    cam.draw(dx, dy);
  });
  cam.draw(0, 0);
}

async function start() {
  console.log("Starting...");
  var nav = new Navigo('/');
  nav.on(':room/board', params => {
  })
  nav.on(':room/tiles', params => {
  })
  .on(':room', params => {
    console.log("route :room", params);
    boardStart(params.room);
  })
  .resolve();
}

export { start }
