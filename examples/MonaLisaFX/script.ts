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
        image = document.createElement('img');

        image.onload = (e?) => {
            Matrix.create('#matrix-canvas', {
                size: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                speed: 8,
                updateRate: 16,
                useFX: true,
                fx: new MonaLisaFX.FX()
            });

            Matrix.start();
        };

        image.src = 'mona_lisa.jpg';
    }

    export class FX extends MatrixFX.FX {

        public constructor() {
            super();
        }

        public render(interval: number, width: number, height: number) {
            this.ctx.beginPath();
            this.ctx.drawImage(image, width / 2.0 - image.width / 2.0, 0);
        }

    }

}
