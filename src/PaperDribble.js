import React, { useState, useEffect,useRef } from 'react';
import { Vector2D } from "./lib/Vector2D"

function Paper(props) {
  let canvasRef = useRef(null);
  let contextRef = useRef(null);
  let context;
  const size = 50;
  let curPos = [200,200];
  let curV = new Vector2D(size,0);
  let prevPos = [200,200];
  let prevV = new Vector2D(0,0);
  let isClicked = false;
  let isChanged = false;
  var myReq;  
  let gra;
  const calCurV = (_curPos,_prevPos, _prevV)=>{
      let moveV = new Vector2D(_prevPos,_curPos);
      //벡터 분해
      let projecV = moveV.projection(_prevV);//x
      let orthoV = new Vector2D(moveV).subtract(projecV);//y    
      let moveVForP2 = projecV.add(orthoV.multiply(props.coeff_friction));  
      //prevp2값 계산
      let prevp2 = _prevV.nomalize().multiply(size);
      prevp2.x += _prevPos[0];
      prevp2.y += _prevPos[1];
      //p2 이동 
      prevp2.add(moveVForP2);
           
      let curp2 = [prevp2.x,prevp2.y];
      return new Vector2D(_curPos, curp2);
  }

  const mouseMove = function(e){    
    curPos[0] = e.clientX - canvasRef.current.offsetLeft;
    curPos[1] = e.clientY - canvasRef.current.offsetTop;
    isChanged = true;
  }
  const mouseDown = function(e){    
    isClicked = true;
    isChanged = true;
    setTimeout(()=>{isClicked = false;isChanged = true;},200);
  }
  const clickedPaper = ()=>{
    context.beginPath();
    context.moveTo(-size/2,-size/2);
    context.lineTo(size,-size/2);
    context.lineTo(size,size/2);
    context.lineTo(-size/2,size/2);
    context.fillStyle = '#66F6F0';    
    context.fill();
  }

  const justPaper = ()=>{    
    context.beginPath();
    context.moveTo(-0.4*size,-size/2 - size/10);
    context.lineTo(size,-size/2);
    context.lineTo(size,size/2);
    context.lineTo(-0.4*size,size/2 + size/10);
    context.fillStyle = gra;    
    context.fill();
  }
  const draw = ()=>{         
      myReq = requestAnimationFrame(draw); 
      //시물레이트
      if(!isChanged) return;
      if(prevV.x != 0 || prevV.y != 0){
        curV = calCurV(curPos,prevPos,prevV);
      }
      prevPos = curPos.slice();
      prevV = new Vector2D(curV);
      //그리기
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.save(); 
      context.translate(curPos[0],curPos[1]);
      context.rotate(curV.getRadian());
      if(isClicked){
        clickedPaper();
      }else{
        justPaper();
      }
      context.restore();   
      isChanged = false;      
  }
  useEffect(() => {
    contextRef.current = canvasRef.current.getContext('2d');
    context = contextRef.current;
    gra = context.createLinearGradient(-size/2,0,size,0);
    gra.addColorStop(0, '#57D0CB');
    gra.addColorStop(1, '#66F6F0');

    draw();
    return function clean(){
      cancelAnimationFrame(myReq);
    }
  }, []);

    
  return (
    <canvas onMouseMove={mouseMove} onMouseDown={mouseDown} ref={canvasRef} width="1000" height="800">이 브라우저는 캔버스를 지원하지 않습니다.</canvas>
  );
}
  

export default Paper;