/**
 https://github.com/FelixVogel/Matrix
 Copyright (c) 2020 Felix Vogel

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

///<reference path="1_Utility.ts"/>
import Color = Utility.Color;
import forEach = Utility.forEach;
import capsule = Utility.capsule;

capsule(() => {
    const enum GradientType {
        NONE,
        ALL,
        PER
    }

    const enum Values {
        INTERVAL = 250,
        DEFAULT_BASE_COLOR = '#44ff00',
        DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z',
    }

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

    interface IChar {
        offsetX : number,
        char    : string
    }

    const OPTIONS: {
        baseColor        : Color,
        speed            : number,
        gradientType     : GradientType,
        gradientInterval : number,
        lineLength       : number,
        resetOnFocus     : boolean
        rotation         : number,
    } = {
        baseColor: Color.fromHex(Values.DEFAULT_BASE_COLOR),
        speed: 1,
        gradientType: GradientType.NONE,
        gradientInterval: 1,
        lineLength: 14,
        resetOnFocus: true,
        rotation: 0
    };

    const settings: {
        canvas            : string,
        baseColor?        : string,
        symbols           : string,
        speed?            : number,
        gradientType?     : number,
        gradientInterval? : number,
        lineLength?       : number,
        rotation?         : number,
    } = JSON.parse(document.querySelector('script[type="matrix-config"]').innerHTML);

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector(settings.canvas ? settings.canvas : '#matrix-canvas');
    const graphics: CanvasRenderingContext2D = canvas.getContext('2d');

    // Chars
    let chars: IChar[] = [];

    // Columns
    let columns: IColumn[] = [];

    const convertToIChar = (line: string): void => {
        if (line === null || line.length === 0) line = Values.DEFAULT_SYMBOLS;

        chars = [];
        for (let i = 0, l = line.length; i < l; i++) {
            chars.push({
                offsetX : Math.floor(6 - (graphics.measureText(line[i]).width / 2)),
                char    : line[i]
            });
        }
    };

    const paintRect = (x: number, y: number, width: number, height: number, color: string = '#000000'): void => {
        graphics.fillStyle = color;
        graphics.fillRect(x, y, width, height);
    };

    const paintDot = (x: number, y: number, column?: IColumn): void => {
        let alpha = Math.max(0.05, Math.min(0.5, Math.random()));

        if (OPTIONS.gradientType !== GradientType.NONE && column) graphics.fillStyle = `hsla(${column.hsv}, 100%, 50%, ${alpha})`;
        else graphics.fillStyle = OPTIONS.baseColor.toRGBA(alpha);

        graphics.fillRect(x + 5, y + 4, 2, 2);
    };

    const createItem = (): IColumnItem => {
        return {
            letters: 0,
            max    : Math.floor(Math.random() * (OPTIONS.lineLength / 2)) + (OPTIONS.lineLength / 2),
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

    const setGradientType = (type: number): void => {
        switch (type) {
            case GradientType.NONE: {
                OPTIONS.gradientType = GradientType.NONE;
                forEach(columns, column => column.hsv = 0);
                break;
            }
            case GradientType.ALL: {
                OPTIONS.gradientType = GradientType.ALL;
                forEach(columns, column => column.hsv = 0);
                break;
            }
            case GradientType.PER: {
                OPTIONS.gradientType = GradientType.PER;
                forEach(columns, column => column.hsv = 360 * (column.x / canvas.width));
                break;
            }
        }
    };

    const rebuild = (): void => {
        columns = [];

        for (let x = 1, width = canvas.width; x < width; x += 12) {
            if (x + 12 > width) break;
            for (let y = 0, height = canvas.height; y < height; y += 12) paintDot(x, y);

            create(x);
        }

        setGradientType(OPTIONS.gradientType);
    };

    const rotate = (angle: number): void => {
        OPTIONS.rotation = angle;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        canvas.style['transform'] = `rotateZ(${angle}deg)`;

        let boundingClientRect = canvas.getBoundingClientRect();

        let width = boundingClientRect.right - boundingClientRect.left;
        let height = boundingClientRect.bottom - boundingClientRect.top;

        canvas.width = width;
        canvas.height = height;

        canvas.style['transform'] = `translate(${(window.innerWidth - width) / 2}px, ${(window.innerHeight - height) / 2}px) rotateZ(${angle}deg)`;

        rebuild();
    };

    const resize = (e?): void => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        rotate(OPTIONS.rotation);
    };

    // Apply settings
    capsule(() => {
        // Base Color
        OPTIONS.baseColor = Color.fromHex(settings.baseColor ? settings.baseColor : Values.DEFAULT_BASE_COLOR);

        // Speed
        OPTIONS.speed = Math.max(1, Math.min(16, settings.speed ?  settings.speed : 2));

        // Gradient type
        OPTIONS.gradientType = Math.min(2, Math.max(0, settings.gradientType ? settings.gradientType : 0));

        // Gradient interval
        OPTIONS.gradientInterval = Math.max(1, Math.min(16, settings.gradientInterval ?  settings.gradientInterval : 2));

        // Line length
        OPTIONS.lineLength = Math.min(32, Math.max(2, settings.lineLength ? settings.lineLength : 32));

        // Symbols
        convertToIChar(settings.symbols ? settings.symbols : Values.DEFAULT_SYMBOLS);

        // Rotation
        OPTIONS.rotation = Math.min(360, Math.max(0, settings.rotation ? settings.rotation : 0));
    });

    // Graphics

    const init = (): void => {

        graphics.scale(1.2, 1.2);

        resize();
        window.addEventListener('resize', resize);

        const update = (column: IColumn): void => {
            let nextItem: boolean = false;

            forEach(column.items, item => {
                if (item.delay <= 0) {
                    paintRect(column.x, item.letterY, 12, 12);

                    if (OPTIONS.gradientType !== GradientType.NONE) graphics.strokeStyle = `hsl(${column.hsv}, 100%, 50%)`;
                    else graphics.strokeStyle = OPTIONS.baseColor.toRGB();

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

            column.items = column.items.filter(item => item.eraseY < canvas.height);

            paintRect(column.x, 0, 12, canvas.height, 'rgba(0, 0, 0, 0.1)');
        };

        let lastRender = 0;
        const loop = (timestamp: number) => {
            let delta = timestamp - lastRender;

            forEach(columns, column => {
                if (OPTIONS.gradientType !== GradientType.NONE) {
                    column.hsv += (delta / 100) * OPTIONS.gradientInterval;

                    if (column.hsv >= 360.0) column.hsv = 0.0;
                }

                column.interval -= delta * OPTIONS.speed;

                if (column.interval <= 0) {
                    update(column);
                    column.interval = Math.floor(Values.INTERVAL * Math.random()) + 150;
                }
            });

            lastRender = timestamp;
            window.requestAnimationFrame(loop);
        };

        lastRender = performance.now();
        window.requestAnimationFrame(loop);
    };

    init();
});
