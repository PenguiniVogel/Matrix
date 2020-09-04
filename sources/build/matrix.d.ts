/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
declare module Utility {
    const enum DrawingMode {
        /**
         * Draw new content on top of existing content
         */
        SOURCE_OVER = "source-over",
        /**
         * Draw new content only where it overlaps with existing content, everything else is made transparent
         */
        SOURCE_IN = "source-in",
        /**
         * Draw new content only where it does not overlap existing content, everything else is made transparent
         */
        SOURCE_OUT = "source-out",
        /**
         * Draw new content only where it overlaps with existing content
         */
        SOURCE_ATOP = "source-atop",
        /**
         * Draw new content behind existing content
         */
        DESTINATION_OVER = "destination-over",
        /**
         * The existing content is only kept where it overlaps the new content, everything else is made transparent
         */
        DESTINATION_IN = "destination-in",
        /**
         * The existing content is only kept where it does not overlap the new content, everything else is made transparent
         */
        DESTINATION_OUT = "destination-out",
        /**
         * The existing content is only kept where it overlaps the new content, everything else is made transparent
         * and the new content is drawn behind the remaining existing content
         */
        DESTINATION_ATOP = "destination-atop",
        /**
         * Where both content overlaps the color is determined by addition
         */
        LIGHTER = "lighter",
        /**
         * Only new content is shown
         */
        COPY = "copy",
        /**
         * The result is made transparent where both content overlaps and drawn normally everywhere else
         */
        XOR = "xor",
        /**
         * Each top layer (new content) pixel is multiplied by the bottom layer (existing content) pixel
         */
        MULTIPLY = "multiply",
        /**
         * Each pixel is inverted, multiplied and then inverted again
         */
        SCREEN = "screen",
        /**
         * A combination of {@link MULTIPLY} and {@link SCREEN}
         */
        OVERLAY = "overlay",
        /**
         * Keeps the darkest pixel of both layers
         */
        DARKEN = "darken",
        /**
         * Keeps the lightest pixel of both layers
         */
        LIGHTEN = "lighten",
        /**
         * Divides the bottom layer (existing content) by the inverted top layer (new content)
         */
        COLOR_DODGE = "color-dodge",
        /**
         * Divides the inverted bottom layer (existing content) by the top layer (new content) and inverts the result
         */
        COLOR_BURN = "color-burn",
        /**
         * Like {@link OVERLAY} but top layer (new content) and bottom layer (existing content) swapped
         */
        HARD_LIGHT = "hard-light",
        /**
         * Like {@link HARD_LIGHT} but pure white or pure black does not result in pure white or pure black
         */
        SOFT_LIGHT = "soft-light",
        /**
         * Subtracts one layer from the other (it always will look for a positive value)
         */
        DIFFERENCE = "difference",
        /**
         * Like {@link DIFFERENCE} but with lower contrast
         */
        EXCLUSION = "exclusion",
        /**
         * Preserves the luma and chroma value of the existing content while adopting the hue value from the new content
         */
        HUE = "hue",
        /**
         * Preserves the luma and hue value of the existing content while adopting the chroma value from the new content
         */
        SATURATION = "saturation",
        /**
         * Preserves the luma value of the existing content while adopting the chroma and hue value from the new content
         */
        COLOR = "color",
        /**
         * Preserves the chroma and hue value of the existing content while adopting the luma value from the new content
         */
        LUMINOSITY = "luminosity"
    }
    /**
     * Fix the provided number of degrees to fit between 0 and 360
     *
     * @param deg The number to fix
     */
    function fixDegrees(deg: number): number;
    /**
     * This fixes a float value to the specified numbers of digits. <br/>
     * Note: This does <b>NOT</b> round the float value, it just cuts it! <br/>
     * <br/>
     * Examples: <br/>
     * <code>fixFloat(1.12345)</code> will return <code>1.12</code> <br/>
     * <code>fixFloat(1.12345, 1e3)</code> will return <code>1.123</code> <br/>
     * <code>fixFloat(1.12345, 1e1)</code> will return <code>1.1</code> <br/>
     * <code>fixFloat(1.12345, 1e4)</code> will return <code>1.1234</code> <br/>
     * <code>fixFloat(1.12345, 1e2)</code> will return <code>1.12</code> <br/>
     *
     * @param val
     * @param decimals
     */
    function fixFloat(val: number, decimals?: number): number;
    /**
     * Generates a UID with the specified options <br/>
     * Note: This is by no means collision safe!
     *
     * @param prefix The uid prefix, defaults to <code>'uid'</code>
     * @param segmentCount The segment count, defaults to <code>4</code>
     * @param segmentLength The segment length, defaults to <code>4</code>
     */
    function getUID(prefix?: string, segmentCount?: number, segmentLength?: number): string;
    /**
     * Create a css hsl color
     *
     * @param h The hue (0 - 360)
     * @param s The saturation (0 - 100), defaults to <code>100</code>
     * @param l The luminosity (0 - 100), defaults to <code>50</code>
     */
    function color_hsl(h: number, s?: number, l?: number): string;
    /**
     * Create a css hsla color
     *
     * @param h The hue (0 - 360)
     * @param s The saturation (0 - 100), defaults to <code>100</code>
     * @param l The luminosity (0 - 100), defaults to <code>50</code>
     * @param a The alpha (0.0 - 1.0), defaults to <code>1.0</code>
     */
    function color_hsla(h: number, s?: number, l?: number, a?: number): string;
    /**
     * Create a css rgb color
     *
     * @param r The red value (0 - 255)
     * @param g The green value (0 - 255)
     * @param b The blue value (0 - 255)
     */
    function color_rgb(r: number, g: number, b: number): string;
    /**
     * Create a css rgba color
     *
     * @param r The red value (0 - 255)
     * @param g The green value (0 - 255)
     * @param b The blue value (0 - 255)
     * @param a The alpha (0.0 - 1.0), defaults to <code>1.0</code>
     */
    function color_rgba(r: number, g: number, b: number, a?: number): string;
    /**
     * This class represents a canvas buffer that can be rendered to
     */
    abstract class Buffer {
        /**
         * The underlying canvas
         */
        protected canvas: HTMLCanvasElement;
        /**
         * The underlying context
         */
        protected ctx: CanvasRenderingContext2D;
        /**
         * Whether the current buffer can be resized.
         */
        protected allowResize: boolean;
        protected constructor(options?: {
            width: number;
            height: number;
            allowResize?: boolean;
        });
        /**
         * Get the current canvas width
         */
        protected width(): number;
        /**
         * Get the current canvas height
         */
        protected height(): number;
        /**
         * Get the underlying canvas that this buffer renders to
         */
        html_canvas(): HTMLCanvasElement;
        /**
         * Resize the buffer
         *
         * @param width The new width
         * @param height The new height
         */
        resize(width: number, height: number): void;
        /**
         * This gets called upon a resize. <br/>
         * Note: This will <b>not</b> get called if {@link allowResize} is <code>false</code>!
         */
        abstract on_resize(): void;
        /**
         * This method gets called on every updateFX by the Matrix core. <br/>
         * Remember, please optimize and move everything that only has to / can happen on a resize to {@link on_resize}
         */
        abstract draw(): void;
        /**
         * Draw the buffer to the target context <br/>
         * Note this will render the buffer canvas in stretch mode by default,
         * meaning it will get stretched to the size of the target canvas!
         *
         * @param targetContext The target {@link CanvasRenderingContext2D context}
         */
        drawTo(targetContext: CanvasRenderingContext2D): void;
    }
}
/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
/**
 * This module contains all FX related things
 */
/** */
declare module MatrixFX {
    /**
     * This is the base class for any FX
     */
    abstract class FX extends Utility.Buffer {
        constructor(options?: {
            width: number;
            height: number;
            allowResize?: boolean;
        });
    }
    /**
     * The default FX, renders a simple {@link Matrix.Settings.Color Color}
     */
    const BUILTIN_FX_COLOR: FX & {
        setColor(_color: Matrix.Settings.Color): void;
        getColor(): Matrix.Settings.Color;
    };
    /**
     * Renders a left to right moving rainbow gradient
     */
    const BUILTIN_FX_COLUMNS: FX;
    /**
     * Renders a top left to bottom right, bottom to top moving rainbow gradient
     */
    const BUILTIN_FX_DIAGONAL: FX;
}
/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
declare module Matrix {
    const DEFAULT_COLOR = "#44ff00";
    const DEFAULT_BACKGROUND_COLOR: Settings.Color;
    const DEFAULT_SYMBOLS = "\uFF66\uFF71\uFF73\uFF74\uFF75\uFF76\uFF77\uFF79\uFF7A\uFF7B\uFF7C\uFF7D\uFF7E\uFF7F\uFF80\uFF82\uFF83\uFF85\uFF86\uFF87\uFF88\uFF8A\uFF8B\uFF8E\uFF8F\uFF90\uFF91\uFF92\uFF93\uFF94\uFF95\uFF97\uFF98\uFF9C\u65E5(+*;)-|2589Z";
    const DEFAULT_SPEED = 1;
    const DEFAULT_LINE_LENGTH = 16;
    const DEFAULT_UPDATE_RATE_FX = 32;
    const DEFAULT_FX: MatrixFX.FX & {
        setColor(_color: string | CanvasGradient | CanvasPattern): void;
        getColor(): string | CanvasGradient | CanvasPattern;
    };
    const DEFAULT_COMPOSITE_ALPHA = 0.3;
    const DEFAULT_MOVE_CHANCE = 0.51;
    const DEFAULT_WAIT_TIME = 20;
    const DEFAULT_MUTATION_CHANCE = 0.1;
    const COLUMN_SIZE = 12;
    const MAX_SPEED = 32;
    const MAX_LINE_LENGTH = 32;
    interface OptionalSettings {
        /**
         * Set the initial container size
         */
        size?: {
            /**
             * The container css width
             */
            width: string;
            /**
             * The container css height
             */
            height: string;
        };
        /**
         * The initial color of the Matrix canvas
         */
        color?: string;
        /**
         * The initial background color
         */
        backgroundColor?: string;
        /**
         * The initial symbols of the Matrix
         */
        symbols?: string;
        /**
         * The initial speed of the columns
         */
        speed?: number;
        /**
         * The initial length of an column segment
         */
        lineLength?: number;
        /**
         * The initial update rate of the FX
         */
        updateRateFX?: number;
        /**
         * The initial {@link MatrixFX.FX} to use
         */
        fx?: MatrixFX.FX;
        /**
         * The initial composite alpha for the Matrix canvas
         */
        compositeAlpha?: number;
        /**
         * The initial move chance of an column
         */
        moveChance?: number;
        /**
         * The initial mutation chance of an letter in a column segment
         */
        mutationChance?: number;
    }
    /**
     * Create the Matrix onto the specified selector. <br/>
     * Note: The selector must match and return a &lt;canvas&gt; element!
     *
     * @param selector The dom selector
     * @param settings {@link Matrix.OptionalSettings}
     */
    function create(selector: string, settings?: OptionalSettings): void;
    /**
     * Start the Matrix
     */
    function start(): void;
    /**
     * Resize the Matrix to the container dimensions
     */
    function resize(): void;
    /**
     * Resize the container element and the Matrix <br/>
     * Note: This will set inline styles, be sure your site styles take that into account!
     *
     * @param _width The new css width
     * @param _height The new css height
     */
    function resizeContainer(_width: string, _height: string): void;
    /**
     * Get the container element the Matrix is inside of
     */
    function getContainer(): HTMLElement;
    /**
     * This will cause the canvas to only render the FX and not composite the actual Matrix. <br />
     * Note: This option can only be enabled <b>before</b> the Matrix is started!
     */
    function debug_fx(): void;
    module Settings {
        type Color = string | CanvasGradient | CanvasPattern;
        /**
         * Set the color of the {@link MatrixFX.BUILTIN_FX_COLOR BUILTIN_FX_COLOR}
         *
         * @param _color The new color
         */
        function setColor(_color?: Color): void;
        /**
         * Get the current {@link MatrixFX.BUILTIN_FX_COLOR BUILTIN_FX_COLOR} color
         */
        function getColor(): Color;
        /**
         * Set the color of the background
         *
         * @param _backgroundColor The new background color
         */
        function setBackgroundColor(_backgroundColor?: Color): void;
        /**
         * Get the current background color
         */
        function getBackgroundColor(): Color;
        /**
         * Set the symbols for Matrix to use
         *
         * @param _symbols The new symbols
         */
        function setSymbols(_symbols?: string): void;
        /**
         * Get the current symbols the Matrix is using
         */
        function getSymbols(): string;
        /**
         * Set the speed of the Matrix columns
         *
         * @param _speed The new speed
         */
        function setSpeed(_speed?: number): void;
        /**
         * Get the current speed of the Matrix columns
         */
        function getSpeed(): number;
        /**
         * Set the <b>max</b> line length for the Matrix column segments
         *
         * @param _lineLength The new <b>max</b> line length
         */
        function setLineLength(_lineLength?: number): void;
        /**
         * Get the current <b>max</b> line length
         */
        function getLineLength(): number;
        /**
         * Set the FX update rate
         *
         * @param _ups The new FX update rate
         */
        function setUpdateRateFX(_ups?: number): void;
        /**
         * Get the current FX update rate
         */
        function getUpdateRate(): number;
        /**
         * Set the {@link MatrixFX.FX} to be used
         *
         * @param _fx The new {@link MatrixFX.FX}
         */
        function setFX(_fx?: MatrixFX.FX): void;
        /**
         * Get the current {@link MatrixFX.FX} that is used
         */
        function getFX(): MatrixFX.FX;
        /**
         * Set the composite alpha for the Matrix canvas to use
         *
         * @param _alpha The new composite alpha
         */
        function setCompositeAlpha(_alpha?: number): void;
        /**
         * Get the current composite alpha that the Matrix canvas is using
         */
        function getCompositeAlpha(): number;
        /**
         * Set the move chance of the Matrix columns
         *
         * @param _chance The new move chance (0.0 - 1.0)
         */
        function setMoveChance(_chance?: number): void;
        /**
         * Get the current move chance of the Matrix columns
         */
        function getMoveChance(): number;
        /**
         * Set the mutation chance of a letter in a column segment
         *
         * @param _chance The new mutation chance (0.0 - 1.0)
         */
        function setMutationChance(_chance?: number): void;
        /**
         * Get the current mutation chance of a letter in a column segment
         */
        function getMutationChance(): number;
    }
}
