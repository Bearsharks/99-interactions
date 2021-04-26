import React, { useEffect,useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';

function Mosaic(props) { 
    let canvasRef = useRef(null);
    let mycanvas = new MyCanvas({
        consts :{
            myimage : new Image(),
        },
        vars : {
            isLoaded : false,
        },
        init : ()=>{            
            mycanvas.canvas.width = mycanvas.consts.myimage.width;
            mycanvas.canvas.height = mycanvas.consts.myimage.height;
            mycanvas.context.strokeStyle = 'rgba(0, 0, 0, 0)';
        },
        simulate : (timestamp)=>{
        
        },
        render : ()=>{
            mycanvas.context.drawImage(mycanvas.consts.myimage,0,0);
        },
    });

    mycanvas.consts.myimage.onload = ()=>{
        mycanvas.vars.isLoaded = true;
        
        if(canvasRef.current){
            mycanvas.renderPicture(canvasRef.current);
        }        
    };
    mycanvas.consts.myimage.src = '/99-interactions/macarons.jpg';

    useEffect(() => {
        if(mycanvas.vars.isLoaded){
            mycanvas.renderPicture(canvasRef.current);
        }       
        return ()=>{
            mycanvas.delete();
        }
    }, []);
    let fillMedianColor = (x,y,w)=>{
        let median = [0,0,0,0];
        let size = 3;
        for(let i = 1 ; i < size; i++){
            for(let j = 1 ; j < size; j++){
                let curw = w*i/size, curh = w*j/size;
                let tmp = mycanvas.context.getImageData(x + curw, y + curh, 1, 1).data;
                for(let i = 0 ; i < 4 ;i++){
                    median[i] += tmp[i];
                }
            }
        }
        size = (size-1)*(size-1);
        for(let i = 0 ; i < 4 ;i++){
            median[i] = Math.round(median[i] / size);
        }
        //median = median.map(el=>el.toString(16).toUpperCase().padStart(2, '0'));
        
        mycanvas.context.beginPath();
        mycanvas.context.arc(x+w/2, y+w/2, w/2, 0, Math.PI * 2);
        mycanvas.context.stroke();
        mycanvas.fill('rgba('+ median.join(", ")+')');
        //mycanvas.context.fillRect(x, y, w, h);
    }
    let onClickhandler = (e)=>{
        let w = 20;
        let wsize = Math.ceil(mycanvas.consts.myimage.width/w);
        let hsize = Math.ceil(mycanvas.consts.myimage.height/w);
        for(let i = 0 ; i < hsize; i++){
            for(let j = 0 ; j < wsize; j++){
                let x,y;
                x = j*w;
                y = i*w;
                fillMedianColor(x,y,w);
            }
        }        
    }
    return (
        <>
        <canvas onClick={onClickhandler} ref={canvasRef} width="800" height="800">
            이 브라우저는 캔버스를 지원하지 않습니다.
        </canvas>      
        </>  
    );
}

export default Mosaic;