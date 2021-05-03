import React, { useEffect,useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';
import CalLiWorker from "./calLiWorker";
import GreyScaleMaker from "./greyScaleMaker";
import images from './lib/Images';
import styles from './Mosaic.module.css';

const MosaicSize = 50;
const NumOfPixel = 90;
const canvasSize = 1000;
class MosaicInfo{
    constructor(){   
        this.bannedList = new Set();
        this.imageIdx = 0;
    }
};
function Mosaic(props) { 
    let canvasRef = useRef(null);
    let originCanvasRef = useRef(null);
    let tmpCanvasRef = useRef(null);
    let lowResBGImgRef = useRef(null);
    let bgImgRef = useRef(null);
    let bgImg = {};
    
    let myc = new MyCanvas({
        consts :{
            setPos : (dx,dy)=>{
                myc.vars.pos[0] += dx;
                myc.vars.pos[1] += dy;
                myc.vars.pos[2] += dx;
                myc.vars.pos[3] += dy; 
            },
            zoom : (posX,posY,d)=>{
                let ratioX = posX/canvasSize;
                let ratioY = posY/canvasSize;

                let prevSize = myc.vars.originSize / myc.vars.zoomScale;  
                myc.vars.zoomScale = Math.min(myc.vars.maxZoomScale,Math.max(1,myc.vars.zoomScale+d));      
                let viewportSize = myc.vars.originSize / myc.vars.zoomScale;  

                let preva = prevSize * ratioX;
                let prevb = prevSize * ratioY; 
                let cura = viewportSize * ratioX;   
                let curb = viewportSize * ratioY;
                let dx,dy;
                [dx,dy] = myc.consts.getClampVal(cura - preva,curb - prevb);

                myc.consts.setPos(dx,dy); 
            },

            move : (dx,dy)=>{
                if(!myc.vars.isInit || !myc.vars.canMove) return;
                dx = dx*10/myc.vars.zoomScale;
                dy = dy*10/myc.vars.zoomScale;
                [dx,dy] = myc.consts.getClampVal(dx,dy);

                myc.consts.setPos(dx,dy);
            },
            getClampVal:(x,y)=>{
                let viewportSize = myc.vars.originSize / myc.vars.zoomScale;
                //원본크기가 뷰포트사이즈보다 같거나 작을때
                if(viewportSize >= myc.vars.originSize*myc.vars.ratioW){
                    x = Math.max(-myc.vars.pos[0],x);//최소를 정함
                    x = Math.min(viewportSize - myc.vars.pos[2],x);//최대를 정함
                }else{
                    x = Math.max(viewportSize - myc.vars.pos[2],x);//최소를 정함
                    x = Math.min(-myc.vars.pos[0],x);//최대를 정함
                }
                if(viewportSize >= myc.vars.originSize*myc.vars.ratioH){
                    y = Math.max(-myc.vars.pos[1],y);
                    y = Math.min(viewportSize - myc.vars.pos[3],y);
                }else{
                    y = Math.max(viewportSize - myc.vars.pos[3],y);
                    y = Math.min(-myc.vars.pos[1],y);
                } 
                return [x,y];
            }
        },
        vars : {
            zoomScale : 1,
            pos : [0,0,0,0],
            isInit : false,
            maxZoomScale : 1,
            originSize : 1000,
            canMove :false,
            ratioW : 1,
            ratioH : 1,
            radioOfPic : 1,
        },
        init : ()=>{   
            myc.vars.originSize = originCanvas.canvas.width > originCanvas.canvas.height ? originCanvas.canvas.width : originCanvas.canvas.height;
            myc.vars.ratioW = originCanvas.canvas.width / myc.vars.originSize;
            myc.vars.ratioH = originCanvas.canvas.height / myc.vars.originSize;
            myc.vars.pos[0] = myc.vars.originSize* (1-myc.vars.ratioW)/2;
            myc.vars.pos[1] = myc.vars.originSize* (1-myc.vars.ratioH)/2;
            myc.vars.pos[2] = myc.vars.pos[0] + myc.vars.originSize*myc.vars.ratioW;
            myc.vars.pos[3] = myc.vars.pos[1] + myc.vars.originSize*myc.vars.ratioH;
            myc.vars.maxZoomScale = myc.vars.originSize/canvasSize;
            myc.vars.radioOfPic = bgImg.renderedPixel/myc.vars.originSize;          
            myc.vars.isInit = true;
        },
        simulate : ()=>{
            let k = myc.vars.originSize / myc.vars.zoomScale;
            let picPos = [-bgImg.zeroX+myc.vars.pos[0]*myc.vars.radioOfPic, -bgImg.zeroY+myc.vars.pos[1]*myc.vars.radioOfPic];
            let viewportSizeForPic = bgImg.renderedPixel /myc.vars.zoomScale;

            myc.simulResult = {
                viewportSize : k,                
                pos : myc.vars.pos,
                picPos : picPos,
                viewportSizeForPic : viewportSizeForPic,
            };
        },
        render : ()=>{
            //그리기
            let res = myc.simulResult;
            myc.context.drawImage(originCanvas.canvas,
                -res.pos[0], -res.pos[1], myc.simulResult.viewportSize, myc.simulResult.viewportSize,
                0, 0, canvasSize, canvasSize);

            myc.context.globalAlpha = 0.1;
            myc.context.drawImage(bgImgRef.current,
                -res.picPos[0], -res.picPos[1], myc.simulResult.viewportSizeForPic, myc.simulResult.viewportSizeForPic,
                0,0,canvasSize,canvasSize);

            myc.context.globalAlpha = 1;
            
        },
    });
    
    let originCanvas = new MyCanvas({
        consts :{
            renderLightness : (lightness)=>{
                for(let pos of originCanvas.vars.pos_lightness[lightness]) {
                    let mosaicInfo = originCanvas.vars.mosaicInfo;
                    let cur = mosaicInfo[pos[1]][pos[0]];
                    let imgs = originCanvas.vars.imgs_lightness;
                    let curImage; 
                    //이미지를 채울 때 주변에 이미 있는 사진은 제외함   
                    let candis = new Array();                 
                    for(let i in imgs[lightness]){
                        let imgidx = imgs[lightness][i].imgidx;
                        if(!cur.bannedList.has(imgidx)){
                            candis.push([i,imgidx]);
                        }
                    }
                    let rd = Math.floor(Math.random() * candis.length);
                    cur.imgidx = candis[rd][1];
                    curImage = imgs[lightness][candis[rd][0]];
                    //채울때 주변에 이 사진은 쓰지 말라고 표시함
                    for(let i = -1; i <= 1; i++){
                        for(let j = -1; j <= 1; j++){
                            let x = pos[0]+i, y = pos[1]+j;
                            if(mosaicInfo[y] && mosaicInfo[y][x]){
                                mosaicInfo[y][x].bannedList.add(cur.imageIdx);
                            }                            
                        }                        
                    }
                    originCanvas.context.putImageData(curImage,pos[0]*MosaicSize,pos[1]*MosaicSize);  
                }
                originCanvas.vars.imgs_lightness[lightness] = null;
                originCanvas.vars.pos_lightness[lightness] = null;
            },
            nOfSameLightnessImgs : 9,
        },
        vars : {
            pos_lightness : new Array(256).fill(null).map(()=>new Array()),
            imgs_lightness : new Array(256).fill(null).map(()=>new Array()),
            imgInfo : [],
            isFull : new Array(256).fill(false),
            base : 0,
            numOfColPixel : 0,
            numOfRowPixel : 0,
            mosaicInfo : null,
            renderLightnessCnt : 0,
        },
        init : ()=>{            
            //w, h 중 큰 것을 NumOfPixel개 로 나눠서 base를 구하고 base x base 크기의 정사각형으로 모자이크를 구성한다. 
            originCanvas.context.strokeStyle = 'rgba(0, 0, 0, 0)';
            let w = bgImgRef.current.width;
            let h = bgImgRef.current.height;
            let base,numOfRowPixel,numOfColPixel;
            if(w >= h){
                base = w/NumOfPixel;
                numOfRowPixel = parseInt(h/base);
                h = numOfRowPixel * base;       
                numOfColPixel = NumOfPixel;
            }else{
                base = h/NumOfPixel;
                numOfColPixel = parseInt(w/base);
                w = numOfColPixel * base;       
                numOfRowPixel = NumOfPixel;
            }
            originCanvas.canvas.width = numOfColPixel;
            originCanvas.canvas.height = numOfRowPixel; 
            originCanvas.vars.mosaicInfo = new Array(numOfRowPixel);
            for (var i = 0; i < numOfRowPixel; i++) {
                originCanvas.vars.mosaicInfo[i] = new Array(numOfColPixel).fill(null).map(()=> new MosaicInfo());
            }
            //배경 이미지 로드 및 관련 정보 초기화
            bgImg.renderedW = w;
            bgImg.renderedH = h;
            bgImg.zeroX = (bgImgRef.current.width - bgImg.renderedW)/2;
            bgImg.zeroY = (bgImgRef.current.height - bgImg.renderedH)/2;
            bgImg.renderedPixel = w > h ? w : h;
            //drawImage를 활용 해상도를 기준 크기까지 줄임
            originCanvas.context.drawImage(bgImgRef.current,bgImg.zeroX,bgImg.zeroY,bgImg.renderedW,bgImg.renderedH,
                                                    0,0,numOfColPixel,numOfRowPixel);
            originCanvas.canRender = false;
            lowResBGImgRef.current.addEventListener("load", originCanvas.render,{once : true});
            lowResBGImgRef.current.src = originCanvas.canvas.toDataURL();

            originCanvas.canvas.width = numOfColPixel*MosaicSize;
            originCanvas.canvas.height = numOfRowPixel*MosaicSize; 
            originCanvas.vars.base = base;
            originCanvas.vars.numOfColPixel = numOfColPixel;
            originCanvas.vars.numOfRowPixel = numOfRowPixel;
        },
        render : ()=>{
            let vars = originCanvas.vars;
            originCanvas.context.drawImage(lowResBGImgRef.current,0,0);
            //돌면서 색상 채우고, 색상정보를 저장함
            let imageData = originCanvas.context.getImageData(0,0,vars.numOfColPixel,vars.numOfRowPixel).data;
            for(let i = 0; i < vars.numOfRowPixel ; i++){
                for(let j = 0; j < vars.numOfColPixel ; j++){
                    let y = i*MosaicSize;
                    let x = j*MosaicSize;
                    let curPixel = 4*(i*vars.numOfColPixel + j);
                    let lightness = parseInt((3*imageData[curPixel] + 4*imageData[curPixel+1] +imageData[curPixel+2]) >>> 3);
                    originCanvas.context.fillStyle = 'rgb('+ lightness + ","+ lightness +',' +lightness+')';
                    originCanvas.context.fillRect(x,y,MosaicSize,MosaicSize);
                    vars.pos_lightness[lightness].push([j,i]);
                }                
            }
            //모자이크처리 이미지를 myc에 그리기 시작
            myc.canAnimRun = true;
            myc.canRender = true;

            //사진을 하나씩 하나씩 불러오면서 비슷한 밝기에다 추가함
            let imageNum = images.length;            
            tmpCanvasRef.current.width  = MosaicSize * 2 * imageNum;
            tmpCanvasRef.current.height = MosaicSize * 2 + 2;
            let tmpctx = tmpCanvasRef.current.getContext('2d');
            
            originCanvas.vars.imgInfo = new Array(images.length);
            let imgInfo = originCanvas.vars.imgInfo;

            const onloadhandler = (e)=>{                
                tmpctx.drawImage(e.target, 0,0,MosaicSize*2,MosaicSize*2, e.target.idx*MosaicSize*2,0,MosaicSize*2,MosaicSize*2);
                let imgDatas = [];
                for(let i = 0; i < 4; i++){
                    let x = e.target.idx*MosaicSize*2 + (i%2 * MosaicSize);
                    let y = Math.floor(i/2) * MosaicSize;
                    imgDatas.push(tmpctx.getImageData(x,y,MosaicSize,MosaicSize));
                    imgDatas[i].imgidx = e.target.idx;
                }

                if (!window.Worker) {
                    tmpctx.drawImage(e.target, 0,0,MosaicSize*2,MosaicSize*2, e.target.idx*MosaicSize*2,0,MosaicSize*2,MosaicSize*2);
                    for(let i = 0; i < 4; i++){
                        let imageData = MyCanvas.img2greyScale(imgDatas[i]);
                        let lightness = 0;
                        let cnt = imageData.data.length/4;
                        for(let i = 0 ; i < imageData.data.length; i+=4){
                            lightness += imageData.data[i];
                        }
                        lightness = parseInt(lightness / cnt);
                        
                        for(let d = -20; d <= 10 ;d++){
                            if(lightness + d >= 10 && lightness + d <= 235 && !originCanvas.vars.isFull[lightness + d]){
                                if(d < 0){
                                    let res = MyCanvas.lightnessMul(imageData, (lightness + d) / lightness);
                                    res.imgidx = imageData.imgidx;
                                    originCanvas.vars.imgs_lightness[lightness + d].push(res);
                                }else if (d > 0){
                                    let res = MyCanvas.lightnessAdd(imageData, d);
                                    res.imgidx = imageData.imgidx;
                                    originCanvas.vars.imgs_lightness[lightness + d].push(res);
                                }else{
                                    originCanvas.vars.imgs_lightness[lightness + d].push(imageData);
                                }

                                let curSize = originCanvas.vars.imgs_lightness[lightness + d].length;
                                if(curSize >= originCanvas.consts.nOfSameLightnessImgs){                                
                                    originCanvas.vars.isFull[lightness + d] = true;
                                    originCanvas.consts.renderLightness(lightness + d);
                                }
                            }                       
                        } 
                    }                    
                }else{
                    const calLiWorker = new Worker(CalLiWorker);
                    const greyScaleMaker = new Worker(GreyScaleMaker);  
                    calLiWorker.onmessage = function(e) {//e에는      
                        let lightness = e.data[0];
                        let isComplete = true;
                        for(let d = -20; d <= 10 ;d++){
                            if(lightness + d >= 10 && lightness + d <= 235) {
                                originCanvas.vars.isFull[lightness+d]++;
                                if(originCanvas.vars.isFull[lightness+d] <= originCanvas.consts.nOfSameLightnessImgs){
                                    isComplete = false;
                                }
                            }
                        }
                        if(!isComplete){
                            greyScaleMaker.postMessage({
                                isFull : originCanvas.vars.isFull,
                                lightness : lightness,
                                nOfSameLightnessImgs : originCanvas.consts.nOfSameLightnessImgs,
                                imgData : e.data[1]
                            });
                        }                        
                    }
                    greyScaleMaker.onmessage = function(e) {//e에는                        
                        for(let i = 0; i< e.data.length;i++){
                            let lightness = e.data[i][0];
                            originCanvas.vars.imgs_lightness[lightness].push(e.data[i][1]);
                            let curSize = originCanvas.vars.imgs_lightness[lightness].length;
                            if(curSize >= originCanvas.consts.nOfSameLightnessImgs){
                                originCanvas.consts.renderLightness(lightness);
                            }
                        }                       
                    }
                    for(let i = 0; i < 4; i++){
                        calLiWorker.postMessage(imgDatas[i]);
                    }                     
                }
                imgInfo[e.target.idx].tmpimg.onload = null;
                imgInfo[e.target.idx].tmpimg = null;
            };
            
            for(let idx = 0; idx < images.length;idx++){                
                let tmpimg = new Image();
                tmpimg.crossOrigin = "Anonymous";
                tmpimg.idx = idx;                
                tmpimg.addEventListener("load", onloadhandler,{once : true});
                tmpimg.src = images[idx];
                imgInfo[idx] = {
                    tmpimg : tmpimg,
                    src : images[idx],
                    //!!다른 정보들
                };
            }
            //정보 보여주는 팝업창을 띄우기
            //서버 구축
            //api연결
            //일반용 테스트용 캐시구현
        },
    });
    
    useEffect(() => {
           
        return ()=>{
            originCanvas.delete();
            myc.delete();
        }
    }, []);

    const onWheelhandler = (e)=>{
        let x = e.pageX - canvasRef.current.offsetLeft;
        let y = e.pageY - canvasRef.current.offsetTop;
        if(e.deltaY > 0){
            myc.consts.zoom(x,y,-0.1);
        }else if(e.deltaY < 0){
            myc.consts.zoom(x,y,0.1);
        }
    }

    const mouseMove = (e)=>{
        myc.consts.move(e.movementX, e.movementY);  
    }
    const onClickhandler = (e)=>{

    }
    const mouseDown = (e)=>{      
        myc.vars.canMove = true;
    }
    const mouseUp = (e)=>{
        myc.vars.canMove = false;
    }
    const mouseLeave = (e)=>{      
        myc.vars.canMove = false;
    }
    const onImageLoaded = (e)=>{
        originCanvas.renderPicture(originCanvasRef.current);        
        myc.animStart(canvasRef.current);   
    }
    return (
        <>
        <img className={styles.dispNone} ref={lowResBGImgRef}></img>
        <img className={styles.dispNone} src={props.src} ref={bgImgRef}
            onLoad={onImageLoaded}            
        ></img>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize}
            className={'asdf'}
            onClick={onClickhandler}
            onWheel={onWheelhandler}
            onMouseMove={mouseMove} 
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            onMouseLeave={mouseLeave}
        >
            이 브라우저는 캔버스를 지원하지 않습니다.
        </canvas> 
        <canvas className={styles.dispNone} ref={tmpCanvasRef} width="100" height="100">
        </canvas> 
        <canvas className={styles.dispNone} ref={originCanvasRef} width="100" height="100">
        </canvas>        
        </>  
        
    );
}

export default Mosaic;