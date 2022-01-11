import React from "react"

export type DrawerProps = {
}

export type Position = {
    x: number
    y: number
}

export type Line = {
    uuid: string
    startRef?: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement>
    startPosition?: Position
    stopRef?: React.RefObject<HTMLDivElement> | React.RefObject<SVGSVGElement>
    stopPosition?: Position
    startType : LineType
    stopType : LineType
    startPoint ?: Point
    stopPoint ?: Point
    state : LineState
}

export type Entity = Box

export type LineState = {
    isFocus : boolean
}

export enum LineType {
    OnlyOne,
    More,
    AnyNumber,
    Optional
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
    parentRef: React.RefObject<HTMLDivElement>
    position: PointPosition
    isHover: boolean
    box: Box
}

export enum PointPosition {
    Left = 'Left',
    Right = 'Right',
}

export enum ActionType {
    None = 'None',
    Drag = 'Drag',
    Focus = 'Focus',
    Draw = 'Draw',
    DrawReady = 'DrawReady',
}