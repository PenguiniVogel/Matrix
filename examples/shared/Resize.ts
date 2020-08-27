/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

///<reference path="../../sources/build/matrix.d.ts"/>

window.addEventListener('resize', () => Matrix.resize(window.innerWidth, window.innerHeight));
Matrix.resize(window.innerWidth, window.innerHeight);
