import { createContext, useContext } from "react"
import { Position } from "../model/Drawer"
export type DrawerContextContent = {
    pos : Position
}
export const DrawerContext = createContext<DrawerContextContent>({
    pos : {
        x : 0,
        y : 0
    }
})
export const useDrawerContext = () => useContext(DrawerContext)