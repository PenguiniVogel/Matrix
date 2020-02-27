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

    const paintRect = (x: number, y: number, width: number, height: number): void => {
        graphics.fillStyle = '#000000';
        graphics.fillRect(x, y, width, height);
    };

    const paintDot = (x: number, y: number): void => {
        graphics.fillStyle = '#44ff00';
        graphics.globalAlpha = Math.max(0.05, Math.min(0.5, Math.random()));
        graphics.fillRect(x + 2, y + 4, 2, 2);
        graphics.globalAlpha = 1;
    };

    const chars: String = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';

    interface IColumnItem {
        x       : number,
        letters : number,
        max     : number,
        letterY : number,
        erasing : boolean,
        eraseY  : number,
        delay   : number
    }

    const createItem = (x: number): IColumnItem => {
        return {
            x      : x,
            letters: 0,
            max    : Math.floor(Math.random() * 8) + 2,
            letterY: 10,
            erasing: false,
            eraseY : 0,
            delay  : Math.floor(Math.random() * 8000) + 2000
        };
    };

    const create = (x): void => {
        let column: IColumnItem[] = [createItem(x)];

        setTimeout(() => setInterval(() => {
            if(update(column)) {
                column.push(createItem(x));
            }

            graphics.globalAlpha = 0.005;
            paintRect(0, 0, window.innerWidth, window.innerHeight);
            graphics.globalAlpha = 1;

            column = column.filter(item => item.eraseY <= window.innerHeight);
        }, interval), Math.floor(Math.random() * 2000) + 1000);
    };

    for (let x: number = 1; x < window.innerWidth; x += 12) {
        if (x + 12 > window.innerWidth) break;
        for (let y: number = 0; y < window.innerHeight; y += 12) paintDot(x, y);

        create(x);
    }

    const update = (column: IColumnItem[]): boolean => {
        let nextItem: boolean = false;

        column.forEach(item => {
            if (item.delay <= 0) {
                paintRect(item.x, item.letterY, 12, 12);

                graphics.strokeStyle = '#44ff00';
                graphics.strokeText(chars[Math.floor(Math.random() * chars.length)], item.x + 1, item.letterY);

                item.letterY += 12;

                if (item.letters >= item.max && !item.erasing) {
                    item.erasing = true;

                    nextItem = true;
                } else {
                    item.letters += 1;
                }

                if (item.erasing) {
                    paintRect(item.x, item.eraseY, 12, 12);
                    paintDot(item.x, item.eraseY);

                    item.eraseY += 12;
                }
            } else {
                item.delay -= interval;
            }
        });

        return nextItem;
    };
};

setTimeout(graphics, 100);
