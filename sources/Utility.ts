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

}
