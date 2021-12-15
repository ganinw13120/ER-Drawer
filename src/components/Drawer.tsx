import React, { ReactElement, useEffect, useRef, useState } from 'react';

type DrawerProps = {
}

type Position = {
    x: number
    y: number
}

type Line = {
    startPosition: Position
    stopPosition: Position
    isFocus: boolean
}

type Box = {
    ref: React.RefObject<HTMLDivElement>
    title: BoxTitle
    entities: Array<BoxEntity>
    isHover: boolean
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

enum HoverType {
    None,
    Div,
    Svg,
    Point
}

type Point = {
    box : Box
    ref : React.RefObject<SVGElement>
    pos : Position
    isHover : boolean
}

const Drawer: React.FC<DrawerProps> = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [isMouseClick, setMouseClick] = useState<boolean>(false);

    const [lines, setLines] = useState<Array<Line>>([]);

    const [points, setPoints] = useState<Array<Point>>([]);

    const [boxes, setBoxes] = useState<Array<Box>>([]);

    const [hoverType, setHoverType] = useState<HoverType>(HoverType.None);

    const [pivotPosition, setPivotPosition] = useState<Position | null>(null);

    useEffect(() => {
        const ref = React.createRef<HTMLDivElement>();
        const refTitle = React.createRef<HTMLDivElement>();
        const refEntity1 = React.createRef<HTMLDivElement>();
        const refEntity2 = React.createRef<HTMLDivElement>();
        const testBoxes: Array<Box> = [
            {
                ref: ref,
                title: {
                    text: 'asd',
                    ref: refTitle
                },
                entities: [
                    {
                        text: 'test1',
                        ref: refEntity1,
                    },
                    {
                        text: 'test2',
                        ref: refEntity2,
                    }
                ],
                isHover: false,
                pos: {
                    x: 0,
                    y: 0
                }
            },
        ];
        setBoxes(testBoxes);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMouseClick) return;
        const current: Position = {
            x: e.pageX,
            y: e.pageY
        }
        if (hoverType === HoverType.Div) {
            const box = boxes.find(e => e.isHover);
            if (!box || !pivotPosition) {
                console.log('error while finding draging box');
                return;
            }
            const newPos: Position = {
                x: box.pos.x + (current.x - pivotPosition.x),
                y: box.pos.y + (current.y - pivotPosition.y)
            }
            setPivotPosition(current);
            setBoxes(prev => {
                const temp = [...prev];
                temp.find(e => e.isHover)!.pos = newPos;
                return temp;
            })
        }
        else if (hoverType === HoverType.Svg) {
            setLines(prev => {
                const temp = [...prev];
                if (!temp.find(e => e.isFocus)) return temp;
                temp.find(e => e.isFocus)!.stopPosition = current;
                return temp;
            })
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const current: Position = {
            x: e.pageX,
            y: e.pageY
        }
        if (boxes.find(e => e.isHover)) {
            setHoverType(HoverType.Div);
            setPivotPosition(current);
        }
        else {
            setHoverType(HoverType.Svg);
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
        setMouseClick(false);
    }

    const generateLineElement = (): ReactElement[] => {
        let list: ReactElement[] = [];
        lines.forEach(e => {
            const middlePositionStart: Position = {
                x: (e.startPosition.x + e.stopPosition.x) / 2,
                y: e.startPosition.y,
            }
            const middlePositionStop: Position = {
                x: (e.startPosition.x + e.stopPosition.x) / 2,
                y: e.stopPosition.y,
            }
            list.push(generateSvgLine(`M ${e.startPosition.x} ${e.startPosition.y}, ${middlePositionStart.x} ${middlePositionStart.y},${middlePositionStop.x}, ${middlePositionStop.y}  , ${e.stopPosition.x} ${e.stopPosition.y}`))
        })
        return list;
    }

    const generateSvgLine = (path: string): ReactElement => {
        return <path d={path} stroke="black" fill="transparent" stroke-width="2" />
    }

    const generatePointElement = (): ReactElement[] => {
        const _points: ReactElement[] = [];
        points.forEach((e, key) => {
            _points.push(generatePoint(e.pos, key));
        })
        return _points;
    }

    const generatePoint = (pos: Position, key : number): ReactElement => {
        const pointR = 2.5;
        return <React.Fragment key={key}>
            <svg onMouseEnter={()=>{onHoverPoint(key)}} onMouseLeave={()=>{onUnHoverPoint(key)}} key={key} style={{cursor : 'pointer', position: 'absolute', top: 0, zIndex: 10, width: `${pointR * 4}px`, height: `${pointR * 4}px`, transform: `translate(${pos.x - (pointR * 2)}px, ${pos.y + (pointR * 2)}px)` }}>
                <circle cx={pointR * 2} cy={pointR * 2} r={pointR * 2} fill="red" />
            </svg>
        </React.Fragment>
    }

    const onClear = () => {
        setLines([]);
    }

    const onHoverDiv = (key: number) => {
        if (isMouseClick) return;
        setBoxes(prev => {
            const temp = [...prev];
            temp[key].isHover = true;
            return temp;
        })
    }

    const onUnHoverDiv = (key: number) => {
        if (isMouseClick) return;
        setBoxes(prev => {
            const temp = [...prev];
            temp[key].isHover = false;
            return temp;
        })
    }

    const onHoverPoint = (key : number) => {
        setPoints(prev=>{
            const temp = [...prev];
            temp[key].isHover=true;
            return temp;
        })
    } 

    const onUnHoverPoint = (key : number) => {
        setPoints(prev=>{
            const temp = [...prev];
            temp[key].isHover=false;
            return temp;
        })
    }

    useEffect(()=>{
        console.log(points.map(v=>v.isHover))
    }, [points])

    useEffect(() => {
        const _points: Array<Point> = [];
        boxes.filter(e=>e.isHover).forEach(e => {
            const TitleL = React.createRef<SVGElement>();
            const TitleR = React.createRef<SVGElement>();
            _points.push({
                isHover : false,
                ref : TitleL,
                box : e,
                pos : {
                    x: 0,
                    y: e.title.ref.current!.clientHeight / 2,
                }
            })
            _points.push({
                isHover : false,
                ref : TitleR,
                box : e,
                pos : {
                    x: e.title.ref.current!.offsetWidth,
                    y: e.title.ref.current!.offsetHeight / 2,
                }
            })
            let sum = e.title.ref.current!.offsetHeight;
            e.entities.forEach(en => {
                const L = React.createRef<SVGElement>();
                const R = React.createRef<SVGElement>();
                _points.push({
                    isHover : false,
                    ref : L,
                    box : e,
                    pos : {
                        x: 0,
                        y: ( en.ref.current!.clientHeight / 2) + sum,
                    }
                })
                _points.push({
                    isHover : false,
                    ref : R,
                    box : e,
                    pos : {
                        x: en.ref.current!.offsetWidth,
                        y: ( en.ref.current!.clientHeight / 2) + sum,
                    }
                })
                sum += en.ref.current!.clientHeight;
            })
        })
        setPoints(_points);
    }, [boxes])

    return (
        <>
            <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button>
            <div ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className='container'>
                {(() => {
                    let _boxes: Array<ReactElement> = [];
                    boxes.forEach((e, key) => {
                        _boxes.push(<React.Fragment key={key}>
                            <div className='box'
                                style={{
                                    transform: `translate(${boxes[key].pos.x}px, ${boxes[key].pos.y}px)`,
                                    // transition : 'all 0.01s'
                                }}
                                ref={boxes[key].ref}
                                onMouseEnter={() => {
                                    onHoverDiv(key);
                                }}
                                onMouseLeave={() => {
                                    onUnHoverDiv(key);
                                }}
                            >
                                <div className='box-inner-container'>
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
                                {generatePointElement()}
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
