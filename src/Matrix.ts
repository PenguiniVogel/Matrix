/**
 https://github.com/FelixVogel/Matrix
 Copyright (c) 2020 Felix Vogel

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

module Matrix {

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    let timeDelta = 0;

    export function init() {
        Settings.load();
        Settings.loaded = true;

        canvas = document.querySelector(Settings.getSettings().canvasId);
        context = canvas.getContext('2d');

        const interval = 1000 / 60.0;

        function loop() {
            let start = Date.now();

            if (timeDelta >= interval) {
                render();

                timeDelta -= interval;
            }

            timeDelta += Date.now() - start;

            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }

    MatrixSettingListener.onColorChange = (color) => {};

    MatrixSettingListener.onSymbolsChange = (symbols) => {
        characters = [];

        function getCharData(char: string): CharData {
            return {
                xOffset: Math.floor(context.measureText(char).width / 2.0),
                char: char
            };
        }

        for (let l_Char of symbols) {
            characters.push(getCharData(l_Char));
        }
    };

    MatrixSettingListener.onSpeedChange = (speed) => {};

    MatrixSettingListener.onColoringModeChange = (gradientType) => {};

    MatrixSettingListener.onColoringModeIntervalChange = (interval) => {};

    MatrixSettingListener.onLineLengthChange = (lineLength) => {};

    MatrixSettingListener.onResetOnFocusChange = (resetOnFocus) => {};

    MatrixSettingListener.onRotationChange = (rotation) => {};

    // Graphics

    /**
     * Contains character data to ensure a character is centered when rendered
     */
    interface CharData {
        xOffset: number,
        char: string
    }

    let characters: CharData[] = [];

    interface Column {
        x: number,
        interval: number,
        segments: ColumnSegment[]
    }

    interface ColumnSegment {
        delay: number,
        y: number,
        length: number
    }

    let colors: Utility.RGBColor[] = [];
    let columns: Column[] = [];

    function resize() {
        let columnWidth = Settings.getColumnWidth();
        let margin = Math.floor((canvas.width - (Math.floor(canvas.width / columnWidth) * columnWidth)) / 2.0);

        colors = [];
        columns = [];

        for (let x = margin; x < canvas.width - margin; x += columnWidth) {
            columns.push({
                x: x,
                interval: Math.floor((Settings.TIMING_INTERVAL / 2.0) + (Math.random() * Settings.TIMING_INTERVAL / 2.0)),
                segments: [{
                    delay: Math.random() * Settings.TIMING_INTERVAL,
                    y: 0,
                    length: Settings.generateLineLength()
                }]
            });
        }
    }

    canvas.addEventListener('resize', resize);
    resize();

    function render() {

    }

    export function refresh() {
        resize();

        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // ----- Old code

    /*import Color = Utility.Color;
    import Cookie = Utility.Cookie;
    import forEach = Utility.forEach;
    import capsule = Utility.capsule;

    capsule(() => {
        let stack: {
            setGradientType?: (value: number) => void
        } = {};

        const enum GradientType {
            NONE,
            ALL,
            PER
        }

        const enum Values {
            INTERVAL = 250,
            DEFAULT_BASE_COLOR = '#44ff00',
            DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z',
            MAX_LINE_LENGTH = 30,

            COOKIE_BASE_COLOR = 'base_color',
            COOKIE_SPEED = 'speed',
            COOKIE_GRADIENT_TYPE = 'gradient_type',
            COOKIE_GRADIENT_INTERVAL = 'gradient_interval',
            COOKIE_LINE_LENGTH = 'line_length',
            COOKIE_SYMBOLS = 'symbols',
            COOKIE_HIDE_CURSOR = 'hide_cursor',
            COOKIE_RESET_ON_FOCUS = 'reset_on_focus',
            COOKIE_ROTATION = 'rotation'
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
            baseColor: new Color(68, 255, 0),
            speed: 1,
            gradientType: GradientType.NONE,
            gradientInterval: 1,
            lineLength: 14,
            resetOnFocus: true,
            rotation: 0
        };

        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#matrix-canvas');
        const graphics: CanvasRenderingContext2D = canvas.getContext('2d');

        // States
        const STATE: {
            isTyping : boolean
        } = {
            isTyping: false
        };

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

        const rebuild = (): void => {
            columns = [];

            for (let x = 1, width = canvas.width; x < width; x += 12) {
                if (x + 12 > width) break;
                for (let y = 0, height = canvas.height; y < height; y += 12) paintDot(x, y);

                create(x);
            }

            stack.setGradientType(OPTIONS.gradientType);
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

        // Base color
        capsule(() => {
            let baseColorInput = <HTMLInputElement>document.querySelector('#base-color');
            let baseColorCookieValue = Cookie.getOrSet(Values.COOKIE_BASE_COLOR, Values.DEFAULT_BASE_COLOR).getValue();

            baseColorInput.value = `${baseColorCookieValue}`;

            const setBaseColor = (inputValue: string): void => {
                OPTIONS.baseColor = Color.fromHex(inputValue);

                Cookie.replace(Values.COOKIE_BASE_COLOR, inputValue);
            };

            setBaseColor(baseColorInput.value);
            baseColorInput.addEventListener('input', (e) => setBaseColor(baseColorInput.value));
        });

        // Speed
        capsule(() => {
            let speedInput = <HTMLInputElement>document.querySelector('#speed');
            let speedValueView = <HTMLElement>document.querySelector('span[data-value-for="speed"]');
            let speedCookieValue: number = parseInt(Cookie.getOrSet(Values.COOKIE_SPEED, '0').getValue());

            const setSpeed = (inputValue: number): void => {
                let adjustedValue = inputValue - (inputValue % 25);

                speedInput.value = `${adjustedValue}`;

                let value = Math.max(1, Math.pow(2, adjustedValue / 25));

                OPTIONS.speed = value;
                speedValueView.innerHTML = `(x ${value})`;

                Cookie.replace(Values.COOKIE_SPEED, `${adjustedValue}`);
            };

            setSpeed(speedCookieValue);
            speedInput.addEventListener('input', (e) => setSpeed(parseInt(speedInput.value)));
        });

        // Gradient
        capsule(() => {
            const setGradientType = (type: GradientType): void => {
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

                Cookie.replace(Values.COOKIE_GRADIENT_TYPE, `${type}`);
            };

            stack['setGradientType'] = setGradientType;

            let gradientTypeInput = <HTMLInputElement>document.querySelector('#gradient-type');

            OPTIONS.gradientType = parseInt(Cookie.getOrSet(Values.COOKIE_GRADIENT_TYPE, '0').getValue());
            gradientTypeInput.value = `${OPTIONS.gradientType}`;

            gradientTypeInput.addEventListener('input', (e) => setGradientType(parseInt(gradientTypeInput.value)));

            // Reset gradient when visibility changes to fix out of sync
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
            let gradientIntervalCookieValue = parseInt(Cookie.getOrSet(Values.COOKIE_GRADIENT_INTERVAL, '0').getValue());

            gradientIntervalInput.value = `${gradientIntervalCookieValue}`;

            const setGradientInterval = (inputValue: number): void => {
                let adjustedValue = inputValue - (inputValue % 25);

                gradientIntervalInput.value = `${adjustedValue}`;

                let value = Math.max(1, Math.pow(2, adjustedValue / 25));

                OPTIONS.gradientInterval = value;
                gradientIntervalValueView.innerHTML = `(x ${value})`;

                Cookie.replace(Values.COOKIE_GRADIENT_INTERVAL, `${adjustedValue}`);
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
                let value: number = Math.floor((Values.MAX_LINE_LENGTH / 100) * inputValue);

                lineLengthInput.value = `${Math.ceil((value / Values.MAX_LINE_LENGTH) * 100)}`;

                value += 2;

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
            let symbolCookieValue = Cookie.getOrSet(Values.COOKIE_SYMBOLS, Values.DEFAULT_SYMBOLS).getValue();

            const setSymbols = (inputValue: string): void => {
                if (!inputValue || inputValue.length === 0) return;

                convertToIChar(inputValue);

                Cookie.replace(Values.COOKIE_SYMBOLS, `${inputValue}`);
            };

            (<HTMLElement>document.querySelector('#symbol-set')).addEventListener('click', (e) => {
                setSymbols(symbolInput.value);
            });

            (<HTMLElement>document.querySelector('#symbol-reset')).addEventListener('click', (e) => {
                symbolInput.value = Values.DEFAULT_SYMBOLS;
                setSymbols(symbolInput.value);
            });

            symbolInput.value = symbolCookieValue;
            setSymbols(symbolCookieValue);

            symbolInput.addEventListener('focus', (e) => STATE.isTyping = true);
            symbolInput.addEventListener('blur', (e) => STATE.isTyping = false);
        });

        // Hide cursor
        capsule(() => {
            let hideCursorInput = <HTMLInputElement>document.querySelector('#hide-cursor');
            let hideCursorCookieValue: boolean = Cookie.getOrSet(Values.COOKIE_HIDE_CURSOR, 'true').getValue() === 'true';

            hideCursorInput.checked = hideCursorCookieValue;

            const setHideCursor = (inputValue: boolean) => {
                (<HTMLElement>document.querySelector('.matrix-container')).style['cursor'] = inputValue ? 'none' : 'default';

                Cookie.replace(Values.COOKIE_HIDE_CURSOR, `${inputValue}`);
            };

            setHideCursor(hideCursorCookieValue);
            hideCursorInput.addEventListener('input', (e) => setHideCursor(hideCursorInput.checked));
        });

        // Reset on focus
        capsule(() => {
            let resetOnFocusInput = <HTMLInputElement>document.querySelector('#reset-on-focus');
            let resetOnFocusCookieValue: boolean = Cookie.getOrSet(Values.COOKIE_RESET_ON_FOCUS, 'true').getValue() === 'true';

            resetOnFocusInput.checked = resetOnFocusCookieValue;

            const setResetOnFocus = (inputValue: boolean) => {
                OPTIONS.resetOnFocus = inputValue;

                Cookie.replace(Values.COOKIE_RESET_ON_FOCUS, `${inputValue}`);
            };

            setResetOnFocus(resetOnFocusCookieValue);
            resetOnFocusInput.addEventListener('input', (e) => setResetOnFocus(resetOnFocusInput.checked));
        });

        // Rotation
        capsule(() => {
            let rotationInput = <HTMLInputElement>document.querySelector('#rotation');
            let rotationCookieValue = parseInt(Cookie.getOrSet(Values.COOKIE_ROTATION, '0').getValue());
            let rotationValueView = <HTMLElement>document.querySelector('span[data-value-for="rotation"]');

            rotationInput.value = `${rotationCookieValue}`;

            const calcRotation = (inputValue: number): number => {
                let rotation = Math.trunc((inputValue / 100) * 360);

                rotationInput.value = `${(rotation / 360) * 100}`;
                rotationValueView.innerHTML = `(${rotation} &deg;)`;

                Cookie.replace(Values.COOKIE_ROTATION, rotationInput.value);

                return rotation;
            };

            const setRotation = (inputValue: number): void => {
                rotate(calcRotation(inputValue));
            };

            (<HTMLElement>document.querySelector('#rotation-set')).addEventListener('click', (e) => {
                setRotation(parseInt(rotationInput.value));
            });

            (<HTMLElement>document.querySelector('#rotation-reset')).addEventListener('click', (e) => {
                rotationInput.value = '0';
                setRotation(0);
            });

            setRotation(rotationCookieValue);

            rotationInput.addEventListener('input', (e) => {
                rotationValueView.innerHTML = `(${calcRotation(parseInt(rotationInput.value))} &deg;)`
            });
        });

        // Window things

        // Options Panel
        window.addEventListener('keyup', (e) => {
            if (e.key && e.key.toLowerCase() === 'o' && !STATE.isTyping) {
                let options = <HTMLElement>document.querySelector('#options');

                if (options.style['display'] === '') options.style['display'] = 'none';
                else options.style['display'] = '';
            }
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
    });*/
}
