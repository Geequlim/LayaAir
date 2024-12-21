import { Config3D } from "../../../../Config3D";
import { Laya } from "../../../../Laya";
import { Laya3DRender } from "../../../d3/RenderObjs/Laya3DRender";
import { SceneRenderManagerOBJ } from "../../../d3/core/scene/SceneRenderManagerOBJ";
import { LayaGL } from "../../../layagl/LayaGL";
import { NotImplementedError } from "../../../utils/Error";
import { IInstanceRenderBatch, IInstanceRenderElement3D, IRender3DProcess, IRenderContext3D } from "../../DriverDesign/3DRenderPass/I3DRenderPass";
import { I3DRenderPassFactory } from "../../DriverDesign/3DRenderPass/I3DRenderPassFactory";
import { DrawNodeCMDData, BlitQuadCMDData, DrawElementCMDData, SetViewportCMD, SetRenderTargetCMD } from "../../DriverDesign/3DRenderPass/IRender3DCMD";
import { ISceneRenderManager } from "../../DriverDesign/3DRenderPass/ISceneRenderManager";
import { SetRenderDataCMD, SetShaderDefineCMD } from "../../DriverDesign/RenderDevice/IRenderCMD";
import { GLESEngine } from "../RenderDevice/GLESEngine";
import { GLESSetRenderData, GLESSetShaderDefine } from "../RenderDevice/GLESRenderCMD";
import { GLESDirectLightShadowRP } from "./GLESDirectLightShadowRP";
import { GLESForwardAddClusterRP } from "./GLESForwardAddClusterRP";
import { GLESForwardAddRP } from "./GLESForwardAddRP";
import { GLESRender3DProcess } from "./GLESRender3DProcess";
import { GLESBlitQuadCMDData, GLESDrawElementCMDData, GLESDrawNodeCMDData, GLESSetRenderTargetCMD, GLESSetViewportCMD } from "./GLESRenderCMD/GLES3DRenderCMD";
import { GLESRenderContext3D } from "./GLESRenderContext3D";
import { GLESRenderElement3D } from "./GLESRenderElement3D";
import { GLESSkinRenderElement3D } from "./GLESSkinRenderElement3D";
import { GLESSpotLightShadowRP } from "./GLESSpotLightShadowRP";

export class GLES3DRenderPassFactory implements I3DRenderPassFactory {
    createInstanceBatch(): IInstanceRenderBatch {
        throw new NotImplementedError();
    }

    createRender3DProcess(): IRender3DProcess {
        return new GLESRender3DProcess();
    }

    createRenderContext3D(): IRenderContext3D {
        return new GLESRenderContext3D();
    }

    createSetRenderDataCMD(): SetRenderDataCMD {
        return new GLESSetRenderData();
    }

    createSetShaderDefineCMD(): SetShaderDefineCMD {
        return new GLESSetShaderDefine();
    }

    createDrawNodeCMDData(): DrawNodeCMDData {
        return new GLESDrawNodeCMDData();
    }

    createBlitQuadCMDData(): BlitQuadCMDData {
        return new GLESBlitQuadCMDData();
    }

    createDrawElementCMDData(): DrawElementCMDData {
        return new GLESDrawElementCMDData();
    }

    createSetViewportCMD(): SetViewportCMD {
        return new GLESSetViewportCMD();
    }

    createSetRenderTargetCMD(): SetRenderTargetCMD {
        return new GLESSetRenderTargetCMD();
    }

  
    createSceneRenderManager(): ISceneRenderManager {
        return new SceneRenderManagerOBJ();
    }
    createSkinRenderElement(): GLESSkinRenderElement3D {
        return new GLESSkinRenderElement3D();
    }

    createInstanceRenderElement3D(): IInstanceRenderElement3D {
        throw new NotImplementedError();
    }

    createDirectLightShadowRP(): GLESDirectLightShadowRP {
        return new GLESDirectLightShadowRP();
    }

    createSpotLightShadowRP(): GLESSpotLightShadowRP {
        return new GLESSpotLightShadowRP();
    }

    createForwardAddRP(): GLESForwardAddRP {
        return new GLESForwardAddRP();
    }

    createForwardAddCluster(): GLESForwardAddClusterRP {
        return new GLESForwardAddClusterRP();
    }


    createRenderElement3D(): GLESRenderElement3D {
        return new GLESRenderElement3D();
    }
}

Laya.addBeforeInitCallback(() => {
    if (!Laya3DRender.Render3DPassFactory)
        Laya3DRender.Render3DPassFactory = new GLES3DRenderPassFactory();
})
