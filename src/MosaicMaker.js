const workercode = () => {
    onmessage = async function (e) {
        const canvas = e.data.canvas;
        const imageInfos = e.data.imageInfos;
        const ctx = canvas.getContext("2d");
        const imgblob = await fetch(imageInfos[0].thumbnailUrl)
            .then((r) => r.blob());
        const img = await this.createImageBitmap(imgblob);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

export default worker_script;