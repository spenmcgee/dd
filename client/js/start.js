import { Cookie } from '/client/js/Cookie.js';
import { Game } from '/client/js/Game.js';
import Navigo from '/lib/navigo/lib/navigo.es.js';

async function boardStart(room) {

  var id = Cookie.getCookie("id");
  var user = Cookie.getCookie("user");
  var room = Cookie.getCookie("room");
  var game = new Game(id, user, room);
  await game.setup();

}

function navigation() {
  var nav = new Navigo("/");
  nav.on(":room/board", params => {
  })
  nav.on(":room/tiles", params => {
  })
  .on(":room", params => {
    console.log("route :room", params);
    boardStart(params.room);
  })
  .resolve();
}

async function start() {
  console.log("Starting...");
  window.addEventListener("DOMContentLoaded", (event) => {
    navigation();
  })
}

export { start }
