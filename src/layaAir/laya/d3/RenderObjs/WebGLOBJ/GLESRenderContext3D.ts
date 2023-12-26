import { RenderClearFlag } from "../../../RenderEngine/RenderEnum/RenderClearFlag";
import { PipelineMode } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/IRenderContext3D";
import { IRenderElement } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/IRenderElement";
import { ShaderData } from "../../../RenderEngine/RenderShader/ShaderData";
import { LayaGL } from "../../../layagl/LayaGL";
import { Color } from "../../../maths/Color";
import { Vector4 } from "../../../maths/Vector4";
import { RenderTexture } from "../../../resource/RenderTexture";
import { SingletonList } from "../../../utils/SingletonList";
import { IRenderContext3D } from "../../RenderDriverLayer/IRenderContext3D";
import { IBaseRenderNode } from "../../RenderDriverLayer/Render3DNode/IBaseRenderNode";
import { Viewport } from "../../math/Viewport";


export class GLESRenderContext3D implements IRenderContext3D {
    /**@internal */
    private _sceneData: ShaderData;
    /**@internal */
    private _cameraData: ShaderData;
    /**@internal */
    private _renderTarget: RenderTexture;
    /**@internal */
    private _viewPort: Viewport;
    /**@internal */
    private _scissor: Vector4;
    /**@internal */
    private _sceneUpdataMask: number;
    /**@internal */
    private _cameraUpdateMask: number;
    /**@internal */
    private _pipelineMode: PipelineMode;
    /**@internal */
    private _invertY: boolean;
    /**@internal */
    private _clearFlag: number;
    /**@internal */
    private _clearColor: Color;
    /**@internal */
    private _clearDepth: number;
    /**@internal */
    private _clearStencil: number;


    get sceneData(): ShaderData {
        return this._sceneData;
    }

    set sceneData(value: ShaderData) {
        this._sceneData = value;
    }


    get cameraData(): ShaderData {
        return this._cameraData;
    }

    set cameraData(value: ShaderData) {
        this._cameraData = value;
    }


    get renderTarget(): RenderTexture {
        return this._renderTarget;
    }

    set renderTarget(value: RenderTexture) {
        this._clearFlag = RenderClearFlag.Nothing;
        this._renderTarget = value;
    }


    get viewPort(): Viewport {
        return this._viewPort;
    }

    set viewPort(value: Viewport) {
        this._viewPort = value;
    }


    get scissor(): Vector4 {
        return this._scissor;
    }

    set scissor(value: Vector4) {
        this._scissor = value;
    }


    get sceneUpdataMask(): number {
        return this._sceneUpdataMask;
    }

    set sceneUpdataMask(value: number) {
        this._sceneUpdataMask = value;
    }


    get cameraUpdateMask(): number {
        return this._cameraUpdateMask;
    }

    set cameraUpdateMask(value: number) {
        this._cameraUpdateMask = value;
    }


    get pipelineMode(): PipelineMode {
        return this._pipelineMode;
    }

    set pipelineMode(value: PipelineMode) {
        this._pipelineMode = value;
    }


    get invertY(): boolean {
        return this._invertY;
    }

    set invertY(value: boolean) {
        this._invertY = value;
    }

    /**
     * <code>GLESRenderContext3D<code/>
     */
    constructor() {
        this._clearColor = new Color();
    }

    setClearData(clearFlag: number, color: Color, depth: number, stencil: number): number {
        this._clearFlag = clearFlag;
        color.cloneTo(this._clearColor);
        this._clearDepth = depth;
        this._clearStencil = stencil;
        return 0;
    }

    drawRenderElementList(list: SingletonList<IRenderElement>): number {
        this._bindRenderTarget();
        this._start();
        var elements = list.elements;
        //for pre;
        //for render;
        for (var i: number = 0, n: number = list.length; i < n; i++){
           //elements[i]._render(this);//render
        }
        this._end();
        return 0;
    }

    drawRenderElementOne(node: IRenderElement): number {
        this._bindRenderTarget();
        this._start();
        //node preRender;
        //node render;
        this._end();
        return 0;
    }

    private _bindRenderTarget() {
        this._renderTarget && this._renderTarget._start();
    }

    private _start() {
        LayaGL.renderEngine.viewport(this._viewPort.x, this._viewPort.y, this._viewPort.width, this._viewPort.height);
        LayaGL.renderEngine.scissor(this._scissor.x, this._scissor.y, this._scissor.z, this._scissor.w);
        if (this._clearFlag != RenderClearFlag.Nothing)
            LayaGL.renderEngine.clearRenderTexture(this._clearFlag, this._clearColor, this._clearDepth, this._clearStencil);
    }

    private _end() {
        //TODO
    }
}