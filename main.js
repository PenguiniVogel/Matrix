function graphics() {
    var interval = 250;

    var canvas = document.getElementById('matrix-canvas');
    var graphics = document.getElementById('matrix-canvas').getContext('2d');

    window.addEventListener('resize', resize);

    function resize(e) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();

    graphics.scale(1.2, 1.2);

    var chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';

    for (var x = 1; x < window.innerWidth; x += 12) {
        function create(x) {
            var column = [createItem(x)];

            setTimeout(function () {
                setInterval(function () {
                    if(update(column)) {
                        column.push(createItem(x));
                    }
					
					graphics.globalAlpha = 0.005;
					graphics.fillStyle = '#000000';
					graphics.fillRect(0, 0, window.innerWidth, window.innerHeight);
					graphics.globalAlpha = 1;

                    column = column.filter(function (item) {
                        return item.eraseY <= window.innerHeight;
                    });
                }, interval);
            }, Math.floor(Math.random() * 2000) + 1000);
        }

        create(x);
    }

    function update(column) {
        var needsNew = false;

        for (var i = 0; i < column.length; i++) {
            var item = column[i];

            if (item.delay <= 0) {
				graphics.strokeStyle = '#44ff00';
				graphics.strokeText(chars[Math.floor(Math.random() * chars.length)], item.x, item.letterY);

                item.letterY += 12;

                if (item.letters >= item.max && !item.erasing) {
                    item.erasing = true;

                    needsNew = true;
                } else {
                    item.letters += 1;
                }

                if (item.erasing) {
                    graphics.fillStyle = '#000000';
                    graphics.fillRect(item.x, item.eraseY, 12, 12);

                    item.eraseY += 12;
                }
            } else {
                item.delay -= interval;
            }
        }

        return needsNew;
    }

    function createItem(x) {
        return {
            x      : x,
            letters: 0,
            max    : Math.floor(Math.random() * 8) + 2,
            letterY: 10,
            erasing: false,
            eraseY : 0,
            delay  : Math.floor(Math.random() * 8000) + 2000
        };
    }
}

setTimeout(function () {graphics();}, 100);
