///<reference path="sources/build/matrix.d.ts"/>

Matrix.create('#matrix-canvas', {
    color: '#000',
    speed: 8,
    updateRate: 16,
    useFX: false
});

window.addEventListener('resize', () => Matrix.resize(window.innerWidth, window.innerHeight));
Matrix.resize(window.innerWidth, window.innerHeight);

Matrix.start();
