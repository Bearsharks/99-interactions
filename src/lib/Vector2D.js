export class Vector2D{
  constructor(_param1, _param2) {
    if(typeof _param1 === "object" && typeof _param2 === "object"){
      this.x = _param2[0] - _param1[0];
      this.y = _param2[1] - _param1[1];
    }else if(typeof _param1 === "number" && typeof _param2 === "number"){
      this.x = _param1;
      this.y = _param2;  
    } else if(_param1.x !== undefined && _param1.y !== undefined ){
      this.x = _param1.x;
      this.y = _param1.y;
    }else{
      this.x = 0;
      this.y = 0;
    }    
  }
  static interpolation(src, dst, coeff){
    if(!src.length && !dst.length) return (1-coeff)*src + coeff*dst;
    if(src.length !== dst.length) return;
    let ret = [];
    for(let i = 0; i < src.length;i++){
      ret[i] = Vector2D.interpolation(src[i], dst[i], coeff);
    }
    return ret;
  }

  dotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }
  
  nomalize() {
    let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);    
    return new Vector2D(this.x/magnitude, this.y/magnitude);
  }
  
  multiply(scala) {
    this.x *= scala;
    this.y *= scala;
    return this;
  }
  add(v){
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  subtract(v){
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  projection(_tgt){
    let tgt = new Vector2D(_tgt);
    return tgt.multiply(this.dotProduct(tgt) / tgt.dotProduct(tgt));
  }

  getRadian(){
    let result = Math.acos(this.nomalize().x);
    if(this.y<0) result = 2*Math.PI - result;
    return result;
  }
}
