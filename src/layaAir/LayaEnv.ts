export class LayaEnv {
    static version: string = "3.0.0rc";
    static isPlaying: boolean = true;
    static isConch: boolean = (<any>window).conch != null;
}