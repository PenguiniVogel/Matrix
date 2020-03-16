/**
 https://github.com/FelixVogel/Matrix
 Copyright (c) 2020 Felix Vogel

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

///<reference path="Utility.ts"/>
import Color = Utility.Color;
import forEach = Utility.forEach;

const enum GradientType {
    NONE,
    ALL,
    PER,
    AUDIO
}

const enum Values {
    INTERVAL = 250
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
    interval: number
    hsv: number,
    items: IColumnItem[]
}

interface IChar {
    offsetX: number,
    char: string
}

const options: {
    textColor     : Color,
    gradientType  : GradientType,
    gradientSpeed : number,
    lineLength    : number,
    lineSpeed     : number,
    rotation      : number
} = {
    textColor: new Color(68, 255, 0),
    gradientType: GradientType.NONE,
    gradientSpeed: 1,
    lineLength: 32,
    lineSpeed: 1,
    rotation: 0
};

let columns: IColumn[] = [];

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('matrix-canvas');
const graphics: CanvasRenderingContext2D = canvas.getContext('2d');

const setGradient = (): void => {
    switch (options.gradientType) {
        case GradientType.NONE: {
            forEach(columns, column => column.hsv = 0);
            break;
        }
        case GradientType.ALL: {
            forEach(columns, column => column.hsv = 0);
            break;
        }
        case GradientType.PER: {
            forEach(columns, column => column.hsv = 360 * (column.x / window.innerWidth));
            break;
        }
        case GradientType.AUDIO: {
            forEach(columns, column => column.hsv = 60);
            break;
        }
    }
};

const rotate = (angle: number): void => {
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

const rebuild = (): void => {
    columns = [];

    for (let x = 1, width = canvas.width; x < width; x += 12) {
        if (x + 12 > width) break;
        for (let y = 0, height = canvas.height; y < height; y += 12) paintDot(x, y);

        create(x);
    }

    setGradient();
};

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
        interval: Math.floor(Values.INTERVAL * Math.random()) + 150,
        hsv: 0,
        items: [createItem()]
    };

    columns.push(column);
};

for (let x: number = 1; x < window.innerWidth; x += 12) {
    if (x + 12 > window.innerWidth) break;
    for (let y: number = 0; y < window.innerHeight; y += 12) paintDot(x, y);

    create(x);
}

const resize = (e?) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    rotate(options.rotation);
};

resize();
window.addEventListener('resize', resize);

let chars: IChar[] = [];

const convertToIChar = (line: string) => {
    chars = [];
    for (let i = 0, l = line.length; i < l; i++) {
        chars.push({
            offsetX: Math.floor(6 - (graphics.measureText(line[i]).width / 2)),
            char: line[i]
        });
    }
};

// @ts-ignore
window.wallpaperPropertyListener = {
    applyUserProperties: (properties) => {
        if (properties.schemecolor) {
            let color = properties.schemecolor.value.split(' ').map(segment => Math.min(255, Math.ceil(parseFloat(segment) * 255)));

            options.textColor = Color.fromRGBA(color[0], color[1], color[2]);
        }

        if (properties.gradienttype) {
            options.gradientType = parseInt(properties.gradienttype.value);
            setGradient();
        }

        if (properties.gradientspeed) {
            options.gradientSpeed = parseInt(properties.gradientspeed.value);
        }

        if (properties.linelength) {
            options.lineLength = parseInt(properties.linelength.value);
        }

        if (properties.linespeed) {
            options.lineSpeed = parseInt(properties.linespeed.value);
        }

        if (properties.symbols) {
            if (properties.symbols.value === '') convertToIChar('ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z');
            else convertToIChar(properties.symbols.value);
        }

        if (properties.rotation) {
            options.rotation = parseInt(properties.rotation.value);
            resize();
        }
    }
};

window.addEventListener('load', (e) => {
    // @ts-ignore
    window.wallpaperRegisterAudioListener((audioFrame: number[]) => {
        if (options.gradientType !== GradientType.AUDIO) return;

        let half = Math.floor(columns.length / 2);
        let colPerFrame = Math.floor(columns.length / 128);

        let iteration = 0;
        let at = 63;

        for (let l = half; l > -1; l --) {
            columns[l].hsv = 240 * audioFrame[at] + 120;

            iteration += 1;

            if (iteration >= colPerFrame) {
                iteration = 0;
                at -= 1;
            }
        }

        at = 64;
        for (let r = half + 1; r < columns.length; r ++) {
            columns[r].hsv = 240 * audioFrame[at] + 120;

            iteration += 1;

            if (iteration >= colPerFrame) {
                iteration = 0;
                at += 1;
            }
        }
    });
});

// Graphics

const init = (): void => {
    const interval: number = 250;

    graphics.scale(1.2, 1.2);

    const update = (column: IColumn): void => {
        let nextItem: boolean = false;

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
                item.delay -= interval;
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
            if (options.gradientType === GradientType.ALL || options.gradientType === GradientType.PER) {
                column.hsv += (delta / 100) * options.gradientSpeed;

                if (column.hsv >= 360) column.hsv = 0;
            }

            column.interval -= delta * options.lineSpeed;

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

    setGradient();
};

window.addEventListener('load', e => init());
