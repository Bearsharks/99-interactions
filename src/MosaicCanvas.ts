import { MOSAIC_SIZE, NUM_OF_PIXELS } from './refs/consts'
import { Coord, ImageInfo } from './refs/Types';
import { wrap, transfer, proxy } from 'comlink'


export default class MosaicCanvas {
    width: number;
    height: number;
    base: number;
    numOfColPixel: number;
    numOfRowPixel: number;
    ctx: OffscreenCanvasRenderingContext2D;
    imgIdxOfMosaic: Array<Array<number>>;
    constructor(imageInfos: ImageInfo[], canvas: HTMLCanvasElement, tmpCanvas: HTMLCanvasElement) {

        //w, h 중 큰 것을 NumOfPixel개 로 나눠서 base를 구하고 base x base 크기의 정사각형으로 모자이크를 구성한다. 
        let w: number = imageInfos[0].width;
        let h: number = imageInfos[0].height;
        if (w >= h) {
            this.base = w / NUM_OF_PIXELS;
            this.numOfRowPixel = Math.floor(h / this.base);
            h = this.numOfRowPixel * this.base;
            this.numOfColPixel = NUM_OF_PIXELS;
        } else {
            this.base = h / NUM_OF_PIXELS;
            this.numOfColPixel = Math.floor(w / this.base);
            w = this.numOfColPixel * this.base;
            this.numOfRowPixel = NUM_OF_PIXELS;
        }
        this.imgIdxOfMosaic = new Array<Array<number>>(this.numOfRowPixel).fill(null).map(() => new Array<number>(this.numOfColPixel).fill(-1));
        this.width = this.numOfColPixel * MOSAIC_SIZE;
        this.height = this.numOfRowPixel * MOSAIC_SIZE;
        canvas.width = this.width;
        canvas.height = this.height;

        tmpCanvas.width = Math.max(this.numOfColPixel, MOSAIC_SIZE * 2);
        tmpCanvas.height = Math.max(this.numOfRowPixel, MOSAIC_SIZE * 2);

        const offscreen: OffscreenCanvas = canvas.transferControlToOffscreen();
        const tmpOffScreen: OffscreenCanvas = tmpCanvas.transferControlToOffscreen();
        const worker = new Worker('./MosaicMaker', { name: "MosaicMaker", type: 'module' });
        const { doIt } = wrap<import('./MosaicMaker').MosaicWorker>(worker);

        const data = { canvas: offscreen, tmpCanvas: tmpOffScreen, imageInfos: imageInfos };
        function test(poss: Array<Coord>, idx: Array<number>) {
            for (let i = 0; i < poss.length; i++) {
                this.imgIdxOfMosaic[poss[i].r][poss[i].c] = idx[i];
            }
        }
        doIt(transfer(data, [data.canvas as any, data.tmpCanvas as any]), proxy(test.bind(this)));
    }
}