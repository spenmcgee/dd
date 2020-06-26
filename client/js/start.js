import { Cookie } from '/client/js/Cookie.js';
import { Game } from '/client/js/Game.js';
import Navigo from '/lib/navigo/lib/navigo.es.js';

async function boardStart(room) {

  eve.on("snap.drag.start", function(x, y, e) {
    e.stopPropagation();
  });
  Snap.plugin( function( Snap, Element, Paper, global ) {
    Element.prototype.altDrag = function() {
      this.drag( dragMove, dragStart, dragEnd );
      return this;
    }
    var dragStart = function ( x,y,ev ) {
      this.data('origTransform', this.transform().local );
    }
    var dragMove = function(dx, dy, ev, x, y) {
      var zoomPan = this.paper.zpd('save');
      this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx / zoomPan.a, dy / zoomPan.a]
      });
    }
    var dragEnd = function() {
    }
  });

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
