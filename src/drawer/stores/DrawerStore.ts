import { observable, action, makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import { ActionType, Box, BoxState, Line, LineType, Point, Position } from '../model/Drawer';
import { v4 as uuidv4 } from 'uuid';

type TStore = {
    currentMousePosition: Position,
    actionType: ActionType,
    focusEntity: Point | null,
    focusLine: Line | null,
    lines: Array<Line>,
    boxes: Array<Box>
}

interface IDrawerStore {
    store: TStore
}

export default class DrawerStore implements IDrawerStore {

    currentMousePosition = { x: 0, y: 0 }
    private _store: TStore = {
        currentMousePosition: { x: 0, y: 0 },
        actionType: ActionType.None,
        focusEntity: null,
        focusLine: null,
        lines: [],
        boxes: []
    }

    public get store(): TStore {
        return this._store;
    }
    constructor() {
        makeAutoObservable(this)
    }

    @action.bound
    public clearSelection(): void {
        this._store.boxes = this._store.boxes.map((e) => { e.state.isSelect = false; return e; })
    }

    @action.bound
    public setBoxes(boxes: Box[]): void {
        this._store.boxes = boxes;
    }

    @action.bound
    public clearLine(): void {
        this._store.lines = [];
    }

    @action.bound
    private onBoxChanges(): void {
        if (this._store.actionType !== ActionType.Draw) {
            this._store.actionType = this.checkAction();
        }
        else {
            this.checkAction();
        }
    }

    @action.bound
    public stopDrawing(): void {
        if (!this._store.focusLine) return;
        const temp = [...this._store.lines];
        const line_uuid = this._store.focusLine.uuid;
        if (this._store.focusEntity) {
            temp.find(e => e.uuid === line_uuid)!.stopRef = this._store.focusEntity.ref;
            temp.find(e => e.uuid === line_uuid)!.stopPoint = this._store.focusEntity;
            temp.find(e => e.uuid === line_uuid)!.stopPosition = undefined;
        } else {
            temp.find(e => e.uuid === line_uuid)!.stopPosition = this._store.currentMousePosition;
            temp.find(e => e.uuid === line_uuid)!.stopRef = undefined;
        }
        this._store.lines = temp;
        this._store.focusLine = null;
        this._store.actionType = ActionType.None;
    }

    @action.bound
    public setBoxState(key: number, newState: BoxState): void {
        const temp = [...this._store.boxes];
        if (newState.isSelect) temp.filter((e, k) => k !== key).forEach(e => {
            e.state.isSelect = false;
        })
        temp[key].state = newState;
        this._store.boxes = temp;
        this.onBoxChanges();
    }

    @action.bound
    public startDrawing(): void {
        if (!this._store.focusEntity) return;
        const temp = [...this._store.lines];
        const line: Line = {
            uuid: uuidv4(),
            startRef: this._store.focusEntity.ref,
            startPoint: this._store.focusEntity,
            stopPosition: this._store.currentMousePosition,
            startType: LineType.OnlyOne,
            stopType: LineType.More,
            state: {
                isFocus: false
            }
        }
        temp.push(line)
        this._store.focusLine = line;
        this._store.lines = temp;
        this._store.actionType = ActionType.Draw;
    }

    @action.bound
    private checkAction(): ActionType {
        let isFocusing, isDragging, isDrawingReady = false;
        let _focusEntity = null;
        this._store.boxes.forEach(e => {
            if (e.state.isDragging) isDragging = true;
            if (e.state.isHover) isFocusing = true;
            if (e.state.pointAiming) {
                // setFocusEntity(e.state.pointAiming);
                _focusEntity = e.state.pointAiming;
                isDrawingReady = true;
            }
        })
        this._store.focusEntity = _focusEntity;
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

    @action
    public setCurrentMousePosition(pos: Position): void {
        this._store.currentMousePosition = pos;
        this.currentMousePosition = pos;
        if (this._store.actionType === ActionType.Draw && this._store.focusLine) {
            const temp = [...this._store.lines];
            temp.find(e => e.uuid === this._store.focusLine!.uuid)!.stopPosition = pos;
            this._store.lines = temp;
        }
    }

}

export type TDrawerStore = typeof DrawerStore

export const DrawerStoreContext = createContext<DrawerStore | null>(null)

export const useDrawerStore = (): DrawerStore => {
    const store = useContext(DrawerStoreContext)
    if (!store) {
        throw new Error('Store not found')
    }
    return store
}
