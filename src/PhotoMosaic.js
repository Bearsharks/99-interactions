import React, { useEffect, useRef } from 'react';
import styles from './PhotoMosaic.module.scss';
import MosaicCanvas from './MosaicCanvas.ts'
import { canvasSize } from './refs/consts'
function PhotoMosaic(props) {
    let canvasRef = useRef(null);
    let mycRef = useRef(null);
    let mosaicCanvas = useRef(null);
    let context = null;
    const render = () => {
        if (context) {
            context.drawImage(canvasRef.current,
                0, 0, props.width, props.height
            );
            requestAnimationFrame(render);
        }
    }
    useEffect(() => {
        mosaicCanvas.current = new MosaicCanvas(props.imageInfos, canvasRef.current);
        context = mycRef.current.getContext("2d");
        requestAnimationFrame(render);
        return () => {
            context = null;
        }
    }, [props.imageInfos, canvasRef, mosaicCanvas, mycRef]);

    return (
        <>
            <canvas className={styles.dispNone} ref={canvasRef} width={props.width} height={props.height}>
            </canvas>
            <canvas ref={mycRef} width={props.width} height={props.height}>
            </canvas>
        </>
    );
};
export default React.memo(PhotoMosaic);