import React, { useEffect, useRef } from 'react';
import { MyCanvas } from './lib/MyCanvas';
import CalLiWorker from "./calLiWorker";
import GreyScaleMaker from "./greyScaleMaker";

import styles from './Mosaic.module.css';


const MosaicSize = 30;
const NumOfPixel = 200;
const canvasSize = 800;
class MosaicInfo {
    constructor() {
        this.bannedList = new Set();
        this.imageIdx = null;
    }
};
const shuffle = (array) => {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const Mosaic = React.memo((props) => {
    let canvasRef = useRef(null);
    let originCanvasRef = useRef(null);
    let tmpCanvasRef = useRef(null);
    let bgImgRef = useRef(null);
    let bgImg = {};
    let images = [];
    fetch("https://99-interactions-functions.azurewebsites.net/api/HttpTrigger1?code=gyPykVBnZ5lSl3vwOm3BvEojwZolAbHSuujci28YxApqalzrA2rHfw==", {
        method: 'GET',
    }).then(res => res.json())
        .then(json => {
            images = json.imgInfos.value;
            bgImgRef.current.crossOrigin = "Anonymous";
            bgImgRef.current.src = images[0].thumbnailUrl + "";
            props.setTodaySong(json.todaySong);
        });
    const preventDefault = e => e.preventDefault();
    let myc = new MyCanvas({
        consts: {
            setPos: (dx, dy) => {
                myc.vars.pos[0] += dx;
                myc.vars.pos[1] += dy;
                myc.vars.pos[2] += dx;
                myc.vars.pos[3] += dy;
            },
            zoom: (posX, posY, d) => {
                let ratioX = posX / canvasSize;
                let ratioY = posY / canvasSize;
                d *= myc.vars.zoomScale;
                let prevSize = myc.vars.originSize / myc.vars.zoomScale;
                myc.vars.zoomScale = Math.min(myc.vars.maxZoomScale, Math.max(1, myc.vars.zoomScale + d));
                let viewportSize = myc.vars.originSize / myc.vars.zoomScale;

                let preva = prevSize * ratioX;
                let prevb = prevSize * ratioY;
                let cura = viewportSize * ratioX;
                let curb = viewportSize * ratioY;
                let [dx, dy] = myc.consts.getClampVal(cura - preva, curb - prevb);

                myc.consts.setPos(dx, dy);
            },
            posToIdx: (posX, posY) => {
                let ratioX = posX / canvasRef.current.clientWidth;
                let ratioY = posY / canvasRef.current.clientWidth;
                let viewportSize = myc.vars.originSize / myc.vars.zoomScale;
                let dx = viewportSize * ratioX;
                let dy = viewportSize * ratioY;

                let idxC = Math.floor((-myc.vars.pos[0] + dx) / MosaicSize);
                let idxR = Math.floor((-myc.vars.pos[1] + dy) / MosaicSize);
                return [idxC, idxR];
            },
            click: (posX, posY) => {
                let x = myc.vars.curHoveredPos[0];
                let y = myc.vars.curHoveredPos[1];
                if (0 <= x && x < originCanvas.vars.numOfColPixel && 0 <= y && y < originCanvas.vars.numOfRowPixel
                    && originCanvas.vars.mosaicInfo[y][x].imageIdx !== null) {
                    //현재 마우스 포인터가 캔버스 기준으로
                    //현재 인덱스는 캔버스 기준으로 바꾸면 좌상단이 몇몇인가?
                    let viewportSize = myc.vars.originSize / myc.vars.zoomScale;
                    let toCanvasCoeff = canvasRef.current.clientWidth / viewportSize;
                    let idxc = x * MosaicSize * toCanvasCoeff;
                    let idxr = y * MosaicSize * toCanvasCoeff;
                    let zeroc = myc.vars.pos[0] * toCanvasCoeff;
                    let zeror = myc.vars.pos[1] * toCanvasCoeff;
                    idxc += zeroc;
                    idxr += zeror;

                    //좌상단과 현재 마우스 포인터를 비교해서 모자이크에서 얼마만큼 갔고 얼마만큼 남았나 
                    let dc = posX - idxc;
                    let dr = posY - idxr;
                    let curMosaicSize = MosaicSize * toCanvasCoeff;


                    let popUpSize = Math.floor(canvasRef.current.clientWidth / 2 - curMosaicSize);
                    let popUpPos = [0, 0];
                    if (posX > canvasRef.current.clientWidth / 2) popUpPos[0] = posX + (curMosaicSize - dc) - popUpSize;
                    else popUpPos[0] = (posX - dc);
                    if (posY > canvasRef.current.clientWidth / 2) popUpPos[1] = posY + (curMosaicSize - dr) - popUpSize;
                    else popUpPos[1] = (posY - dr);
                    popUpPos[0] = Math.min(canvasRef.current.clientWidth - popUpSize, Math.max(0, popUpPos[0])) + canvasRef.current.offsetLeft;
                    popUpPos[1] = Math.min(canvasRef.current.clientWidth - popUpSize, Math.max(0, popUpPos[1])) + canvasRef.current.offsetTop;
                    let imageIdx = originCanvas.vars.mosaicInfo[y][x].imageIdx;
                    let imageInfo = images[Math.floor(imageIdx)];
                    props.popUp({
                        popUpSize: popUpSize,
                        popUpPos: popUpPos,
                        imageId: imageInfo.imageId,
                        name: imageInfo.name,
                        thumbnail: imageInfo.thumbnail,
                        thumbnailUrl: imageInfo.thumbnailUrl,
                        webSearchUrl: imageInfo.webSearchUrl,
                    });
                } else {
                    props.popUp(null);
                }
            },
            emp: (posX, posY) => {
                let pos = myc.consts.posToIdx(posX, posY);
                if (0 <= pos[0] && pos[0] < originCanvas.vars.numOfColPixel
                    && 0 <= pos[1] && pos[1] < originCanvas.vars.numOfRowPixel) {
                    myc.vars.curHoveredPos = pos;
                } else {
                    myc.vars.curHoveredPos = [-100, -100];
                }

            },
            move: (dx, dy) => {
                if (!myc.vars.isInit || !myc.vars.canMove) return;
                dx = dx * 10 / myc.vars.zoomScale;
                dy = dy * 10 / myc.vars.zoomScale;
                [dx, dy] = myc.consts.getClampVal(dx, dy);

                myc.consts.setPos(dx, dy);
            },
            getClampVal: (x, y) => {
                let viewportSize = myc.vars.originSize / myc.vars.zoomScale;
                //원본크기가 뷰포트사이즈보다 같거나 작을때
                if (viewportSize >= myc.vars.originSize * myc.vars.ratioW) {
                    x = Math.max(-myc.vars.pos[0], x);//최소를 정함
                    x = Math.min(viewportSize - myc.vars.pos[2], x);//최대를 정함
                } else {
                    x = Math.max(viewportSize - myc.vars.pos[2], x);//최소를 정함
                    x = Math.min(-myc.vars.pos[0], x);//최대를 정함
                }
                if (viewportSize >= myc.vars.originSize * myc.vars.ratioH) {
                    y = Math.max(-myc.vars.pos[1], y);
                    y = Math.min(viewportSize - myc.vars.pos[3], y);
                } else {
                    y = Math.max(viewportSize - myc.vars.pos[3], y);
                    y = Math.min(-myc.vars.pos[1], y);
                }
                return [x, y];
            }
        },
        vars: {
            zoomScale: 1,
            pos: [0, 0, 0, 0],
            curHoveredPos: [-10, -10],
            isInit: false,
            maxZoomScale: 1,
            originSize: 1000,
            canMove: false,
            ratioW: 1,
            ratioH: 1,
            radioOfPic: 1,
        },
        init: () => {
            myc.vars.originSize = originCanvas.canvas.width > originCanvas.canvas.height ? originCanvas.canvas.width : originCanvas.canvas.height;
            myc.vars.ratioW = originCanvas.canvas.width / myc.vars.originSize;
            myc.vars.ratioH = originCanvas.canvas.height / myc.vars.originSize;
            myc.vars.pos[0] = myc.vars.originSize * (1 - myc.vars.ratioW) / 2;
            myc.vars.pos[1] = myc.vars.originSize * (1 - myc.vars.ratioH) / 2;
            myc.vars.pos[2] = myc.vars.pos[0] + myc.vars.originSize * myc.vars.ratioW;
            myc.vars.pos[3] = myc.vars.pos[1] + myc.vars.originSize * myc.vars.ratioH;
            myc.vars.maxZoomScale = myc.vars.originSize * (100 / MosaicSize) / canvasSize;
            myc.vars.radioOfPic = bgImg.renderedPixel / myc.vars.originSize;
            let d = myc.vars.pos[0] + myc.vars.pos[1];
            if (d > canvasSize / 8) {
                myc.consts.zoom(canvasSize / 2, canvasSize / 2, myc.vars.originSize / (myc.vars.originSize - 1.7 * d) - 1);
            }

            myc.vars.isInit = true;

        },
        simulate: () => {
            let viewportSize = myc.vars.originSize / myc.vars.zoomScale;
            let picPos = [-bgImg.zeroX + myc.vars.pos[0] * myc.vars.radioOfPic, -bgImg.zeroY + myc.vars.pos[1] * myc.vars.radioOfPic];
            let viewportSizeForPic = bgImg.renderedPixel / myc.vars.zoomScale;
            let hoverLineSize = MosaicSize * canvasSize / viewportSize;
            let hoveredPos = myc.vars.curHoveredPos.slice();
            hoveredPos[0] = hoveredPos[0] * MosaicSize + myc.vars.pos[0];
            hoveredPos[1] = hoveredPos[1] * MosaicSize + myc.vars.pos[1];
            hoveredPos[0] *= canvasSize / viewportSize;
            hoveredPos[1] *= canvasSize / viewportSize;
            myc.simulResult = {
                viewportSize: viewportSize,
                pos: myc.vars.pos,
                picPos: picPos,
                viewportSizeForPic: viewportSizeForPic,
                hoveredPos: hoveredPos,
                hoverLineSize: hoverLineSize,
            };
        },
        render: () => {
            //그리기
            let res = myc.simulResult;
            myc.context.drawImage(...MyCanvas.getSafeRect(originCanvas.canvas,
                -res.pos[0], -res.pos[1], res.viewportSize, res.viewportSize,
                0, 0, canvasSize, canvasSize));
            myc.context.beginPath();
            myc.context.lineTo(res.hoveredPos[0], res.hoveredPos[1]);
            myc.context.lineTo(res.hoveredPos[0] + res.hoverLineSize, res.hoveredPos[1]);
            myc.context.lineTo(res.hoveredPos[0] + res.hoverLineSize, res.hoveredPos[1] + res.hoverLineSize);
            myc.context.lineTo(res.hoveredPos[0], res.hoveredPos[1] + res.hoverLineSize);
            myc.context.closePath();
            myc.context.stroke();

            myc.context.globalAlpha = 0.2;
            myc.context.drawImage(...MyCanvas.getSafeRect(bgImgRef.current,
                -res.picPos[0], -res.picPos[1], res.viewportSizeForPic, res.viewportSizeForPic,
                0, 0, canvasSize, canvasSize));
            myc.context.globalAlpha = 1;
        },
    });

    let originCanvas = new MyCanvas({
        consts: {
            renderLightness: (lightness) => {
                for (let pos of originCanvas.vars.pos_lightness[lightness]) {
                    let mosaicInfo = originCanvas.vars.mosaicInfo;
                    let cur = mosaicInfo[pos[1]][pos[0]];
                    let imgs = originCanvas.vars.imgs_lightness;
                    let curImage;
                    //이미지를 채울 때 주변에 이미 있는 사진은 제외함   
                    let candis = [];
                    for (let i in imgs[lightness]) {
                        let imgidx = imgs[lightness][i].imgidx;
                        if (!cur.bannedList.has(imgidx)) {
                            candis.push([i, imgidx]);
                        }
                    }
                    let rd = Math.floor(Math.random() * candis.length);
                    if (!candis[rd]) debugger;
                    cur.imageIdx = candis[rd][1];
                    curImage = imgs[lightness][candis[rd][0]];
                    //채울때 주변에 이 사진은 쓰지 말라고 표시함
                    for (let i = -2; i <= 2; i++) {
                        for (let j = -2; j <= 2; j++) {
                            let x = pos[0] + i, y = pos[1] + j;
                            if (mosaicInfo[y] && mosaicInfo[y][x]) {
                                mosaicInfo[y][x].bannedList.add(cur.imageIdx);
                            }
                        }
                    }
                    originCanvas.context.putImageData(curImage, pos[0] * MosaicSize, pos[1] * MosaicSize);
                }
                originCanvas.vars.imgs_lightness[lightness] = null;
                originCanvas.vars.pos_lightness[lightness] = null;
            },
            selectUsableImg: (cur, images) => {
                for (let info of images) {
                    let imgidx = info[1];
                    if (!cur.bannedList.has(imgidx)) {
                        return info;
                    }
                }
                return null;
            },
            drawRemain: () => {
                for (let lightness = 5; lightness < 240; lightness++) {
                    let curPosArray = originCanvas.vars.pos_lightness[lightness];
                    let imgs_lightness = originCanvas.vars.imgs_lightness;
                    let images = [];
                    for (let pos of curPosArray) {
                        let mosaicInfo = originCanvas.vars.mosaicInfo;
                        let cur = mosaicInfo[pos[1]][pos[0]];
                        let d = 1;
                        //images에 있는 것 중 사용 할 수 있는 것이 있다면 선택
                        //!!!있는것중 랜덤으로 고르게하기
                        let imageInfo = originCanvas.consts.selectUsableImg(cur, images);
                        //없으면 사용 할 수 있으며 가장 밝기가 비슷한 이미지를 찾고 같은 밝기로 만들기
                        while (!imageInfo) {
                            let candiImageInfo = null;
                            if (lightness + d < 255) {
                                candiImageInfo = originCanvas.consts.selectUsableImg(cur, imgs_lightness[lightness + d]);
                            }
                            if (!candiImageInfo && lightness - d > 0) {
                                candiImageInfo = originCanvas.consts.selectUsableImg(cur, imgs_lightness[lightness - d]);
                            }
                            if (candiImageInfo) {
                                imageInfo = [0, candiImageInfo[1]];
                                if (d < 0) {
                                    imageInfo[0] = MyCanvas.lightnessMul(candiImageInfo[0], (lightness + d) / lightness);
                                } else {
                                    imageInfo[0] = MyCanvas.lightnessAdd(candiImageInfo[0], d);
                                }
                                images.push(imageInfo);
                            }
                            d++;
                        }

                        cur.imageIdx = imageInfo[1];
                        //채울 때 주변에 이 사진은 쓰지 말라고 표시함
                        for (let i = -1; i <= 1; i++) {
                            for (let j = -1; j <= 1; j++) {
                                let x = pos[0] + i, y = pos[1] + j;
                                if (mosaicInfo[y] && mosaicInfo[y][x]) {
                                    mosaicInfo[y][x].bannedList.add(cur.imageIdx);
                                }
                            }
                        }
                        originCanvas.context.putImageData(imageInfo[0], pos[0] * MosaicSize, pos[1] * MosaicSize);
                    }
                }
                originCanvas.vars.imgs_lightness = null;
            },
            nOfSameLightnessImgs: 9,
            usingImageSize: 100,
        },
        vars: {
            pos_lightness: new Array(256).fill(null).map(() => []),
            imgs_lightness: new Array(256).fill(null).map(() => []),
            imgInfo: [],
            isFull: new Array(256).fill(false),
            base: 0,
            numOfColPixel: 0,
            numOfRowPixel: 0,
            mosaicInfo: null,
            renderLightnessCnt: 0,
            imgLoadCounter: 0,
        },
        init: () => {
            //w, h 중 큰 것을 NumOfPixel개 로 나눠서 base를 구하고 base x base 크기의 정사각형으로 모자이크를 구성한다. 
            originCanvas.context.strokeStyle = 'rgba(0, 0, 0, 0)';
            let w = bgImgRef.current.width;
            let h = bgImgRef.current.height;
            let base, numOfRowPixel, numOfColPixel;
            if (w >= h) {
                base = w / NumOfPixel;
                numOfRowPixel = parseInt(h / base);
                h = numOfRowPixel * base;
                numOfColPixel = NumOfPixel;
            } else {
                base = h / NumOfPixel;
                numOfColPixel = parseInt(w / base);
                w = numOfColPixel * base;
                numOfRowPixel = NumOfPixel;
            }

            originCanvas.vars.mosaicInfo = new Array(numOfRowPixel);
            for (var i = 0; i < numOfRowPixel; i++) {
                originCanvas.vars.mosaicInfo[i] = new Array(numOfColPixel).fill(null).map(() => new MosaicInfo());
            }
            //배경 이미지 로드 및 관련 정보 초기화
            bgImg.renderedW = w;
            bgImg.renderedH = h;
            bgImg.zeroX = (bgImgRef.current.width - bgImg.renderedW) / 2;
            bgImg.zeroY = (bgImgRef.current.height - bgImg.renderedH) / 2;
            bgImg.renderedPixel = w > h ? w : h;
            //drawImage를 활용 해상도를 기준 크기까지 줄임
            tmpCanvasRef.current.width = numOfColPixel;
            tmpCanvasRef.current.height = numOfRowPixel;
            let tmpctx = tmpCanvasRef.current.getContext('2d');
            tmpctx.drawImage(bgImgRef.current, bgImg.zeroX, bgImg.zeroY, bgImg.renderedW, bgImg.renderedH,
                0, 0, numOfColPixel, numOfRowPixel);

            originCanvas.vars.base = base;
            originCanvas.vars.numOfColPixel = numOfColPixel;
            originCanvas.vars.numOfRowPixel = numOfRowPixel;
            originCanvas.canvas.width = numOfColPixel * MosaicSize;
            originCanvas.canvas.height = numOfRowPixel * MosaicSize;
        },
        render: () => {
            let vars = originCanvas.vars;
            //돌면서 색상 채우고, 색상정보를 저장함
            let tmpctx = tmpCanvasRef.current.getContext('2d');
            let imageData = tmpctx.getImageData(0, 0, vars.numOfColPixel, vars.numOfRowPixel).data;
            for (let i = 0; i < vars.numOfRowPixel; i++) {
                for (let j = 0; j < vars.numOfColPixel; j++) {
                    let y = i * MosaicSize;
                    let x = j * MosaicSize;
                    let curPixel = 4 * (i * vars.numOfColPixel + j);
                    let lightness = parseInt((3 * imageData[curPixel] + 4 * imageData[curPixel + 1] + imageData[curPixel + 2]) >>> 3);
                    //lightness = Math.max(0, lightness - 10);
                    originCanvas.context.fillStyle = 'rgb(' + lightness + "," + lightness + ',' + lightness + ')';
                    originCanvas.context.fillRect(x, y, MosaicSize, MosaicSize);
                    vars.pos_lightness[lightness].push([j, i]);
                }
            }
            //원본 모자이크 myc에 그리기 시작
            myc.canAnimRun = true;
            myc.canRender = true;
            tmpCanvasRef.current.width = MosaicSize * 2;
            tmpCanvasRef.current.height = MosaicSize * 2;
            for (let i = 0; i < 255; i++) {
                vars.pos_lightness[i] = shuffle(vars.pos_lightness[i]);
            }
            const onloadhandler = (e) => {
                ++originCanvas.vars.imgLoadCounter;
                tmpctx.drawImage(e.target, 0, 0, MosaicSize * 2, MosaicSize * 2);
                let imgDatas = [];
                let idx = e.target.idx;
                for (let i = 0; i < 4; i++) {
                    let x = (i % 2 * MosaicSize);
                    let y = Math.floor(i / 2) * MosaicSize;
                    imgDatas.push(tmpctx.getImageData(x, y, MosaicSize, MosaicSize));
                }

                for (let i = 0; i < 4; i++) {
                    //회색으로 바꾸고
                    let imageData = MyCanvas.img2greyScale(imgDatas[i]);
                    let imgidx = idx + i / 10;
                    let lightness = 0;
                    let cnt = imageData.data.length / 4;
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        lightness += imageData.data[i];
                    }
                    //평균밝기를 구하고
                    lightness = parseInt(lightness / cnt);
                    originCanvas.vars.imgs_lightness[lightness].push([imageData, imgidx]);
                    //같은 밝기를 가진 모자이크조각에다 넣음
                    let posArr = originCanvas.vars.pos_lightness[lightness];
                    let curidx = 0;
                    let last = posArr.length - 1;
                    while (curidx <= last) {
                        let pos = posArr[curidx];
                        let mosaicInfo = originCanvas.vars.mosaicInfo;
                        let cur = mosaicInfo[pos[1]][pos[0]];

                        //이미지를 채울 때 주변에 이미 있다면 넘어감   
                        if (cur.bannedList.has(imgidx)) {
                            curidx++;
                            continue;
                        }
                        cur.imageIdx = imgidx;
                        //채울 때 주변에 이 사진은 쓰지 말라고 표시함
                        for (let i = -2; i <= 2; i++) {
                            for (let j = -2; j <= 2; j++) {
                                let x = pos[0] + i, y = pos[1] + j;
                                if (mosaicInfo[y] && mosaicInfo[y][x]) {
                                    mosaicInfo[y][x].bannedList.add(cur.imageIdx);
                                }
                            }
                        }
                        originCanvas.context.putImageData(imageData, pos[0] * MosaicSize, pos[1] * MosaicSize);

                        //채워진 모자이크는 지운다.
                        posArr[curidx] = posArr[last];
                        last--;
                        posArr.pop();
                    }
                }
                if (originCanvas.vars.imgLoadCounter === originCanvas.consts.usingImageSize) {
                    originCanvas.consts.drawRemain()
                }
            };
            const onerrorhandler = () => {
                if (originCanvas.vars.imgLoadCounter === originCanvas.consts.usingImageSize) {
                    originCanvas.consts.drawRemain()
                }
            }
            for (let idx = 0; idx < images.length && idx < originCanvas.consts.usingImageSize; idx++) {
                let tmpimg = new Image();
                tmpimg.crossOrigin = "Anonymous";
                tmpimg.idx = idx;
                //tmpimg.addEventListener("load", onloadhandler, { once: true });
                tmpimg.onload = onloadhandler;
                tmpimg.onerror = onerrorhandler;
                tmpimg.src = images[idx].thumbnailUrl + "&w=100&h=100&c=7";
                images[idx].tmpimg = tmpimg;
            }
            //정보 보여주는 팝업창을 띄우기
        },
    });

    useEffect(() => {
        canvasRef.current.addEventListener('wheel', preventDefault);
        canvasRef.current.addEventListener('touchmove', preventDefault);
        return () => {
            originCanvas.delete();
            myc.delete();
        }
    }, []);

    const onWheelhandler = (e) => {
        let x = e.pageX - canvasRef.current.offsetLeft;
        let y = e.pageY - canvasRef.current.offsetTop;
        if (e.deltaY > 0) {
            myc.consts.zoom(x, y, -0.1);
        } else if (e.deltaY < 0) {
            myc.consts.zoom(x, y, 0.1);
        }
    }

    let isMoved = false;
    let prev = [];
    let downpos = [];
    const onmove = (e) => {
        let x, y;
        if (e.touches) {
            props.hide();
            if (prev.length >= 2) {
                let dx = prev[0].pageX - prev[1].pageX;
                let dy = prev[0].pageY - prev[1].pageY;
                let midx = (prev[0].pageX + prev[1].pageX) / 2 - canvasRef.current.offsetLeft;
                let midy = (prev[0].pageY + prev[1].pageY) / 2 - canvasRef.current.offsetTop;
                let prevDiff = Math.sqrt(dx * dx + dy * dy);
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (prev[0].identifier === e.changedTouches[i].identifier) {
                        prev[0] = e.changedTouches[i];
                    } else {
                        prev[1] = e.changedTouches[i];
                    }
                }
                dx = prev[0].pageX - prev[1].pageX;
                dy = prev[0].pageY - prev[1].pageY;
                let curDiff = Math.sqrt(dx * dx + dy * dy);
                let diff = curDiff - prevDiff;
                if (prevDiff) {
                    myc.consts.zoom(midx, midy, diff / canvasRef.current.clientWidth)
                }
                return;
            } else {
                x = e.touches[0].pageX;
                y = e.touches[0].pageY;
                e.movementX = x - prev[0].pageX
                e.movementY = y - prev[0].pageY;
                prev[0] = e.touches[0];
            }
        } else {
            x = e.pageX - canvasRef.current.offsetLeft;
            y = e.pageY - canvasRef.current.offsetTop;
        }
        myc.consts.emp(x, y);
        myc.consts.move(e.movementX, e.movementY);
    }

    const onClickhandler = (e) => {
        if (isMoved) return;
        let x = e.pageX - canvasRef.current.offsetLeft;
        let y = e.pageY - canvasRef.current.offsetTop;
        myc.consts.click(x, y);
    }
    const ondown = (e) => {
        if (e.touches) {
            if (prev.length > 2) return;

            prev.push(e.touches[0]);
        } else {
            downpos = [e.clientX, e.clientY];
        }
        myc.vars.canMove = true;
    }
    const onup = (e) => {
        if (e.touches) {
            prev = [];
            /*
            for (var i = 0; i < prev.length; i++) {
                if (prev[i].identifier == e.changedTouches[0].identifier) {
                    prev.splice(i, 1);
                    break;
                }
            }     */
        } else {
            let d = e.clientX - downpos[0];
            d += e.clientY - downpos[1];
            isMoved = !!d;
        }
        myc.vars.canMove = false;
    }
    const mouseLeave = (e) => {
        myc.vars.canMove = false;
    }
    const onImageLoaded = (e) => {
        props.setImageLoaded(true);
        myc.canRender = false;
        myc.canAnimRun = false;
        originCanvas.renderPicture(originCanvasRef.current);
        myc.animStart(canvasRef.current);
    }

    return (
        <>

            <img
                className={styles.dispNone}
                ref={bgImgRef}
                onLoad={onImageLoaded}
                alt=""
            ></img>
            <canvas className={styles.width100} ref={canvasRef} width={canvasSize} height={canvasSize}
                onClick={onClickhandler}
                onWheel={onWheelhandler}
                onMouseMove={onmove}
                onMouseDown={ondown}
                onMouseUp={onup}
                onMouseLeave={mouseLeave}
                onTouchStart={ondown}
                onTouchMove={onmove}
                onTouchEnd={onup}
            >
                이 브라우저는 캔버스를 지원하지 않습니다.
            </canvas>
            <canvas className={styles.dispNone} ref={tmpCanvasRef} width="100" height="100">
            </canvas>
            <canvas className={styles.dispNone} ref={originCanvasRef} width="100" height="100">
            </canvas>
        </>

    );
});

export default Mosaic;