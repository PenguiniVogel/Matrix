/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
/** */
module Utility {

    // --- OverlayMode

    /**
     * The overlay mode for the foreground overlay render
     */
    export const enum OverlayMode {

        /**
         * Overlay the entire canvas
         */
        FULL,

        /**
         * Overlay only old letters (default)
         */
        NORMAL,

        /**
         * Fade old letters gradually
         */
        FADE,

        /**
         * Don't render the overlay
         */
        NONE

    }

    // --- LetterMutationMode

    /**
     * The mutation modes for letters
     */
    export const enum LetterMutationMode {

        /**
         * There will always be a new letter at the end and the previous ones will get shifted
         */
        NORMAL,

        /**
         * Randomly mutate a letter in an segment
         */
        RANDOM,

        /**
         * A combination of first {@link NORMAL} and then {@link RANDOM}
         */
        BOTH,

        /**
         * Don't mutate letters
         */
        NONE

    }

    // --- Drawing Mode

    /**
     * Contains all possible graphical composite methods for {@link CanvasRenderingContext2D.globalCompositeOperation}
     */
    export const enum DrawingMode {

        /**
         * Draw new content on top of existing content
         */
        SOURCE_OVER = 'source-over',

        /**
         * Draw new content only where it overlaps with existing content, everything else is made transparent
         */
        SOURCE_IN = 'source-in',

        /**
         * Draw new content only where it does not overlap existing content, everything else is made transparent
         */
        SOURCE_OUT = 'source-out',

        /**
         * Draw new content only where it overlaps with existing content
         */
        SOURCE_ATOP = 'source-atop',

        /**
         * Draw new content behind existing content
         */
        DESTINATION_OVER = 'destination-over',

        /**
         * The existing content is only kept where it overlaps the new content, everything else is made transparent
         */
        DESTINATION_IN = 'destination-in',

        /**
         * The existing content is only kept where it does not overlap the new content, everything else is made transparent
         */
        DESTINATION_OUT = 'destination-out',

        /**
         * The existing content is only kept where it overlaps the new content, everything else is made transparent
         * and the new content is drawn behind the remaining existing content
         */
        DESTINATION_ATOP = 'destination-atop',

        /**
         * Where both content overlaps the color is determined by addition
         */
        LIGHTER = 'lighter',

        /**
         * Only new content is shown
         */
        COPY = 'copy',

        /**
         * The result is made transparent where both content overlaps and drawn normally everywhere else
         */
        XOR = 'xor',

        /**
         * Each top layer (new content) pixel is multiplied by the bottom layer (existing content) pixel
         */
        MULTIPLY = 'multiply',

        /**
         * Each pixel is inverted, multiplied and then inverted again
         */
        SCREEN = 'screen',

        /**
         * A combination of {@link MULTIPLY} and {@link SCREEN}
         */
        OVERLAY = 'overlay',

        /**
         * Keeps the darkest pixel of both layers
         */
        DARKEN = 'darken',

        /**
         * Keeps the lightest pixel of both layers
         */
        LIGHTEN = 'lighten',

        /**
         * Divides the bottom layer (existing content) by the inverted top layer (new content)
         */
        COLOR_DODGE = 'color-dodge',

        /**
         * Divides the inverted bottom layer (existing content) by the top layer (new content) and inverts the result
         */
        COLOR_BURN = 'color-burn',

        /**
         * Like {@link OVERLAY} but top layer (new content) and bottom layer (existing content) swapped
         */
        HARD_LIGHT = 'hard-light',

        /**
         * Like {@link HARD_LIGHT} but pure white or pure black does not result in pure white or pure black
         */
        SOFT_LIGHT = 'soft-light',

        /**
         * Subtracts one layer from the other (it always will look for a positive value)
         */
        DIFFERENCE = 'difference',

        /**
         * Like {@link DIFFERENCE} but with lower contrast
         */
        EXCLUSION = 'exclusion',

        /**
         * Preserves the luma and chroma value of the existing content while adopting the hue value from the new content
         */
        HUE = 'hue',

        /**
         * Preserves the luma and hue value of the existing content while adopting the chroma value from the new content
         */
        SATURATION = 'saturation',

        /**
         * Preserves the luma value of the existing content while adopting the chroma and hue value from the new content
         */
        COLOR = 'color',

        /**
         * Preserves the chroma and hue value of the existing content while adopting the luma value from the new content
         */
        LUMINOSITY = 'luminosity'

    }

    // --- Math

    /**
     * Fix the provided number of degrees to fit between 0 and 360
     *
     * @param deg The number to fix
     */
    export function fixDegrees(deg: number): number {
        return deg - (Math.floor(deg / 360.0) * 360.0);
    }

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
    export function fixFloat(val: number, decimals: number = 1e2): number {
        return ~~(val * decimals) / decimals;
    }

    // --- UID

    const UID_CHARSET: string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * Generates a UID with the specified options <br/>
     * Note: This is by no means collision safe!
     *
     * @param prefix The uid prefix, defaults to <code>'uid'</code>
     * @param segmentCount The segment count, defaults to <code>4</code>
     * @param segmentLength The segment length, defaults to <code>4</code>
     */
    export function getUID(prefix = 'uid', segmentCount = 4, segmentLength = 4): string {
        if (prefix.length < 1 || segmentCount < 1 || segmentLength < 1) throw new Error('The specified arguments are not valid');

        let result = `${prefix}`;

        for (let u = 0; u < segmentCount; u++) {
            result += '-';
            for (let i = 0; i < segmentLength; i++) {
                result += `${UID_CHARSET[Math.floor(Math.random() * UID_CHARSET.length)]}`;
            }
        }

        return result;
    }

    // --- Color

    /**
     * Create a css hsl color
     *
     * @param h The hue (0 - 360)
     * @param s The saturation (0 - 100), defaults to <code>100</code>
     * @param l The luminosity (0 - 100), defaults to <code>50</code>
     */
    export function color_hsl(h: number, s = 100, l = 50): string {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    /**
     * Create a css hsla color
     *
     * @param h The hue (0 - 360)
     * @param s The saturation (0 - 100), defaults to <code>100</code>
     * @param l The luminosity (0 - 100), defaults to <code>50</code>
     * @param a The alpha (0.0 - 1.0), defaults to <code>1.0</code>
     */
    export function color_hsla(h: number, s = 100, l = 50, a = 1.0): string {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }

    /**
     * Create a css rgb color
     *
     * @param r The red value (0 - 255)
     * @param g The green value (0 - 255)
     * @param b The blue value (0 - 255)
     */
    export function color_rgb(r: number, g: number, b: number): string {
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Create a css rgba color
     *
     * @param r The red value (0 - 255)
     * @param g The green value (0 - 255)
     * @param b The blue value (0 - 255)
     * @param a The alpha (0.0 - 1.0), defaults to <code>1.0</code>
     */
    export function color_rgba(r: number, g: number, b: number, a = 1.0): string {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // --- Buffer

    /**
     * This class represents a canvas buffer that can be rendered to
     */
    export abstract class Buffer {

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
        protected allowResize: boolean = true;

        protected constructor(options?: { width: number, height: number, allowResize?: boolean }) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            if (options) {
                if (options.width) this.canvas.width = options.width;
                if (options.height) this.canvas.height = options.height;
                if (options.allowResize != null) this.allowResize = options.allowResize;
            }
        }

        /**
         * Get the current canvas width
         */
        protected width(): number {
            return this.canvas.width;
        }

        /**
         * Get the current canvas height
         */
        protected height(): number {
            return this.canvas.height;
        }

        /**
         * Get the underlying canvas that this buffer renders to
         */
        public html_canvas(): HTMLCanvasElement {
            return this.canvas;
        }

        /**
         * Resize the buffer
         *
         * @param width The new width
         * @param height The new height
         */
        public resize(width: number, height: number): void {
            if (!this.allowResize) return;

            this.canvas.width = width;
            this.canvas.height = height;
        }

        /**
         * This method gets called on every updateFX by the Matrix core. <br/>
         * Remember, please optimize and move everything that only has to / can happen on a resize to {@link on_resize}
         */
        public abstract draw(): void;

        /**
         * Draw the buffer to the target context <br/>
         * Note this will render the buffer canvas in stretch mode by default,
         * meaning it will get stretched to the size of the target canvas!
         *
         * @param targetContext The target {@link CanvasRenderingContext2D context}
         * @param width The target canvas width
         * @param height The target canvas height
         */
        public drawTo(targetContext: CanvasRenderingContext2D, width: number, height: number): void {
            targetContext.drawImage(this.html_canvas(), 0, 0, width, height);
        }

    }

}
