/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
module MatrixFX {

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

    export class BasicColumnFX extends FX {

        private hueOffset = 0;

        private colCount = 0;
        private colHue = 0;

        public fx_buffer(width: number, height: number) {
            this.colCount = width / Matrix.COLUMN_SIZE;

            this.colHue = 360.0 / this.colCount;

            super.fx_buffer(this.colCount, 1);
        }

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

    export class BasicLetterFX extends FX {

        private hueOffset = 0;

        private colCount = 0;
        private colHue = 0;

        private rowCount = 0;
        private rowHue = 0;

        public fx_buffer(width: number, height: number) {
            this.colCount = width / Matrix.COLUMN_SIZE;
            this.rowCount = height / Matrix.COLUMN_SIZE;

            this.colHue = 360.0 / this.colCount;
            this.rowHue = 360.0 / this.rowCount;

            super.fx_buffer(this.colCount, this.rowCount);
        }

        public fx_draw(_ctx: CanvasRenderingContext2D, width: number, height: number) {
            _ctx.drawImage(this.buffer, 0, 0, width, height);
        }

        public render(interval: number, width: number, height: number): void {
            console.time('FX : Column');
            for (let x = 0, y = 0; x < this.colCount;) {
                // this.ctx.fillStyle = Utility.color_hsl(
                //     Utility.fixDegrees(this.hueOffset - this.colHue * x - this.rowHue * y)
                // );

                this.ctx.fillRect(x, y, 1, 1);

                y ++;

                if (y >= this.rowCount) {
                    y = 0;

                    x ++;
                }
            }
            console.timeEnd('FX : Column');

            this.hueOffset = Utility.fixDegrees(this.hueOffset + this.rowHue);
        }

    }

}
