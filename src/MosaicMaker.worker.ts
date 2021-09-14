
window.addEventListener('message', async (e) => {
    const canvas = e.data.canvas;
    const imageInfos = e.data.imageInfos;
    const ctx = canvas.getContext("2d");
    const imgblob = await fetch(imageInfos[0].thumbnailUrl)
        .then((r) => r.blob());
    const img = await createImageBitmap(imgblob);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
});