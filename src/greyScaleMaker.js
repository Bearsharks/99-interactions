const workercode = () => {
    onmessage = function(e) {
        let isFull = e.data.isFull;
        let lightness = e.data.lightness;
        let imgData = e.data.imgData;
        let imgidx = e.data.imgidx;
        let nOfSameLightnessImgs = e.data.nOfSameLightnessImgs;
        let pixels = new Uint8ClampedArray(imgData.data);
        for (let i = 0; i < pixels.length; i += 4) {
            let li = parseInt((3*pixels[i] + 4*pixels[i + 1] + pixels[i + 2]) >>> 3);
            pixels[i] = li;
            pixels[i + 1] = li;
            pixels[i + 2] = li;
        }
        let res = [];
        for(let d = -20; d <= 10 ;d++){
            if(lightness + d >= 5 && lightness + d <= 245 
                && isFull[lightness + d] <= nOfSameLightnessImgs) {
                let copy = new ImageData(imgData.width,imgData.height);
                let dataCopy = new Uint8ClampedArray(pixels);
                if(d < 0){
                    let k = (lightness + d) / lightness;
                    for (let i = 0; i < dataCopy.length; i += 4) {
                        dataCopy[i] *= k;
                        dataCopy[i + 1] *= k;
                        dataCopy[i + 2] *= k;
                    }
                }else if (d > 0){
                    for (let i = 0; i < dataCopy.length; i += 4) {
                        dataCopy[i] += d;
                        dataCopy[i + 1] += d;
                        dataCopy[i + 2] += d;
                    }
                }
                copy.data.set(dataCopy);
                res.push([lightness+d,copy,imgidx]);
            }
        }
        postMessage(res);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;