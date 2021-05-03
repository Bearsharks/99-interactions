const workercode = () => {
    onmessage = function(e) {
        let imgData = e.data;
        let pixels = imgData.data;
        let lightness = 0;
        for (var i = 0; i < pixels.length; i += 4) {
            lightness += parseInt((3*pixels[i] + 4*pixels[i + 1] + pixels[i + 2]) >>> 3);
        }
        let cnt = imgData.data.length/4;
        lightness = parseInt(lightness / cnt);
        postMessage([lightness, imgData]);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;