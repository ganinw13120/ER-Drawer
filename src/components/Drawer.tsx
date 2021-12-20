import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Utils    

const parseClientRectsToPosition = (val: DOMRect): Position => {
    return {
        x: val.x + 10,
        y: val.y + 10
    }
}

//


type DrawerProps = {
}

type Position = {
    x: number
    y: number
}

type Line = {
    startRef?: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement>
    startPosition?: Position
    stopRef?: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement>
    stopPosition?: Position
    isFocus: boolean
}

type Box = {
    uuid: string
    ref: React.RefObject<HTMLDivElement>
    title: BoxTitle
    entities: Array<BoxEntity>
    isSelect: boolean
    isHover: boolean
    isDragging: boolean
    pos: Position
}

type BoxTitle = {
    text: string
    ref: React.RefObject<HTMLDivElement>
}

type BoxEntity = {
    text: string
    ref: React.RefObject<HTMLDivElement>
}

enum FocusType {
    None,
    Div,
    Svg,
    Point
}

type Point = {
    uuid: string
    boxId: string
    ref: React.RefObject<SVGSVGElement>
    pos: Position
    isHover: boolean
    isShow: boolean
}

const Drawer: React.FC<DrawerProps> = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [isMouseClick, setMouseClick] = useState<boolean>(false);

    const [lines, setLines] = useState<Array<Line>>([]);

    const [points, setPoints] = useState<Array<Point>>([]);

    const [boxes, setBoxes] = useState<Array<Box>>([]);

    const [focusType, setFocusType] = useState<FocusType>(FocusType.None);

    const [dragingBox, setDragingBox] = useState<Box | null>(null);

    const [pivotPosition, setPivotPosition] = useState<Position | null>(null);

    useEffect(() => {
        const ref = React.createRef<HTMLDivElement>();
        const refTitle = React.createRef<HTMLDivElement>();
        const refEntity1 = React.createRef<HTMLDivElement>();

        const ref_2 = React.createRef<HTMLDivElement>();
        const refTitle_2 = React.createRef<HTMLDivElement>();
        const refEntity1_2 = React.createRef<HTMLDivElement>();
        const testBoxes: Array<Box> = [
            {
                ref: ref,
                uuid: uuidv4(),
                title: {
                    text: 'asd',
                    ref: refTitle
                },
                entities: [
                    {
                        text: 'test1',
                        ref: refEntity1,
                    },
                ],
                isHover: false,
                isDragging: false,
                isSelect: false,
                pos: {
                    x: 0,
                    y: 0
                }
            },
            {
                ref: ref_2,
                uuid: uuidv4(),
                title: {
                    text: 'asd',
                    ref: refTitle_2
                },
                entities: [
                    {
                        text: 'test1',
                        ref: refEntity1_2,
                    },
                ],
                isHover: false,
                isDragging: false,
                isSelect: false,
                pos: {
                    x: 0,
                    y: 0
                }
            },
        ];
        setLines([]);
        setPoints([]);
        setBoxes(testBoxes);
    }, []);

    const clearSelection = () => {
        setBoxes(prev => {
            return prev.map(e => {
                e.isSelect = false;
                return e;
            })
        })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMouseClick) return;
        let current: Position = {
            x: e.pageX,
            y: e.pageY
        }
        let currentRef: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement> | null = null;
        if (points.find(e => e.isHover)) {
            currentRef = points.find(e => e.isHover)!.ref
            current = parseClientRectsToPosition(currentRef.current!.getClientRects()[0]);
        }

        if (focusType === FocusType.Div) {
            if (!dragingBox || !pivotPosition) {
                return console.log('Error!');
            }
            const newPos: Position = {
                x: dragingBox.pos.x + (current.x - pivotPosition.x),
                y: dragingBox.pos.y + (current.y - pivotPosition.y)
            }
            setPivotPosition(current);
            setBoxes(prev => {
                const temp = [...prev];
                temp.find(e => e.uuid === dragingBox.uuid)!.pos = newPos;
                return temp;
            })
        }
        else if (focusType === FocusType.Point) {
            setLines(prev => {
                const temp = [...prev];
                if (!temp.find(e => e.isFocus)) return temp;
                if (currentRef) {
                    temp.find(e => e.isFocus)!.stopPosition = undefined;
                    temp.find(e => e.isFocus)!.stopRef = currentRef;
                }
                else {
                    temp.find(e => e.isFocus)!.stopPosition = current;
                    temp.find(e => e.isFocus)!.stopRef = undefined;
                }
                return temp;
            })
        }
        else if (focusType === FocusType.Svg) {
            setLines(prev => {
                const temp = [...prev];
                if (!temp.find(e => e.isFocus)) return temp;
                if (currentRef) {
                    temp.find(e => e.isFocus)!.stopPosition = undefined;
                    temp.find(e => e.isFocus)!.stopRef = currentRef;
                }
                else {
                    temp.find(e => e.isFocus)!.stopPosition = current;
                    temp.find(e => e.isFocus)!.stopRef = undefined;
                }
                return temp;
            })
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        clearSelection();
        const current: Position = {
            x: e.pageX,
            y: e.pageY
        }
        if (points.find(e => e.isHover)) {
            setFocusType(FocusType.Point);
            setLines(prev => {
                const temp = [...prev];
                const line: Line = {
                    startRef: points.find(e => e.isHover)!.ref,
                    stopPosition: current,
                    isFocus: true
                }
                temp.push(line)
                return temp;
            })
        } else if (boxes.find(e => e.isHover)) {
            setFocusType(FocusType.Div);
            setDragingBox(boxes.find(e => e.isHover)!);
            setPivotPosition(current);

            setBoxes(prev => {
                let temp = [...prev];
                temp.find(e => e.isHover)!.isDragging = true;
                temp.find(e => e.isHover)!.isSelect = true;
                return temp;
            })
        }
        else {
            setFocusType(FocusType.Svg);
            setLines(prev => {
                const temp = [...prev];
                const line: Line = {
                    startPosition: current,
                    stopPosition: current,
                    isFocus: true
                }
                temp.push(line)
                return temp;
            })
        }
        setMouseClick(true);
    }
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        setLines(prev => {
            const temp = [...prev];
            if (!temp.find(e => e.isFocus)) return temp
            temp.find(e => e.isFocus)!.isFocus = false
            return temp;
        })
        if (boxes.find(e => e.isDragging === true)) {
            setBoxes(prev => {
                let temp = [...prev];
                if (!boxes.find(e => e.isDragging)) return temp;
                temp.find(e => e.isDragging)!.isDragging = false;
                return temp;
            })
        }
        setMouseClick(false);
    }

    const generateLineElement = (): ReactElement[] => {
        let list: ReactElement[] = [];

        lines.forEach(e => {
            const startPos = e.startRef?.current ? parseClientRectsToPosition(e.startRef.current!.getClientRects()[0]) : e.startPosition!
            const stopPos = e.stopRef?.current ? parseClientRectsToPosition(e.stopRef.current!.getClientRects()[0]) : e.stopPosition!

            const middlePositionStart: Position = {
                x: (startPos.x + stopPos.x) / 2,
                y: startPos.y,
            }
            const middlePositionStop: Position = {
                x: (startPos.x + stopPos.x) / 2,
                y: stopPos.y,
            }
            list.push(generateSvgLine(`M ${startPos.x} ${startPos.y}, ${middlePositionStart.x} ${startPos.y},${middlePositionStop.x}, ${middlePositionStop.y}  , ${stopPos.x} ${stopPos.y}`))
        })
        return list;
    }

    const generateSvgLine = (path: string): ReactElement => {
        return <path d={path} stroke="black" fill="transparent" strokeWidth="2" />
    }

    const generatePointElement = (key: string): ReactElement[] => {
        const _points: ReactElement[] = [];
        points.filter(e => e.boxId === key).forEach((e, key) => {
            _points.push(generatePoint(e, key));
        })
        return _points;
    }

    const generatePoint = (pos: Point, key: number): ReactElement => {
        const pointR = 2.5;
        return <React.Fragment key={pos.uuid}>
            <svg ref={pos.ref} onMouseEnter={() => { onHoverPoint(pos.uuid) }} onMouseLeave={() => { onUnHoverPoint(pos.uuid) }} key={pos.uuid} style={{ cursor: 'pointer', position: 'absolute', top: 0, zIndex: 10, width: `${pointR * 8}px`, height: `${pointR * 8}px`, transform: `translate(${pos.pos.x - (pointR * 4)}px, ${pos.pos.y + (pointR)}px)` }}>
                {pos.isHover && <circle cx={pointR * 4} cy={pointR * 4} r={pointR * 2} fill="#d99a9a" />}
            </svg>
        </React.Fragment>
    }

    const onClear = () => {
        setLines([]);
    }

    const onHoverDiv = (key: number) => {
        setBoxes(prev => {
            const temp = [...prev];
            temp[key].isHover = true;
            return temp;
        })
    }

    const onUnHoverDiv = (key: number) => {
        setBoxes(prev => {
            const temp = [...prev];
            temp[key].isHover = false;
            return temp;
        })
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
        setPoints(prev => {
            const temp = [...prev].map(e=>{
                e.isShow = boxes.find(_e => _e.uuid === e.boxId)!.isHover; 
                return e;
            });
            return temp;
        })
    }, [boxes])

    useEffect(() => {
        const _points: Array<Point> = [];
        boxes.forEach(e => {
            const TitleL = React.createRef<SVGSVGElement>();
            const TitleR = React.createRef<SVGSVGElement>();
            _points.push({
                uuid: uuidv4(),
                isHover: false,
                isShow: false,
                ref: TitleL,
                boxId: e.uuid,
                pos: {
                    x: 0,
                    y: e.title.ref.current!.clientHeight / 2,
                }
            })
            _points.push({
                uuid: uuidv4(),
                isHover: false,
                isShow: false,
                ref: TitleR,
                boxId: e.uuid,
                pos: {
                    x: e.title.ref.current!.offsetWidth,
                    y: e.title.ref.current!.offsetHeight / 2,
                }
            })
            let sum = e.title.ref.current!.offsetHeight;
            e.entities.forEach(en => {
                const L = React.createRef<SVGSVGElement>();
                const R = React.createRef<SVGSVGElement>();
                _points.push({
                    uuid: uuidv4(),
                    isHover: false,
                    isShow: false,
                    ref: L,
                    boxId: e.uuid,
                    pos: {
                        x: 0,
                        y: (en.ref.current!.clientHeight / 2) + sum,
                    }
                })
                _points.push({
                    uuid: uuidv4(),
                    isHover: false,
                    isShow: false,
                    ref: R,
                    boxId: e.uuid,
                    pos: {
                        x: en.ref.current!.offsetWidth,
                        y: (en.ref.current!.clientHeight / 2) + sum,
                    }
                })
                sum += en.ref.current!.clientHeight;
            })
        })
        setPoints(_points);
    }, [boxes.length]);


    return (
        <>
            <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button>
            <div ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className={`container`}>
                {(() => {
                    let _boxes: Array<ReactElement> = [];
                    boxes.forEach((e, key) => {
                        _boxes.push(<React.Fragment key={key}>
                            <div className={`box`}
                                style={{
                                    transform: `translate(${boxes[key].pos.x}px, ${boxes[key].pos.y}px)`,
                                }}
                                ref={boxes[key].ref}
                                onMouseEnter={() => {
                                    onHoverDiv(key);
                                }}
                                onMouseLeave={() => {
                                    onUnHoverDiv(key);
                                }}
                            >
                                <div className={`box-inner-container ${e.isSelect && !e.isDragging ? 'box-select' : ''} ${e.isDragging ? 'box-dragging' : ''} `}>
                                    <div className='box-header' ref={e.title.ref}>
                                        {e.title.text}
                                    </div>
                                    {(() => {
                                        const details: Array<ReactElement> = [];
                                        e.entities.forEach((entity, key) => {
                                            details.push(<React.Fragment key={key}>
                                                <div className='box-detail' ref={entity.ref}>
                                                    {entity.text}
                                                </div>
                                            </React.Fragment>)
                                        })
                                        return details;
                                    })()}
                                </div>
                                {generatePointElement(e.uuid)}
                            </div>
                        </React.Fragment>)
                    })
                    return _boxes;
                })()}
                <svg style={{ width: '100%', height: '100%', top: 0 }} >
                    <g>
                        {generateLineElement()}
                    </g>
                </svg>
            </div>
        </>
    );
}

export default Drawer;
