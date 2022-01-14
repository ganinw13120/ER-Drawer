import React, { ReactElement, useEffect, useRef, createContext, useContext } from 'react';
import { DrawerContext } from '../hooks/useDrawerContext';
import { useDrawer } from '../hooks/useDrawer';
import { Position, DrawerProps, BoxState, LineState } from '../model/Drawer';
import BoxComponent from './Box';
import generateBox from '../utils/generateBox';
import Line from './Line';
import Stat from './Stat';

const Drawer: React.FC<DrawerProps> = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [
        [boxes, setBoxes],
        [lines, setLines],
        actionType,
        setBoxState,
        [setLineState, deleteLine],
        clearSelection,
        [onMouseDown, onMouseUp],
        [currentPos, setCurrentPos],
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
            const _setLineState = (state: LineState) => {
                setLineState(key, state);
            }
            const _deleteLine = () : void => {
                deleteLine(key);
            }
            list.push(<Line data={e} setLineState={_setLineState} deleteLine={_deleteLine} />)
        })
        return list;
    }

    const onClear = () => {
        setLines([]);
    }

    const onBackgroundClick = () => {
        clearSelection();
    }

    return (
        <>
            <Stat />
            <DrawerContext.Provider value={{
                pos: currentPos
            }}>
                <a style={{ position: 'absolute' }}>{actionType}</a>
                {/* <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button> */}
                <div onKeyDown={(e)=>{console.log(e)}} ref={containerRef} onMouseMove={handleMouseMove} className={`container`} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
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