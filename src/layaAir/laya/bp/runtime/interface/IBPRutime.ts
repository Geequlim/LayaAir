import { IRunAble } from "./IRunAble";

export interface IBPRutime {
    runByContext(context: IRunAble, currentIndex: number,enableDebugPause?:boolean):void
}