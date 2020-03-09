/**
 https://github.com/FelixVogel/Matrix
 Copyright (c) 2020 Felix Vogel

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

///<reference path="1_Utility.ts"/>
import Color = Utility.Color;
import Cookie = Utility.Cookie;
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
        MAX_LINE_LENGTH = 14,

        COOKIE_BASE_COLOR = 'base_color',
        COOKIE_GRADIENT_TYPE = 'gradient_type',
        COOKIE_GRADIENT_INTERVAL = 'gradient_interval',
        COOKIE_LINE_LENGTH = 'line_length',
        COOKIE_SYMBOLS = 'symbols',
        COOKIE_HIDE_CURSOR = 'hide_cursor',
        COOKIE_RESET_ON_FOCUS = 'reset_on_focus'
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
        gradientType     : GradientType,
        gradientInterval : number,
        lineLength       : number,
        resetOnFocus     : boolean
    } = {
        baseColor : new Color(68, 255, 0),
        gradientType: GradientType.NONE,
        gradientInterval: 100,
        lineLength: 14,
        resetOnFocus: true
    };

    const columns: IColumn[] = [];
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('matrix-canvas');
    const graphics: CanvasRenderingContext2D = canvas.getContext('2d');

    // States
    const STATE: {
        isTyping : boolean
    } = {
        isTyping: false
    };

    // Chars
    let chars: IChar[] = [];

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

    // Base color
    capsule(() => {
        let baseColorInput = <HTMLInputElement>document.querySelector('#base-color');
        let baseColorCookieValue = Cookie.getOrSet(Values.COOKIE_BASE_COLOR, Values.DEFAULT_BASE_COLOR).getValue();

        baseColorInput.value = `${baseColorCookieValue}`;

        const setBaseColor = (inputValue: string): void => {
            OPTIONS.baseColor.fromHex(inputValue);

            Cookie.replace(Values.COOKIE_BASE_COLOR, inputValue);
        };

        setBaseColor(baseColorInput.value);
        baseColorInput.addEventListener('input', (e) => setBaseColor(baseColorInput.value));
    });

    // Gradient
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
                forEach(columns, column => column.hsv = 360 * (column.x / window.innerWidth));
                break;
            }
        }

        Cookie.replace(Values.COOKIE_GRADIENT_TYPE, `${type}`);
    };

    capsule(() => {
        let gradientTypeInput = <HTMLInputElement>document.querySelector('#gradient-type');

        OPTIONS.gradientType = parseInt(Cookie.getOrSet(Values.COOKIE_GRADIENT_TYPE, '0').getValue());
        gradientTypeInput.value = `${OPTIONS.gradientType}`;

        gradientTypeInput.addEventListener('input', (e) => setGradientType(parseInt(gradientTypeInput.value)));

        /* Reset gradient when visibility changes to fix out of sync */
        const eventResetOnFocus = (e: Event, hidden: string) => {
            if ((hidden && document[hidden]) || !OPTIONS.resetOnFocus) return;

            setGradientType(OPTIONS.gradientType);
        };

        if (document.hidden !== undefined) {
            document.addEventListener('visibilitychange', (e) => eventResetOnFocus(e, 'hidden'));
                   // @ts-ignore
        } else if (document.webkitHidden) {
            document.addEventListener('webkitvisibilitychange', (e) => eventResetOnFocus(e, 'webkitHidden'));
                   // @ts-ignore
        } else if (document.msHidden) {
            document.addEventListener('msvisibilitychange', (e) => eventResetOnFocus(e, 'msHidden'));
        } else {
            window.addEventListener('focus', (e) => eventResetOnFocus(e, null));
        }
    });

    // Gradient Interval
    capsule(() => {
        let gradientIntervalInput = <HTMLInputElement>document.querySelector('#gradient-interval');
        let gradientIntervalValueView = <HTMLElement>document.querySelector('span[data-value-for="gradient-interval"]');
        let gradientIntervalCookieValue = parseInt(Cookie.getOrSet(Values.COOKIE_GRADIENT_INTERVAL, '100').getValue());

        gradientIntervalInput.value = `${gradientIntervalCookieValue}`;

        const setGradientInterval = (inputValue: number): void => {
            let value: number = Math.max(1, Math.min(100, inputValue));
            OPTIONS.gradientInterval = value;
            gradientIntervalValueView.innerHTML = `(${value})`;

            Cookie.replace(Values.COOKIE_GRADIENT_INTERVAL, `${value}`);
        };

        setGradientInterval(gradientIntervalCookieValue);
        gradientIntervalInput.addEventListener('input', (e) => setGradientInterval(parseInt(gradientIntervalInput.value)));
    });

    // Line Length
    capsule(() => {
        let lineLengthInput = <HTMLInputElement>document.querySelector('#line-length');
        let lineLengthValueView = <HTMLElement>document.querySelector('span[data-value-for="line-length"]');
        let lineLengthCookieValue = parseInt(Cookie.getOrSet(Values.COOKIE_LINE_LENGTH, '100').getValue());

        lineLengthInput.value = `${lineLengthCookieValue}`;

        const setLineLength = (inputValue: number): void => {
            let value: number = Math.floor(2 + ((Values.MAX_LINE_LENGTH / 100) * inputValue));

            OPTIONS.lineLength = value;
            lineLengthValueView.innerHTML = `(${value})`;

            Cookie.replace(Values.COOKIE_LINE_LENGTH, `${inputValue}`);
        };

        setLineLength(lineLengthCookieValue);
        lineLengthInput.addEventListener('input', (e) => setLineLength(parseInt(lineLengthInput.value)));
    });

    // Symbols
    capsule(() => {
        let symbolInput = <HTMLInputElement>document.querySelector('#symbols');

        const setSymbols = (inputValue: string): void => {
            convertToIChar(inputValue);

            Cookie.replace(Values.COOKIE_SYMBOLS, `${inputValue}`);
        };

        (<HTMLElement>document.querySelector('#symbol-reset')).addEventListener('click', (e) => {
            symbolInput.value = Values.DEFAULT_SYMBOLS;
            setSymbols(symbolInput.value);
        });

        symbolInput.value = Cookie.getOrSet(Values.COOKIE_SYMBOLS, Values.DEFAULT_SYMBOLS).getValue();

        setSymbols(symbolInput.value);
        symbolInput.addEventListener('input', (e) => setSymbols(symbolInput.value));

        symbolInput.addEventListener('focus', (e) => STATE.isTyping = true);
        symbolInput.addEventListener('blur', (e) => STATE.isTyping = false);
    });

    // Hide cursor
    capsule(() => {
        let hideCursorInput = <HTMLInputElement>document.querySelector('#hide-cursor');
        let hideCursorCookieValue: boolean = Cookie.getOrSet(Values.COOKIE_HIDE_CURSOR, 'true').getValue() === 'true';

        const setHideCursor = (inputValue: boolean) => {
            canvas.style['cursor'] = inputValue ? 'none' : 'default';

            Cookie.replace(Values.COOKIE_HIDE_CURSOR, `${inputValue}`);
        };

        setHideCursor(hideCursorCookieValue);
        hideCursorInput.addEventListener('input', (e) => setHideCursor(hideCursorInput.checked));
    });

    // Reset on focus
    capsule(() => {
        let resetOnFocusInput = <HTMLInputElement>document.querySelector('#reset-on-focus');
        let resetOnFocusCookieValue: boolean = Cookie.getOrSet(Values.COOKIE_RESET_ON_FOCUS, 'true').getValue() === 'true';

        const setResetOnFocus = (inputValue: boolean) => {
            OPTIONS.resetOnFocus = inputValue;

            Cookie.replace(Values.COOKIE_RESET_ON_FOCUS, `${inputValue}`);
        };

        setResetOnFocus(resetOnFocusCookieValue);
        resetOnFocusInput.addEventListener('input', (e) => setResetOnFocus(resetOnFocusInput.checked));
    });

    // Window things

    /* Options Panel */
    window.addEventListener('keyup', (e) => {
        if (e.key && e.key.toLowerCase() === 'o' && !STATE.isTyping) {
            let options = <HTMLElement>document.querySelector('#options');

            if (options.style['display'] === '') options.style['display'] = 'none';
            else options.style['display'] = '';
        }
    });

    // Graphics

    const init = (): void => {

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

        for (let x: number = 1; x < window.innerWidth; x += 12) {
            if (x + 12 > window.innerWidth) break;
            for (let y: number = 0; y < window.innerHeight; y += 12) paintDot(x, y);

            create(x);
        }

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

            column.items = column.items.filter(item => item.eraseY < window.innerHeight);

            paintRect(column.x, 0, 12, window.innerHeight, 'rgba(0, 0, 0, 0.1)');
        };

        let lastRender = 0;
        const loop = (timestamp: number) => {
            let delta = timestamp - lastRender;

            forEach(columns, column => {
                if (OPTIONS.gradientType !== GradientType.NONE) {
                    column.hsv += delta / OPTIONS.gradientInterval;

                    if (column.hsv >= 360.0) column.hsv = 0.0;
                }

                column.interval -= delta;

                if (column.interval <= 0) {
                    update(column);
                    column.interval = Math.floor(Values.INTERVAL * Math.random()) + 150;
                }
            });

            lastRender = timestamp;
            window.requestAnimationFrame(loop);
        };

        setGradientType(OPTIONS.gradientType);
        lastRender = performance.now();
        window.requestAnimationFrame(loop);
    };

    init();
});
