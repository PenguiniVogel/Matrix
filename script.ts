/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

///<reference path="sources/build/matrix.d.ts"/>

Matrix.create('#matrix-canvas', {
    color: '#44ff00',
    speed: 16,
    updateRate: 16,
    useFX: true
});

window.addEventListener('resize', () => Matrix.resize(window.innerWidth, window.innerHeight));
Matrix.resize(window.innerWidth, window.innerHeight);

Matrix.start();
