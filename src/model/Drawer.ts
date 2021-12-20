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
    isSelect: boolean
    isHover: boolean
    isDragging: boolean
    pos: Position
}

export type BoxTitle = {
    text: string
    ref: React.RefObject<HTMLDivElement>
}

export type BoxEntity = {
    text: string
    ref: React.RefObject<HTMLDivElement>
}

export enum FocusType {
    None,
    Div,
    Svg,
    Point
}

export type Point = {
    uuid: string
    boxId: string
    ref: React.RefObject<SVGSVGElement>
    pos: Position
    isHover: boolean
    isShow: boolean
}
