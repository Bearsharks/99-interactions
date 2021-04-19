import React, { useState, useEffect,useRef } from 'react';
import { Vector2D } from "./lib/Vector2D"

function Paper(props) {
  let pos = [200,200];
  let v = new Vector2D(0,0);
  let isClicked = false;
  let gra;
  let canvasRef = useRef(null);
  let contextRef = useRef(null);

  let curPos = [200,200];
  let curV = new Vector2D(props.size,0);
  var myReq;  
  const calCurV = (_curPos)=>{
      let moveV = new Vector2D(pos,_curPos);
      //벡터 분해
      let projecV = moveV.projection(v);//x
      let orthoV = new Vector2D(moveV).subtract(projecV);//y    
      let moveVForP2 = projecV.add(orthoV.multiply(props.coeff_friction));  
      //prevp2값 계산
      let prevp2 = v.nomalize().multiply(props.size);
      prevp2.x += pos[0];
      prevp2.y += pos[1];
      //p2 이동 
      prevp2.add(moveVForP2);
           
      let curp2 = [prevp2.x,prevp2.y];
      return new Vector2D(_curPos, curp2);
  }
  const mouseMove = (e)=>{
    curPos[0] = e.clientX - canvasRef.current.offsetLeft;
    curPos[1] = e.clientY - canvasRef.current.offsetTop;
  }
  const mouseDown = (e)=>{      
    isClicked = true;
  }
  const mouseUp = (e)=>{    
    isClicked = false;
  }
  const clickedPaper = ()=>{
    let context = contextRef.current;
    context.beginPath();
    context.moveTo(-props.size/2,-props.size/2);
    context.lineTo(props.size,-props.size/2);
    context.lineTo(props.size,props.size/2);
    context.lineTo(-props.size/2,props.size/2);
    context.fillStyle = '#66F6F0';    
    context.fill();
  }

  const justPaper = ()=>{    
    let context = contextRef.current;
    context.beginPath();
    context.moveTo(-0.4*props.size,-props.size/2 - props.size/10);
    context.lineTo(props.size,-props.size/2);
    context.lineTo(props.size,props.size/2);
    context.lineTo(-0.4*props.size,props.size/2 + props.size/10);
    context.fillStyle = gra;    
    context.fill();
  }
    
  useEffect(() => {
    contextRef.current = canvasRef.current.getContext('2d');
    gra = contextRef.current.createLinearGradient(-props.size/2, 0, props.size/2, 0);
    gra.addColorStop(0, '#57D0CB');
    gra.addColorStop(1, '#66F6F0');
    const draw = ()=>{ 
      myReq = requestAnimationFrame(draw);
      //시물레이트     
      if(v.x !== 0 || v.y !== 0)  curV = calCurV(curPos);      

      pos = curPos.slice();
      v = new Vector2D(curV);
      let context = contextRef.current;
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
    }

    draw();
    return function clean(){
      cancelAnimationFrame(myReq);
    }
  }, []);

    
  return (
    <canvas onMouseMove={mouseMove} onMouseDown={mouseDown} onMouseUp={mouseUp} ref={canvasRef} width="1000" height="800">이 브라우저는 캔버스를 지원하지 않습니다.</canvas>
  );
}
  

export default Paper;