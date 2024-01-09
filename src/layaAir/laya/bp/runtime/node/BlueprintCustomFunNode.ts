import { IBluePrintSubclass } from "../../core/interface/IBluePrintSubclass";
import { INodeManger } from "../../core/interface/INodeManger";
import { TBPEventProperty, TBPNode } from "../../datas/types/BlueprintTypes";
import { IRunAble } from "../interface/IRunAble";
import { BlueprintFunNode } from "./BlueprintFunNode";

export class BlueprintCustomFunNode extends BlueprintFunNode {
    functionID: string;

    protected onParseLinkData(node: TBPNode, manger: INodeManger<BlueprintFunNode>) {
        if (node.dataId) {
            this.functionID = "";
            //this.eventName = (manger.dataMap[node.dataId] as TBPEventProperty).name;
        }
    }

    protected excuteFun(context: IRunAble, caller: IBluePrintSubclass, parmsArray: any[]) {
        //TODO 
        if (caller && caller.context) {
            return caller.bp.runCustomFun(caller.context, this.functionID, parmsArray);
        }
        return context.excuteFun(this.nativeFun, this.outPutParmPins, caller, parmsArray);
    }


    setFunction(fun: Function, isMember: boolean) {
        this.nativeFun = this.customFun;//fun;
        this.isMember = isMember;
        this.funcode = fun?.name;
    }


    customFun(parms: any[]) {

    }
}