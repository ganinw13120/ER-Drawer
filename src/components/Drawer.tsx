import React, { ReactElement, useEffect, useRef, createContext, useContext } from 'react';
import { DrawerContext } from '../hooks/useDrawerContext';
import { useDrawer } from '../hooks/useDrawer';
import { Position, DrawerProps, BoxState, LineState } from '../model/Drawer';
import BoxComponent from './Box';
import generateBox from '../utils/generateBox';
import Line from './Line';
import Stat from './Stat';
import { Provider } from 'mobx-react';
import DrawerStore, { DrawerStoreContext, useDrawerStore } from '../stores/DrawerStore';
import { useLocalStore } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0

const drawerStore = new DrawerStore();

const Drawer: React.FC<DrawerProps> = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [
        [boxes, setBoxes],
        [lines, setLines],
        actionType,
        setBoxState,
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
            const setLineState = (state: LineState) => {

            }
            list.push(<Line data={e} setLineState={setLineState} />)
        })
        return list;
    }

    const onClear = () => {
        setLines([]);
    }

    const onBackgroundClick = () => {
        clearSelection();
    }

    console.log((performance as any).memory)


    return (
        <>
            <Stat />
            <DrawerStoreContext.Provider value={drawerStore}>
                <DrawerContext.Provider value={{
                    pos: currentPos
                }}>
                    <a style={{ position: 'absolute' }}>{actionType}</a>
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
            </DrawerStoreContext.Provider>
        </>
    );
}

export default Drawer