import React, { useEffect,useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';
import { Vector2D } from "./lib/Vector2D"

function Paper(props) { 
  let canvasRef = useRef(null);  
  let curPos = [200,200];
  let curV = new Vector2D(props.size,0);

  let mycanvas = new MyCanvas({
    state : {
      pos : [200,200],
      v : new Vector2D(0,0),
      isClicked : false,
      gra : null,
      size : props.size,
      calCurV : (_curPos)=>{
        let moveV = new Vector2D(mycanvas.state.pos,_curPos);
        //벡터 분해
        let projecV = moveV.projection(mycanvas.state.v);//x
        let orthoV = new Vector2D(moveV).subtract(projecV);//y    
        let moveVForP2 = projecV.add(orthoV.multiply(props.coeff_friction));  
        //p2값 계산
        let prevp2 = mycanvas.state.v.nomalize().multiply(mycanvas.state.size);
        prevp2.x += mycanvas.state.pos[0];
        prevp2.y += mycanvas.state.pos[1];
        //p2 이동 
        prevp2.add(moveVForP2);             
        let curp2 = [prevp2.x,prevp2.y];
        return new Vector2D(_curPos, curp2);
      }
    },
    init : ()=>{
      mycanvas.state.gra = mycanvas.context.createLinearGradient(-mycanvas.state.size/2, 0, mycanvas.state.size/2, 0);
      mycanvas.state.gra.addColorStop(0, '#57D0CB');
      mycanvas.state.gra.addColorStop(1, '#66F6F0');
    },
    simulate : ()=>{
      //시물레이트     
      if(mycanvas.state.v.x !== 0 || mycanvas.state.v.y !== 0) curV = mycanvas.state.calCurV(curPos);      
  
      mycanvas.state.pos = curPos.slice();
      mycanvas.state.v = new Vector2D(curV);
    },
    render : ()=>{        
        //그리기        
        mycanvas.context.save(); 
        mycanvas.context.translate(curPos[0],curPos[1]);
        mycanvas.context.rotate(curV.getRadian());
        if(mycanvas.state.isClicked){
          mycanvas.drawPolygon([
              [-0.4*mycanvas.state.size,-mycanvas.state.size/2 - mycanvas.state.size/10],
              [mycanvas.state.size,-mycanvas.state.size/2],
              [mycanvas.state.size,mycanvas.state.size/2],
              [-0.4*mycanvas.state.size,mycanvas.state.size/2 + mycanvas.state.size/10]            
          ]);
          mycanvas.fill('#66F6F0');
        }else{
          mycanvas.drawPolygon([
            [-0.4*mycanvas.state.size,-mycanvas.state.size/2 - mycanvas.state.size/10],
            [mycanvas.state.size,-mycanvas.state.size/2],
            [mycanvas.state.size,mycanvas.state.size/2],
            [-0.4*mycanvas.state.size,mycanvas.state.size/2 + mycanvas.state.size/10]            
          ]);
          mycanvas.fill(mycanvas.state.gra);
        }
        mycanvas.context.restore();      
    },
  });

  const mouseMove = (e)=>{
    curPos[0] = e.clientX - canvasRef.current.offsetLeft;
    curPos[1] = e.clientY - canvasRef.current.offsetTop;
  }

  const mouseDown = (e)=>{      
    mycanvas.state.isClicked = true;
  }
  const mouseUp = (e)=>{    
    mycanvas.state.isClicked = false;
  }

  useEffect(() => {
    mycanvas.animStart(canvasRef.current);
    return ()=>{
      mycanvas.delete();
    }
  }, []);

    
  return (
    <canvas onMouseMove={mouseMove} onMouseDown={mouseDown} onMouseUp={mouseUp} ref={canvasRef} width="1000" height="800">이 브라우저는 캔버스를 지원하지 않습니다.</canvas>
  );
}
  

export default Paper;