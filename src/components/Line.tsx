import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Line, LineState, LineType, Position } from '../model/Drawer';
import { v4 as uuidv4 } from 'uuid';
import parseClientRectsToPosition from '../utils/parseClientRectsToPosition';

type LineComponentProps = {
    data: Line
    setLineState: (state: LineState) => void
}

const pointOffset: number = 15;

const lineStartTickDistance: number = 13;
const lineStartTickLength: number = 26;

const lineStopTickDistance: number = 20;
const lineStopTickSpread: number = 13;

const LineComponent: React.FC<LineComponentProps> = ({ data, setLineState }) => {

    const [state, setState] = useState<LineState>(data.state);

    useEffect(() => {
        setLineState(state);
    }, [state])

    const generateLineElement = (): ReactElement[] => {

        let element: ReactElement[] = [];

        const startPos = data.startRef?.current ? parseClientRectsToPosition(data.startRef.current!.getClientRects()[0], pointOffset) : data.startPosition!
        const stopPos = data.stopRef?.current ? parseClientRectsToPosition(data.stopRef.current!.getClientRects()[0], pointOffset) : data.stopPosition!

        const middlePositionStart: Position = {
            x: (startPos.x + stopPos.x) / 2,
            y: startPos.y,
        }
        const middlePositionStop: Position = {
            x: (startPos.x + stopPos.x) / 2,
            y: stopPos.y,
        }
        element.push(generateSvgLine(`M ${startPos.x} ${startPos.y}, ${middlePositionStart.x} ${startPos.y},${middlePositionStop.x}, ${middlePositionStop.y}  , ${stopPos.x} ${stopPos.y}`))

        switch (data.startType) {
            case LineType.OnlyOne: {
                element.push(generateSvgLine(`M ${startPos.x + lineStartTickDistance} ${startPos.y + (lineStartTickLength / 2)}, ${startPos.x + lineStartTickDistance} ${startPos.y - (lineStartTickLength / 2)}`))
                break;
            }
        }

        switch (data.stopType) {
            case LineType.More: {
                element.push(generateSvgLine(`M ${stopPos.x - lineStopTickDistance} ${stopPos.y}, ${stopPos.x} ${stopPos.y + lineStopTickSpread}`))
                element.push(generateSvgLine(`M ${stopPos.x - lineStopTickDistance} ${stopPos.y}, ${stopPos.x} ${stopPos.y}`))
                element.push(generateSvgLine(`M ${stopPos.x - lineStopTickDistance} ${stopPos.y}, ${stopPos.x} ${stopPos.y - lineStopTickSpread}`))
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