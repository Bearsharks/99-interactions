import { MOSAIC_SIZE, NUM_OF_PIXELS } from './refs/consts'
import { ImageInfo } from './refs/Types';
import { wrap, transfer, proxy } from 'comlink'
import { MosaicWorker } from './MosaicMaker2';
export default class MosaicCanvas {
    width: number;
    height: number;
    base: number;
    numOfColPixel: number;
    numOfRowPixel: number;
    ctx: OffscreenCanvasRenderingContext2D;
    constructor(imageInfos: ImageInfo[], canvas: HTMLCanvasElement) {
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
        canvas.width = this.numOfColPixel * MOSAIC_SIZE;
        canvas.height = this.numOfRowPixel * MOSAIC_SIZE;
        const offscreen: OffscreenCanvas = canvas.transferControlToOffscreen();
        const worker = new Worker('./MosaicMaker2', { name: "mosaworker", type: 'module' });
        const { doSomething } = wrap<import('./MosaicMaker2').MosaicWorker>(worker);
        const data = { canvas: offscreen, imageInfos: imageInfos };
        doSomething(transfer(data, [data.canvas as any]));
    }
}
