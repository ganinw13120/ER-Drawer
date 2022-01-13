import React, { ReactElement, useEffect, useRef, createContext, useContext } from 'react';
import { DrawerContext } from '../hooks/useDrawerContext';
import { useDrawer } from '../hooks/useDrawer';
import { Position, DrawerProps, BoxState, LineState, ActionType } from '../model/Drawer';
import BoxComponent from './Box';
import generateBox from '../utils/generateBox';
import Line from './Line';
import Stat from './Stat';
import { Provider } from 'mobx-react';
import DrawerStore, { DrawerStoreContext, useDrawerStore } from '../stores/DrawerStore';

import { observer } from "mobx-react";

const Drawer: React.FC<DrawerProps> = observer(() => {

    const containerRef = useRef<HTMLDivElement>(null);

    const store = useContext(DrawerStoreContext);

    useEffect(()=>{
        console.log(store!.store)
    }, [store])

    useEffect(() => {
        store!.clearLine();
        store!.setBoxes([
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
        store!.setCurrentMousePosition(current);
    }

    const generateLineElement = (): ReactElement[] => {
        let list: ReactElement[] = [];
        store!.store.lines.forEach((e, key) => {
            const setLineState = (state: LineState) => {

            }
            list.push(<Line data={e} setLineState={setLineState} />)
        })
        return list;
    }

    const onBackgroundClick = () => {
        store!.clearSelection();
    }

    const onMouseDown = (): void => {
        if (store!.store.actionType === ActionType.DrawReady) {
            store!.startDrawing();
        }
    }

    const onMouseUp = (): void => {
        if (store!.store.actionType === ActionType.Draw) {
            store!.stopDrawing();
        }
    }

    console.log(store!.store)

    return (
        <>
            <Stat />
                <a style={{ position: 'absolute' }}>{store!.store.actionType}</a>
                {/* <button onClick={onClear} style={{ position: 'absolute' }}>Clear</button> */}
                <div ref={containerRef} onMouseMove={handleMouseMove} className={`container`} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                    {(() => {
                        let _boxes: Array<ReactElement> = [];
                        store!.store.boxes.forEach((e, key) => {
                            const _setBoxState = (state: BoxState) => {
                                store!.setBoxState(key, state);;
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
        </>
    );
})

export default Drawer