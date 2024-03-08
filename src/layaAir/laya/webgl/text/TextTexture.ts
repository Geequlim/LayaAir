import { RenderInfo } from "../../renders/RenderInfo"
import { Resource } from "../../resource/Resource"
import { CharRenderInfo } from "./CharRenderInfo"
import { ILaya } from "../../../ILaya";
import { Texture2D } from "../../resource/Texture2D";
import { TextureFormat } from "../../RenderEngine/RenderEnum/TextureFormat";
import { FilterMode } from "../../RenderEngine/RenderEnum/FilterMode";
import { WrapMode } from "../../RenderEngine/RenderEnum/WrapMode";
import { TextAtlas } from "./TextAtlas";
import { LayaEnv } from "../../../LayaEnv";
import { TextRender } from "./TextRender";
import { LayaGL } from "../../layagl/LayaGL";

/**
 * 保存文字的贴图
 */
export class TextTexture extends Resource {
    private static pool: any[] = new Array(10); // 回收用
    private static poolLen = 0;
    private static cleanTm = 0;

    /**@internal */
    _source: Texture2D;	// webgl 贴图
    /**@internal */
    _texW = 0;
    /**@internal */
    _texH = 0;
    /**@internal */
    _discardTm = 0;			//释放的时间。超过一定时间会被真正删除
    genID = 0; 				// 这个对象会重新利用，为了能让引用他的人知道自己引用的是否有效，加个id
    bitmap: any = { id: 0, _glTexture: null };						//samekey的判断用的
    curUsedCovRate = 0; 	// 当前使用到的使用率。根据面积算的
    curUsedCovRateAtlas = 0; 	// 大图集中的占用率。由于大图集分辨率低，所以会浪费一些空间
    lastTouchTm = 0;
    ri: CharRenderInfo = null; 		// 如果是独立文字贴图的话带有这个信息
    //public var isIso:Boolean = false;
    get gammaCorrection(): number {
        return (this.bitmap._glTexture as any).gammaCorrection;
    }
    constructor(textureW: number, textureH: number) {
        super();
        this._texW = textureW || TextRender.atlasWidth;
        this._texH = textureH || TextRender.atlasWidth;
        this.bitmap.id = this.id;
        this.lock = true;//防止被资源管理清除
    //    this._render2DContext = LayaGL.render2DContext;
    }

    recreateResource(): void {
        if (this._source)
            return;
        var glTex: Texture2D = this._source = new Texture2D(this._texW, this._texH, TextureFormat.R8G8B8A8, false, false, true);
        glTex.setPixelsData(null, true, false);
        glTex.lock = true;
        this.bitmap._glTexture = glTex;

        this._source.filterMode = FilterMode.Bilinear;
        this._source.wrapModeU = WrapMode.Clamp;
        this._source.wrapModeV = WrapMode.Clamp;

        //TODO 预乘alpha
        if (TextRender.debugUV) {
            this.fillWhite();
        }
    }

    /**
     * 添加一个文字位图
     * @param	data
     * @param	x			拷贝位置。
     * @param	y
     * @param  uv  
     * @return uv数组  如果uv不为空就返回传入的uv，否则new一个数组
     */
    addChar(data: ImageData, x: number, y: number, uv: any[] = null): any[] {
        //if (!LayaEnv.isConch &&  !__JS__('(data instanceof ImageData)')) {
        if (TextRender.isWan1Wan) {
            return this.addCharCanvas(data, x, y, uv);
        }
        var dt: any = data.data;
        if (data.data instanceof Uint8ClampedArray)
            dt = new Uint8Array(dt.buffer);
        !this._source && this.recreateResource();

        LayaGL.textureContext.setTextureSubPixelsData(this._source._texture, dt, 0, false, x, y, data.width, data.height, true, false);
        var u0: number;
        var v0: number;
        var u1: number;
        var v1: number;
        u0 = x / this._texW;
        v0 = y / this._texH;
        u1 = (x + data.width) / this._texW;
        v1 = (y + data.height) / this._texH;
        uv = uv || new Array(8);
        uv[0] = u0, uv[1] = v0;
        uv[2] = u1, uv[3] = v0;
        uv[4] = u1, uv[5] = v1;
        uv[6] = u0, uv[7] = v1;
        return uv;
    }

    /**
     * 添加一个文字
     * 玩一玩不支持 getImageData，只能用canvas的方式
     * @param	canv
     * @param	x
     * @param	y
     */
    addCharCanvas(canv: any, x: number, y: number, uv: any[] = null): any[] {
        !this._source && this.recreateResource();

        LayaGL.textureContext.setTextureSubImageData(this._source._texture, canv, x, y, true, false);
        var u0: number;
        var v0: number;
        var u1: number;
        var v1: number;
        if (LayaEnv.isConch) {
            u0 = x / this._texW;		// +1 表示内缩一下，反正文字总是有留白。否则会受到旁边的一个像素的影响
            v0 = y / this._texH;
            u1 = (x + canv.width) / this._texW;
            v1 = (y + canv.height) / this._texH;
        } else {
            u0 = (x + 1) / this._texW;		// +1 表示内缩一下，反正文字总是有留白。否则会受到旁边的一个像素的影响
            v0 = (y + 1) / this._texH;
            u1 = (x + canv.width - 1) / this._texW;
            v1 = (y + canv.height - 1) / this._texH;
        }
        uv = uv || new Array(8);
        uv[0] = u0, uv[1] = v0;
        uv[2] = u1, uv[3] = v0;
        uv[4] = u1, uv[5] = v1;
        uv[6] = u0, uv[7] = v1;
        return uv;
    }

    /**
     * 填充白色。调试用。
     */
    fillWhite(): void {
        !this._source && this.recreateResource();
        var dt = new Uint8Array(this._texW * this._texH * 4);
        dt.fill(0xff);
        LayaGL.textureContext.setTextureImageData(this._source._getSource(), dt as any, true, false);
    }

    discard(): void {
        // 文字贴图的释放要触发全局cacheas normal无效
        ILaya.stage.setGlobalRepaint();
        // 不再使用问题贴图的重用，否则会有内容清理问题
        this.destroy();
        return;
    }

    static getTextTexture(w: number, h: number): TextTexture {
        // 不再回收
        return new TextTexture(w, h);
    }
    /**
     * @override
     */
    protected _disposeResource(): void {
        //console.log('destroy TextTexture');
        this._source && this._source.destroy();
        this._source = null;
    }

    /**
     * 定期清理
     * 为了简单，只有发生 getAPage 或者 discardPage的时候才检测是否需要清理
     */
    static clean(): void {
        var curtm = RenderInfo.loopStTm;// Laya.stage.getFrameTm();
        if (TextTexture.cleanTm === 0) TextTexture.cleanTm = curtm;
        if (curtm - TextTexture.cleanTm >= TextRender.checkCleanTextureDt) {	//每10秒看看pool中的贴图有没有很老的可以删除的
            for (var i = 0; i < TextTexture.poolLen; i++) {
                var p: TextTexture = TextTexture.pool[i];
                if (curtm - p._discardTm >= TextRender.destroyUnusedTextureDt) {//超过20秒没用的删掉
                    p.destroy();					//真正删除贴图
                    TextTexture.pool[i] = TextTexture.pool[TextTexture.poolLen - 1];
                    TextTexture.poolLen--;
                    i--;	//这个还要处理，用来抵消i++
                }
            }
            TextTexture.cleanTm = curtm;
        }
    }

    touchRect(ri: CharRenderInfo, curloop: number): void {
        if (this.lastTouchTm != curloop) {
            //每帧的第一次覆盖率都清零，然后随着touch覆盖率逐渐增加
            this.curUsedCovRate = 0;
            this.curUsedCovRateAtlas = 0;
            this.lastTouchTm = curloop;
        }
        var texw2 = TextRender.atlasWidth * TextRender.atlasWidth;
        var gridw2 = TextAtlas.atlasGridW * TextAtlas.atlasGridW;
        this.curUsedCovRate += (ri.bmpWidth * ri.bmpHeight) / texw2;
        this.curUsedCovRateAtlas += (Math.ceil(ri.bmpWidth / TextAtlas.atlasGridW) * Math.ceil(ri.bmpHeight / TextAtlas.atlasGridW)) / (texw2 / gridw2);
    }

    // 为了与当前的文字渲染兼容的补丁
    get texture(): any {
        return this;
    }
    /**@internal */
    _getSource(): any {
        return this._source._getSource();
    }
}
