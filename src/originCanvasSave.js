
let originCanvas = {
    consts: {
        selectUsableImg: (cur, images) => {
            //사용가능한 이미지를 랜덤하게 고른다
            let candis = [];
            for (let i in images) {
                let imgidx = images[i][1];
                if (!cur.bannedList.has(imgidx)) {
                    candis.push(i);
                }
            }
            if (candis.length === 0) return null;
            let randomIndex = Math.floor(Math.random() * candis.length);
            return images[candis[randomIndex]];
        },
        drawRemain: () => {
            for (let lightness = 5; lightness < 245; lightness++) {
                let curPosArray = originCanvas.vars.pos_lightness[lightness];
                let imgs_lightness = originCanvas.vars.imgs_lightness;
                let images = [];
                for (let pos of curPosArray) {
                    let mosaicInfo = originCanvas.vars.mosaicInfo;
                    let cur = mosaicInfo[pos[1]][pos[0]];
                    let d = 1;
                    //images에 있는 것 중 사용 할 수 있는 것이 있다면 선택
                    let imageInfo = originCanvas.consts.selectUsableImg(cur, images);
                    //없으면 사용가능하며, 가장 밝기가 비슷한 이미지를 찾고 같은 밝기로 만들기
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
                            if (d > 0) {
                                imageInfo[0] = lightnessMul(candiImageInfo[0], lightness / (lightness + d));
                            } else {
                                imageInfo[0] = lightnessAdd(candiImageInfo[0], -d);
                            }
                            images.push(imageInfo);
                        }
                        d++;
                    }

                    cur.imageIdx = imageInfo[1];
                    originCanvas.context.putImageData(imageInfo[0], pos[0] * MOSAIC_SIZE, pos[1] * MOSAIC_SIZE);

                    //주변에 이 사진은 쓰지 말라고 표시함
                    for (let i = -2; i <= 2; i++) {
                        for (let j = -2; j <= 2; j++) {
                            let x = pos[0] + i, y = pos[1] + j;
                            if (mosaicInfo[y] && mosaicInfo[y][x]) {
                                mosaicInfo[y][x].bannedList.add(cur.imageIdx);
                            }
                        }
                    }
                }
            }
        },
        usingImageSize: 100,
    },
    vars: {
        pos_lightness: new Array(256).fill(null).map(() => []),
        imgs_lightness: new Array(256).fill(null).map(() => []),
        base: 0,
        numOfColPixel: 0,
        numOfRowPixel: 0,
        mosaicInfo: null,
        imgLoadCounter: 0,
    },
    init: () => {
        //w, h 중 큰 것을 NumOfPixel개 로 나눠서 base를 구하고 base x base 크기의 정사각형으로 모자이크를 구성한다. 
        originCanvas.context.strokeStyle = 'rgba(0, 0, 0, 0)';
        let w = bgImgRef.current.width;
        let h = bgImgRef.current.height;
        let base, numOfRowPixel, numOfColPixel;
        if (w >= h) {
            base = w / NUM_OF_PIXELS;
            numOfRowPixel = parseInt(h / base);
            h = numOfRowPixel * base;
            numOfColPixel = NUM_OF_PIXELS;
        } else {
            base = h / NUM_OF_PIXELS;
            numOfColPixel = parseInt(w / base);
            w = numOfColPixel * base;
            numOfRowPixel = NUM_OF_PIXELS;
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
        originCanvas.canvas.width = numOfColPixel * MOSAIC_SIZE;
        originCanvas.canvas.height = numOfRowPixel * MOSAIC_SIZE;
    },
    render: () => {
        let vars = originCanvas.vars;
        //돌면서 색상 채우고, 색상정보를 저장함
        let tmpctx = tmpCanvasRef.current.getContext('2d');
        let imageData = tmpctx.getImageData(0, 0, vars.numOfColPixel, vars.numOfRowPixel).data;
        for (let i = 0; i < vars.numOfRowPixel; i++) {
            for (let j = 0; j < vars.numOfColPixel; j++) {
                let y = i * MOSAIC_SIZE;
                let x = j * MOSAIC_SIZE;
                let curPixel = 4 * (i * vars.numOfColPixel + j);
                let lightness = parseInt((3 * imageData[curPixel] + 4 * imageData[curPixel + 1] + imageData[curPixel + 2]) >>> 3);
                //lightness = Math.max(0, lightness - 10);
                originCanvas.context.fillStyle = 'rgb(' + lightness + "," + lightness + ',' + lightness + ')';
                originCanvas.context.fillRect(x, y, MOSAIC_SIZE, MOSAIC_SIZE);
                vars.pos_lightness[lightness].push([j, i]);
            }
        }
        //원본 모자이크 myc에 그리기 시작
        myc.canAnimRun = true;
        myc.canRender = true;
        tmpCanvasRef.current.width = MOSAIC_SIZE * 2;
        tmpCanvasRef.current.height = MOSAIC_SIZE * 2;
        for (let i = 0; i < 255; i++) {
            vars.pos_lightness[i] = shuffle(vars.pos_lightness[i]);
        }
        const onloadhandler = (e) => {
            tmpctx.drawImage(e.target, 0, 0, MOSAIC_SIZE * 2, MOSAIC_SIZE * 2);
            let imgDatas = [];
            let idx = e.target.idx;
            for (let i = 0; i < 4; i++) {
                let x = (i % 2 * MOSAIC_SIZE);
                let y = Math.floor(i / 2) * MOSAIC_SIZE;
                imgDatas.push(tmpctx.getImageData(x, y, MOSAIC_SIZE, MOSAIC_SIZE));
            }

            const greyScaleMaker = new Worker(GreyScaleMaker);
            greyScaleMaker.onmessage = (e) => {
                let lightness = e.data.lightness;
                let imgidx = e.data.imgidx;
                let imageData = e.data.imageData;
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
                    originCanvas.context.putImageData(imageData, pos[0] * MOSAIC_SIZE, pos[1] * MOSAIC_SIZE);

                    //채워진 모자이크는 지운다.
                    posArr[curidx] = posArr[last];
                    curidx++;
                    last--;
                    posArr.pop();
                }
                ++originCanvas.vars.imgLoadCounter;
                if (originCanvas.vars.imgLoadCounter >= originCanvas.consts.usingImageSize * 4) {
                    originCanvas.consts.drawRemain();
                }
            }
            for (let i = 0; i < 4; i++) {
                greyScaleMaker.postMessage({ imagedata: imgDatas[i], imgidx: idx + i / 10 });
            }
        };
        const onerrorhandler = () => {
            originCanvas.vars.imgLoadCounter += 4;
            if (originCanvas.vars.imgLoadCounter >= originCanvas.consts.usingImageSize * 4) {
                originCanvas.consts.drawRemain();
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
}