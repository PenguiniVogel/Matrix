/**
 https://github.com/FelixVogel/Matrix
 Copyright (c) 2020 Felix Vogel

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

module Utility {

    export class Color {

        public static fromRGBA(r: number, g: number, b: number, a: number = 255): Color {
            return new Color(r, g, b, a);
        }

        public static fromHex(hex: string): Color {
            if (!hex.match(/^#(:?[0-9a-fA-F]{2}){1,3}$/g)) return null;

            let r, g, b;

            hex = hex.substr(1);

            for (let i = 0; i < hex.length; i += 2) {
                let parsed = parseInt(hex.substr(i, 2), 16);
                switch (i) {
                    case 0: {
                        r = parsed;
                        break;
                    }

                    case 2: {
                        g = parsed;
                        break;
                    }

                    case 4: {
                        b = parsed;
                        break;
                    }

                    default:
                        break;
                }

            }

            return this.fromRGBA(r, g, b);
        }

        // Class

        private readonly r: number;
        private readonly g: number;
        private readonly b: number;
        private readonly a: number;

        constructor(r: number, g: number, b: number, a: number = 255) {
            this.r = Math.max(0, Math.min(255, r));
            this.g = Math.max(0, Math.min(255, g));
            this.b = Math.max(0, Math.min(255, b));
            this.a = Math.max(0, Math.min(255, a));
        }

        public toRGBA(a: number = this.a): string {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
        }

        public toRGB(): string {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }

        public toHex(): string {
            return `#${(this.r < 16 ? '0' : '') + this.r.toString(16)}${(this.g < 16 ? '0' : '') + this.g.toString(16)}${(this.b < 16 ? '0' : '') + this.b.toString(16)}`;
        }

    }

    export function forEach<T>(array: T[], callback: (item: T, index?: number) => void): void {
        for (let i = 0, l = array.length; i < l; i ++) {
            callback(array[i], i);
        }
    }

    export function capsule(func: () => void): void {
        func();
    }

}
