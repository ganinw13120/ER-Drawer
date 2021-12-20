import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Box } from '../model/Drawer';

type BoxComponentProps = {
    data : Box
    onHoverDiv : () => void
    onUnHoverDiv : () => void
}

const BoxComponent: React.FC<BoxComponentProps> = ({data, onHoverDiv, onUnHoverDiv}) => {
    return (
        <>
            <div className={`box`}
                style={{
                    transform: `translate(${data.pos.x}px, ${data.pos.y}px)`,
                }}
                ref={data.ref}
                onMouseEnter={() => {
                    onHoverDiv();
                }}
                onMouseLeave={() => {
                    onUnHoverDiv();
                }}
            >
                <div className={`box-inner-container ${data.isSelect && !data.isDragging ? 'box-select' : ''} ${data.isDragging ? 'box-dragging' : ''} `}>
                    <div className='box-header' ref={data.title.ref}>
                        {data.title.text}
                    </div>
                    {(() => {
                        const details: Array<ReactElement> = [];
                        data.entities.forEach((entity, key) => {
                            details.push(<React.Fragment key={key}>
                                <div className='box-detail' ref={entity.ref}>
                                    {entity.text}
                                </div>
                            </React.Fragment>)
                        })
                        return details;
                    })()}
                </div>
                {/* {generatePointElement(e.uuid)} */}
            </div>
        </>
    )
}

export default BoxComponent;