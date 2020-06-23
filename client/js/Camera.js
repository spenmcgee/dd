class Camera {

  constructor(canvasEl, srcCanvas) {
    let { canvas, context } = this.getContext(canvasEl);
    this.canvas = canvas;
    this.context = context;
    this.src = srcCanvas;
    canvas.width = window.innerWidth-20;
    canvas.height = window.innerHeight-60;
    this.x = 0;
    this.y = 0;
  }

  getContext(canvas) {
    canvas.id = "camera";
    //canvas.style.zIndex = 6;
    //canvas.style.position = "absolute";
    //canvas.style.border = "0px";
    //canvas.style['background-color'] = 'purple';
    var context = canvas.getContext("2d");
    return { canvas, context };
  }

  draw(x, y) {
    x = x || this.x, y = y || this.y;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.src,
      -x, -y, this.canvas.width, this.canvas.height,
      0, 0, this.canvas.width, this.canvas.height);
    //this.context.fillStyle = "#FF0000";
    //this.context.fillRect(100, 50, 40, 60);
    this.x = x, this.y = y;
  }

}

export { Camera }
