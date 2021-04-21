export class MyCanvas{
  constructor(options){    
    var default_args = {
      'vars'       :   null,
      'consts'     :   null,
      'simulate'   :   ()=>{},
      'render'     :   ()=>{},
      'init'       :   ()=>{},
      'delete'     :   ()=>{},
    }
    for (var index in default_args) {
        if (typeof options[index] == "undefined") options[index] = default_args[index];
    }
    this.vars = options.vars;
    this.consts = options.consts;
    this.simulate = options.simulate;
    this.render = options.render;
    this.init = options.init;
    this._delete = options.delete;
    this.simulResult = {};
    this._prevSResult = {};
    this.lastReq = null;
  }
  
  animStart(_canvas){
    this._init(_canvas);
    this.renderFrame();
  }
  _init(_canvas){
    this.canvas = _canvas;
    this.context = _canvas.getContext('2d');
    this.init();
  }
  renderFrame(){
    this.lastReq = requestAnimationFrame(this.renderFrame.bind(this));
    this.context.clearRect(0, 0, this.canvas.width,  this.canvas.height);
    this._simulate();

    let isRenderable = false;
    for (var index in this.simulResult) {
      if (this._prevSResult[index] !== this.simulResult[index]){
        isRenderable = true;
        this._prevSResult = {};
        Object.assign(this._prevSResult, this.simulResult);
      }
    }
    if(!isRenderable) return;
    
    this.render();
  }
  renderPicture(){
    this.context.clearRect(0, 0, this.canvas.width,  this.canvas.height);
    this.render();
  }
  _simulate(){
    this.simulate();
  }
  delete(){
    cancelAnimationFrame(this.lastReq);
    this._delete();
  }
  drawPolygon(param){
    console.assert(param && param.length > 2, "다각형을 구성하는 점이 너무 작습니다.");
    this.context.beginPath();
    this.context.moveTo(param[0][0], param[0][1]);
    param.forEach(element => {
      this.context.lineTo(element[0],element[1]);
    });
    this.context.closePath();
  }
  fill(style){
    this.context.fillStyle = style;
    this.context.fill();
  }
}  