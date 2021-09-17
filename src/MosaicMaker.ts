import { expose } from 'comlink'
import { ImageInfo, Coord } from './refs/Types'
import { MOSAIC_SIZE } from './refs/consts'
import { isExportDefaultDeclaration } from '@babel/types';

type MosaicPieceInfo = {
    bannedList: Set<number>,
    imageIdx: number
}
function lightnessMul(imgData, k): ImageData {
    let res: ImageData = new ImageData(imgData.width, imgData.height);
    var pixels: Uint8ClampedArray = new Uint8ClampedArray(imgData.data);
    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] *= k;
        pixels[i + 1] *= k;
        pixels[i + 2] *= k;
    }
    res.data.set(pixels);
    return res;
}
function lightnessAdd(imgData, k): ImageData {
    let res: ImageData = new ImageData(imgData.width, imgData.height);
    var pixels: Uint8ClampedArray = new Uint8ClampedArray(imgData.data);
    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] += k;
        pixels[i + 1] += k;
        pixels[i + 2] += k;
    }
    res.data.set(pixels);
    return res;
}
function selectUsableImg(pieceInfo: MosaicPieceInfo, imagesIdxs: number[]): number {
    //사용가능한 이미지를 랜덤하게 고른다
    let candis = [];
    for (let i: number = 0; i < imagesIdxs.length; i++) {
        if (!pieceInfo.bannedList.has(imagesIdxs[i])) {
            candis.push(i);
        }
    }
    if (candis.length === 0) return null;
    let randomIndex = Math.floor(Math.random() * candis.length);
    return imagesIdxs[candis[randomIndex]];
}

const shuffle = (array) => {
    var currentIndex = array.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
function toGreyScale(pixels: Uint8ClampedArray): Uint8ClampedArray {
    for (let i = 0; i < pixels.length; i += 4) {
        let li = Math.floor((3 * pixels[i] + 4 * pixels[i + 1] + pixels[i + 2]) >>> 3);
        pixels[i] = li;
        pixels[i + 1] = li;
        pixels[i + 2] = li;
    }
    return pixels;
}
function getLightness(pixels: Uint8ClampedArray): number {
    let cnt = 0;
    let lightness = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        lightness += pixels[i];
        cnt++;
    }
    return Math.floor(lightness / cnt);
}
async function getImage(url: string): Promise<ImageBitmap> {
    try {
        const data = await fetch(url);
        const blob = await data.blob();
        return await createImageBitmap(blob);
    } catch (e) {
        return null;
    }
}


async function doIt(data) {
    const canvas: OffscreenCanvas = data.canvas;
    const tmpCanvas: OffscreenCanvas = data.tmpCanvas;
    const imageInfos: ImageInfo[] = data.imageInfos;
    const ctx: OffscreenCanvasRenderingContext2D = canvas.getContext("2d");
    const tmpCtx: OffscreenCanvasRenderingContext2D = tmpCanvas.getContext("2d");
    const numOfColPixel: number = canvas.width / MOSAIC_SIZE;
    const numOfRowPixel: number = canvas.height / MOSAIC_SIZE;

    const img: ImageBitmap = await getImage(imageInfos[0].thumbnailUrl);
    if (!img) {
        return;
    }
    //배경 모자이크화  
    let position_lightness: Coord[][] = new Array<Coord[]>(256).fill(null).map(() => new Array<Coord>());
    tmpCtx.drawImage(img, 0, 0, numOfColPixel, numOfRowPixel);
    const imageData: Uint8ClampedArray = tmpCtx.getImageData(0, 0, numOfColPixel, numOfRowPixel).data;
    for (let i = 0; i < numOfRowPixel; i++) {
        for (let j = 0; j < numOfColPixel; j++) {
            const y: number = i * MOSAIC_SIZE;
            const x: number = j * MOSAIC_SIZE;
            const curPixel: number = 4 * (i * numOfColPixel + j);
            const lightness: number = Math.floor((3 * imageData[curPixel] + 4 * imageData[curPixel + 1] + imageData[curPixel + 2]) >>> 3);
            ctx.fillStyle = 'rgb(' + lightness + "," + lightness + ',' + lightness + ')';
            ctx.fillRect(x, y, MOSAIC_SIZE, MOSAIC_SIZE);
            position_lightness[lightness].push({ r: i, c: j });
        }
    }
    for (let i = 0; i < 255; i++) {
        position_lightness[i] = shuffle(position_lightness[i]);
    }

    //조각 채우기    
    const totalImageNum: number = imageInfos.length;
    let renderedImageNum: number = 0;

    let mosaicPieceInfos: MosaicPieceInfo[][] = new Array<MosaicPieceInfo[]>(numOfRowPixel);
    for (var i = 0; i < numOfRowPixel; i++) {
        mosaicPieceInfos[i] = new Array(numOfColPixel).fill(null).map(() => {
            return {
                bannedList: new Set<number>(),
                imageIdx: -1
            }
        });
    }
    let imageDatas: ImageData[] = new Array<ImageData>(totalImageNum);
    let img_lightness: number[][] = new Array<number[]>(256).fill(null).map(() => new Array<number>());
    function getImageDataIdx(idx: number, order: number): number {
        return idx * 4 + order;
    }
    function setImageData(idx: number, order: number, imageData: ImageData): number {
        imageDatas[idx * 4 + order] = imageData;
        return idx * 4 + order;
    }
    async function renderRemain() {
        for (let lightness = 5; lightness < 245; lightness++) {
            let curPosArray: Coord[] = position_lightness[lightness];

            let usableImages: ImageData[] = [];
            let usableImageIdxs: number[] = [];
            for (let pos of curPosArray) {
                let curPieceInfo: MosaicPieceInfo = mosaicPieceInfos[pos.r][pos.c];

                //usableImages에서 사용할 수 있는 것을 선택
                let imageIdx: number = selectUsableImg(curPieceInfo, usableImageIdxs);
                let usableImage: ImageData;
                if (imageIdx) {
                    usableImage = usableImages[imageIdx];
                } else {
                    let d = 0;
                    while (!imageIdx) {
                        d++;
                        if (lightness + d < 255) {
                            imageIdx = selectUsableImg(curPieceInfo, img_lightness[lightness + d]);
                        }
                        if (!imageIdx && lightness - d > 0) {
                            imageIdx = selectUsableImg(curPieceInfo, img_lightness[lightness - d]);
                        }
                    }
                    usableImage = (d > 0) ? lightnessMul(imageDatas[imageIdx], lightness / (lightness + d)) :
                        lightnessAdd(imageDatas[imageIdx], -d);
                    usableImages.push(usableImage);
                    usableImageIdxs.push(imageIdx);
                }

                ctx.putImageData(usableImage, pos.r * MOSAIC_SIZE, pos.c * MOSAIC_SIZE);
                curPieceInfo.imageIdx = imageIdx;


                //주변에 이 사진은 쓰지 말라고 표시함
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let x = pos[0] + i, y = pos[1] + j;
                        if (mosaicPieceInfos[y] && mosaicPieceInfos[y][x]) {
                            mosaicPieceInfos[y][x].bannedList.add(imageIdx);
                        }
                    }
                }
            }
        }
    }
    async function renderMosaicPiece(url, imgidx) {
        //이미지를 불러와서
        const img: ImageBitmap = await getImage(url + "&w=100&h=100&c=7");
        if (img) {
            tmpCtx.drawImage(img, 0, 0, 2 * MOSAIC_SIZE, 2 * MOSAIC_SIZE);
            //4등분한 각각의 데이터와 평균 밝기값 계산 후 같은 밝기의 조각에 그린다.
            for (let i = 0; i < 4; i++) {
                let x = (i % 2 * MOSAIC_SIZE);
                let y = Math.floor(i / 2) * MOSAIC_SIZE;
                const imgData: ImageData = tmpCtx.getImageData(x, y, MOSAIC_SIZE, MOSAIC_SIZE);
                //흑백처리
                const rgbaArray: Uint8ClampedArray = toGreyScale(imgData.data);
                const li: number = getLightness(rgbaArray);
                imgData.data.set(rgbaArray);
                //저장
                const imgIdx = setImageData(imgidx, i, imgData);
                img_lightness[li].push(imgIdx);

                //같은 밝기 값인 조각에 그리기.
                const coords: Coord[] = position_lightness[li];
                let curPos = 0, last = coords.length - 1;
                while (curPos < last) {
                    let pos: Coord = coords[curPos];
                    let cur = mosaicPieceInfos[pos.r][pos.c];
                    //이미지를 채울 때 주변에 이미 있다면 넘어감
                    if (cur.bannedList.has(imgidx)) continue;
                    cur.imageIdx = imgidx;
                    //채울 때 주변에 이 사진은 쓰지 말라고 표시함
                    for (let a = -1; a <= 1; a++) {
                        for (let b = -1; b <= 1; b++) {
                            let r: number = pos.r + a, c: number = pos.c + b;
                            if (mosaicPieceInfos[r] && mosaicPieceInfos[r][c]) {
                                mosaicPieceInfos[r][c].bannedList.add(imgidx);
                            }
                        }
                    }
                    ctx.putImageData(imgData, pos.r * MOSAIC_SIZE, pos.c * MOSAIC_SIZE);
                    //채워진 모자이크는 지운다.
                    coords[i] = coords[coords.length - 1];
                    i++;
                    last--;
                    coords.pop();
                }
            }
        }
        renderedImageNum++;
        if (renderedImageNum === totalImageNum) {
            //모든이미지 그린 후 남은 것 그림
            renderRemain();
        }
    }
    for (let i = 0; i < totalImageNum; i++) {
        renderMosaicPiece(imageInfos[i].thumbnailUrl, i);
    }
}
const worker = {
    doIt
}
export type MosaicWorker = typeof worker;

expose(worker);