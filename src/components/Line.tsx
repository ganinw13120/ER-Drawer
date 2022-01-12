import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Box, Line, LineState, LineType, Point, Position } from '../model/Drawer';
import { v4 as uuidv4 } from 'uuid';
import parseClientRectsToPosition from '../utils/parseClientRectsToPosition';
import generateShortestPath from '../utils/generateShortestPath';

type LineComponentProps = {
    data: Line
    setLineState: (state: LineState) => void
}

type LinePath = {
    checkPoints: Position[]
    startAngle: Angle
    stopAngle: Angle
}

enum Angle {
    ToLeft,
    ToRight
}

export type LinePathParameters = {
    startPos: Position
    stopPos: Position
    startPoint?: Point
    stopPoint?: Point
}

export const pathReservY: number = 10;
export const pathReservX: number = 30;

const pointOffset: number = 15;

export const lineStartTickDistance: number = 13;
export const lineStartTickLength: number = 26;

export const lineStopTickDistance: number = 20;
export const lineStopTickSpread: number = 13;

const LineComponent: React.FC<LineComponentProps> = ({ data, setLineState }) => {

    const generateHeadOne = (direction : Angle, pos : Position) : ReactElement[] => {
        const element : ReactElement[] = [];
        switch (direction) {
            case Angle.ToLeft :{
                element.push(generateSvgLine(`M ${pos.x - lineStartTickDistance} ${pos.y + (lineStartTickLength / 2)}, ${pos.x - lineStartTickDistance} ${pos.y - (lineStartTickLength / 2)}`))
                break;
            }
            case Angle.ToRight : {
                element.push(generateSvgLine(`M ${pos.x + lineStartTickDistance} ${pos.y + (lineStartTickLength / 2)}, ${pos.x + lineStartTickDistance} ${pos.y - (lineStartTickLength / 2)}`))
                break;
            }
        }
        return element;
    }

    const generateHeadMany = (direction : Angle, pos : Position) : ReactElement[] => {
        const element : ReactElement[] = [];
        switch (direction) {
            case Angle.ToLeft :{
                element.push(generateSvgLine(`M ${pos.x + lineStopTickDistance} ${pos.y}, ${pos.x} ${pos.y + lineStopTickSpread}`))
                element.push(generateSvgLine(`M ${pos.x + lineStopTickDistance} ${pos.y}, ${pos.x} ${pos.y}`))
                element.push(generateSvgLine(`M ${pos.x + lineStopTickDistance} ${pos.y}, ${pos.x} ${pos.y - lineStopTickSpread}`))
                break;
            }
            case Angle.ToRight : {
                element.push(generateSvgLine(`M ${pos.x - lineStopTickDistance} ${pos.y}, ${pos.x} ${pos.y + lineStopTickSpread}`))
                element.push(generateSvgLine(`M ${pos.x - lineStopTickDistance} ${pos.y}, ${pos.x} ${pos.y}`))
                element.push(generateSvgLine(`M ${pos.x - lineStopTickDistance} ${pos.y}, ${pos.x} ${pos.y - lineStopTickSpread}`))
                break;
            }
        }
        return element;
    }

    const generateLinePath = (param: LinePathParameters): LinePath => {
        const {
            startPos,
            stopPos,
            startPoint,
            stopPoint,
        } = param;
        const middlePositionStart: Position = {
            x: (startPos.x + stopPos.x) / 2,
            y: startPos.y,
        }
        const middlePositionStop: Position = {
            x: (startPos.x + stopPos.x) / 2,
            y: stopPos.y,
        }

        const shortestPath = generateShortestPath(param);
        const stopAngle = shortestPath[shortestPath.length-1].x < shortestPath[shortestPath.length-2].x ? Angle.ToLeft : Angle.ToRight;
        const startAngle = shortestPath[0].x < shortestPath[1].x ? Angle.ToRight : Angle.ToLeft;

        return {
            checkPoints: shortestPath,
            startAngle: startAngle,
            stopAngle: stopAngle,
        }
    }

    const [state, setState] = useState<LineState>(data.state);

    useEffect(() => {
        setLineState(state);
    }, [state])

    const generateLineElement = (): ReactElement[] => {

        let element: ReactElement[] = [];

        const startPos = data.startRef?.current ? parseClientRectsToPosition(data.startRef.current!.getClientRects()[0], pointOffset) : data.startPosition!
        const stopPos = data.stopRef?.current ? parseClientRectsToPosition(data.stopRef.current!.getClientRects()[0], pointOffset) : data.stopPosition!

        const linePath = generateLinePath({
            startPos: startPos,
            stopPos: stopPos,
            startPoint: data.startPoint,
            stopPoint: data.stopPoint
        });
        const {startAngle, stopAngle} = linePath;
        let linePathString = `M `;
        linePath.checkPoints.forEach((e, i) => {
            linePathString += `${e.x} ${e.y} ${i === linePath.checkPoints.length - 1 ? '' : ','}`;
        })

        element.push(generateSvgLine(linePathString))

        switch (data.startType) {
            case LineType.OnlyOne: {
                element.push(...generateHeadOne(startAngle, startPos));
                break;
            }
        }

        switch (data.stopType) {
            case LineType.More: {
                element.push(...generateHeadMany(stopAngle, stopPos));
                break;
            }
        }

        return element
    }

    const generateSvgLine = (path: string): ReactElement => {
        return <><path onClick={() => { console.log('clicking lines') }} key={uuidv4()} d={path} stroke="black" fill="transparent" strokeWidth="2" /></>

    }

    return <>

        {generateLineElement()}

    </>
}

export default LineComponent
