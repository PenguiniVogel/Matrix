module MatrixFX {

    export abstract class FX {

        public buffer: HTMLCanvasElement;
        public ctx: CanvasRenderingContext2D;

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

        public abstract render(interval: number, width: number, height: number): void;

    }

    export class BasicColumnFX extends FX {

        private hueOffset = 0;

        public render(interval: number, width: number, height: number): void {
            let colHue = 360.0 / (width / Matrix.COLUMN_SIZE);

            for (let x = 0; x < width; x += Matrix.COLUMN_SIZE) {
                this.ctx.fillStyle = Utility.color_hsl(
                    Utility.fixDegrees(this.hueOffset -
                        colHue * (x / Matrix.COLUMN_SIZE))
                );

                this.ctx.fillRect(x, 0, Matrix.COLUMN_SIZE, height);
            }

            this.hueOffset = Utility.fixDegrees(this.hueOffset + colHue);
        }

    }

    export class BasicLetterFX extends FX {

        private hueOffset = 0;

        public render(interval: number, width: number, height: number): void {
            let colHue = 360.0 / (width / Matrix.COLUMN_SIZE);
            let rowHue = 360.0 / (height / Matrix.COLUMN_SIZE);

            for (let y = 0; y < height; y += Matrix.COLUMN_SIZE) {
                for (let x = 0; x < width; x += Matrix.COLUMN_SIZE) {
                    this.ctx.fillStyle = Utility.color_hsl(
                        Utility.fixDegrees(this.hueOffset -
                            colHue * (x / Matrix.COLUMN_SIZE) -
                            rowHue * (y / Matrix.COLUMN_SIZE))
                    );
                    this.ctx.fillRect(x, y, Matrix.COLUMN_SIZE, Matrix.COLUMN_SIZE);
                }
            }

            this.hueOffset = Utility.fixDegrees(this.hueOffset + rowHue);
        }

    }

}
