import { observable, action } from 'mobx';
import { createContext, useContext } from 'react';
import { Position } from '../model/Drawer';

type TStore = {
    currentMousePosition : Position
}

interface IDrawerStore {
    store : TStore
}

export default class DrawerStore implements IDrawerStore {

    @observable
    private _store : TStore = {
        currentMousePosition : {x : 0, y : 0}
    }

    get store () : TStore {
        return this._store;
    }

    @action.bound
    setCurrentMousePosition (pos : Position) : void {
        this._store.currentMousePosition = pos;
    }

}

export type TDrawerStore = typeof DrawerStore

export const DrawerStoreContext = createContext<DrawerStore | null>(null)

export const useDrawerStore = () : DrawerStore => {
    const store = useContext(DrawerStoreContext)
    if (!store) {
        throw new Error('Store not found')
    }
    return store
}
