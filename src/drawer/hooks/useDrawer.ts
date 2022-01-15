import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ActionType, Box, BoxState, Entity, Line, LineState, LineType, Point, Position } from "../model/Drawer";
import generateBox from "../utils/generateBox";

type TUseDrawer= [
    {
        boxes : Box[],
        setBoxes : React.Dispatch<React.SetStateAction<Box[]>>,
        setBoxState : (key: number, newState: BoxState) => void
    },
    {
        lines : Line[],
        setLines : React.Dispatch<React.SetStateAction<Line[]>>,
        setLineState : (key: number, newState: LineState) => void,
    },
    ActionType,
    () => void,
    {
        onMouseDown : () => void,
        onMouseUp : () => void,
    },
    [Position, (pos: Position) => void],
    {
        deleteItem : () => void,
        addRelation : () => void,
        changeFields : (amount : number) => void,
        addField : () => void
    }
]

export const useDrawer = (): TUseDrawer => {

    const [actionType, setActionType] = useState<ActionType>(ActionType.None);

    const [focusEntity, setFocusEntity] = useState<Point | null>(null);

    const [focusLine, setFocusLine] = useState<Line | null>(null);

    const [lines, setLines] = useState<Array<Line>>([]);

    const [pos, setPos] = useState<Position>({ x: 0, y: 0 });

    const [boxes, setBoxes] = useState<Array<Box>>([]);

    const checkAction = (): ActionType => {
        let isFocusing, isDragging, isDrawingReady = false;
        let _focusEntity = null;
        boxes.forEach(e => {
            if (e.state.isDragging) isDragging = true;
            if (e.state.isHover) isFocusing = true;
            if (e.state.pointAiming) {
                // setFocusEntity(e.state.pointAiming);
                _focusEntity = e.state.pointAiming;
                isDrawingReady = true;
            }
        })
        setFocusEntity(_focusEntity);
        if (isDrawingReady) {
            return ActionType.DrawReady;
        }
        else if (isDragging) {
            return ActionType.Drag;
        } else if (isFocusing) {
            return ActionType.Focus;
        } else {
            return ActionType.None;
        }
    }

    useEffect(() => {
        if (actionType !== ActionType.Draw) {
            setActionType(checkAction());
        }
        else {
            checkAction();
        }
    }, [boxes]);

    useEffect(() => {
        if (actionType === ActionType.Draw) {
            if (!focusLine) return;
            setLines((prev) => {
                const temp = [...prev];
                temp.find(e => e.uuid === focusLine.uuid)!.stopPosition = pos;
                return temp;
            })
        }
    }, [pos]);

    const startDrawing = (): void => {
        if (!focusEntity) return;
        setLines(prev => {
            const temp = [...prev];
            const line: Line = {
                uuid: uuidv4(),
                startRef: focusEntity.ref,
                startPoint: focusEntity,
                stopPosition: pos,
                startType : LineType.OnlyOne,
                stopType : LineType.More,
                state : {
                    isFocus : false
                }
            }
            temp.push(line)
            setFocusLine(line);
            return temp;
        })
        setActionType(ActionType.Draw);
    }

    const stopDrawing = (): void => {
        if (!focusLine) return;
        setLines((prev) => {
            const temp = [...prev];
            if (focusEntity) {
                temp.find(e => e.uuid === focusLine.uuid)!.stopRef = focusEntity.ref;
                temp.find(e => e.uuid === focusLine.uuid)!.stopPoint = focusEntity;
                temp.find(e => e.uuid === focusLine.uuid)!.stopPosition = undefined;
            } else {
                temp.find(e => e.uuid === focusLine.uuid)!.stopPosition = pos;
                temp.find(e => e.uuid === focusLine.uuid)!.stopRef = undefined;
            }
            return temp;
        })
        setFocusLine(null);
        setActionType(ActionType.None);
    }

    const onMouseDown = (): void => {
        if (actionType === ActionType.DrawReady) {
            startDrawing();
        }
    }

    const onMouseUp = (): void => {
        if (actionType === ActionType.Draw) {
            stopDrawing();
        }
    }

    const updateCurrentPosition = (pos: Position): void => {
        setPos(pos);
    }

    const clearSelection = (): void => {
        setBoxes(prev => {
            return prev.map(e => { e.state.isSelect = false; return e });
        })
    }

    const clearBoxesFocus = () => {
        setBoxes(prev => {
            return [...prev].map(e=>{e.state.isSelect=false; return e;});            
        })
    }
    const clearLineFocus = () => {
        setLines(prev => {
            return [...prev].map(e=>{e.state.isFocus=false; return e;});            
        })
    }
    
    const setBoxState = (key: number, newState: BoxState): void => {
        setBoxes(prev => {
            const temp = [...prev];
            if (newState.isSelect) temp.filter((e, k) => k !== key).forEach(e => {
                e.state.isSelect = false;
            })
            temp[key].state = newState;
            return temp;
        })
        if (newState.isSelect) clearLineFocus();
    }

    const setLineState = (key: number, newState: LineState): void => {
        setLines(prev => {
            const temp = [...prev];
            temp[key].state = newState;
            return temp;
        })
        if (newState.isFocus) clearBoxesFocus();
    }

    const getCurrentFocus = () : Entity | null => {
        const box = boxes.find(e=>e.state.isSelect);
        if (box) return box;
        const line = lines.find(e=>e.state.isFocus);
        if (line) return line;
        return null;
    }

    const deleteItem = () : void => {
        // console.log(typeof getCurrentFocus() === typeof lines)
        const focus = getCurrentFocus();
        if (!focus) return;
        if ((focus as Box).title!==undefined) {
            setBoxes((prev)=>{
                let temp = [...prev];
                temp = temp.filter(e=>e.uuid!==focus.uuid);
                return temp;
            })
        } else {
            setLines((prev)=>{
                let temp = [...prev];
                temp = temp.filter(e=>e.uuid!==focus.uuid);
                return temp;
            })
        }
    }
    const addRelation = () : void => {
        setBoxes(prev=>{
            const temp = [...prev];
            temp.push(generateBox(" ", []))
            return temp;
        })
    }
    const changeFields = (amount : number) : void => {

    }
    const addField = () : void => {

    }

    return [
        {
            boxes : boxes,
            setBoxes : setBoxes,
            setBoxState : setBoxState
        },
        {
            lines : lines, 
            setLines : setLines, 
            setLineState : setLineState
        },
        actionType,
        clearSelection,
        {
            onMouseDown : onMouseDown,
            onMouseUp : onMouseUp,
        },
        [pos, updateCurrentPosition],
        {
            deleteItem : deleteItem,
            addRelation : addRelation,
            changeFields : changeFields,
            addField : addField
        }
    ]

}