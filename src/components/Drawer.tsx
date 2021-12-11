import React, { useEffect, useRef, useState } from 'react';

type DrawerProps = {
    lineWidth: number
    lineCap: CanvasLineCap
    strokeStyle: string
}

type Position = {
    x: number
    y: number
}

type Path = {
    startPosition: Position
    stopPosition: Position
    isFocus: boolean
}

const Drawer: React.FC<DrawerProps> = ({ lineWidth, lineCap, strokeStyle }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

    const [isMouseClick, setMouseClick] = useState<boolean>(false);

    const [paths, setPaths] = useState<Array<Path>>([]);

    useEffect(() => {
        if (!containerRef || !containerRef.current) return
        const resizeObserver = new ResizeObserver(() => { resizeCanvas() });
        resizeObserver.observe(containerRef.current)
        return (): void => { resizeObserver.unobserve(containerRef.current!) };
    }, [containerRef])

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return
        canvas.height = containerRef.current!.clientHeight;
        canvas.width = containerRef.current!.clientWidth;
    }

    useEffect(() => {
        if (!canvasRef || !containerRef) return;

        const canvas = canvasRef.current
        if (!canvas) return;

        canvas.height = containerRef.current!.clientHeight;
        canvas.width = containerRef.current!.clientWidth;

        const context = canvas.getContext('2d')

        context!.lineWidth = lineWidth;
        context!.lineCap = lineCap;
        context!.strokeStyle = strokeStyle;

        if (!context) return;
        setCanvasContext(context);
    }, [canvasRef, containerRef]);

    useEffect(() => {
        if (!canvasContext) return;
        canvasContext?.clearRect(0, 0, canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
        paths.forEach(e => {
            canvasContext.moveTo(e.startPosition.x, e.startPosition.y);
            canvasContext.beginPath();
            generateSubPath(e).forEach(subPath => {
                canvasContext.lineTo(subPath.x, subPath.y);
            })
            canvasContext.stroke();
        })
        canvasContext!.lineWidth = lineWidth;
        canvasContext!.lineCap = lineCap;
        canvasContext!.strokeStyle = strokeStyle;
    }, [paths])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMouseClick && canvasContext) {
            const position: Position = {
                x: e.pageX,
                y: e.pageY,
            }
            setPaths((p) => {
                const temp = [...p];
                temp.find(e => e.isFocus)!.stopPosition = position;
                return temp
            })
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const position: Position = {
            x: e.pageX,
            y: e.pageY,
        }
        setPaths((p) => {
            const temp = [...p];
            temp.push({ startPosition: position, stopPosition: position, isFocus: true })
            return temp
        })
        setMouseClick(true);
    }
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        const position: Position = {
            x: e.pageX,
            y: e.pageY,
        }
        setPaths((p) => {
            const temp = [...p];
            if (!temp.find(e => e.isFocus)) return temp;
            temp.find(e => e.isFocus)!.stopPosition = position;
            temp.find(e => e.isFocus)!.isFocus = false;
            return temp
        })
        setMouseClick(false);
    }

    const generateSubPath = (path: Path): Position[] => {
        const middleX = (path.startPosition.x + path.stopPosition.x) / 2
        const middleStartPosition: Position = {
            x: middleX,
            y: path.startPosition.y
        }
        const middleStopPosition: Position = {
            x: middleX,
            y: path.stopPosition.y
        }
        return [path.startPosition, middleStartPosition, middleStopPosition, path.stopPosition];
    }

    const onClear = () => {
        canvasContext?.clearRect(0, 0, canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
        setPaths([]);
    }

    return (
        <>
            <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button>
            <div ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className='canvas-container'>
                <canvas ref={canvasRef} />
            </div>
        </>
    );
}

export default Drawer;
