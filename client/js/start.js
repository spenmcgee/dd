import { Game } from '/client/js/Game.js';
import Navigo from '/lib/navigo/lib/navigo.es.js';

async function boardStart(room) {

  var game = new Game();
  await game.setup(room);

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
