import React, { ReactElement, useEffect, useReducer, useState } from 'react';
import { Box, BoxState, Point, PointPosition, Position } from '../model/Drawer';
import { v4 as uuidv4 } from 'uuid';
import { useDrawerContext } from '../hooks/useDrawerContext';
import { useDrawerStore } from '../stores/DrawerStore';

const pointHitbox: number = 30;

type BoxComponentProps = {
    data: Box
    setBoxState: (state: BoxState) => void
}

const BoxComponent: React.FC<BoxComponentProps> = ({ data, setBoxState }) => {

    const drawerStore = useDrawerStore();

    const {currentMousePosition : currentPos} = drawerStore.store;

    console.log(drawerStore.store)

    const [points, setPoints] = useState<Array<Point>>([]);

    const [state, setState] = useState<BoxState>(data.state);

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

    useEffect(() => {
        setPoints([]);
        generatePoints();
    }, [data])

    const generatePoints = () => {
        const _points: Array<Point> = [];
        const TitleL = React.createRef<SVGSVGElement>();
        const TitleR = React.createRef<SVGSVGElement>();
        _points.push({
            uuid: uuidv4(),
            isHover: false,
            ref: TitleL,
            box: data,
            position: PointPosition.Left,
            parentRef: data.title.ref
        })
        _points.push({
            uuid: uuidv4(),
            isHover: false,
            ref: TitleR,
            position: PointPosition.Right,
            parentRef: data.title.ref,
            box: data
        })
        data.entities.forEach(en => {
            const L = React.createRef<SVGSVGElement>();
            const R = React.createRef<SVGSVGElement>();
            _points.push({
                uuid: uuidv4(),
                isHover: false,
                ref: L,
                position: PointPosition.Left,
                parentRef: en.ref,
                box: data
            })
            _points.push({
                uuid: uuidv4(),
                isHover: false,
                ref: R,
                position: PointPosition.Right,
                parentRef: en.ref,
                box: data
            })
        })
        setPoints(_points);
    }

    const generatePointElement = (): ReactElement[] => {
        const _points: ReactElement[] = [];
        let sum = 10;
        let borderNoise = 0;
        let borderNoiseAddup = .65;
        points.forEach((e, key) => {
            const _onHoverPoint = () => {
                onHoverPoint(e.uuid);
            }
            const _onUnHoverPoint = () => {
                onUnHoverPoint(e.uuid);
            }
            const pos: Position = e.position === PointPosition.Left ? {
                x: 0,
                y: sum + borderNoise,
            } : {
                x: e.parentRef.current!.offsetWidth + borderNoiseAddup,
                y: sum + borderNoise,
            }
            if (e.position === PointPosition.Right) sum += e.parentRef.current!.clientHeight;
            borderNoise += borderNoiseAddup;
            _points.push(<PointComponent pos={pos} data={e} onHoverPoint={_onHoverPoint} onUnHoverPoint={_onUnHoverPoint} />);
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

    useEffect(() => {
        setState({
            ...state,
            pointAiming: points.find(e => e.isHover)
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
            isSelect: true,
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

    const isAnyHoveringPoint = (): boolean => {
        return !points.every(e => !e.isHover);
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
                                <div className={`${key % 2 === 0 ? 'row-even' : 'row-odd'} box-detail`} ref={entity.ref}>
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
    pos: Position
}

const PointComponent: React.FC<PointComponentProps> = ({ data, onHoverPoint, onUnHoverPoint, pos }) => {
    const pointR = 2.5;
    const pointTranslateX = (pointHitbox / 2) - (pointR * 1);
    return (<>
        <svg key={data.uuid} ref={data.ref} onMouseEnter={() => { onHoverPoint() }} onMouseLeave={() => { onUnHoverPoint() }} style={{ padding: `${pointR * 3}px`,cursor: 'pointer', position: 'absolute', top: 0, zIndex: 10, width: `${pointHitbox}px`, height: `${pointHitbox}px`, transform: `translate(${pos.x - (pointHitbox / 2)}px, ${pos.y}px)` }}>
            {data.isHover && <circle cx={pointR * 4} cy={pointR * 4} r={pointR * 2} fill="#d99a9a" />}
        </svg>
    </>)
}