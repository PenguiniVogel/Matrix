/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */
module MonaLisaFX {

    let image: HTMLImageElement;

    export function load() {
        Matrix.create('#matrix-canvas', {
            speed: 8,
            updateRateFX: 16
        });

        window.addEventListener('resize', () => Matrix.resizeContainer(`${window.innerWidth}px`, `${window.innerHeight}px`));

        Matrix.start();

        image = document.createElement('img');

        image.onload = (e?) => {
            Matrix.Settings.setFX(new MonaLisaFX.FX());
            // Matrix.Settings.setUseFX(true);
        };

        image.src = 'mona_lisa.jpg';
    }

    export class FX extends MatrixFX.FX {

        public constructor() {
            super();
        }

        public on_resize() {
            this.ctx.beginPath();
            this.ctx.drawImage(image, 0, 0, this.width(), this.height());
        }

        public draw() { }

    }

}
