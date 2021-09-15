import { expose } from 'comlink'
async function doSomething(data) {
    const canvas = data.canvas;
    const imageInfos = data.imageInfos;
    const ctx = canvas.getContext("2d");
    const imgblob = await fetch(imageInfos[0].thumbnailUrl)
        .then((r) => r.blob());
    const img = await createImageBitmap(imgblob);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
const worker = {
    doSomething
}
export type MosaicWorker = typeof worker;

expose(worker);