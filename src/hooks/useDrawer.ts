import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ActionType, Box, BoxState, Line, Point, Position } from "../model/Drawer";

type useDrawerType = [
    [
        Box[],
        React.Dispatch<React.SetStateAction<Box[]>>
    ],
    [
        Line[],
        React.Dispatch<React.SetStateAction<Line[]>>
    ],
    ActionType,
    (key: number, newState: BoxState) => void,
    () => void,
    [
        () => void,
        () => void,
    ],
    [Position, (pos: Position) => void]
]

export const useDrawer = (): useDrawerType => {

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
            console.log(checkAction())
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
                stopPosition: pos,
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
            console.log(focusEntity)
            if (focusEntity) {
                temp.find(e => e.uuid === focusLine.uuid)!.stopRef = focusEntity.ref;
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

    const setBoxState = (key: number, newState: BoxState): void => {
        setBoxes(prev => {
            const temp = [...prev];
            if (newState.isSelect) temp.filter((e, k) => k !== key).forEach(e => {
                e.state.isSelect = false;
            })
            temp[key].state = newState;
            return temp;
        })
    }

    return [
        [boxes, setBoxes],
        [lines, setLines],
        actionType,
        setBoxState,
        clearSelection,
        [onMouseDown, onMouseUp],
        [pos, updateCurrentPosition]
    ]

}