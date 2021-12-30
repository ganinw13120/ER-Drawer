import { useEffect, useState } from "react";
import { ActionType, Box, BoxState, Line } from "../model/Drawer";

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
    (key: number, newState: BoxState) => void
]

export const useDrawer = (): useDrawerType => {

    const [actionType, setActionType] = useState<ActionType>(ActionType.None);

    const [lines, setLines] = useState<Array<Line>>([]);

    const [boxes, setBoxes] = useState<Array<Box>>([]);

    const checkAction = () => {
        let isFocusing, isDragging, isDrawingReady = false;
        boxes.forEach(e=>{
            if (e.state.isDragging) isDragging = true;
            if (e.state.isHover) isFocusing = true;
            if (e.state.pointAiming) isDrawingReady = true;
        })        
        if (isDrawingReady) {
            setActionType(ActionType.DrawReady);
        }
        else if (isDragging) {
            setActionType(ActionType.Drag);
        } else if (isFocusing) {
            setActionType(ActionType.Focus);
        } else {
            setActionType(ActionType.None);
        }
    }

    useEffect(()=>{
        checkAction();
    }, [boxes])

    useEffect(()=>{
        console.log(actionType);
    }, [actionType])

    const startDrawing = () => {
        
    }

    const setBoxState = (key: number, newState: BoxState) => {
        setBoxes(prev => {
            const temp = [...prev];
            temp[key].state = newState;
            return temp;
        })
    }

    return [
        [boxes, setBoxes],
        [lines, setLines],
        actionType,
        setBoxState,
    ]

}