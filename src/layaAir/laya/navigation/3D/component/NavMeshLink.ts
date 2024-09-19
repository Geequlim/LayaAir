
import { Component } from "../../../components/Component";
import { Matrix4x4 } from "../../../maths/Matrix4x4";
import { Vector3 } from "../../../maths/Vector3";
import { NavMeshLinkData } from "../../common/data/NavMeshLinkData";
import { BaseNav3DModifle } from "./BaseNav3DModifle";

const tempVec3 = new Vector3();
const tempVec31 = new Vector3();
/**
 * <code>NavMeshLink</code> 网格外链接。
 */
export class NavMeshLink extends BaseNav3DModifle {

    private _agentType: string;
    /**
     * 宽度
     */
    set width(value: number) {
        this._data._updateWidth(value);
    }

    get width(): number {
        return this._data._width;
    }


    /**
     * 地形标记
     */
    set areaFlag(value: string) {
        this._data.areaFlag = value;
    }

    get areaFlag(): string {
        return this._data.areaFlag;
    }

    /**
     * 区域类型
     */
    set agentType(value: string) {
        this._agentType = value;
    }

    get agentType() {
        return this._agentType;
    }

    /**
     * 是否双向
     */
    set bidirectional(value: boolean) {
        this._data._updateBidirectional(value);
    }

    get bidirectional(): boolean {
        return this._data._bidirectional;
    }

    /**
   * 起始位置
   */

    set start(value: Vector3) {
        this._data._updateStartPoint(value);
    }

    get start(): Vector3 {
        return this._data._startPoint;
    }

    /**
     * 结束位置
     */
    set end(value: Vector3) {
        this._data._updateEndPoint(value);
    }

    get end(): Vector3 {
        return this._data._endPoint;
    }

    /**
     * @ignore
     * 创建一个 <code>NavNavMeshLink</code> 实例。
     */
    constructor() {
        super();
        this._modifierData = new NavMeshLinkData();
    }

    private get _data(): NavMeshLinkData {
        return this._modifierData as NavMeshLinkData;
    }

    /**@internal */
    protected _onEnable(): void {
        super._onEnable();
        this._onWorldMatNeedChange();
        Vector3.min(this._data._startPoint, this._data._endPoint, tempVec3);
        Vector3.max(this._data._startPoint, this._data._endPoint, tempVec31);
        let surface = this._manager.getNavMeshSurfacesByBound(tempVec3, tempVec31, this._agentType);
        this._data._initSurface(surface);
    }



    /**
     * @internal
     */
    _refeashTranfrom(mat: Matrix4x4, min: Vector3, max: Vector3) {
        var data = this._data;
        mat.cloneTo(data._transfrom);
        this._modifierData._refeahTransfrom();
        Vector3.transformCoordinate(data._startPoint, mat, data.globalStart);
        Vector3.transformCoordinate(data._endPoint, mat, data.globalEnd);
    }

    /**@internal */
    _cloneTo(dest: Component): void {
        let link = dest as NavMeshLink;
        this.start.cloneTo(link.start);
        this.end.cloneTo(link.end);
        link.agentType = this.agentType;
        link.areaFlag = this.areaFlag;
        link.bidirectional = this.bidirectional;
        link.width = this.width;
        super._cloneTo(dest);
    }
}