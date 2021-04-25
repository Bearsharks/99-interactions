import React, { useEffect,useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';
import { Vector2D } from "./lib/Vector2D"

function Paper(props) { 
  let canvasRef = useRef(null);  
  let curPos = [-100,-100];

  let mycanvas = new MyCanvas({
    consts :{
      totalFlipTime : 50, 
      initialV : new Vector2D(props.size,0),
      size : props.size,
      initialPos : [-100,-100],
      flipState :{
        done : 0,
        fliping : 1,
        unfliping : 2,
      },
      unflipedSquare :[
          [-0.4*props.size,-props.size/2 - props.size/10],
          [props.size,-props.size/2],
          [props.size,props.size/2],
          [-0.4*props.size,props.size/2 + props.size/10]            
        ],
      flipedSquare :[
            [-props.size/2,-props.size/2],
            [props.size,-props.size/2],
            [props.size,props.size/2],
            [-props.size/2,props.size/2]            
        ],
      doflip : ()=>{
        if(mycanvas.vars.flipState !== mycanvas.consts.flipState.done) return;
        mycanvas.vars.flipState = mycanvas.consts.flipState.fliping;
        
        if(mycanvas.simulResult && mycanvas.simulResult.progress) {
          mycanvas.simulResult.progress = 0; 
        }
        mycanvas.vars.isUnflipPended = false;
      },
      unflip : ()=>{
        if(mycanvas.vars.flipState !== mycanvas.consts.flipState.done) return;
        mycanvas.vars.flipState = mycanvas.consts.flipState.unfliping;
        mycanvas.simulResult.progress = 0;

        mycanvas.vars.isUnflipPended = false;
      },
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
    vars : {
      flipState : 0,
      isClicked : false,
      gra : null,
      isUnflipPended : false,
    },
    init : ()=>{
      mycanvas.vars.gra = mycanvas.context.createLinearGradient(-mycanvas.consts.size/2, 0, mycanvas.consts.size/2, 0);
      mycanvas.vars.gra.addColorStop(0, '#57D0CB');
      mycanvas.vars.gra.addColorStop(1, '#66F6F0');
      mycanvas.vars.flipState = mycanvas.consts.flipState.done;
    },
    simulate : (timestamp)=>{
      let simulRes = mycanvas.simulResult;
      let totalFlipTime = mycanvas.consts.totalFlipTime;      
      if(!simulRes){ //처음이면
        simulRes = { //초기화
          v : mycanvas.consts.initialV,
          pos : curPos.slice(),
          poligon : mycanvas.consts.unflipedSquare,
          gra : mycanvas.vars.gra,
        };
        mycanvas.simulResult = simulRes;
      }else{ //타임스탬프로 위치 각도 플립정도 계산
        simulRes.v = mycanvas.consts.calCurV(curPos);
        simulRes.pos = curPos.slice();
      }
      //플립상태 플립정도 를 이용 그라데이션과 폴리곤 정점계산  
      if(mycanvas.vars.flipState !== mycanvas.consts.flipState.done){
        if(!simulRes.time){//상태바뀌고 처음이면 
          simulRes.time = timestamp-1;
          simulRes.progress = 0;
        }
        simulRes.progress = Math.min(1000, simulRes.progress + (1000 / totalFlipTime) * (timestamp - simulRes.time));
        simulRes.time = timestamp;
        //정점계산
        
        let srcPoligon = mycanvas.consts.unflipedSquare;
        let dstPoligon = mycanvas.consts.flipedSquare;
        if(mycanvas.vars.flipState === mycanvas.consts.flipState.unfliping){
          [srcPoligon, dstPoligon] = [dstPoligon, srcPoligon];
        }        
        simulRes.poligon = Vector2D.interpolation(srcPoligon,dstPoligon,simulRes.progress/1000);
        //그라데이션 계산
        //플립 #57D0CB -> #66F6F0 언플립#66F6F0 -> #57D0CB 
        let srcColor = [0x57,0xD0,0xCB];
        let dstColor = [0x66,0xF6,0xF0];
        if(mycanvas.vars.flipState === mycanvas.consts.flipState.unfliping){
          [srcColor, dstColor] = [dstColor, srcColor];
        }
        let tgtcolor = Vector2D.interpolation(srcColor,dstColor,simulRes.progress/1000);
        tgtcolor = tgtcolor.map(el=>Math.round(el).toString(16).toUpperCase().padStart(2, '0'));
        mycanvas.vars.gra.addColorStop(0, "#" + tgtcolor.join(""));
        simulRes.gra = mycanvas.vars.gra;
        if(simulRes.progress > 999){
          simulRes.progress = undefined;
          simulRes.time = undefined;
          mycanvas.vars.flipState = mycanvas.consts.flipState.done;
        }        
      }
      if(mycanvas.vars.isUnflipPended) mycanvas.consts.unflip();
    },
    render : ()=>{      
        let simulRes = mycanvas.simulResult;
        mycanvas.context.save(); 
        mycanvas.context.translate(simulRes.pos[0],simulRes.pos[1]);
        mycanvas.context.rotate(simulRes.v.getRadian());
        mycanvas.drawPolygon(simulRes.poligon);
        mycanvas.fill(simulRes.gra);
        mycanvas.context.restore();      
    },
  });

  const mouseMove = (e)=>{
    curPos[0] = e.clientX - canvasRef.current.offsetLeft;
    curPos[1] = e.clientY - canvasRef.current.offsetTop;
  }
  const mouseEnter = (e)=>{
    curPos[0] = e.clientX - canvasRef.current.offsetLeft;
    curPos[1] = e.clientY - canvasRef.current.offsetTop;
    mycanvas.canAnimRun = true;
    mycanvas.canRender = true;
  }
  const mouseLeave = (e)=>{      
    mycanvas.canAnimRun = false;
    mycanvas.canRender = false;
  }
  const mouseDown = (e)=>{      
    mycanvas.consts.doflip();
  }
  const mouseUp = (e)=>{
    mycanvas.vars.isUnflipPended = true;    
  }

  useEffect(() => {
    mycanvas.animStart(canvasRef.current);
    return ()=>{
      mycanvas.delete();
    }
  }, []);
    
  return (
    <canvas 
      onMouseMove={mouseMove} 
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      ref={canvasRef} width="1000" height="800">이 브라우저는 캔버스를 지원하지 않습니다.</canvas>
  );
}
  

export default Paper;