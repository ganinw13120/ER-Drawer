export type DrawerProps = {
}

export type Position = {
    x: number
    y: number
}

export type Line = {
    startRef?: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement>
    startPosition?: Position
    stopRef?: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement>
    stopPosition?: Position
    isFocus: boolean
}

export type Box = {
    uuid: string
    ref: React.RefObject<HTMLDivElement>
    title: BoxTitle
    entities: Array<BoxEntity>
    state: BoxState
}

export type BoxState = {
    isSelect: boolean
    isHover: boolean
    isDragging: boolean
    pos: Position
    pointAiming?: Point
}

export type BoxTitle = {
    text: string
    ref: React.RefObject<HTMLDivElement>
}

export type BoxEntity = {
    text: string
    ref: React.RefObject<HTMLDivElement>
}

export type Point = {
    uuid: string
    ref: React.RefObject<SVGSVGElement>
    pos: Position
    isHover: boolean
    isShow: boolean
}

export enum ActionType {
    None = 'None',
    Drag = 'Drag',
    Focus = 'Focus',
    Draw = 'Draw',
    DrawReady = 'DrawReady',
}