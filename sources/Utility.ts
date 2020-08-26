module Utility {

    export function fixDegrees(deg: number) {
        return deg - (Math.floor(deg / 360.0) * 360.0);
    }

    export function color_hsl(h: number, s = 100, l = 50): string {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    export function color_hsla(h: number, s = 100, l = 50, a = 1.0): string {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }

    export function color_rgb(r: number, g: number, b: number) {
        return `rgb(${r}, ${g}, ${b})`;
    }

    export function color_rgba(r: number, g: number, b: number, a = 1.0) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    export function debug_value(selector: string, value: string): void {
        let el;
        if ((el = document.querySelector(selector))) el.innerHTML = value;
    }

    export abstract class GraphicCanvas {

        private readonly canvas: HTMLCanvasElement;
        public readonly ctx: CanvasRenderingContext2D;

        constructor(_canvas?: HTMLCanvasElement) {
            if (!_canvas) _canvas = document.createElement('canvas');

            this.canvas = _canvas;
            this.ctx = this.canvas.getContext('2d');
        }

        public abstract render();

        public resize(width: number, height: number) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        public getBuffer() {
            return this.canvas;
        }

    }

}
