import { LayaEnv } from "../../LayaEnv";
import { Event } from "../events/Event";
import { Controller } from "./Controller";
import { UIEventType } from "./UIEvent";
import type { GWidget } from "./GWidget";

export class ControllerRef {
    private _target: GWidget;
    private _name: string;
    private _inst: Controller;
    private _inited: boolean;

    public onChanged: Function;

    constructor(target: GWidget, name: string);
    constructor(inst: Controller);
    constructor(target: GWidget | Controller, name?: string) {
        if (arguments.length == 2) {
            this._target = <GWidget>target;
            this._name = name || "";
        }
        else {
            this._target = (<Controller>target).owner;
            this._name = (<Controller>target).name;
        }
        this._inst = null;
    }

    public get target() {
        return this._target;
    }

    public get name() {
        return this._name;
    }

    public get inst() {
        return this._inst;
    }

    public get selectedIndex(): number {
        return this._inst ? this._inst.selectedIndex : -1;
    }

    public set selectedIndex(value: number) {
        if (this._inst)
            this._inst.selectedIndex = value;
    }

    public get selectedPage(): string {
        return this._inst ? this._inst.selectedPage : "";
    }

    public set selectedPage(value: string) {
        if (this._inst)
            this._inst.selectedPage = value;
    }

    public get previousIndex(): number {
        return this._inst ? this._inst.selectedIndex : 0;
    }

    public set oppositeIndex(value: number) {
        if (this._inst)
            this._inst.oppositeIndex = value;
    }

    release() {
        if (this._inited) {
            this._inited = false;
            this._target.off(UIEventType.controllers_changed, this, this._check);
            if (!LayaEnv.isPlaying)
                this._target.off(UIEventType.instance_reload, this, this._reload);
            if (this._inst) {
                this._inst.off(UIEventType.changed, this, this._onChanged);
                this._inst = null;
            }
        }
    }

    validate() {
        if (!this._inited) {
            this._inited = true;
            this._target.on(UIEventType.controllers_changed, this, this._check);
            if (!LayaEnv.isPlaying)
                this._target.on(UIEventType.instance_reload, this, this._reload);
            this._check(null);
        }
    }

    private _reload(newIns: any) {
        this._target = newIns;
        this._check(Event.EMPTY);
    }

    private _check(evt: Event) {
        let c = this._target.getController(this._name);
        if (c != this._inst) {
            if (this._inst)
                this._inst.off(UIEventType.changed, this, this._onChanged);
            this._inst = c;
            if (c)
                c.on(UIEventType.changed, this, this._onChanged);
            if (evt != null)
                this._onChanged();
        }
    }

    private _onChanged() {
        this.onChanged();
    }
}