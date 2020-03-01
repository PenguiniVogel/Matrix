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

const enum GradientType {
    NONE,
    ALL,
    PER
}

interface Options {
    textColor: Color,
    gradientType: GradientType,
    lineLength: number
}

interface IColumnItem {
    letters: number,
    max: number,
    letterY: number,
    erasing: boolean,
    eraseY: number,
    delay: number
}

interface IColumn {
    x: number,
    hsv: number,
    items: IColumnItem[]
}

const options: Options = {
    textColor: new Color(68, 255, 0),
    gradientType: GradientType.NONE,
    lineLength: 6
};

const columns: IColumn[] = [];

// @ts-ignore
window.wallpaperPropertyListener = {
    applyUserProperties: (properties) => {
        if (properties.schemecolor) {
            let color = properties.schemecolor.value.split(' ').map(segment => Math.min(255, Math.ceil(parseFloat(segment) * 255)));

            options.textColor.fromRGB(color[0], color[1], color[2]);
        }

        if (properties.gradienttype) {
            options.gradientType = properties.gradienttype.value;
            setGradient();
        }

        if (properties.linelength) {
            options.lineLength = properties.linelength.value;
        }
    }
};

// Gradient Settings

const setGradient = (): void => {
    switch (options.gradientType) {
        case GradientType.NONE: {
            columns.forEach(column => column.hsv = 0);
            break;
        }
        case GradientType.ALL: {
            columns.forEach(column => column.hsv = 0);
            break;
        }
        case GradientType.PER: {
            columns.forEach(column => column.hsv = 360 * (column.x / window.innerWidth));
            break;
        }
    }
};

// Graphics

const graphics = (): void => {
    const interval: number = 250;

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
        offsetX: number,
        char: string
    }

    const chars: IChar[] = [];

    let convertToIChar = (line: string) => {
        for (let i = 0; i < line.length; i++) {
            chars.push({
                offsetX: Math.floor(6 - (graphics.measureText(line[i]).width / 2)),
                char: line[i]
            });
        }
    };

    convertToIChar('ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z');

    const createItem = (): IColumnItem => {
        return {
            letters: 0,
            max: Math.floor(Math.random() * (options.lineLength / 2)) + (options.lineLength / 2),
            letterY: 10,
            erasing: false,
            eraseY: 0,
            delay: Math.floor(Math.random() * 8000) + 2000
        };
    };

    const create = (x): void => {
        let column: IColumn = {
            x: x,
            hsv: 0,
            items: [createItem()]
        };

        columns.push(column);

        setTimeout(() => setInterval(() => {
            update(column);

            if (options.gradientType !== GradientType.NONE) {
                column.hsv += 1;

                if (column.hsv >= 360) column.hsv = 0;
            }
        }, interval), Math.floor(Math.random() * 2000) + 1000);
    };

    for (let x: number = 1; x < window.innerWidth; x += 12) {
        if (x + 12 > window.innerWidth) break;
        for (let y: number = 0; y < window.innerHeight; y += 12) paintDot(x, y);

        create(x);
    }

    const update = (column: IColumn): void => {
        let nextItem: boolean = false;

        column.items.forEach(item => {
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
                item.delay -= interval;
            }
        });

        if (nextItem) column.items.push(createItem());

        column.items = column.items.filter(item => item.eraseY < window.innerHeight);

        paintRect(column.x, 0, 12, window.innerHeight, 'rgba(0, 0, 0, 0.1)');
    };
};

setTimeout(() => {
    graphics();
    setGradient();
}, 100);
