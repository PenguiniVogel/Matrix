/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
/** */
module Matrix {

    export const DEFAULT_COLOR = '#44ff00';
    export const DEFAULT_BACKGROUND_COLOR: Settings.Color = '#000';
    export const DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';
    export const DEFAULT_SPEED = 1;
    export const DEFAULT_LINE_LENGTH = 16;
    export const DEFAULT_UPDATE_RATE_FX = 32;
    export const DEFAULT_FX = MatrixFX.BUILTIN_FX_COLOR;
    export const DEFAULT_COMPOSITE_ALPHA = 0.3;
    export const DEFAULT_MOVE_CHANCE = 0.51;
    export const DEFAULT_WAIT_TIME = 20;
    export const DEFAULT_MUTATION_CHANCE = 0.1;
    export const DEFAULT_OVERLAY_MODE = Utility.OverlayMode.NORMAL;
    export const DEFAULT_LETTER_MUTATION_MODE = Utility.LetterMutationMode.NORMAL;

    export const COLUMN_SIZE = 12;
    export const MAX_SPEED = 32;
    export const MAX_LINE_LENGTH = 32;

    // --- Internal Settings

    let created = false;
    let started = false;

    let width: number;
    let height: number;

    let container: HTMLElement;

    let fgCanvas: HTMLCanvasElement;
    let fgCtx: CanvasRenderingContext2D;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let bgCanvas: HTMLCanvasElement;
    let bgCtx: CanvasRenderingContext2D;

    let characters: string;
    let characterSizes: number[];

    function convertSymbols(_symbols: string = DEFAULT_SYMBOLS): void {
        characters = _symbols;
        characterSizes = [];

        for (let i = 0, l = characters.length; i < l; i ++) {
            characterSizes[i] = ctx.measureText(characters[i]).width / 2.0;
        }
    }

    function random_char(): number {
        return Math.floor(Math.random() * characters.length);
    }

    let backgroundColor: Settings.Color = DEFAULT_BACKGROUND_COLOR;
    let speed: number = DEFAULT_SPEED;
    let lineLength: number = DEFAULT_LINE_LENGTH;

    let upsFX: number = DEFAULT_UPDATE_RATE_FX;
    let fx: MatrixFX.FX = DEFAULT_FX;

    let compositeAlpha: number = DEFAULT_COMPOSITE_ALPHA;

    let moveChance: number = DEFAULT_MOVE_CHANCE;
    let mutationChance: number = DEFAULT_MUTATION_CHANCE;

    let overlayMode: Utility.OverlayMode = DEFAULT_OVERLAY_MODE;
    let letterMutationMode: Utility.LetterMutationMode = DEFAULT_LETTER_MUTATION_MODE;

    // --- Creation

    // OptionalSettings were removed with build 0409, please use Matrix.Settings.<setting>
    // export interface OptionalSettings {
    //
    //     /**
    //      * Set the initial container size
    //      */
    //     size?: {
    //         /**
    //          * The container css width
    //          */
    //         width: string,
    //
    //         /**
    //          * The container css height
    //          */
    //         height: string
    //     },
    //
    //     /**
    //      * The initial color of the Matrix canvas
    //      */
    //     color?: string,
    //
    //     /**
    //      * The initial background color
    //      */
    //     backgroundColor?: string,
    //
    //     /**
    //      * The initial symbols of the Matrix
    //      */
    //     symbols?: string,
    //
    //     /**
    //      * The initial speed of the columns
    //      */
    //     speed?: number,
    //
    //     /**
    //      * The initial length of an column segment
    //      */
    //     lineLength?: number,
    //
    //     /*
    //      * @deprecated
    //      *
    //     rotation?: number,
    //      */
    //
    //     /**
    //      * The initial update rate of the FX
    //      */
    //     updateRateFX?: number,
    //
    //     /*
    //      * @deprecated
    //      *
    //     useFX?: boolean
    //      */
    //
    //     /**
    //      * The initial {@link MatrixFX.FX} to use
    //      */
    //     fx?: MatrixFX.FX,
    //
    //     /**
    //      * The initial composite alpha for the Matrix canvas
    //      */
    //     compositeAlpha?: number,
    //
    //     /**
    //      * The initial move chance of an column
    //      */
    //     moveChance?: number,
    //
    //     /**
    //      * The initial mutation chance of an letter in a column segment
    //      */
    //     mutationChance?: number
    // }

    /**
     * Create the Matrix onto the specified selector. <br/>
     * Note: The selector must match and return a &lt;canvas&gt; element!
     *
     * @param selector The dom selector
     * @param size The initial container size
     */
    export function create(selector: string, size?: { width: string, height: string }): void {
        container = document.querySelector(selector);

        if (!container) {
            console.error('Matrix : Could not find the container specified.');

            return;
        }

        created = true;

        container.style.overflow = 'hidden';

        fgCanvas = document.createElement('canvas');
        canvas = document.createElement('canvas');
        bgCanvas = document.createElement('canvas');

        let generalStyles = 'position: absolute;';

        fgCanvas.setAttribute('style', `z-index: 3; ${generalStyles}`);
        canvas.setAttribute('style', `z-index: 2; ${generalStyles}`);
        bgCanvas.setAttribute('style', `z-index: 1; ${generalStyles}`);

        container.append(fgCanvas, canvas, bgCanvas);

        fgCtx = fgCanvas.getContext('2d');
        ctx = canvas.getContext('2d');
        bgCtx = bgCanvas.getContext('2d');

        // Settings
        convertSymbols(DEFAULT_SYMBOLS);

        DEFAULT_FX.setColor(DEFAULT_COLOR);

        if (size) {
            resizeContainer(size.width, size.height);
        }
        // if (settings) {
        //     if (settings.size) resizeContainer(settings.size.width, settings.size.height);
        //     if (settings.color) Settings.setColor(settings.color);
        //     if (settings.backgroundColor) Settings.setBackgroundColor(settings.backgroundColor);
        //     if (settings.symbols) Settings.setSymbols(settings.symbols);
        //     if (settings.speed) Settings.setSpeed(settings.speed);
        //     if (settings.lineLength) Settings.setLineLength(settings.lineLength);
        //     // if (settings.rotation) Settings.setRotation(settings.rotation);
        //     if (settings.updateRateFX) Settings.setUpdateRateFX(settings.updateRateFX);
        //     // if (settings.useFX != null) Settings.setUseFX(settings.useFX);
        //     if (settings.fx) Settings.setFX(settings.fx);
        //     if (settings.compositeAlpha) Settings.setCompositeAlpha(settings.compositeAlpha);
        //     if (settings.moveChance) Settings.setMoveChance(settings.moveChance);
        //     if (settings.mutationChance) Settings.setMutationChance(settings.mutationChance);
        // }
    }

    /**
     * Start the Matrix
     */
    export function start() {
        if (started) {
            console.error('Matrix : Cannot start twice.');

            return;
        }

        started = true;

        resize();

        RenderEngine.start();
    }

    // --- Settings

    /**
     * Resize the Matrix to the container dimensions
     */
    export function resize(): void {
        if (!created) {
            console.error('Matrix : Cannot resize before creation.');

            return;
        }

        width = container.clientWidth;
        height = container.clientHeight;

        fgCanvas.width = width;
        fgCanvas.height = height;

        canvas.width = width;
        canvas.height = height;

        bgCanvas.width = width;
        bgCanvas.height = height;

        fx.resize(width, height);

        RenderEngine.recalculate_columns();
    }

    /**
     * Resize the container element and the Matrix <br/>
     * Note: This will set inline styles, be sure your site styles take that into account!
     *
     * @param _width The new css width
     * @param _height The new css height
     */
    export function resizeContainer(_width: string, _height: string): void {
        if (!created) {
            console.error('Matrix : Cannot resize container before creation.');

            return;
        }

        container.style.width = _width;
        container.style.height = _height;

        resize();
    }

    /**
     * Get the container element the Matrix is inside of
     */
    export function getContainer(): HTMLElement {
        return container;
    }

    /**
     * This will cause the canvas to only render the FX and not composite the actual Matrix. <br />
     * Note: This option can only be enabled <b>before</b> the Matrix is started!
     */
    export function debug_fx(): void {
        if (started) throw new Error('Cannot debug fx if already started!');

        // Settings.setUseFX(true);

        RenderEngine.debug_fx();
    }

    /**
     * Contains all the changeable settings for Matrix
     */
    /** */
    export module Settings {

        function checkCreated(settingName: string) {
            if (!created) throw new Error(`Cannot set setting "${settingName}" before creation!`);
        }

        export type Color = string | CanvasGradient | CanvasPattern;

        /**
         * Set the color of the {@link MatrixFX.BUILTIN_FX_COLOR BUILTIN_FX_COLOR}
         *
         * @param _color The new color
         */
        export function setColor(_color: Color = DEFAULT_COLOR): Settings {
            DEFAULT_FX.setColor(_color);

            return Settings;
        }

        /**
         * Get the current {@link MatrixFX.BUILTIN_FX_COLOR BUILTIN_FX_COLOR} color
         */
        export function getColor(): Color {
            return DEFAULT_FX.getColor();
        }

        /**
         * Set the color of the background
         *
         * @param _backgroundColor The new background color
         */
        export function setBackgroundColor(_backgroundColor: Color = DEFAULT_BACKGROUND_COLOR): Settings {
            backgroundColor = _backgroundColor;

            bgCtx.fillStyle = backgroundColor;

            bgCtx.beginPath();
            bgCtx.fillRect(0, 0, width, height);

            fgCtx.fillStyle = backgroundColor;

            return Settings;
        }

        /**
         * Get the current background color
         */
        export function getBackgroundColor(): Color {
            return backgroundColor;
        }

        /**
         * Set the symbols for Matrix to use
         *
         * @param _symbols The new symbols
         */
        export function setSymbols(_symbols: string = DEFAULT_SYMBOLS): Settings {
            checkCreated('symbols');

            convertSymbols(_symbols);

            RenderEngine.recalculate_columns();

            return Settings;
        }

        /**
         * Get the current symbols the Matrix is using
         */
        export function getSymbols(): string {
            return characters;
        }

        /**
         * Set the speed of the Matrix columns
         *
         * @param _speed The new speed
         */
        export function setSpeed(_speed: number = DEFAULT_SPEED): Settings {
            if (_speed < 1 || _speed > MAX_SPEED) _speed = DEFAULT_SPEED;

            speed = _speed;

            return Settings;
        }

        /**
         * Get the current speed of the Matrix columns
         */
        export function getSpeed(): number {
            return speed;
        }

        /**
         * Set the <b>max</b> line length for the Matrix column segments
         *
         * @param _lineLength The new <b>max</b> line length
         */
        export function setLineLength(_lineLength: number = DEFAULT_LINE_LENGTH): Settings {
            if (_lineLength < 1 || _lineLength > MAX_LINE_LENGTH) _lineLength = DEFAULT_LINE_LENGTH;

            lineLength = _lineLength;

            return Settings;
        }

        /**
         * Get the current <b>max</b> line length
         */
        export function getLineLength(): number {
            return lineLength;
        }

        /*
         * @deprecated Rotation is not supported starting Build 2908, please implement your own rotation mechanism at your own risk of performance loss!
         *
        export function setRotation(_rotation: number): void {
            throw new Error('Rotation is not supported starting Build 2908, please implement your own rotation mechanism at your own risk of performance loss!');
        }
         */

        /*
         * @deprecated Rotation is not supported starting Build 2908, please implement your own rotation mechanism at your own risk of performance loss!
         *
        export function getRotation(): number {
            return 0;
        }
         */

        /**
         * Set the FX update rate
         *
         * @param _ups The new FX update rate
         */
        export function setUpdateRateFX(_ups: number = DEFAULT_UPDATE_RATE_FX): Settings {
            if (_ups < 1) _ups = DEFAULT_UPDATE_RATE_FX;

            upsFX = _ups;

            return Settings;
        }

        /**
         * Get the current FX update rate
         */
        export function getUpdateRate(): number {
            return upsFX;
        }

        /*
         * @deprecated FX is always enabled by default since build 3108.
         *
        export function setUseFX(_useFX: boolean = false): void {
            throw new Error('FX is always enabled by default since build 3108.');
        }
         */

        /*
         * @deprecated FX is always enabled by default since build 3108.
         *
        export function getUseFX(): boolean {
            return true;
        }
         */

        /**
         * Set the {@link MatrixFX.FX} to be used
         *
         * @param _fx The new {@link MatrixFX.FX}
         */
        export function setFX(_fx: MatrixFX.FX = DEFAULT_FX): Settings {
            checkCreated('fx');

            fx = _fx;

            fx.resize(width, height);

            return Settings;
        }

        /**
         * Get the current {@link MatrixFX.FX} that is used
         */
        export function getFX(): MatrixFX.FX {
            return fx;
        }

        /**
         * Set the composite alpha for the Matrix canvas to use
         *
         * @param _alpha The new composite alpha
         */
        export function setCompositeAlpha(_alpha: number = DEFAULT_COMPOSITE_ALPHA): Settings {
            compositeAlpha = _alpha;

            fgCtx.globalAlpha = compositeAlpha;

            return Settings;
        }

        /**
         * Get the current composite alpha that the Matrix canvas is using
         */
        export function getCompositeAlpha(): number {
            return compositeAlpha;
        }

        /**
         * Set the move chance of the Matrix columns
         *
         * @param _chance The new move chance (0.0 - 1.0)
         */
        export function setMoveChance(_chance: number = DEFAULT_MOVE_CHANCE): Settings {
            moveChance = _chance;

            return Settings;
        }

        /**
         * Get the current move chance of the Matrix columns
         */
        export function getMoveChance(): number {
            return moveChance;
        }

        /**
         * Set the mutation chance of a letter in a column segment
         *
         * @param _chance The new mutation chance (0.0 - 1.0)
         */
        export function setMutationChance(_chance: number = DEFAULT_MUTATION_CHANCE): Settings {
            mutationChance = _chance;

            return Settings;
        }

        /**
         * Get the current mutation chance of a letter in a column segment
         */
        export function getMutationChance(): number {
            return mutationChance;
        }

        /**
         * Set the foreground overlay mode
         *
         * @param _overlayMode The new overlay mode
         */
        export function setOverlayMode(_overlayMode: Utility.OverlayMode = DEFAULT_OVERLAY_MODE): Settings {
            overlayMode = _overlayMode;

            // TODO

            return Settings;
        }

        export function getOverlayMode(): Utility.OverlayMode {
            return overlayMode;
        }

        export function setLetterMutationMode(_letterMutationMode: Utility.LetterMutationMode = DEFAULT_LETTER_MUTATION_MODE): Settings {
            letterMutationMode = _letterMutationMode;

            // TODO

            return Settings;
        }

        export function getLetterMutationMode(): Utility.LetterMutationMode {
            return letterMutationMode;
        }

    }

    // --- Rendering

    /**
     * Contains all logic responsible for rendering
     */
    /** */
    module RenderEngine {

        /**
         * Represents a column in the Matrix
         */
        interface Column {
            wait: number,
            x: number,
            segments: ColumnSegment[]
        }

        /**
         * Represents a segment in an column
         */
        interface ColumnSegment {
            delay: number,
            y: number,
            letters: number[],
            length: number,
        }

        let columns: Column[] = [];

        /**
         * Recalculate the amount of columns
         */
        export function recalculate_columns(): void {
            columns = [];

            paint_reset();

            for (let x = 0; x < width; x += COLUMN_SIZE) {
                columns.push({
                    wait: DEFAULT_WAIT_TIME + (DEFAULT_WAIT_TIME * moveChance * Math.random()),
                    x: x,
                    segments: [create_segment()]
                });
            }
        }

        /**
         * Creates a new segment
         */
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

        let background: BGBuffer;

        function render_columns(delta: number) {
            if (columnsAccumulator >= 1000.0 / speed) {
                // ctx.beginPath();
                ctx.clearRect(0, 0, width, height);
                fgCtx.clearRect(0, 0, width, height);

                render_background();

                for (let l_Column of columns) {
                    // randomly determine regarding speed whether a column should be moved.
                    let move: boolean = (l_Column.wait -= delta) <= 0;

                    if (move) {
                        l_Column.wait = DEFAULT_WAIT_TIME + (DEFAULT_WAIT_TIME * moveChance * Math.random());
                    }

                    let needsNext = move;
                    for (let l_Segment of l_Column.segments) {
                        if (l_Segment.delay > 0) {
                            needsNext = false;

                            if (!move) continue;

                            l_Segment.delay -= 1;

                            continue;
                        }

                        // ensure max one letter gets changed
                        let changedLetter: boolean = true;

                        if (move) {
                            changedLetter = false;

                            if (l_Segment.letters.length < l_Segment.length) {
                                l_Segment.letters.push(random_char());

                                needsNext = false;
                            } else {
                                // ctx.beginPath();
                                ctx.clearRect(l_Column.x, l_Segment.y, COLUMN_SIZE, COLUMN_SIZE);

                                l_Segment.y += COLUMN_SIZE;
                            }
                        }

                        for (let i = 0, l = l_Segment.letters.length; i < l; i ++) {
                            let letter = l_Segment.letters[i];
                            // chance that letter gets changed
                            if (!changedLetter && Math.random() < mutationChance) {
                                changedLetter = true;

                                letter = random_char();
                                l_Segment.letters[i] = letter;

                                paint_letter_mutation(l_Column.x, l_Segment.y + COLUMN_SIZE * i);
                            } else {
                                paint_letter(letter, l_Column.x, l_Segment.y + COLUMN_SIZE * i);

                                if (i + 1 < l) {
                                    fgCtx.beginPath();
                                    fgCtx.fillRect(l_Column.x, l_Segment.y - 8 + COLUMN_SIZE * i, COLUMN_SIZE, COLUMN_SIZE);
                                }
                            }
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

        function render_background() {
            ctx.globalAlpha = compositeAlpha;

            ctx.drawImage(background.html_canvas(), 0, 0);

            ctx.globalAlpha = 1.0;
        }

        function render_composite_color(/* delta: number */) {
            ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_ATOP;

            if (colorAccumulator >= 1000.0 / upsFX) {
                fx.draw();

                colorAccumulator = 0;
            }

            fx.drawTo(ctx);

            ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_OVER;
        }

        function render_process_normal(delta: number): void {
            columnsAccumulator += delta;

            render_columns(delta);

            colorAccumulator += delta;

            render_composite_color(/* delta */);
        }

        function render_process_debugFX(delta: number): void {
            colorAccumulator += delta;

            if (colorAccumulator >= 1000.0 / upsFX) {
                ctx.fillRect(0, 0, width, height);

                render_composite_color(/* delta */);
            }
        }

        let render_process: (delta: number) => void = render_process_normal;

        /**
         * Tell the RenderEngine to debug FX
         */
        export function debug_fx() {
            render_process = render_process_debugFX;
        }

        export function start() {
            function loop(timestamp) {
                let delta = timestamp - lastRender;

                render_process(delta);

                lastRender = timestamp;
                window.requestAnimationFrame(loop);
            }

            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#000';

            background = new BGBuffer();

            paint_reset();

            let lastRender = 0;
            window.requestAnimationFrame(loop);
        }

        function paint_reset(): void {
            ctx.clearRect(0, 0, width, height);

            ctx.scale(1.2, 1.2);

            if (background) background.resize(width, height);

            bgCtx.fillStyle = backgroundColor;

            bgCtx.scale(1.2, 1.2);

            bgCtx.beginPath();
            bgCtx.fillRect(0, 0, width, height);

            fgCtx.globalAlpha = compositeAlpha;

            fgCtx.scale(1.2, 1.2);
        }

        function paint_letter(char: number, x: number, y: number): void {
            // ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.beginPath();
            ctx.strokeText(characters[char], x + 6 - characterSizes[char], y + 2, COLUMN_SIZE);
        }

        function paint_letter_mutation(x: number, y: number) {
            // ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.globalAlpha = 0.3;

            ctx.beginPath();
            ctx.fillRect(x + 3, y + 1, COLUMN_SIZE - 6, COLUMN_SIZE - 2);

            ctx.globalAlpha = 1.0;
        }

        // --- Buffers

        /**
         * This renders the "dotted" background to save on resources
         * as it only renders it on every resize
         */
        class BGBuffer extends Utility.Buffer {

            constructor() {
                super();

                this.ctx.fillStyle = '#000';
            }

            public on_resize(): void {
                this.draw();
            }

            public draw(): void {
                this.ctx.clearRect(0, 0, this.width(), this.height());

                for (let y = 0; y < this.height(); y += COLUMN_SIZE) {
                    for (let x = 0; x < this.width(); x += COLUMN_SIZE) {
                        this.ctx.beginPath();
                        this.ctx.fillRect(x + 5, y + 5, 2, 2);
                    }
                }
            }

        }

    }

}
