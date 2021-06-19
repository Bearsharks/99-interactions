const workercode = () => {
    onmessage = function (e) {
        let imgData = e.data.imagedata;
        let pixels = new Uint8ClampedArray(imgData.data);
        let lightness = 0;
        let cnt = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            let li = parseInt((3 * pixels[i] + 4 * pixels[i + 1] + pixels[i + 2]) >>> 3);
            pixels[i] = li;
            pixels[i + 1] = li;
            pixels[i + 2] = li;
            lightness += li;
            cnt++;
        }
        imgData.data.set(pixels);

        postMessage({
            lightness: Math.round(lightness / cnt),
            imgidx: e.data.imgidx,
            imageData: imgData
        });
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;