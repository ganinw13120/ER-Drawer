import React, { ReactElement, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DrawerContext } from '../hooks/useDrawerContext';
import { useDrawer } from '../hooks/useDrawer';
import { Position, DrawerProps, Box, BoxState } from '../model/Drawer';
import BoxComponent from './Box';
import parseClientRectsToPosition from '../utils/parseClientRectsToPosition';
import generateBox from '../utils/generateBox';

const Drawer: React.FC<DrawerProps> = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [
        [boxes, setBoxes], 
        [lines, setLines], 
        actionType, 
        setBoxState, 
        clearSelection,
        [onMouseDown, onMouseUp],
        [currentPos, setCurrentPos]
    ] = useDrawer();

    useEffect(() => {
        setLines([]);
        setBoxes([
            generateBox('นักเรียน', ['รหัสนักเรียน', 'ชื่อจริง', 'นามสกุล', 'เบอร์โทร', 'วันเกิด']),
            generateBox('นักเลง', ['รหัสนักเรียน', 'ชื่อจริง', 'นามสกุล', 'เบอร์โทร', 'วันเกิด', 'ที่อยู่']),
            generateBox('Customer', ['cusomter_id', 'full_name', 'mobile_no', 'password', 'created_at', 'updated_at']),
            generateBox('Branch', ['branch_d', 'branch_name', 'branch_address', 'mobile_no', 'created_at', 'updated_at'])
        ]);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        let current: Position = {
            x: e.pageX,
            y: e.pageY
        }
        setCurrentPos(current);
    }

    const generateLineElement = (): ReactElement[] => {
        let list: ReactElement[] = [];
        lines.forEach((e, key) => {
            const startPos = e.startRef?.current ? parseClientRectsToPosition(e.startRef.current!.getClientRects()[0], 10) : e.startPosition!
            const stopPos = e.stopRef?.current ? parseClientRectsToPosition(e.stopRef.current!.getClientRects()[0], 10) : e.stopPosition!

            const middlePositionStart: Position = {
                x: (startPos.x + stopPos.x) / 2,
                y: startPos.y,
            }
            const middlePositionStop: Position = {
                x: (startPos.x + stopPos.x) / 2,
                y: stopPos.y,
            }
            list.push(generateSvgLine(key, `M ${startPos.x} ${startPos.y}, ${middlePositionStart.x} ${startPos.y},${middlePositionStop.x}, ${middlePositionStop.y}  , ${stopPos.x} ${stopPos.y}`))
        })
        return list;
    }

    const generateSvgLine = (key : number, path: string): ReactElement => {
        return <path key={key} d={path} stroke="black" fill="transparent" strokeWidth="2" />
    }

    const onClear = () => {
        setLines([]);
    }

    const onBackgroundClick = () => {
        clearSelection();
    }
    
    return (
        <>
            <DrawerContext.Provider value={{
                pos: currentPos
            }}>
                <a style={{position:'absolute'}}>{actionType}</a>
                {/* <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button> */}
                <div ref={containerRef} onMouseMove={handleMouseMove} className={`container`} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                    {(() => {
                        let _boxes: Array<ReactElement> = [];
                        boxes.forEach((e, key) => {
                            const _setBoxState = (state: BoxState) => {
                                setBoxState(key, state);
                            }
                            _boxes.push(<React.Fragment key={key}>
                                <BoxComponent data={e} setBoxState={_setBoxState} />
                            </React.Fragment>)
                        })
                        return _boxes;
                    })()}
                    <svg style={{ width: '100%', height: '100%', top: 0 }} onMouseDown={onBackgroundClick}>
                        <g>
                            {generateLineElement()}
                        </g>
                    </svg>
                </div>
            </DrawerContext.Provider>
        </>
    );
}

export default Drawer