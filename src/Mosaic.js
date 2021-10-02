import React, { useEffect, useRef } from 'react';
import { MyCanvas } from './refs/MyCanvas';
import MosaicCanvas from './MosaicCanvas.ts'
import styles from './PhotoMosaic.module.scss';


const MosaicSize = 50;
const canvasSize = 800;

const Mosaic = React.memo((props) => {
    let canvasRef = useRef(null);
    let originCanvasRef = useRef(null);
    let originCanvas = useRef(null);
    let tmpCanvasRef = useRef(null);
    let bgImgRef = useRef(null);
    let bgImg = {};
    let images = [];
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
                console.log(originCanvas.current.imgIdxOfMosaic[x][y]);
                return;
                if (0 <= x && x < originCanvas.current.numOfColPixel && 0 <= y && y < originCanvas.current.numOfRowPixel
                    && originCanvas.current.mosaicInfo[y][x].imageIdx !== null) {
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
                if (!originCanvas.current) return;
                let pos = myc.consts.posToIdx(posX, posY);
                if (0 <= pos[0] && pos[0] < originCanvas.current.numOfColPixel
                    && 0 <= pos[1] && pos[1] < originCanvas.current.numOfRowPixel) {
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
            myc.vars.originSize = originCanvas.current.width > originCanvas.current.height ? originCanvas.current.width : originCanvas.current.height;
            myc.vars.ratioW = originCanvas.current.width / myc.vars.originSize;
            myc.vars.ratioH = originCanvas.current.height / myc.vars.originSize;
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
            myc.context.drawImage(...MyCanvas.getSafeRect(originCanvasRef.current,
                -res.pos[0], -res.pos[1], res.viewportSize, res.viewportSize,
                0, 0, canvasSize, canvasSize));
            myc.context.beginPath();
            myc.context.lineTo(res.hoveredPos[0], res.hoveredPos[1]);
            myc.context.lineTo(res.hoveredPos[0] + res.hoverLineSize, res.hoveredPos[1]);
            myc.context.lineTo(res.hoveredPos[0] + res.hoverLineSize, res.hoveredPos[1] + res.hoverLineSize);
            myc.context.lineTo(res.hoveredPos[0], res.hoveredPos[1] + res.hoverLineSize);
            myc.context.closePath();
            myc.context.stroke();
            myc.context.globalAlpha = 0.25;
            myc.context.drawImage(...MyCanvas.getSafeRect(bgImgRef.current,
                -res.picPos[0], -res.picPos[1], res.viewportSizeForPic, res.viewportSizeForPic,
                0, 0, canvasSize, canvasSize));
            myc.context.globalAlpha = 1;
        },
    });

    useEffect(() => {
        canvasRef.current.addEventListener('wheel', preventDefault);
        canvasRef.current.addEventListener('touchmove', preventDefault);
        fetch("https://99-interactions-functions.azurewebsites.net/api/HttpTrigger1?code=gyPykVBnZ5lSl3vwOm3BvEojwZolAbHSuujci28YxApqalzrA2rHfw==", {
            method: 'GET',
        }).then(res => res.json()
        ).then(json => {
            images = json.imgInfos.value;
            originCanvas.current = new MosaicCanvas(json.imgInfos.value, originCanvasRef.current, tmpCanvasRef.current);
            bgImgRef.current.crossOrigin = "Anonymous";
            bgImgRef.current.src = json.imgInfos.value[0].thumbnailUrl + "&c=7&p=0";
        });
        return () => {
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
        bgImg.renderedW = bgImgRef.current.width;
        bgImg.renderedH = bgImgRef.current.height;
        bgImg.zeroX = (bgImgRef.current.width - bgImg.renderedW) / 2;
        bgImg.zeroY = (bgImgRef.current.height - bgImg.renderedH) / 2;
        bgImg.renderedPixel = bgImg.renderedW > bgImg.renderedH ? bgImg.renderedW : bgImg.renderedH;
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