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
