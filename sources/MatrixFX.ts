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

        // @internal
        public drawTo(targetContext: CanvasRenderingContext2D) {
            // super.drawTo(targetContext);
            targetContext.drawImage(this.html_canvas(), 0, 0, targetContext.canvas.width, targetContext.canvas.height);
        }

        public on_resize() {
            this.colCount = this.width() / Matrix.COLUMN_SIZE;

            this.draw();
        }

        public draw() {
            for (let x = 0; x < this.colCount; x ++) {
                this.ctx.fillStyle = Utility.color_hsl(
                    Utility.fixDegrees(this.hueOffset - this.colHue * x)
                );

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

        // @internal
        private colors: string[] = [
            '#ff0000',
            '#ff5500',
            '#ffaa00',
            '#ffff00',
            '#aaff00',
            '#55ff00',
            '#00ff00',
            '#00ff55',
            '#00ffaa',
            '#00ffff',
            '#00aaff',
            '#0055ff',
            '#0000ff',
            '#5500ff',
            '#aa00ff',
            '#ff00ff',
            '#ff00aa',
            '#ff0055'
        ];

        // @internal
        private colCount = 0;

        // @internal
        private rowCount = 0;

        // @internal
        private yOffset = 0;

        // @internal
        public drawTo(targetContext: CanvasRenderingContext2D) {
            // super.drawTo(targetContext);
            if (this.yOffset >= this.rowCount) {
                this.yOffset = 0;
            }

            this.yOffset ++;

            targetContext.drawImage(this.html_canvas(), 0, this.yOffset, targetContext.canvas.width, targetContext.canvas.height);
        }

        public on_resize() {
            this.colCount = this.width() / Matrix.COLUMN_SIZE;
            this.rowCount = this.height() / Matrix.COLUMN_SIZE;

            this.canvas.width = this.colCount;
            this.canvas.height = this.rowCount * 2;

            this.ctx.beginPath();
            this.ctx.clearRect(0, 0, this.colCount, this.rowCount * 2);

            let gradientBufferCanvas: HTMLCanvasElement = document.createElement('canvas');
            let gradientBufferCtx: CanvasRenderingContext2D = gradientBufferCanvas.getContext('2d');

            gradientBufferCanvas.width = this.colCount;
            gradientBufferCanvas.height = this.rowCount;

            let gradient = this.ctx.createLinearGradient(0, 0, this.colCount, this.rowCount);

            gradient.addColorStop(0, this.colors[0]);

            let gradientStep = 1.0 / (this.colors.length - 1);
            let at = gradientStep;

            for (let i = 1, l = this.colors.length; i < l; i ++) {
                gradient.addColorStop(Math.min(1.0, at), this.colors[i]);

                at += gradientStep;
            }

            gradient.addColorStop(1, this.colors[0]);

            gradientBufferCtx.fillStyle = gradient;

            gradientBufferCtx.beginPath();
            gradientBufferCtx.fillRect(0, 0, this.colCount, this.rowCount);

            this.ctx.drawImage(gradientBufferCanvas, 0, 0, this.colCount, this.rowCount);
            this.ctx.drawImage(gradientBufferCanvas, this.colCount, this.rowCount, -this.colCount, this.rowCount);
        }

        public draw() { }

    }

    // --- Builtin FX

    /**
     * The default FX, renders a simple {@link Matrix.Settings.Color Color}
     */
    export const BUILTIN_FX_COLOR: FX & {
        setColor: (_color: Matrix.Settings.Color) => void,
        getColor: () => Matrix.Settings.Color
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
