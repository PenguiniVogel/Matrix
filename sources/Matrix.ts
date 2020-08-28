/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
module Matrix {

    export const DEFAULT_SIZE = 300;
    export const DEFAULT_COLOR = '#44ff00';
    export const DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';
    export const DEFAULT_SPEED = 1;
    export const DEFAULT_LINE_LENGTH = 16;
    export const DEFAULT_ROTATION = 0;
    export const DEFAULT_UPDATE_RATE_FX = 32;
    export const DEFAULT_FX: MatrixFX.FX = new MatrixFX.BasicColumnFX();
    export const DEFAULT_COMPOSITE_ALPHA = 0.3;
    export const DEFAULT_MOVE_CHANCE = 0.51;
    export const DEFAULT_MUTATION_CHANCE = 0.1;

    export const COLUMN_SIZE = 12;
    export const MAX_SPEED = 32;
    export const MAX_LINE_LENGTH = 32;

    // --- Internal Settings

    let created = false;
    let started = false;

    let width: number = DEFAULT_SIZE;
    let q_width: number = DEFAULT_SIZE;
    let height: number = DEFAULT_SIZE;
    let q_height: number = DEFAULT_SIZE;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let color: string = DEFAULT_COLOR;

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

    let speed: number = DEFAULT_SPEED;
    let lineLength: number = DEFAULT_LINE_LENGTH;
    let rotation: number = DEFAULT_ROTATION;
    let upsFX: number = DEFAULT_UPDATE_RATE_FX;
    let useFX: boolean = false;
    let fx: MatrixFX.FX = DEFAULT_FX;
    let compositeAlpha: number = DEFAULT_COMPOSITE_ALPHA;
    let moveChance: number = DEFAULT_MOVE_CHANCE;
    let mutationChance: number = DEFAULT_MUTATION_CHANCE;

    // --- Creation

    export interface OptionalSettings {
        /**
         * The initial size of the Matrix canvas
         */
        size?: {width: number, height: number},

        /**
         * The initial color of the Matrix canvas
         */
        color?: string,

        /**
         * The initial symbols of the Matrix
         */
        symbols?: string,

        /**
         * The initial speed of the columns
         */
        speed?: number,

        /**
         * The initial length of an column segment
         */
        lineLength?: number,

        /**
         * The initial rotation of the Matrix canvas
         */
        rotation?: number,

        /**
         * The initial update rate of the FX
         */
        updateRateFX?: number,

        /**
         * Whether to use FX or not initially
         */
        useFX?: boolean,

        /**
         * The initial {@link MatrixFX.FX} to use
         */
        fx?: MatrixFX.FX,

        /**
         * The initial composite alpha for the Matrix canvas
         */
        compositeAlpha?: number,

        /**
         * The initial move chance of an column
         */
        moveChance?: number,

        /**
         * The initial mutation chance of an letter in a column segment
         */
        mutationChance?: number
    }

    /**
     * Create the Matrix onto the specified selector. <br/>
     * Note: The selector must match and return a &lt;canvas&gt; element!
     *
     * @param selector The dom selector
     * @param settings {@link Matrix.OptionalSettings}
     */
    export function create(selector: string, settings?: OptionalSettings): void {
        let _canvas: HTMLCanvasElement = document.querySelector(selector);

        if (_canvas.tagName.toLowerCase() != 'canvas') return;

        created = true;

        canvas = _canvas;
        ctx = _canvas.getContext('2d');

        resize(q_width, q_height);

        // Settings
        convertSymbols(DEFAULT_SYMBOLS);

        if (settings) {
            if (settings.size) resize(settings.size.width, settings.size.height);
            if (settings.color) Settings.setColor(settings.color);
            if (settings.symbols) Settings.setSymbols(settings.symbols);
            if (settings.speed) Settings.setSpeed(settings.speed);
            if (settings.lineLength) Settings.setLineLength(settings.lineLength);
            if (settings.rotation) Settings.setRotation(settings.rotation);
            if (settings.updateRateFX) Settings.setUpdateRateFX(settings.updateRateFX);
            if (settings.useFX != null) Settings.setUseFX(settings.useFX);
            if (settings.fx && settings.fx.render) Settings.setFX(settings.fx);
            if (settings.compositeAlpha) Settings.setCompositeAlpha(settings.compositeAlpha);
            if (settings.moveChance) Settings.setMoveChance(settings.moveChance);
            if (settings.mutationChance) Settings.setMutationChance(settings.mutationChance);
        }
    }

    /**
     * Start the Matrix
     */
    export function start() {
        if (started) return;

        started = true;

        RenderEngine.start();
    }

    // --- Settings

    /**
     * Resize the Matrix canvas
     *
     * @param _width The new width
     * @param _height The new height
     */
    export function resize(_width: number = DEFAULT_SIZE, _height: number = DEFAULT_SIZE): void {
        if (!created) {
            q_width = _width;
            q_height = _height;

            return;
        }

        width = _width;
        height = _height;

        canvas.width = _width;
        canvas.height = _height;

        fx.fx_buffer(_width, _height);

        RenderEngine.recalculate_columns();
    }

    /**
     * This will cause the canvas to only render the FX and not composite the actual Matrix. <br />
     * Note: This option can only be enabled <b>before</b> the Matrix is started!
     */
    export function debug_fx(): void {
        if (started) throw new Error('Cannot debug fx if already started!');

        Settings.setUseFX(true);

        RenderEngine.debug_fx();
    }

    export module Settings {

        function checkCreated(settingName: string) {
            if (!created) throw new Error(`Cannot set setting "${settingName}" before creation!`);
        }

        /**
         * Set the color of the Matrix canvas
         *
         * @param _color The new color
         */
        export function setColor(_color: string = DEFAULT_COLOR): void {
            color = _color;
        }

        /**
         * Get the current Matrix canvas color
         */
        export function getColor(): string {
            return color;
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
         * Set the speed of the Matrix columns
         *
         * @param _speed The new speed
         */
        export function setSpeed(_speed: number = DEFAULT_SPEED): void {
            if (_speed < 1 || _speed > MAX_SPEED) _speed = DEFAULT_SPEED;

            speed = _speed;
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
         * Set the rotation of the Matrix canvas
         *
         * @param _rotation The new rotation
         */
        export function setRotation(_rotation: number = DEFAULT_ROTATION): void {
            checkCreated('rotation');

            rotation = Utility.fixDegrees(_rotation);

            // TODO rotation
        }

        /**
         * Get the current rotation of the Matrix canvas
         */
        export function getRotation(): number {
            return rotation;
        }

        /**
         * Set the FX update rate
         *
         * @param _ups The new FX update rate
         */
        export function setUpdateRateFX(_ups: number = DEFAULT_UPDATE_RATE_FX): void {
            if (_ups < 1) _ups = DEFAULT_UPDATE_RATE_FX;

            upsFX = _ups;
        }

        /**
         * Get the current FX update rate
         */
        export function getUpdateRate(): number {
            return upsFX;
        }

        /**
         * Set whether FX should be used
         *
         * @param _useFX Whether FX should be used
         */
        export function setUseFX(_useFX: boolean = false): void {
            useFX = _useFX;
        }

        /**
         * Get whether FX is currently used
         */
        export function getUseFX(): boolean {
            return useFX;
        }

        /**
         * Set the {@link MatrixFX.FX} to be used
         *
         * @param _fx The new {@link MatrixFX.FX}
         */
        export function setFX(_fx: MatrixFX.FX = DEFAULT_FX): void {
            checkCreated('fx');

            fx = _fx;

            fx.fx_buffer(width, height);
            fx.fx_render(0, width, height);
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
        export function setCompositeAlpha(_alpha: number = DEFAULT_COMPOSITE_ALPHA) {
            compositeAlpha = _alpha;
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
        export function setMoveChance(_chance: number = DEFAULT_MOVE_CHANCE) {
            moveChance = _chance;
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
        export function setMutationChance(_chance: number = DEFAULT_MUTATION_CHANCE) {
            mutationChance = _chance;
        }

        /**
         * Get the current mutation chance of a letter in a column segment
         */
        export function getMutationChance(): number {
            return mutationChance;
        }

    }

    // --- Rendering

    module RenderEngine {

        /**
         * Represents a column in the Matrix
         */
        interface Column {
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

        function render_columns(/* delta: number */) {
            if (columnsAccumulator >= 1000.0 / speed) {
                ctx.beginPath();
                ctx.clearRect(0, 0, width, height);

                render_background();

                for (let l_Column of columns) {
                    // randomly determine regarding speed whether a column should be moved.
                    let move: boolean = Math.random() < moveChance;

                    let needsNext = true;
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
                                ctx.beginPath();
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

                                continue;
                            }

                            paint_letter(letter, l_Column.x, l_Segment.y + COLUMN_SIZE * i);
                        }
                    }

                    if (move && needsNext) {
                        l_Column.segments.push(create_segment());
                    }

                    l_Column.segments = l_Column.segments.filter(segment => segment.y - (COLUMN_SIZE * segment.length) < height);
                }

                columnsAccumulator = 0;
            }
        }

        function render_background() {
            ctx.globalAlpha = compositeAlpha;

            ctx.drawImage(background.getBuffer(), 0, 0);

            ctx.globalAlpha = 1.0;
        }

        function render_composite_color(delta: number) {
            ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_ATOP;

            if (useFX) {
                if (colorAccumulator >= 1000.0 / upsFX) {
                    fx.fx_render(delta, width, height);

                    colorAccumulator = 0;
                }

                fx.fx_draw(ctx, width, height);
            } else {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.fillRect(0, 0, width, height);
            }

            ctx.globalCompositeOperation = Utility.DrawingMode.SOURCE_OVER;

            ctx.fillStyle = '#000';
        }

        function render_process_normal(delta: number): void {
            columnsAccumulator += delta;

            render_columns(/* delta */);

            colorAccumulator += delta;

            render_composite_color(delta);
        }

        function render_process_debugFX(delta: number): void {
            colorAccumulator += delta;

            if (colorAccumulator >= 1000.0 / upsFX) {
                ctx.fillRect(0, 0, width, height);

                render_composite_color(delta);
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

            background = new BGBuffer();

            ctx.fillStyle = '#000';

            paint_reset();

            let lastRender = 0;
            window.requestAnimationFrame(loop);
        }

        function paint_reset(): void {
            ctx.clearRect(0, 0, width, height);

            ctx.scale(1.2, 1.2);

            if (background) background.render();
        }

        function paint_letter(char: number, x: number, y: number): void {
            ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.beginPath();
            ctx.fillText(characters[char], x + 6 - characterSizes[char], y + 2, COLUMN_SIZE);
        }

        function paint_letter_mutation(x: number, y: number) {
            ctx.beginPath();
            ctx.clearRect(x, y, COLUMN_SIZE, COLUMN_SIZE);

            ctx.globalAlpha = 0.3;

            ctx.beginPath();
            ctx.fillRect(x + 3, y + 1, COLUMN_SIZE - 6, COLUMN_SIZE - 2);

            ctx.globalAlpha = 1.0;
        }

        /**
         * This renders the "dot" background to save on resources
         * as it only renders it on every resize
         */
        class BGBuffer {

            private readonly canvas: HTMLCanvasElement;
            private readonly ctx: CanvasRenderingContext2D;

            constructor() {
                this.canvas = document.createElement('canvas');
                this.ctx = this.canvas.getContext('2d');

                this.ctx.fillStyle = '#000';
            }

            public render() {
                this.canvas.width = width;
                this.canvas.height = height;

                this.ctx.clearRect(0, 0, width, height);

                for (let y = 0; y < height; y += COLUMN_SIZE) {
                    for (let x = 0; x < width; x += COLUMN_SIZE) {
                        this.ctx.beginPath();
                        this.ctx.fillRect(x + 5, y + 5, 2, 2);
                    }
                }
            }

            public getBuffer(): HTMLCanvasElement {
                return this.canvas;
            }

        }

    }

}
