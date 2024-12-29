import { Node } from "../display/Node";
import { Resource } from "./Resource";

/**
 * @en Prefab class.
 * @zh 预制体类。
 */
export class Prefab extends Resource {
    /**
     * @ignore
     */
    constructor() {
        super(false);

        this._traceDeps = true;
    }

    /**
     * @en If the prefab is loaded from a url, call this method to enable management of the prefab by the resource manager.
     * @zh 如果预制体是从 URL 加载的，则调用此方法以启用资源管理器对预制体的管理。
     */
    onLoad(): this {
        Resource._idResourcesMap[this._id] = this;
        return this;
    }

    /**
     * @en Create an instance of the prefab.
     * @param options Instantiation options.
     * @param errors Error content.
     * @zh 创建一个预制体的实例。
     * @param options 实例化选项
     * @param errors 错误内容
     */
    create(options?: Record<string, any>, errors?: Array<any>): Node {
        return null;
    }
}

//旧版本兼容
export type HierarchyResource = Prefab;
export var HierarchyResource = Prefab;