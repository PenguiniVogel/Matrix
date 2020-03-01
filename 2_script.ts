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

///<reference path="1_Utility.ts"/>
import Color = Utility.Color;
import Cookie = Utility.Cookie;
import forEach = Utility.forEach;

(function () {
    enum GradientType {
        NONE,
        ALL,
        PER
    }

    interface Options {
        textColor: Color,
        gradientType: GradientType,
        lineLength: number
    }

    const options: Options = {
        textColor : new Color(68, 255, 0),
        gradientType: GradientType.NONE,
        lineLength: 6
    };

    interface IColumnItem {
        letters : number,
        max     : number,
        letterY : number,
        erasing : boolean,
        eraseY  : number,
        delay   : number
    }

    interface IColumn {
        x        : number,
        interval : number,
        hsv      : number,
        items    : IColumnItem[]
    }

    const columns: IColumn[] = [];

    const enum Values {
        INTERVAL = 250,
        DEFAULT_TEXT_COLOR = '#44ff00',
        COOKIE_TEXT_COLOR = 'text_color',
        COOKIE_GRADIENT_TYPE = 'gradient_type',
        COOKIE_LINE_LENGTH = 'line_length',
        MAX_LINE_LENGTH = 14
    }

    // Text Color

    options.textColor.fromHex(Cookie.getCookieOrSet(Values.COOKIE_TEXT_COLOR, Values.DEFAULT_TEXT_COLOR).getValue());

    let textColorInput = <HTMLInputElement>document.querySelector('#text-color');

    textColorInput.value = options.textColor.toHex();

    textColorInput.addEventListener('input', (e: InputEvent) => {
        let hex = (<HTMLInputElement>e.target).value;

        new Cookie(Values.COOKIE_TEXT_COLOR, hex).add();

        options.textColor.fromHex(hex);
    });

    // Gradient

    let gradientTypeInput = <HTMLInputElement>document.querySelector('#gradient-type');

    options.gradientType = parseInt(Cookie.getCookieOrSet(Values.COOKIE_GRADIENT_TYPE, '0').getValue());
    gradientTypeInput.value = `${options.gradientType}`;

    const gradientTypeEvent = (inputValue: number) => {
        switch (inputValue) {
            case GradientType.NONE: {
                options.gradientType = GradientType.NONE;
                forEach(columns, column => column.hsv = 0);
                break;
            }
            case GradientType.ALL: {
                options.gradientType = GradientType.ALL;
                forEach(columns, column => column.hsv = 0);
                break;
            }
            case GradientType.PER: {
                options.gradientType = GradientType.PER;
                forEach(columns, column => column.hsv = 360 * (column.x / window.innerWidth));
                break;
            }
        }

        new Cookie(Values.COOKIE_GRADIENT_TYPE, `${inputValue}`).add();
    };

    gradientTypeInput.addEventListener('input', (e: InputEvent) => gradientTypeEvent(parseInt((<HTMLInputElement>e.target).value)));

    // Line Length

    let lineLengthInput = <HTMLInputElement>document.querySelector('#line-length');

    let lineLengthCookieValue = parseInt(Cookie.getCookieOrSet(Values.COOKIE_LINE_LENGTH, '25').getValue());
    lineLengthInput.value = `${lineLengthCookieValue}`;

    const lineLengthEvent = (inputValue: number) => {
        let value: number = Math.floor(2 + ((Values.MAX_LINE_LENGTH / 100) * inputValue));

        options.lineLength = value;
        document.querySelector('#range-value').innerHTML = `(${value})`;

        new Cookie(Values.COOKIE_LINE_LENGTH, `${inputValue}`).add();
    };

    lineLengthInput.addEventListener('input', (e) => lineLengthEvent(parseInt((<HTMLInputElement>e.target).value)));

    // Option Panel

    window.addEventListener('keyup', (e) => {
        if (e.key && e.key.toLowerCase() === 'o') {
            let options = <HTMLElement>document.querySelector('#options');

            if (options.style['display'] === '') options.style['display'] = 'none';
            else options.style['display'] = '';
        }
    });

    // Graphics

    const graphics = (): void => {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('matrix-canvas');
        const graphics: CanvasRenderingContext2D = canvas.getContext('2d');

        const resize = (e: Event): void => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize(null);
        window.addEventListener('resize', resize);

        graphics.scale(1.2, 1.2);

        const paintRect = (x: number, y: number, width: number, height: number, color: string = '#000000'): void => {
            graphics.fillStyle = color;
            graphics.fillRect(x, y, width, height);
        };

        const paintDot = (x: number, y: number, column?: IColumn): void => {
            let alpha = Math.max(0.05, Math.min(0.5, Math.random()));

            if (options.gradientType !== GradientType.NONE && column) graphics.fillStyle = `hsla(${column.hsv}, 100%, 50%, ${alpha})`;
            else graphics.fillStyle = options.textColor.toRGBA(alpha);

            graphics.fillRect(x + 5, y + 4, 2, 2);
        };

        interface IChar {
            offsetX : number,
            char    : string
        }

        const chars: IChar[] = [];

        let convertToIChar = (line: string) => {
            for (let i = 0, l = line.length; i < l; i++) {
                chars.push({
                    offsetX : Math.floor(6 - (graphics.measureText(line[i]).width / 2)),
                    char    : line[i]
                });
            }
        };

        convertToIChar('ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z');

        const createItem = (): IColumnItem => {
            return {
                letters: 0,
                max    : Math.floor(Math.random() * (options.lineLength / 2)) + (options.lineLength / 2),
                letterY: 10,
                erasing: false,
                eraseY : 0,
                delay  : Math.floor(Math.random() * 8000) + 2000
            };
        };

        const create = (x): void => {
            let column: IColumn = {
                x        : x,
                interval : Math.floor(Values.INTERVAL * Math.random()) + 150,
                hsv      : 0,
                items    : [createItem()]
            };

            columns.push(column);
        };

        for (let x: number = 1; x < window.innerWidth; x += 12) {
            if (x + 12 > window.innerWidth) break;
            for (let y: number = 0; y < window.innerHeight; y += 12) paintDot(x, y);

            create(x);
        }

        const update = (column: IColumn, delta: number): void => {
            let nextItem: boolean = false;

            if (options.gradientType !== GradientType.NONE) {
                column.hsv += 1;

                if (column.hsv >= 360) column.hsv = 0;
            }

            forEach(column.items, item => {
                if (item.delay <= 0) {
                    paintRect(column.x, item.letterY, 12, 12);

                    if (options.gradientType !== GradientType.NONE) graphics.strokeStyle = `hsl(${column.hsv}, 100%, 50%)`;
                    else graphics.strokeStyle = options.textColor.toRGB();

                    let char: IChar = chars[Math.floor(Math.random() * chars.length)];

                    graphics.strokeText(char.char, column.x + char.offsetX, item.letterY);

                    item.letterY += 12;

                    if (item.letters >= item.max && !item.erasing) {
                        item.erasing = true;

                        nextItem = true;
                    } else {
                        item.letters += 1;
                    }

                    if (item.erasing) {
                        paintRect(column.x, item.eraseY, 12, 12);
                        paintDot(column.x, item.eraseY, column);

                        item.eraseY += 12;
                    }
                } else {
                    item.delay -= Values.INTERVAL;
                }
            });

            if (nextItem) column.items.push(createItem());

            column.items = column.items.filter(item => item.eraseY < window.innerHeight);

            paintRect(column.x, 0, 12, window.innerHeight, 'rgba(0, 0, 0, 0.1)');
        };

        let lastRender = 0;
        const loop = (timestamp: number) => {
            let delta = timestamp - lastRender;

            forEach(columns, column => {
                column.interval -= delta;

                if (column.interval <= 0) {
                    update(column, delta);
                    column.interval = Math.floor(Values.INTERVAL * Math.random()) + 150;
                }
            });

            lastRender = timestamp;
            window.requestAnimationFrame(loop);
        };

        lastRender = performance.now();
        window.requestAnimationFrame(loop);
    };

    lineLengthEvent(parseInt(lineLengthInput.value));

    graphics();

    gradientTypeEvent(options.gradientType);
})();
