import React, { useEffect,useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';
import { Vector2D } from "./lib/Vector2D"

function Paper(props) { 
  let canvasRef = useRef(null);  
  let curPos = [-100,-100];

  let mycanvas = new MyCanvas({
    consts :{
      initialV : new Vector2D(props.size,0),
      size : props.size,
      initialPos : [-100,-100],
    },
    vars : {
      isClicked : false,
      gra : null,
      calCurV : (_curPos)=>{
        let moveV = new Vector2D(mycanvas.simulResult.pos,_curPos);
        //벡터 분해
        let projecV = moveV.projection(mycanvas.simulResult.v);//x
        let orthoV = new Vector2D(moveV).subtract(projecV);//y    
        let moveVForP2 = projecV.add(orthoV.multiply(props.coeff_friction));  
        //p2값 계산
        let prevp2 = mycanvas.simulResult.v.nomalize().multiply(mycanvas.consts.size);
        prevp2.x += mycanvas.simulResult.pos[0];
        prevp2.y += mycanvas.simulResult.pos[1];
        //p2 이동 
        prevp2.add(moveVForP2);             
        let curp2 = [prevp2.x,prevp2.y];
        return new Vector2D(_curPos, curp2);
      }
    },
    init : ()=>{
      mycanvas.vars.gra = mycanvas.context.createLinearGradient(-mycanvas.consts.size/2, 0, mycanvas.consts.size/2, 0);
      mycanvas.vars.gra.addColorStop(0, '#57D0CB');
      mycanvas.vars.gra.addColorStop(1, '#66F6F0');
    },
    simulate : ()=>{   
      if(Object.keys(mycanvas.simulResult).length !== 0){
        mycanvas.simulResult.v = mycanvas.vars.calCurV(curPos);    
      }else{
        mycanvas.simulResult = {
          v : mycanvas.consts.initialV,
          pos : mycanvas.consts.initialPos,
        };  
      }
      mycanvas.simulResult.pos = curPos.slice();
    },
    render : ()=>{          
        mycanvas.context.save(); 
        mycanvas.context.translate(mycanvas.simulResult.pos[0],mycanvas.simulResult.pos[1]);
        mycanvas.context.rotate(mycanvas.simulResult.v.getRadian());
        if(mycanvas.vars.isClicked){
          mycanvas.drawPolygon([
              [-0.4*mycanvas.consts.size,-mycanvas.consts.size/2 - mycanvas.consts.size/10],
              [mycanvas.consts.size,-mycanvas.consts.size/2],
              [mycanvas.consts.size,mycanvas.consts.size/2],
              [-0.4*mycanvas.consts.size,mycanvas.consts.size/2 + mycanvas.consts.size/10]            
          ]);
          mycanvas.fill('#66F6F0');
        }else{
          mycanvas.drawPolygon([
            [-0.4*mycanvas.consts.size,-mycanvas.consts.size/2 - mycanvas.consts.size/10],
            [mycanvas.consts.size,-mycanvas.consts.size/2],
            [mycanvas.consts.size,mycanvas.consts.size/2],
            [-0.4*mycanvas.consts.size,mycanvas.consts.size/2 + mycanvas.consts.size/10]            
          ]);
          mycanvas.fill(mycanvas.vars.gra);
        }
        mycanvas.context.restore();      
    },
  });

  const mouseMove = (e)=>{
    curPos[0] = e.clientX - canvasRef.current.offsetLeft;
    curPos[1] = e.clientY - canvasRef.current.offsetTop;
  }

  const mouseDown = (e)=>{      
    mycanvas.vars.isClicked = true;
  }
  const mouseUp = (e)=>{    
    mycanvas.vars.isClicked = false;
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