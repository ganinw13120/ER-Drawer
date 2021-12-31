import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Box, BoxState, Point, Position } from '../model/Drawer';
import { v4 as uuidv4 } from 'uuid';
import { useDrawerContext } from '../hooks/useDrawerContext';

type BoxComponentProps = {
    data: Box
    setBoxState: (state: BoxState) => void
}

const BoxComponent: React.FC<BoxComponentProps> = ({ data, setBoxState }) => {
    const [points, setPoints] = useState<Array<Point>>([]);

    const [state, setState] = useState<BoxState>(data.state);

    const { pos: currentPos } = useDrawerContext();

    const [lastPos, setLastPos] = useState<Position>(currentPos);

    useEffect(() => {
        if (state.isDragging) {
            const newPos: Position = {
                x: state.pos.x + (currentPos.x - lastPos.x),
                y: state.pos.y + (currentPos.y - lastPos.y)
            }
            setLastPos(currentPos);
            setState({
                ...state,
                pos: newPos
            });
        }
    }, [currentPos])

    useEffect(() => {
        setBoxState(state);
    }, [state])

    useEffect(() => {
        generatePoints();
    }, []);

    const generatePoints = () => {
        const _points: Array<Point> = [];
        const TitleL = React.createRef<SVGSVGElement>();
        const TitleR = React.createRef<SVGSVGElement>();
        _points.push({
            uuid: uuidv4(),
            isHover: false,
            isShow: false,
            ref: TitleL,
            pos: {
                x: 0,
                y: data.title.ref.current!.clientHeight / 2,
            },
            box : data
        })
        _points.push({
            uuid: uuidv4(),
            isHover: false,
            isShow: false,
            ref: TitleR,
            pos: {
                x: data.title.ref.current!.offsetWidth,
                y: data.title.ref.current!.offsetHeight / 2,
            },
            box : data
        })
        let sum = data.title.ref.current!.offsetHeight;
        data.entities.forEach(en => {
            const L = React.createRef<SVGSVGElement>();
            const R = React.createRef<SVGSVGElement>();
            _points.push({
                uuid: uuidv4(),
                isHover: false,
                isShow: false,
                ref: L,
                pos: {
                    x: 0,
                    y: (en.ref.current!.clientHeight / 2) + sum,
                },
                box : data
            })
            _points.push({
                uuid: uuidv4(),
                isHover: false,
                isShow: false,
                ref: R,
                pos: {
                    x: en.ref.current!.offsetWidth,
                    y: (en.ref.current!.clientHeight / 2) + sum,
                },
                box : data
            })
            sum += en.ref.current!.clientHeight;
        })
        setPoints(_points);
    }

    const generatePointElement = (): ReactElement[] => {
        const _points: ReactElement[] = [];
        points.forEach((e, key) => {
            const _onHoverPoint = () => {
                onHoverPoint(e.uuid);
            }
            const _onUnHoverPoint = () => {
                onUnHoverPoint(e.uuid);
            }
            _points.push(<PointComponent data={e} onHoverPoint={_onHoverPoint} onUnHoverPoint={_onUnHoverPoint} />);
        })
        return _points;
    }

    const onHoverPoint = (key: string) => {
        setPoints(prev => {
            let temp = [...prev];
            temp.find(e => e.uuid === key)!.isHover = true;
            return temp;
        })
    }

    const onUnHoverPoint = (key: string) => {
        setPoints(prev => {
            let temp = [...prev];
            temp.find(e => e.uuid === key)!.isHover = false;
            return temp;
        })
    }

    useEffect(()=>{
        setState({
            ...state,
            pointAiming : points.find(e=>e.isHover)
        })
    }, [points])

    const onHoverDiv = () => {
        setState({
            ...state,
            isHover: true
        })
    }

    const onUnHoverDiv = () => {
        setState({
            ...state,
            isHover: false
        })
    }

    const startDrag = () => {
        setLastPos(currentPos);
        setState({
            ...state,
            isSelect : true,
            isDragging: true
        })

    }

    const stopDrag = () => {
        setLastPos(currentPos);
        setState({
            ...state,
            isDragging: false
        })
    }

    const isAnyHoveringPoint = () : boolean => {
        return !points.every(e=>!e.isHover);
    }

    const handleMouseDown = () => {
        if (isAnyHoveringPoint()) return;
        else startDrag();
    }
    const handleMouseUp = () => {
        if (state.isDragging) {
            stopDrag();
        }
    }

    return (
        <>
            <div className={`box`}
                style={{
                    transform: `translate(${state.pos.x}px, ${state.pos.y}px)`,
                }}
                ref={data.ref}
                onMouseEnter={() => {
                    onHoverDiv();
                }}
                onMouseLeave={() => {
                    onUnHoverDiv();
                }}
                onMouseDown={() => {
                    handleMouseDown();
                }}
                onMouseUp={() => {
                    handleMouseUp();
                }}
            >
                <div className={`box-inner-container ${state.isSelect && !state.isDragging ? 'box-select' : ''} ${state.isDragging ? 'box-dragging' : ''} `}>
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
                {generatePointElement()}
            </div>
        </>
    )
}

export default BoxComponent;


type PointComponentProps = {
    data: Point
    onHoverPoint: () => void
    onUnHoverPoint: () => void
}

const PointComponent: React.FC<PointComponentProps> = ({ data, onHoverPoint, onUnHoverPoint }) => {
    const pointR = 2.5;
    return (<>
        <svg key={data.uuid} ref={data.ref} onMouseEnter={() => { onHoverPoint() }} onMouseLeave={() => { onUnHoverPoint() }} style={{ cursor: 'pointer', position: 'absolute', top: 0, zIndex: 10, width: `${pointR * 8}px`, height: `${pointR * 8}px`, transform: `translate(${data.pos.x - (pointR * 4)}px, ${data.pos.y + (pointR)}px)` }}>
            {data.isHover && <circle cx={pointR * 4} cy={pointR * 4} r={pointR * 2} fill="#d99a9a" />}
        </svg>
    </>)
}