module Matrix {

    export const DEFAULT_SIZE = 300;
    export const DEFAULT_COLOR = '#44ff00';
    export const DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';
    export const DEFAULT_SPEED = 1;
    export const DEFAULT_LINE_LENGTH = 16;
    export const DEFAULT_ROTATION = 0;
    export const DEFAULT_UPDATE_RATE = 32;
    export const DEFAULT_FX = new MatrixFX.BasicColumnFX();

    export const COLUMN_SIZE = 12;
    export const MAX_SPEED = 32;
    export const MAX_LINE_LENGTH = 32;

    // --- Internal Settings

    let width: number = DEFAULT_SIZE;
    let height: number = DEFAULT_SIZE;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let color: string = DEFAULT_COLOR;

    interface CharData {
        width: number,
        char: string
    }

    let characters: CharData[] = [];

    function convertSymbols(_symbols: string = DEFAULT_SYMBOLS): void {
        characters = [];

        for (let i = 0, l = _symbols.length; i < l; i ++) {
            let c = _symbols[i];
            let measure = ctx.measureText(c);
            characters.push({
                width: measure.width,
                char: c
            });
        }
    }

    let speed: number = DEFAULT_SPEED;
    let lineLength: number = DEFAULT_LINE_LENGTH;
    let rotation: number = DEFAULT_ROTATION;
    let ups: number = DEFAULT_UPDATE_RATE;
    let useFX: boolean = false;
    let fx: MatrixFX.FX = DEFAULT_FX;

    // --- Creation

    export interface OptionalSettings {
        size?: {width: number, height: number},
        color?: string,
        symbols?: string,
        speed?: number,
        lineLength?: number,
        rotation?: number,
        updateRate?: number,
        useFX?: boolean,
        fx?: MatrixFX.FX
    }

    export function create(selector: string, settings?: OptionalSettings): void {
        let _canvas: HTMLCanvasElement = document.querySelector(selector);

        if (_canvas.tagName.toLowerCase() != 'canvas') return;

        canvas = _canvas;
        ctx = _canvas.getContext('2d');

        resize(DEFAULT_SIZE, DEFAULT_SIZE);

        // Settings
        convertSymbols(DEFAULT_SYMBOLS);

        if (settings) {
            if (settings.size) resize(settings.size.width, settings.size.height);
            if (settings.color) setColor(settings.color);
            if (settings.symbols) setSymbols(settings.symbols);
            if (settings.speed) setSpeed(settings.speed);
            if (settings.lineLength) setLineLength(settings.lineLength);
            if (settings.rotation) setRotation(settings.rotation);
            if (settings.updateRate) setUpdateRate(settings.updateRate);
            if (settings.useFX != null) setUseFX(settings.useFX);
            if (settings.fx && settings.fx.render) setFX(settings.fx);
        }
    }

    export function start() {
        RenderEngine.start();
    }

    // --- Settings

    export function resize(_width: number = DEFAULT_SIZE, _height: number = DEFAULT_SIZE) {
        width = _width;
        height = _height;

        canvas.width = _width;
        canvas.height = _height;

        fx.fx_buffer(_width, _height);

        RenderEngine.recalculate_columns();
    }

    export function setColor(_color: string = DEFAULT_COLOR): void {
        color = _color;
    }

    export function setSymbols(_symbols: string = DEFAULT_SYMBOLS): void {
        convertSymbols(_symbols);
    }

    export function setSpeed(_speed: number = DEFAULT_SPEED): void {
        if (_speed < 1 || _speed > MAX_SPEED) _speed = DEFAULT_SPEED;

        speed = _speed;
    }

    export function setLineLength(_lineLength: number = DEFAULT_LINE_LENGTH): void {
        if (_lineLength < 1 || _lineLength > MAX_LINE_LENGTH) _lineLength = DEFAULT_LINE_LENGTH;

        lineLength = _lineLength;
    }

    export function setRotation(_rotation: number = DEFAULT_ROTATION): void {
        rotation = Utility.fixDegrees(_rotation);
    }

    export function setUpdateRate(_ups: number = DEFAULT_UPDATE_RATE): void {
        if (_ups < 1) _ups = DEFAULT_UPDATE_RATE;

        ups = _ups;
    }

    export function setUseFX(_useFX: boolean = false): void {
        useFX = _useFX;
    }

    export function setFX(_fx: MatrixFX.FX = DEFAULT_FX): void {
        fx = _fx;
    }

    // Rendering

    module RenderEngine {

        interface Column {
            x: number,
            segments: ColumnSegment[]
        }

        interface ColumnSegment {
            delay: number,
            y: number,
            letters: CharData[],
            length: number,
        }

        let columns: Column[] = [];

        export function recalculate_columns(): void {
            columns = [];

            paint_reset();

            for (let x = 0; x < width; x += COLUMN_SIZE) {
                columns.push({
                    x: x,
                    segments: [create_segment()]
                });
            }
        }

        function create_segment(): ColumnSegment {
            let hLineLength = lineLength / 2.0;

            return {
                delay: Math.ceil(5 + Math.random() * 15),
                y: 0,
                letters: [],
                length: Math.ceil(hLineLength + Math.random() * hLineLength)
            };
        }

        let columnsAccumulator = 0;
        let colorAccumulator = 0;

        let bg: BG;

        let fxBuffer: HTMLCanvasElement;

        function render_columns(delta: number) {
            Utility.debug_value('#debug-columns', `${columns.length}`);
            Utility.debug_value('#debug-column-0', `${columns[0].segments[columns[0].segments.length - 1].delay}`);

            if (columnsAccumulator >= 1000.0 / speed) {
                for (let l_Column of columns) {
                    ctx.beginPath();
                    ctx.clearRect(l_Column.x, 0, COLUMN_SIZE, height);

                    ctx.beginPath();
                    ctx.drawImage(bg.getBuffer(), 0, 0, COLUMN_SIZE, height, l_Column.x, 0, COLUMN_SIZE, height);

                    let needsNext = true;
                    for (let l_Segment of l_Column.segments) {
                        if (l_Segment.delay > 0) {
                            l_Segment.delay -= 1;

                            needsNext = false;

                            continue;
                        }

                        if (l_Segment.letters.length < l_Segment.length) {
                            l_Segment.letters.push(characters[Math.floor(Math.random() * characters.length)]);

                            needsNext = false;
                        } else {
                            ctx.beginPath();
                            ctx.clearRect(l_Column.x, l_Segment.y, COLUMN_SIZE, COLUMN_SIZE);

                            l_Segment.y += COLUMN_SIZE;
                        }

                        for (let i = 0, l = l_Segment.letters.length; i < l; i ++) {
                            paint_letter(l_Segment.letters[i], l_Column.x, l_Segment.y + COLUMN_SIZE * i);
                        }
                    }

                    if (needsNext) {
                        l_Column.segments.push(create_segment());
                    }

                    l_Column.segments = l_Column.segments.filter(segment => segment.y - (COLUMN_SIZE * segment.length) < height);
                }

                columnsAccumulator = 0;
            }
        }

        function render_bg() {
            ctx.save();

            // ctx.globalCompositeOperation = 'copy';

            ctx.drawImage(bg.getBuffer(), 0, 0);

            ctx.restore();
        }

        function render_color(delta: number) {
            ctx.save();

            ctx.globalCompositeOperation = 'source-atop';

            if (useFX) {
                if (!fxBuffer || colorAccumulator >= 1000.0 / ups) {
                    fxBuffer = fx.fx_render(delta, width, height);

                    colorAccumulator = 0;
                }

                ctx.drawImage(fxBuffer, 0, 0);
            } else {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.fillRect(0, 0, width, height);
            }

            ctx.restore();
        }

        export function start() {
            function loop(timestamp) {
                let delta = timestamp - lastRender;

                // ctx.clearRect(0, 0, width, height);

                // render_bg();

                columnsAccumulator += delta;

                render_columns(delta);

                colorAccumulator += delta;

                render_color(delta);

                lastRender = timestamp;
                window.requestAnimationFrame(loop);
            }

            bg = new BG();

            paint_reset();

            let lastRender = 0;
            window.requestAnimationFrame(loop);
        }

        function paint_reset(): void {
            ctx.clearRect(0, 0, width, height);

            ctx.scale(1.2, 1.2);

            if (bg) bg.render();
        }

        function paint_letter(charData: CharData, x: number, y: number): void {
            ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.fillText(charData.char, x + 6 - (charData.width / 2.0), y + 1, COLUMN_SIZE);
        }

        class BG extends Utility.GraphicCanvas {

            constructor() {
                super();
            }

            public render() {
                this.resize(width, height);

                this.ctx.clearRect(0, 0, width, height);

                this.ctx.fillStyle = '#000000';

                for (let y = 0; y < height; y += COLUMN_SIZE) {
                    for (let x = 0; x < width; x += COLUMN_SIZE) {
                        this.ctx.beginPath();
                        this.ctx.fillRect(x + 5, y + 5, 2, 2);
                    }
                }
            }

        }

    }

}
