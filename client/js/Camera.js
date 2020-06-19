class Camera {

  constructor(canvasEl, srcCanvas) {
    let { canvas, context } = this.getContext(canvasEl);
    this.canvas = canvas;
    this.context = context;
    this.src = srcCanvas;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  getContext(canvas) {
    canvas.id = "camera";
    //canvas.style.zIndex = 6;
    //canvas.style.position = "absolute";
    //canvas.style.border = "0px";
    canvas.style['background-color'] = 'purple';
    var context = canvas.getContext("2d");
    return { canvas, context };
  }

  draw(x,y) {
    // var i = new Image();
    // i.src = "/client/img/grass1.png";
    // i.onload = () => this.context.drawImage(i, 0, 0, 100, 100);
    //console.log("draw", this.src);
    //var cw=this.canvas.width, ch=this.canvas.height;
    var cw=this.canvas.width, ch=this.canvas.height;
    this.context.clearRect(0, 0, cw, ch);
    this.context.drawImage(this.src,
      -x, -y, cw, ch,
      0, 0, cw, ch);
    this.context.fillStyle = "#FF0000";
    this.context.fillRect(100, 50, 40, 60);
  }

}

export { Camera }
