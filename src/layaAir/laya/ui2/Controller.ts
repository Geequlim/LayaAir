import { EventDispatcher } from "../events/EventDispatcher";
import { UIEventType } from "./UIEvent";
import type { GWidget } from "./GWidget";

export class Controller extends EventDispatcher {
    private _selectedIndex: number;
    private _previousIndex: number;
    private _pages: string[];

    public owner: GWidget;
    public name: string;

    public changing: boolean;

    constructor() {
        super();

        this.name = "";
        this._pages = [];
        this._selectedIndex = -1;
        this._previousIndex = -1;
    }

    public get pages(): Array<string> {
        return this._pages;
    }

    public set pages(value: Array<string>) {
        this._pages = value;

        if (value.length > 0 && this._selectedIndex == -1)
            this.selectedIndex = 0;
    }

    public get numPages() {
        return this._pages.length;
    }

    public set numPages(value: number) {
        this._pages.length = value;
        for (let i = 0; i < value; i++)
            if (this._pages[i] == null) this._pages[i] = "";
    }

    public addPage(name?: string) {
        name = name || "";
        this._pages.push(name);

        if (this._selectedIndex == -1)
            this.selectedIndex = 0;

        return this;
    }

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    public set selectedIndex(value: number) {
        if (this._pages.length == 0)
            return;

        if (this._selectedIndex != value) {
            if (value > this._pages.length - 1) {
                console.warn("index out of bounds: " + value);
                return;
            }

            this._previousIndex = this._selectedIndex;
            this._selectedIndex = value;

            this.changing = true;
            this.event(UIEventType.changed);
            this.changing = false;
        }
    }

    public get selectedPage(): string {
        if (this._selectedIndex < 0 || this._selectedIndex >= this._pages.length)
            return null;
        else
            return this._pages[this._selectedIndex];
    }

    public set selectedPage(value: string) {
        let i = this._pages.indexOf(value);
        if (i == -1)
            i = 0;
        this.selectedIndex = i;
    }

    public get previousIndex(): number {
        return this._previousIndex;
    }

    public set oppositeIndex(value: number) {
        if (value > 0)
            this.selectedIndex = 0;
        else if (this._pages.length > 1)
            this.selectedIndex = 1;
    }
}