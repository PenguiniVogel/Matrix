declare module Utility {
    function fixDegrees(deg: number): number;
    function color_hsl(h: number, s?: number, l?: number): string;
    function color_hsla(h: number, s?: number, l?: number, a?: number): string;
    function color_rgb(r: number, g: number, b: number): string;
    function color_rgba(r: number, g: number, b: number, a?: number): string;
    function debug_value(selector: string, value: string): void;
    abstract class GraphicCanvas {
        private readonly canvas;
        readonly ctx: CanvasRenderingContext2D;
        constructor(_canvas?: HTMLCanvasElement);
        abstract render(): any;
        resize(width: number, height: number): void;
        getBuffer(): HTMLCanvasElement;
    }
}
declare module MatrixFX {
    abstract class FX {
        buffer: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        constructor();
        fx_buffer(width: number, height: number): void;
        fx_render(interval: number, width: number, height: number): HTMLCanvasElement;
        abstract render(interval: number, width: number, height: number): void;
    }
    class BasicColumnFX extends FX {
        private hueOffset;
        render(interval: number, width: number, height: number): void;
    }
    class BasicLetterFX extends FX {
        private hueOffset;
        render(interval: number, width: number, height: number): void;
    }
}
declare module Matrix {
    const DEFAULT_SIZE = 300;
    const DEFAULT_COLOR = "#44ff00";
    const DEFAULT_SYMBOLS = "\uFF66\uFF71\uFF73\uFF74\uFF75\uFF76\uFF77\uFF79\uFF7A\uFF7B\uFF7C\uFF7D\uFF7E\uFF7F\uFF80\uFF82\uFF83\uFF85\uFF86\uFF87\uFF88\uFF8A\uFF8B\uFF8E\uFF8F\uFF90\uFF91\uFF92\uFF93\uFF94\uFF95\uFF97\uFF98\uFF9C\u65E5(+*;)-|2589Z";
    const DEFAULT_SPEED = 1;
    const DEFAULT_LINE_LENGTH = 16;
    const DEFAULT_ROTATION = 0;
    const DEFAULT_UPDATE_RATE = 32;
    const DEFAULT_FX: MatrixFX.BasicColumnFX;
    const COLUMN_SIZE = 12;
    const MAX_SPEED = 32;
    const MAX_LINE_LENGTH = 32;
    interface OptionalSettings {
        size?: {
            width: number;
            height: number;
        };
        color?: string;
        symbols?: string;
        speed?: number;
        lineLength?: number;
        rotation?: number;
        updateRate?: number;
        useFX?: boolean;
        fx?: MatrixFX.FX;
    }
    function create(selector: string, settings?: OptionalSettings): void;
    function start(): void;
    function resize(_width?: number, _height?: number): void;
    function setColor(_color?: string): void;
    function setSymbols(_symbols?: string): void;
    function setSpeed(_speed?: number): void;
    function setLineLength(_lineLength?: number): void;
    function setRotation(_rotation?: number): void;
    function setUpdateRate(_ups?: number): void;
    function setUseFX(_useFX?: boolean): void;
    function setFX(_fx?: MatrixFX.FX): void;
}
