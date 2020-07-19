Snap.plugin( function( Snap, Element, Paper, global ) {

	function rectunion(rect1, rect2) {
		var p1 = rect1.paper.path(rect1);
		console.log("***********here", rect1.select('path'))
		console.log("***********here", Snap.path.intersection(rect1.select('path'), rect2.select('path')))
		return p1;
	}

	Paper.prototype.rectunion = rectunion;
})
