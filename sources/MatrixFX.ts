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
    export abstract class FX {

        protected buffer: HTMLCanvasElement;
        protected ctx: CanvasRenderingContext2D;

        constructor() {
            this.buffer = document.createElement('canvas');
            this.ctx = this.buffer.getContext('2d');
        }


        public fx_buffer(width: number, height: number): void {
            this.buffer.width = width;
            this.buffer.height = height;
        }

        public fx_render(interval: number, width: number, height: number): HTMLCanvasElement {
            this.ctx.clearRect(0, 0, width, height);

            this.render(interval, width, height);

            return this.buffer;
        }

        public fx_draw(_ctx: CanvasRenderingContext2D, width: number, height: number): void {
            _ctx.drawImage(this.buffer, 0, 0);
        }

        public abstract render(interval: number, width: number, height: number): void;

    }

    /**
     * Internal FX builtin
     * @sealed
     */
    export class BasicColumnFX extends FX {

        // @internal
        private hueOffset = 0;

        // @internal
        private colCount = 0;

        // @internal
        private colHue = 0;

        // @internal
        public fx_buffer(width: number, height: number) {
            this.colCount = width / Matrix.COLUMN_SIZE;

            this.colHue = 360.0 / this.colCount;

            super.fx_buffer(this.colCount, 1);
        }

        // @internal
        public fx_draw(_ctx: CanvasRenderingContext2D, width: number, height: number) {
            _ctx.drawImage(this.buffer, 0, 0, width, height);
        }

        public render(interval: number, width: number, height: number): void {
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
    export class BasicDiagonalFX extends FX {

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
        public fx_buffer(width: number, height: number) {
            this.colCount = width / Matrix.COLUMN_SIZE;
            this.rowCount = height / Matrix.COLUMN_SIZE;

            this.reset_translate();

            super.fx_buffer(this.colCount, this.rowCount * 2);

            let gradient = this.ctx.createLinearGradient(0, 0, this.colCount, this.rowCount);

            gradient.addColorStop(0, this.colors[0]);

            let gradientStep = 1.0 / (this.colors.length - 1);
            let at = gradientStep;

            for (let i = 1, l = this.colors.length; i < l; i ++) {
                gradient.addColorStop(at, this.colors[i]);

                at += gradientStep;
            }

            gradient.addColorStop(1, this.colors[0]);

            this.ctx.fillStyle = gradient;

            this.ctx.beginPath();
            this.ctx.fillRect(0, 0, this.colCount, this.rowCount);

            this.ctx.beginPath();
            this.ctx.fillRect(0, this.rowCount, this.colCount, this.rowCount);
        }

        // @internal
        public fx_render(interval: number, width: number, height: number): HTMLCanvasElement {
            this.render(interval, width, height);

            return this.buffer;
        }

        // @internal
        public fx_draw(_ctx: CanvasRenderingContext2D, width: number, height: number) {
            _ctx.drawImage(this.buffer, 0, this.yOffset, this.colCount, this.rowCount, 0, 0, width, height);
        }

        // @internal
        private reset_translate() {
            this.ctx.translate(0, -this.yOffset);

            this.yOffset = 0;
        }

        public render(interval: number, width: number, height: number): void {
            if (this.yOffset >= this.rowCount) this.reset_translate();

            this.yOffset ++;

            this.ctx.translate(0, 1);
        }

    }

}
