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
    title: string
    entities: Array<string>
    isHover: boolean
    pos : Position
}

enum HoverType {
    None,
    Div, 
    Svg
}

const Drawer: React.FC<DrawerProps> = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [isMouseClick, setMouseClick] = useState<boolean>(false);

    const [lines, setLines] = useState<Array<Line>>([]);

    const [boxes, setBoxes] = useState<Array<Box>>([]);

    const [hoverType, setHoverType] = useState<HoverType>(HoverType.None);

    const [pivotPosition, setPivotPosition] = useState<Position | null>(null);

    useEffect(() => {
        const ref = React.createRef<HTMLDivElement>();
        const testBoxes: Array<Box> = [
            {
                ref: ref,
                title: "test",
                entities: ['Test1', 'Test2'],
                isHover: false,
                pos : {
                    x : 0,
                    y : 0
                }
            },
        ];
        setBoxes(testBoxes);
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMouseClick) return;
        const current: Position = {
            x: e.pageX,
            y: e.pageY
        }
        if (hoverType===HoverType.Div) {
            const box = boxes.find(e=>e.isHover);
            if (!box || !pivotPosition) {
                console.log('error while finding draging box');
                return;
            }
            const newPos : Position = {
                x : box.pos.x + (current.x - pivotPosition.x),
                y : box.pos.y + (current.y - pivotPosition.y)
            }
            setPivotPosition(current);
            setBoxes(prev=>{
                const temp = [...prev];
                temp.find(e=>e.isHover)!.pos = newPos;
                return temp;
            })
        }
        else if (hoverType===HoverType.Svg) {
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
        if (boxes.find(e=>e.isHover)) {
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

    const onClear = () => {
        setLines([]);
    }

    const onHoverDiv = (key : number) => {
        if (isMouseClick) return;
        setBoxes(prev=>{
            const temp = [...prev];
            temp[key].isHover = true;
            return temp;
        })
    }

    const onUnHoverDiv = (key : number) => {
        if (isMouseClick) return;
        setBoxes(prev=>{
            const temp = [...prev];
            temp[key].isHover = false;
            return temp;
        })
    }
    return (
        <>
            <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button>
            <div ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className='container'>
                {(() => {
                    let _boxes: Array<ReactElement> = [];
                    boxes.forEach((e, key) => {
                        _boxes.push(<>
                            <div className='box'
                                style={{
                                    transform : `translate(${boxes[key].pos.x}px, ${boxes[key].pos.y}px)`,
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
                                <div className='box-header'>
                                    {e.title}
                                </div>
                                {(() => {
                                    const details: Array<ReactElement> = [];
                                    e.entities.forEach(entity => {
                                        details.push(<>
                                            <div className='box-detail'>
                                                {entity}
                                            </div>
                                        </>)
                                    })
                                    return details;
                                })()}
                            </div>
                        </>)
                    })
                    return _boxes;
                })()}
                <svg style={{ width: '100%', height: '100%' }}>
                    <g>
                        {generateLineElement()}
                    </g>
                </svg>
            </div>
        </>
    );
}

export default Drawer;
