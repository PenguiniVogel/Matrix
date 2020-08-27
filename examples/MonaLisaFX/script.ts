/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

///<reference path="../../sources/build/matrix.d.ts"/>

module MonaLisaFX {

    let image: HTMLImageElement;

    export function load() {
        Matrix.create('#matrix-canvas', {
            speed: 8,
            updateRate: 16,
            useFX: false
        });

        Matrix.start();

        image = document.createElement('img');

        image.onload = (e?) => {
            Matrix.Settings.setFX(new MonaLisaFX.FX());
            Matrix.Settings.setUseFX(true);
        };

        image.src = 'mona_lisa.jpg';
    }

    export class FX extends MatrixFX.FX {

        public constructor() {
            super();
        }

        public render(interval: number, width: number, height: number) {
            this.ctx.beginPath();
            this.ctx.drawImage(image, 0, 0, width, height);
        }

    }

}
