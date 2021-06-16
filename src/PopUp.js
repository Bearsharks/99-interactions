import React, { useEffect, useRef } from 'react';
import styles from './PopUp.module.css';
function PopUp(props) {
    let abs;
    if (props.imageInfo !== null) {
        abs = {
            position: 'absolute',
            left: `${props.imageInfo.popUpPos[0]}px`,
            top: `${props.imageInfo.popUpPos[1]}px`,
            width: `${props.imageInfo.popUpSize}px`,
            height: `${props.imageInfo.popUpSize}px`,
        };
    }

    return (
        <>
            {props.imageInfo &&
                <div className={styles.popUpContainer} style={abs} onMouseLeave={props.hide}>
                    <a
                        href={props.imageInfo.webSearchUrl}
                        target='_blank'
                        rel="noreferrer"
                        title={props.imageInfo.name}
                    >
                        <div className={styles.popUpContainer}>{props.imageInfo.name}</div>
                        <img
                            className={styles.thumbnailImg}
                            src={props.imageInfo.thumbnailUrl + `&w=${props.imageInfo.popUpSize}&h=${props.imageInfo.popUpSize - 50}&c=7&p=0`}
                            alt={props.imageInfo.name}
                        />
                    </a>


                </div>
            }
        </>
    );
}

export default PopUp;