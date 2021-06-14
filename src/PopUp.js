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
    debugger;
    /*{
      popUpSize : popUpSize,
      popUpPos : popUpPos,
      imageId : imageInfo.imageId,
      name: imageInfo.name,
      thumbnail: imageInfo.thumbnail,
      thumbnailUrl: imageInfo.thumbnailUrl,
      webSearchUrl: imageInfo.webSearchUrl,                        
    }*/
    return (
        <>
            {props.imageInfo &&
                <div className={styles.line} style={abs} onMouseLeave={props.hide}>
                    <a
                        href={props.imageInfo.webSearchUrl}
                        target='_blank'
                        rel="noreferrer"
                    >
                        <img
                            className={styles.width100}
                            src={props.imageInfo.thumbnailUrl + `&w=${props.imageInfo.popUpSize}&h=${props.imageInfo.popUpSize}&c=7`}
                            alt={props.imageInfo.name}
                        />
                    </a>


                </div>
            }
        </>
    );
}

export default PopUp;