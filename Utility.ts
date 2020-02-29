/**
 MIT License

 Copyright (c) 2020 Felix Vogel

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

module Utility {

    export class Color {

        private r: number;
        private g: number;
        private b: number;
        private a: number;

        constructor(r: number, g: number, b: number, a: number = 255) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        public fromRGBA(r: number, g: number, b: number, a: number): Color {
            this.r = Math.max(0, Math.min(255, r));
            this.g = Math.max(0, Math.min(255, g));
            this.b = Math.max(0, Math.min(255, b));
            this.a = Math.max(0, Math.min(255, a));

            return this;
        }

        public toRGBA(a: number = this.a): string {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
        }

        public fromRGB(r: number, g: number, b: number): Color {
            return this.fromRGBA(r, g, b, 255);
        }

        public toRGB(): string {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }

        public fromHex(hex: string): Color {
            if (!hex.match(/^#(:?[0-9a-fA-F]{2}){1,3}$/g)) return this;

            hex = hex.substr(1);

            for (let i = 0; i < hex.length; i += 2) {
                let parsed = parseInt(hex.substr(i, 2), 16);
                switch (i) {
                    case 0: {
                        this.r = parsed;
                        break;
                    }

                    case 2: {
                        this.g = parsed;
                        break;
                    }

                    case 4: {
                        this.b = parsed;
                        break;
                    }

                    default:
                        break;
                }

            }

            return this;
        }

        public toHex(): string {
            return `#${(this.r < 16 ? '0' : '') + this.r.toString(16)}${(this.g < 16 ? '0' : '') + this.g.toString(16)}${(this.b < 16 ? '0' : '') + this.b.toString(16)}`;
        }

    }

    export class Cookie {

        public static getCookie(name: string): Cookie {
            let index = document.cookie.indexOf(`${name}=`);

            if (index === -1) return null;

            let s = document.cookie.substr(index);

            if (s.indexOf('; ') !== -1) s = s.substring(0, s.indexOf('; '));

            let split = s.split('=');

            return new Cookie(split[0], split[1]);
        }

        public static getCookieOrSet(name: string, defaultValue: string): Cookie {
            let cookie = Cookie.getCookie(name);

            if (!cookie) {
                cookie = new Cookie(name, defaultValue);

                cookie.add();
            }

            return cookie;
        }

        // Class

        private readonly name: string;

        private value: string;
        private expires: Date;

        constructor(name: string, value: string) {
            this.name = name;
            this.value = value;
            this.expires = new Date();

            // Cookie by default 7 days valid
            this.expires.setTime(this.expires.getTime() + (7 * 24 * 60 * 60 * 1000));
        }

        public setExpirationDate(date: Date): Cookie {
            this.expires = date;
            return this;
        }

        public getName(): string {
            return this.name;
        }

        public getValue(): string {
            return this.value;
        }

        public setValue(value: string): Cookie {
            this.value = value;
            return this;
        }

        public add(): void {
            document.cookie = `${this.name}=${this.value}; expires=${this.expires.toUTCString()}; path=/`;
        }

        public remove(): void {
            let date = new Date();

            date.setTime(date.getTime() - (24 * 60 * 60 * 1000));

            document.cookie = `${this.name}=; expires=${date.toUTCString()}; path=/`;
        }

    }

}
