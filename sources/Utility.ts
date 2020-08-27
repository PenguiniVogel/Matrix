/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
module Utility {

    // --- Math

    export function fixDegrees(deg: number): number {
        return deg - (Math.floor(deg / 360.0) * 360.0);
    }

    // --- UID

    const UID_CHARSET: string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    export function getUID(prefix = 'uid', segmentCount = 4, segmentLength = 4): string {
        if (prefix.length < 1 || segmentCount < 1 || segmentLength < 1) throw new Error('The specified arguments are not valid');

        let result = `${prefix}`;

        for (let u = 0; u < segmentCount; u ++) {
            result += '-';
            for (let i = 0; i < segmentLength; i ++) {
                result += `${UID_CHARSET[Math.floor(Math.random() * UID_CHARSET.length)]}`;
            }
        }

        return result;
    }

    // --- Color

    export function color_hsl(h: number, s = 100, l = 50): string {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    export function color_hsla(h: number, s = 100, l = 50, a = 1.0): string {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }

    export function color_rgb(r: number, g: number, b: number): string {
        return `rgb(${r}, ${g}, ${b})`;
    }

    export function color_rgba(r: number, g: number, b: number, a = 1.0): string {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // --- Debug

    interface DebugHandle {
        id: string
    }

    export function debug_create(parentSelector: string): DebugHandle {
        let el;
        if ((el = document.querySelector(parentSelector))) {
            let id = getUID('debug');
            let span = document.createElement('span');
            span.id = id;

            el.appendChild(span);

            return {
                id: id
            };
        }

        return null;
    }

    export function debug_value(handle: DebugHandle, value: string): void {
        let el;
        if (handle && handle.id && (el = document.querySelector(handle.id))) el.innerHTML = value;
    }

    // --- Graphics

    export abstract class GraphicCanvas {

        private readonly canvas: HTMLCanvasElement;
        public readonly ctx: CanvasRenderingContext2D;

        protected constructor(_canvas?: HTMLCanvasElement) {
            if (!_canvas) _canvas = document.createElement('canvas');

            this.canvas = _canvas;
            this.ctx = this.canvas.getContext('2d');
        }

        public abstract render(): void;

        public resize(width: number, height: number): void {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        public getBuffer(): HTMLCanvasElement {
            return this.canvas;
        }

    }

}
