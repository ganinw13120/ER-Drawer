import { LinePathParameters, pathReservY, pathReservX, lineStartTickDistance } from "../components/Line";
import { PointPosition, Position } from "../model/Drawer";

const generateShortestPath = (param : LinePathParameters) : Position[] => {
    const {
        startPos,
        stopPos,
        startPoint,
        stopPoint,
    } = param;
    const path : Array<Array<Position>> = [];
    if (startPoint && stopPoint) {
        if (
            (startPos.x < stopPos.x && startPoint.position===PointPosition.Right && stopPoint.position===PointPosition.Left) ||
            (startPos.x > stopPos.x && startPoint.position===PointPosition.Left && stopPoint.position===PointPosition.Right)
        ) {
            path.push(getSimplePath(param));
        } else {
            path.push(
                getRoundTop(param),
                getRoundBottom(param)
            )
        }
    } else {
        path.push(getSimplePath(param));
    }

    // if ((startPos.x < stopPos.x && startPoint?.position))

    let min : Position[] = [];
    let minDistance : number = Infinity;
    path.forEach(e=>{
        const distance = calDistance(e);
        if (distance < minDistance) {
            minDistance = distance;
            min = e;
        }
    })
    return min;
}

const getSimplePath = (param : LinePathParameters) : Position[] => {
    const {
        startPos,
        stopPos,
    } = param;
    const middlePositionStart: Position = {
        x: (startPos.x + stopPos.x) / 2,
        y: startPos.y,
    }
    const middlePositionStop: Position = {
        x: (startPos.x + stopPos.x) / 2,
        y: stopPos.y,
    }
    return [
        startPos,
        middlePositionStart,
        middlePositionStop,
        stopPos
    ]
}

const calDistance = (pos : Position[]) : number => {
    let totalDistance : number = 0;
    let i : number = 0;
    while (i < pos.length-2) {
        const cur = pos[i];
        const next = pos[i+1];
        const distance = Math.sqrt(Math.pow(cur.x - next.x, 2) + Math.pow(cur.y - next.y, 2));
        totalDistance += distance;
        i++;
    }
    return totalDistance;
}

const getRoundTop = (param: LinePathParameters): Position[] => {
    const {
        startPos,
        stopPos,
        startPoint,
        stopPoint,
    } = param;
    let checkPoints: Position[] = [];
    const stopBox = stopPoint?.box;
    const boxRect = stopBox?.ref.current?.getClientRects()[0];
    /// 1.
    checkPoints.push({ x: startPos.x, y: startPos.y });
    if (startPos.x + lineStartTickDistance >= boxRect!.x - pathReservX) {
        /// 2.
        checkPoints.push({ x: stopPos.x + pathReservX, y: startPos.y });
    }
    else {
        /// 2.
        checkPoints.push({ x: boxRect!.x - pathReservX, y: startPos.y });
        /// 3.
        checkPoints.push({ x: boxRect!.x - pathReservX, y: boxRect!.y - pathReservY });
        /// 4.
        checkPoints.push({ x: stopPos.x + pathReservX, y: boxRect!.y - pathReservY });
    }
    /// 5.
    checkPoints.push({ x: stopPos.x + pathReservX, y: stopPos.y });
    /// 6.
    checkPoints.push({ x: stopPos.x, y: stopPos.y });
    return checkPoints;
}

const getRoundBottom = (param: LinePathParameters): Position[] => {
    const {
        startPos,
        stopPos,
        startPoint,
        stopPoint,
    } = param;
    const stopBox = stopPoint?.box;
    let checkPoints: Position[] = [];
    const boxRect = stopBox?.ref.current?.getClientRects()[0];
    /// 1.
    checkPoints.push({ x: startPos.x, y: startPos.y });
    if (startPos.x + lineStartTickDistance >= boxRect!.x - pathReservX) {
        /// 2.
        checkPoints.push({ x: stopPos.x + pathReservX, y: startPos.y });
    }
    else {
        /// 2.
        checkPoints.push({ x: boxRect!.x - pathReservX, y: startPos.y });
        /// 3.
        checkPoints.push({ x: boxRect!.x - pathReservX, y: (boxRect!.y+ boxRect!.height) + pathReservY });
        /// 4.
        checkPoints.push({ x: stopPos.x + pathReservX, y: (boxRect!.y + boxRect!.height) + pathReservY });
    }
    /// 5.
    checkPoints.push({ x: stopPos.x + pathReservX, y: stopPos.y });
    /// 6.
    checkPoints.push({ x: stopPos.x, y: stopPos.y });
    return checkPoints;
}

export default generateShortestPath;