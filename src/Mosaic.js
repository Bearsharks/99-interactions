import React, { useEffect,useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';

document.test = null;
function Mosaic(props) { 
    let canvasRef = useRef(null);
    let originCanvasRef = useRef(null);
    let test = useRef(null);
    let bgImg = new Image();
    bgImg.onload = ()=>{
        bgImg.isLoaded = true;        
        if(originCanvasRef.current){
            originCanvas.renderPicture(originCanvasRef.current);
        }        
    };
    bgImg.isLoaded = false;
    bgImg.src = '/99-interactions/images/gyu.jpg';
    
    let myc = new MyCanvas({
        consts :{
            myimage : new Image(),
            canvaswidth : 1000,
            d : 100,
        },
        vars : {
            medians : new Array(256).fill(null).map(()=>new Set()),
            images : new Array(256),
        },
        init : ()=>{            
            
        },
        simulate : (timestamp)=>{
        
        },
        render : ()=>{

        },
    });
    
    let originCanvas = new MyCanvas({
        consts :{
        },
        vars : {
            medians : new Array(256).fill(null).map(()=>new Array()),
            images : new Array(256),
            base : 0,
            numOfColPixel : 0,
            numOfRowPixel : 0,
        },
        init : ()=>{            
            //w, h 중 작은거를 100개로 나눈다. 그걸 x라 하자
            //100*100이 w,h중 작은거가 된다. h/x*100이 w,h 중 큰것이 된다.
            originCanvas.context.strokeStyle = 'rgba(0, 0, 0, 0)';
            let w = bgImg.width;
            let h = bgImg.height;
            let base,numOfRowPixel,numOfColPixel;
            if(w >= h){
                base = parseInt(w/100);
                w = base*100;
                numOfColPixel = parseInt(h/base);
                h = numOfColPixel * base;       
                numOfRowPixel = 100;
            }else{
                base = parseInt(h/100);
                h = base*100;
                numOfRowPixel = parseInt(w/base);
                w = numOfRowPixel * base;       
                numOfColPixel = 100;
            }
            
            

            let scale = numOfColPixel/w;
            originCanvas.canvas.width = numOfColPixel;
            originCanvas.canvas.height = numOfRowPixel; 
            originCanvas.context.scale(scale,scale);
            originCanvas.context.drawImage(bgImg,0,0);
            
            test.current.src = originCanvas.canvas.toDataURL();
            scale = w/numOfColPixel;
            originCanvas.context.scale(scale,scale);
            

            originCanvas.canvas.width = numOfColPixel*100;
            originCanvas.canvas.height = numOfRowPixel*100; 
            originCanvas.vars.base = base;
            originCanvas.vars.numOfColPixel = numOfColPixel;
            originCanvas.vars.numOfRowPixel = numOfRowPixel;
        },
        simulate : (timestamp)=>{
        
        },
        render : ()=>{
            let vars = originCanvas.vars;
            originCanvas.context.drawImage(test.current,0,0);
            //돌면서 색상 채우고, 색상정보를 저장함
            let imageData = originCanvas.context.getImageData(0,0,vars.numOfColPixel,vars.numOfRowPixel).data;
            for(let i = 0; i < vars.numOfRowPixel ; i++){
                for(let j = 0; j < vars.numOfColPixel ; j++){
                    let y = i*100;
                    let x = j*100;
                    let curPixel = 4*(i*vars.numOfColPixel + j);
                    let lightness = parseInt((3*imageData[curPixel] + 4*imageData[curPixel+1] +imageData[curPixel+2]) >>> 3);
                    originCanvas.context.fillStyle = 'rgb('+ lightness + ","+ lightness +',' +lightness+')';
                    originCanvas.context.fillRect(x,y,100,100);
                    vars.medians[lightness].push([j,i]);
                }                
            }
            //이제 이걸 mycanvas에 애니메이션으로 계속 보여주면됨
            //사진을 하나씩 하나씩 불러오면서 비슷한 색상이면 추가하고
            //한 색상에 이미지가 9개 채워졌으면 그 색상 모조리 채움
            //채울때 주변에 이거 쓰지 마세요 라고 넣어둠
            //채울때 쓰지말란거 말고 채움
            //안된 색깔은 주변에서 빌려옴
            //최적화 시작
            //서버 구축
            //api연결
            //일반용 테스트용 캐시구현
            //테스트 작성
        },
    });

    
    useEffect(() => {
        if(bgImg.isLoaded){
            originCanvas.renderPicture(canvasRef.current);
            myc.canAnimRun = false;
            myc.canRender = false;
            myc.animStart(canvasRef.current);
        }       
        return ()=>{
            originCanvas.delete();
            myc.delete();
        }
    }, []);

    let getMedianColor = (x,y,w,size,ctx)=>{
        let median = 0;
        size++;
        if(!ctx) ctx = myc.context;
        for(let i = 1 ; i < size; i++){
            for(let j = 1 ; j < size; j++){
                let curw = w*i/size, curh = w*j/size;
                let tmp = ctx.getImageData(x + curw, y + curh, 1, 1).data;
                median += tmp[0];
            }
        }
        size--;
        size *= size;
        return Math.round(median / size);
    }
    let fillColor = (x,y,w,lightness)=>{    
        myc.context.fillStyle = 'rgb('+ lightness + ","+ lightness +',' +lightness+')';
        myc.context.fillRect(x,y,w,w);
    }

    let onClickhandler = (e)=>{
        let w = myc.consts.d;
        let wsize = Math.ceil(myc.consts.canvaswidth/w);
        let hsize = Math.ceil(myc.consts.canvaswidth/w);
        for(let i = 0 ; i < hsize; i++){
            for(let j = 0 ; j < wsize; j++){
                let x,y;
                //x = j*w -(i&1)*w/2;
                x = j*w;
                y = i*w;
                let median = getMedianColor(x,y,w,3);
                fillColor(x,y,w,median);
                if(median < 230 && median > 25){
                    myc.vars.medians[median].add([x,y]);
                }
                
            }
        }
        
    }
    let doit = ()=>{
        let a = document.getElementsByTagName('img')[0];
        let d = myc.consts.d;
        var ctx = originCanvasRef .current.getContext('2d');
        let sc = 0.1;
        for(let i = 0 ; i < 10 ; i++){
            ctx.scale(sc,sc);
            ctx.drawImage(a,80,20,d,d,i*100,0,d,d);
            ctx.scale(1/sc,1/sc);
            sc += 0.1;
        }
        
        /*
        let a = document.getElementsByTagName('img')[0];
        let d = myc.consts.d;
        let w = d;
        let h = d;
        let mn = d;
        let x,y;
        let median;
        var ctx = originCanvasRef .current.getContext('2d');
        ctx.drawImage(a,2000,0);        
        
        if(w < h){
            x = 10;
            y = a.height * 0.1 + (h-w)/2;
            mn = w;
            h = w;
        }else{
            x = 10;
            y = a.height * 0.1;
            mn = h;
            w = h;            
        }
        let imgdata = ctx.getImageData(2000+x,y,d*2,d*2);
        ctx.putImageData(myc.img2greyScale(imgdata), 1600, 0);
        let median1 = getMedianColor(1600,0,mn,5,ctx);
        let median2 = getMedianColor(1600+d,0,mn,5,ctx);
        let median3 = getMedianColor(1600,d,mn,5,ctx);
        let median4 = getMedianColor(1600+d,d,mn,5,ctx);

        let imagess = new Array(256);
        let rn = 10;
        for(let i = 0; i < 256; i++){
            let rnd = Math.random();
            let imgdata;
            if(rnd < 0.25){
                imgdata = ctx.getImageData(1600,0,w,h);
                median = median1;
            }else if(rnd < 0.5){
                imgdata = ctx.getImageData(1600+d,0,w,h);
                median = median2;
            }else if(rnd < 0.75){
                imgdata = ctx.getImageData(1600,d,w,h);
                median = median3;
            }else{
                imgdata = ctx.getImageData(1600+d,d,w,h);
                median = median4;
            }
             
            if(median > i){//어두워 져야한다면
                let d = i/median;                
                for(let j = 0;j<imgdata.data.length;j+=4){
                    imgdata.data[j] *= d;
                    imgdata.data[j+1] *= d;
                    imgdata.data[j+2] *= d;
                }
                ctx.putImageData(imgdata,100*(i%rn),100*parseInt(i/rn));
            }else{//더하기 밝게
                let d = i-median;                
                for(let j = 0;j<imgdata.data.length;j+=4){
                    imgdata.data[j] += d;
                    imgdata.data[j+1] += d;
                    imgdata.data[j+2] += d;
                }
                ctx.putImageData(imgdata,100*(i%rn),100*parseInt(i/rn));
            }
            imagess[i] = imgdata;
        }
        let medians = myc.vars.medians;
        for(let i = 0; i < 256; i++){
            for(let pos of medians[i]){
                myc.context.putImageData(imagess[i],pos[0],pos[1]);              

            }
            
        }
        /*
        let cnt = 0;
        for(let i = 0; i < 256; i++){
            
            
        }*/
        //새로운 사진을 받을 때마다 흑백으로 바꾸고
        //평균값을 구해서 위 5 아래 10에 집어 넣는다.
        //200개에 사진들을 넣어둔다. 9개씩
        //더 이상 사진이 없는데 색깔이 모자라면 근처에서 랜덤으로 골라서 만든다.
        //각 점에서 중간값을 보고 맵핑한다. 주변에 사용한 img 표시한다. 이 점에서 사용할수 있는 이미지를 사용한다.     
        //w, h 중 작은거를 100개로 나눈다. 그걸 x라하자  개
        //100*100이 w,h중 작은거가 된다. h/x*100이 w,h 중 큰것이 된다.
    }
    return (
        <>
        <img onClick={doit} src={'https://th.bing.com/th/id/OIP._zOMtcLwRWcBmJ9Q8anbRgAAAA?w=161&h=176&c=7&o=5&dpr=1.65&pid=1.7'}></img>
        <img ref={test}></img>
        <canvas onClick={onClickhandler} ref={canvasRef} width="1000" height="1000">
            이 브라우저는 캔버스를 지원하지 않습니다.
        </canvas> 
        
        <canvas ref={originCanvasRef} width="100" height="100">
            이 브라우저는 캔버스를 지원하지 않습니다.
        </canvas>
        
        </>  
        
    );
}

export default Mosaic;