import { Cookie } from '/client/js/Cookie.js';
import { Game } from '/client/js/ui/Game.js';
import { WebsocketClient } from '/client/js/WebsocketClient.js';
import Navigo from '/lib/navigo/lib/navigo.es.js';

async function boardStart(room) {
  var id = Cookie.getCookie("id");
  var user = Cookie.getCookie("user");
  var room = Cookie.getCookie("room");
  var color = Cookie.getCookie("color");
  var wsClient = new WebsocketClient();
  var game = new Game(id, user, room, color, wsClient);
  await game.setup();
  wsClient.connect();
}

function navigation() {

  var nav = new Navigo("/");
  nav.on(":room/board", params => {
  })
  nav.on(":room/commands", params => {
  })
  nav.on(":room/asset", params => {
  })
  nav.on(":room/config", params => {
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
