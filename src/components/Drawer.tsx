import React, { useEffect, useRef, useState } from 'react';

type DrawerProps = {
    lineWidth : number
    lineCap : CanvasLineCap
    strokeStyle : string
}

const Drawer: React.FC<DrawerProps> = ({lineWidth, lineCap, strokeStyle}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

    const [isMouseClick, setMouseClock] = useState<boolean>(false);

    useEffect(()=>{
        if (!containerRef || !containerRef.current) return
       const resizeObserver = new ResizeObserver(() => {resizeCanvas()});
       resizeObserver.observe(containerRef.current)
       return (): void => { resizeObserver.unobserve(containerRef.current!) };
    }, [containerRef])

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return
        canvas.height = containerRef.current!.clientHeight;
        canvas.width = containerRef.current!.clientWidth;
    }

    useEffect(()=>{
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
    }, [canvasRef, containerRef])

    const handleMouseMove = (e : React.MouseEvent<HTMLDivElement>) => {
        if (isMouseClick && canvasContext) {
                
            canvasContext!.lineWidth = lineWidth;
            canvasContext!.lineCap = lineCap;
            canvasContext!.strokeStyle = strokeStyle;

            canvasContext?.lineTo(e.pageX, e.pageY)
            canvasContext?.stroke()
            canvasContext?.beginPath()
            canvasContext?.moveTo(e.pageX, e.pageY)
        }
    }

    const handleMouseDown = (e : React.MouseEvent<HTMLDivElement>) => {
        setMouseClock(true);
    }
    const handleMouseUp = (e : React.MouseEvent<HTMLDivElement>) => {
        setMouseClock(false);
        canvasContext?.beginPath()
    }

    return (
        <>
            <div ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className='canvas-container'>
                <canvas ref={canvasRef} />
            </div>
        </>
    );
}

export default Drawer;
