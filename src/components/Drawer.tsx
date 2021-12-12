import React, { ReactElement, useRef, useState } from 'react';

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

const Drawer: React.FC<DrawerProps> = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMouseClick, setMouseClick] = useState<boolean>(false);

    const [lines, setLines] = useState<Array<Line>>([]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMouseClick) {
            const current: Position = {
                x: e.pageX,
                y: e.pageY
            }
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
            const middlePositionStart : Position = {
                x : (e.startPosition.x + e.stopPosition.x) / 2,
                y : e.startPosition.y,
            }
            const middlePositionStop : Position = {
                x : (e.startPosition.x + e.stopPosition.x) / 2,
                y : e.stopPosition.y,
            }
            list.push(generateSvgLine(`M ${e.startPosition.x} ${e.startPosition.y}, ${middlePositionStart.x} ${middlePositionStart.y},${middlePositionStop.x}, ${middlePositionStop.y}  , ${e.stopPosition.x} ${e.stopPosition.y}`))
        })
        return list;
    }

    const generateSvgLine = (path: string): ReactElement => {
        return   <path d={path} stroke="black" fill="transparent" />
    }

    const onClear = () => {
        setLines([]);
    }

    return (
        <>
            <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button>
            <div ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className='container'>
                <svg style={{width : '100%', height : '100%'}}>
                    <g>
                        {generateLineElement()}
                    </g>
                </svg>
            </div>
        </>
    );
}

export default Drawer;
