import { Position } from "../model/Drawer"

const parseClientRectsToPosition = (val: DOMRect, addOn : number): Position => {
    return {
        x: val.x + addOn,
        y: val.y + addOn
    }
}

export default parseClientRectsToPosition;