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
    export const DEFAULT_LINE_LENGTH = 16;
    export const DEFAULT_UPDATE_RATE = 12;
    export const DEFAULT_UPDATE_RATE_FX = 32;
    export const DEFAULT_FX = MatrixFX.BUILTIN_FX_COLOR;
    export const DEFAULT_COMPOSITE_ALPHA = 0.3;
    export const DEFAULT_COMPOSITE_MUTATION = true;
    export const DEFAULT_MOVE_CHANCE = 0.51;
    export const DEFAULT_WAIT_TIME = 3;
    export const DEFAULT_MUTATION_CHANCE = 0.1;
    export const DEFAULT_OVERLAY_MODE = Utility.OverlayMode.NORMAL;
    export const DEFAULT_LETTER_MUTATION_MODE = Utility.LetterMutationMode.NORMAL;
    export const DEFAULT_SCALE_X = 1.2;
    export const DEFAULT_SCALE_Y = 1.2;

    export const COLUMN_SIZE = 12;
    export const MAX_SPEED = 32;
    export const MAX_LINE_LENGTH = 32;

    // --- Internal Settings

    let created = false;
    let started = false;

    let width: number;
    let height: number;

    let scaleX: number = DEFAULT_SCALE_X;
    let scaleY: number = DEFAULT_SCALE_Y;

    let container: HTMLElement;

    let targetCanvas: HTMLCanvasElement;
    let targetCanvasCtx: CanvasRenderingContext2D;

    let fgCanvas: HTMLCanvasElement;
    let fgCtx: CanvasRenderingContext2D;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let bgCanvas: HTMLCanvasElement;
    let bgCtx: CanvasRenderingContext2D;

    let bgColorCanvas: HTMLCanvasElement;
    let bgColorCtx: CanvasRenderingContext2D;

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
    // let speed: number = DEFAULT_SPEED;
    let lineLength: number = DEFAULT_LINE_LENGTH;

    let ups: number = DEFAULT_UPDATE_RATE;

    let upsFX: number = DEFAULT_UPDATE_RATE_FX;
    let fx: MatrixFX.FX = DEFAULT_FX;

    let compositeAlpha: number = DEFAULT_COMPOSITE_ALPHA;
    let compositeMutation: boolean = DEFAULT_COMPOSITE_MUTATION;

    let moveChance: number = DEFAULT_MOVE_CHANCE;
    let mutationChance: number = DEFAULT_MUTATION_CHANCE;

    let overlayMode: Utility.OverlayMode = DEFAULT_OVERLAY_MODE;
    let letterMutationMode: Utility.LetterMutationMode = DEFAULT_LETTER_MUTATION_MODE;

    // --- Creation

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

        targetCanvas = document.createElement('canvas');
        targetCanvasCtx = targetCanvas.getContext('2d');

        fgCanvas = document.createElement('canvas');
        canvas = document.createElement('canvas');
        bgCanvas = document.createElement('canvas');
        bgColorCanvas = document.createElement('canvas');

        // let generalStyles = 'position: absolute;';
        // fgCanvas.setAttribute('style', `z-index: 3; ${generalStyles}`);
        // canvas.setAttribute('style', `z-index: 2; ${generalStyles}`);
        // bgCanvas.setAttribute('style', `z-index: 1; ${generalStyles}`);
        // container.append(fgCanvas, canvas, bgCanvas);

        container.append(targetCanvas);

        fgCtx = fgCanvas.getContext('2d');
        ctx = canvas.getContext('2d');
        bgCtx = bgCanvas.getContext('2d');
        bgColorCtx = bgColorCanvas.getContext('2d');

        // Settings
        convertSymbols(DEFAULT_SYMBOLS);

        DEFAULT_FX.setColor(DEFAULT_COLOR);

        if (size) {
            resizeContainer(size.width, size.height);
        } else {
            resize();
        }
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

        targetCanvas.width = width;
        targetCanvas.height = height;

        fgCanvas.width = width;
        fgCanvas.height = height;

        canvas.width = width;
        canvas.height = height;

        bgCanvas.width = width;
        bgCanvas.height = height;

        bgColorCanvas.width = width;
        bgColorCanvas.height = height;

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

        function checkCreated(settingName: string): void {
            if (!created) throw new Error(`Cannot set setting "${settingName}" before creation!`);
        }

        export type Color = string | CanvasGradient | CanvasPattern;

        /**
         * Set the color of the {@link MatrixFX.BUILTIN_FX_COLOR BUILTIN_FX_COLOR}
         *
         * @param _color The new color
         */
        export function setColor(_color: Color = DEFAULT_COLOR): void {
            DEFAULT_FX.setColor(_color);

            return this;
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
        export function setBackgroundColor(_backgroundColor: Color = DEFAULT_BACKGROUND_COLOR): void {
            backgroundColor = _backgroundColor;

            bgColorCtx.fillStyle = backgroundColor;

            bgColorCtx.beginPath();
            bgColorCtx.fillRect(0, 0, width, height);

            fgCtx.fillStyle = backgroundColor;

            return this;
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
        export function setSymbols(_symbols: string = DEFAULT_SYMBOLS): void {
            checkCreated('symbols');

            convertSymbols(_symbols);

            RenderEngine.recalculate_columns();
        }

        /**
         * Get the current symbols the Matrix is using
         */
        export function getSymbols(): string {
            return characters;
        }

        /**
         * Set the <b>max</b> line length for the Matrix column segments
         *
         * @param _lineLength The new <b>max</b> line length
         */
        export function setLineLength(_lineLength: number = DEFAULT_LINE_LENGTH): void {
            if (_lineLength < 1 || _lineLength > MAX_LINE_LENGTH) _lineLength = DEFAULT_LINE_LENGTH;

            lineLength = _lineLength;
        }

        /**
         * Get the current <b>max</b> line length
         */
        export function getLineLength(): number {
            return lineLength;
        }

        /**
         * Set the update rate
         *
         * @param _ups The new update rate
         */
        export function setUpdateRate(_ups: number = DEFAULT_UPDATE_RATE): void {
            ups = Math.max(1, _ups);
        }

        /**
         * Get the current update rate
         */
        export function getUpdateRate(): number {
            return ups;
        }

        /**
         * Set the update rate
         *
         * @param _upsFX The new FX update rate
         */
        export function setUpdateRateFX(_upsFX: number = DEFAULT_UPDATE_RATE_FX): void {
            upsFX = Math.max(1, _upsFX);
        }

        /**
         * Get the current FX update rate
         */
        export function getUpdateRateFX(): number {
            return upsFX;
        }

        /**
         * Set the {@link MatrixFX.FX} to be used
         *
         * @param _fx The new {@link MatrixFX.FX}
         */
        export function setFX(_fx: MatrixFX.FX = DEFAULT_FX): void {
            checkCreated('fx');

            fx = _fx;

            fx.resize(width, height);
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
        export function setCompositeAlpha(_alpha: number = DEFAULT_COMPOSITE_ALPHA): void {
            compositeAlpha = _alpha;

            fgCtx.globalAlpha = compositeAlpha;
        }

        /**
         * Get the current composite alpha that the Matrix canvas is using
         */
        export function getCompositeAlpha(): number {
            return compositeAlpha;
        }

        /**
         * Set whether the letter mutation should use the defined composite alpha
         *
         * @param _compositeMutation Whether letter mutation should use composite alpha
         */
        export function setCompositeMutation(_compositeMutation: boolean): void {
            compositeMutation = _compositeMutation;
        }

        /**
         * Does letter mutation use the composite alpha
         */
        export function getCompositeMutation(): boolean {
            return compositeMutation;
        }

        /**
         * Set the move chance of the Matrix columns
         *
         * @param _chance The new move chance (0.0 - 1.0)
         */
        export function setMoveChance(_chance: number = DEFAULT_MOVE_CHANCE): void {
            moveChance = _chance;
        }

        /**
         * Get the current move chance of the Matrix columns
         */
        export function getMoveChance(): number {
            return moveChance;
        }

        /**
         * Set the mutation chance of a letter in a column segment <br />
         * Only effective if {@link getLetterMutationMode getLetterMutationMode()} is
         * {@link Utility.LetterMutationMode.RANDOM LetterMutationMode.RANDOM} or {@link Utility.LetterMutationMode.BOTH LetterMutationMode.BOTH}
         *
         * @param _chance The new mutation chance (0.0 - 1.0)
         */
        export function setMutationChance(_chance: number = DEFAULT_MUTATION_CHANCE): void {
            mutationChance = _chance;
        }

        /**
         * Get the current mutation chance of a letter in a column segment
         */
        export function getMutationChance(): number {
            return mutationChance;
        }

        /**
         * Set the foreground {@link Utility.OverlayMode OverlayMode}
         *
         * @param _overlayMode The new {@link Utility.OverlayMode OverlayMode}
         */
        export function setOverlayMode(_overlayMode: Utility.OverlayMode = DEFAULT_OVERLAY_MODE): void {
            overlayMode = _overlayMode;
        }

        /**
         * Get the current foreground {@link Utility.OverlayMode OverlayMode}
         */
        export function getOverlayMode(): Utility.OverlayMode {
            return overlayMode;
        }

        /**
         * Set the {@link Utility.LetterMutationMode LetterMutationMode}
         *
         * @param _letterMutationMode The new {@link Utility.LetterMutationMode LetterMutationMode}
         */
        export function setLetterMutationMode(_letterMutationMode: Utility.LetterMutationMode = DEFAULT_LETTER_MUTATION_MODE): void {
            letterMutationMode = _letterMutationMode;
        }

        /**
         * Get the current {@link Utility.LetterMutationMode LetterMutationMode}
         */
        export function getLetterMutationMode(): Utility.LetterMutationMode {
            return letterMutationMode;
        }

        /**
         * Set the scale
         *
         * @param _scaleX The x scale
         * @param _scaleY The y scale
         */
        export function setScale(_scaleX: number, _scaleY?: number) {
            checkCreated('scale');

            scaleX = Math.max(DEFAULT_SCALE_X, _scaleX);
            scaleY = Math.max(DEFAULT_SCALE_Y, !!_scaleY ? _scaleY : _scaleX);

            RenderEngine.recalculate_columns();
        }

        /**
         * Get the current scale, scaleX being [0] and scaleY being [1]
         */
        export function getScale(): number[] {
            return [scaleX, scaleY];
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
            x: number,
            segments: ColumnSegment[],
            nextWait: number
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
                    x: x,
                    segments: [create_segment()],
                    nextWait: DEFAULT_WAIT_TIME
                });
            }
        }

        /**
         * Creates a new segment
         */
        function create_segment(): ColumnSegment {
            let hLineLength = lineLength / 2.0;
            let _length = Math.ceil(hLineLength + Math.random() * hLineLength);
            let _letters = [];

            for (let i = 0; i < _length; i ++) {
                _letters.push(random_char());
            }

            return {
                delay: Math.ceil(5 + Math.random() * 15),
                y: -((_length + 1) * COLUMN_SIZE),
                letters: _letters,
                length: _length
            };
        }

        let accumulatorRender = 0;
        let accumulatorFX = 0;

        let background: BGBuffer;

        function render_columns(/* delta: number */) {
            switch (overlayMode) {
                case Utility.OverlayMode.NONE:
                    ctx.clearRect(0, 0, width, height);
                    fgCtx.clearRect(0, 0, width, height);

                    break;
                case Utility.OverlayMode.NORMAL:
                case Utility.OverlayMode.FULL:
                    ctx.clearRect(0, 0, width, height);
                    fgCtx.clearRect(0, 0, width, height);

                    fgCtx.beginPath();
                    fgCtx.fillRect(0, 0, width, height);

                    break;
                case Utility.OverlayMode.FADE:
                    fgCtx.beginPath();
                    fgCtx.fillRect(0, 0, width, height);

                    break;
            }

            for (let l_Column of columns) {
                let move: boolean = true;

                if (l_Column.nextWait > 0) {
                    l_Column.nextWait -= 1;
                } else {
                    l_Column.nextWait = DEFAULT_WAIT_TIME;
                    move = Math.random() < moveChance;
                }

                let needsNext: boolean = move;

                const x = l_Column.x;

                for (let l_Segment of l_Column.segments) {
                    if (l_Segment.delay > 0 && move) {
                        needsNext = false;

                        l_Segment.delay -= 1;

                        continue;
                    }

                    if (l_Segment.length > 0) {
                        needsNext = false;

                        l_Segment.length -= 1;
                    }

                    let hasMutation: number = -1;

                    if (move) {
                        l_Segment.y += COLUMN_SIZE;

                        switch (letterMutationMode) {
                            case Utility.LetterMutationMode.NORMAL:
                                shift_letters(l_Segment);

                                break;
                            case Utility.LetterMutationMode.RANDOM:
                                hasMutation = randomize_letter(l_Segment, hasMutation);

                                break;
                            case Utility.LetterMutationMode.BOTH:
                                shift_letters(l_Segment);
                                hasMutation = randomize_letter(l_Segment, hasMutation);

                                break;
                        }
                    }

                    // bgCtx.beginPath();
                    bgCtx.clearRect(x, l_Segment.y, COLUMN_SIZE, l_Segment.letters.length * COLUMN_SIZE);

                    for (let i = 0, l = l_Segment.letters.length; i < l; i ++) {
                        const y = l_Segment.y + COLUMN_SIZE * i;

                        if (i != hasMutation) {
                            paint_letter(l_Segment.letters[i], x, y);
                        } else {
                            paint_letter_mutation(x, y);
                        }

                        if (i + 1 == l && overlayMode != Utility.OverlayMode.FULL) {
                            fgCtx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);
                        }
                    }

                    if (overlayMode == Utility.OverlayMode.FADE) {
                        fgCtx.globalAlpha = compositeAlpha * 2;

                        fgCtx.beginPath();
                        fgCtx.fillRect(x, l_Segment.y - COLUMN_SIZE, COLUMN_SIZE, COLUMN_SIZE);

                        fgCtx.globalAlpha = compositeAlpha;
                    }
                }

                if (needsNext) {
                    l_Column.segments.push(create_segment());
                }

                l_Column.segments = l_Column.segments.filter(segment => segment.y - (COLUMN_SIZE * segment.length) < height);
            }
        }

        function render_background() {
            // ctx.globalCompositeOperation = Utility.DrawingMode.DESTINATION_OVER;
            bgCtx.clearRect(0, 0, width, height);
            bgCtx.globalAlpha = compositeAlpha;

            bgCtx.drawImage(background.html_canvas(), 0, 0);

            bgCtx.globalAlpha = 1.0;
            // ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_OVER;
        }

        function render_composite_color(/* delta: number */) {
            ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_ATOP;
            bgCtx.globalCompositeOperation = Utility.DrawingMode.SOURCE_ATOP;

            fx.drawTo(ctx, width, height);
            fx.drawTo(bgCtx, width, height);

            ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_OVER;
            bgCtx.globalCompositeOperation = Utility.DrawingMode.SOURCE_OVER;
        }

        function render_process_normal(/* delta: number */): void {
            // renders the background behind the columns
            render_background();

            // takes care of letter and fg layer
            render_columns(/* delta */);

            // renders fx into the dots and columns
            render_composite_color(/* delta */);

            targetCanvasCtx.drawImage(bgColorCanvas, 0, 0);
            targetCanvasCtx.drawImage(bgCanvas, 0, 0);

            targetCanvasCtx.globalCompositeOperation = Utility.DrawingMode.SOURCE_ATOP;
            targetCanvasCtx.drawImage(canvas, 0, 0);
            targetCanvasCtx.globalCompositeOperation = Utility.DrawingMode.SOURCE_OVER;

            targetCanvasCtx.drawImage(fgCanvas, 0, 0);
        }

        function render_process_debugFX(/* delta: number */): void {
            if (accumulatorFX >= 1000.0 / upsFX) {
                accumulatorFX -= 1000.0 / upsFX;

                ctx.fillRect(0, 0, width, height);

                render_composite_color(/* delta */);
            }
        }

        let render_process: (/* delta: number */) => void = render_process_normal;

        /**
         * Tell the RenderEngine to debug FX
         */
        export function debug_fx() {
            render_process = render_process_debugFX;
        }

        export function start() {
            function loop(timestamp) {
                let delta = timestamp - lastRender;

                accumulatorFX += delta;

                if (accumulatorFX >= 1000.0 / upsFX) {
                    accumulatorFX -= 1000.0 / upsFX;

                    if (accumulatorFX >= 1000.0 / upsFX) {
                        Utility.warn(`Skipping ${Math.ceil(accumulatorFX / (1000.0 / upsFX))} fx updates, is the update rate too fast?`);
                        accumulatorFX = 0;
                    }

                    fx.draw();
                }

                accumulatorRender += delta;

                if (accumulatorRender >= 1000.0 / ups) {
                    accumulatorRender -= 1000.0 / ups;

                    if (accumulatorRender >= 1000.0 / ups) {
                        Utility.warn(`Skipping ${Math.ceil(accumulatorRender / (1000.0 / ups))} render updates, is the update rate too fast?`);
                        accumulatorRender = 0;
                    }

                    render_process(/* delta */);
                }

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
            fgCtx.globalAlpha = compositeAlpha;

            fgCtx.resetTransform();
            fgCtx.scale(scaleX, scaleY);

            ctx.clearRect(0, 0, width, height);

            ctx.resetTransform();
            ctx.scale(scaleX, scaleY);

            if (background) background.resize(width, height);

            bgCtx.resetTransform();
            bgCtx.scale(scaleX, scaleY);

            bgColorCtx.fillStyle = backgroundColor;

            bgColorCtx.resetTransform();
            bgColorCtx.scale(scaleX, scaleY);

            bgColorCtx.beginPath();
            bgColorCtx.fillRect(0, 0, width, height);
        }

        function shift_letters(l_Segment: ColumnSegment) {
            l_Segment.letters.push(random_char());
            l_Segment.letters.shift();
        }

        function randomize_letter(l_Segment: ColumnSegment, hasMutation: number): number {
            if (hasMutation == -1 && Math.random() < mutationChance) {
                hasMutation = Math.floor((l_Segment.letters.length - 1) * Math.random());

                l_Segment.letters[hasMutation] = random_char();
            }

            return hasMutation;
        }

        function paint_letter(char: number, x: number, y: number): void {
            // ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.beginPath();
            ctx.strokeText(characters[char], x + 1 + (COLUMN_SIZE / 2.0) - characterSizes[char], y + COLUMN_SIZE - 1, COLUMN_SIZE / 2.0);
        }

        function paint_letter_mutation(x: number, y: number) {
            // ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.globalAlpha = compositeMutation ? compositeAlpha : 1.0;

            ctx.beginPath();
            ctx.fillRect(x + 2, y + 1, COLUMN_SIZE - 4, COLUMN_SIZE - 2);

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

            resize(width: number, height: number) {
                super.resize(width, height);

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
