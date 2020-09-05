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
module MatrixFX {

    /**
     * This is the base class for any FX
     */
    export abstract class FX extends Utility.Buffer {

        constructor(options?: { width: number, height: number, allowResize?: boolean }) {
            super(options);
        }

    }

    // --- Builtin FX Classes

    /**
     * Internal FX builtin
     * @sealed
     */
    class BasicColorFX extends FX {

        // @internal
        constructor() {
            super({ width: 1, height: 1, allowResize: false });

            // this.setColor(Matrix.DEFAULT_COLOR);
        }

        public setColor(_color: Matrix.Settings.Color): void {
            this.ctx.fillStyle = _color;

            this.draw();
        }

        public getColor(): Matrix.Settings.Color {
            return this.ctx.fillStyle;
        }

        public on_resize() { }

        public draw() {
            // this.ctx.beginPath();
            // this.ctx.clearRect(0, 0, 1, 1);

            this.ctx.beginPath();
            this.ctx.fillRect(0, 0, 1, 1);
        }

    }

    /**
     * Internal FX builtin
     * @sealed
     */
    class BasicColumnFX extends FX {

        // @internal
        private hueOffset = 0;

        // @internal
        private colCount = 0;

        // @internal
        private colHue = 0;

        public resize(width: number, height: number) {
            this.colCount = Math.ceil(width / Matrix.COLUMN_SIZE);
            this.colHue = 360.0 / this.colCount;

            this.canvas.width = this.colCount;
            this.canvas.height = 1;

            this.draw();
        }

        public draw() {
            for (let x = 0; x < this.colCount; x ++) {
                this.ctx.fillStyle = Utility.color_hsl(
                    Utility.fixDegrees(this.hueOffset - this.colHue * x)
                );

                this.ctx.beginPath();
                this.ctx.fillRect(x, 0, 1, 1);
            }

            this.hueOffset = Utility.fixDegrees(this.hueOffset + this.colHue);
        }

    }

    /**
     * Internal Builtin
     * @sealed
     */
    class BasicDiagonalFX extends FX {

        private readonly size = 22;

        // @internal
        private hueOffset = 0;

        // @internal
        private colHue = 0;

        public resize(width: number, height: number) {
            this.colHue = 360.0 / (width / Matrix.COLUMN_SIZE);

            this.canvas.width = this.size;
            this.canvas.height = this.size;

            this.draw();
        }

        public draw() {
            let gradient = this.ctx.createLinearGradient(0, 0, this.size, this.size);
            for (let i = 0; i < 1.1; i += 0.1) {
                gradient.addColorStop(Utility.fixFloat(i, 1e1), Utility.color_hsl(
                    Utility.fixDegrees(this.hueOffset - (360.0 / 11) * (i * 10))
                ));
            }

            this.ctx.fillStyle = gradient;

            this.ctx.beginPath();
            this.ctx.fillRect(0, 0, this.size, this.size);

            this.hueOffset = Utility.fixDegrees(this.hueOffset + this.colHue);
        }
    }

    // --- Builtin FX

    /**
     * The default FX, renders a simple {@link Matrix.Settings.Color Color}
     */
    export const BUILTIN_FX_COLOR: FX & {
        setColor(_color: Matrix.Settings.Color): void,
        getColor(): Matrix.Settings.Color
    } = new BasicColorFX();

    /**
     * Renders a left to right moving rainbow gradient
     */
    export const BUILTIN_FX_COLUMNS: FX = new BasicColumnFX();

    /**
     * Renders a top left to bottom right, bottom to top moving rainbow gradient
     */
    export const BUILTIN_FX_DIAGONAL: FX = new BasicDiagonalFX();

}
