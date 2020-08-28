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
    updateRateFX: 16,
    useFX: false,
    fx: new MatrixFX.BasicColumnFX()
});

import Settings = Matrix.Settings;

function createSetting(id: string, type: string, value: string, text: string, title: string, setOp: (val) => void, displayOp?: (val) => string): void {
    id = `options_${id}`;

    let container = document.createElement('container');
    let label = document.createElement('label');
    let input = document.createElement('input');
    let set = document.createElement('a');
    let display = document.createElement('span');

    label.htmlFor = id;
    label.title = title;
    label.innerHTML = text;

    input.id = id;
    input.type = type;
    input.value = value;

    set.setAttribute('data-for', id);
    set.innerHTML = 'Set';

    display.setAttribute('data-for', id);

    set.onclick = (e?) => setOp(input.type == 'checkbox' ? input.checked : input.value);

    if (displayOp) {
        input.oninput = (e?) => {
            display.innerHTML = displayOp(input.type == 'checkbox' ? input.checked : input.value);
        };

        input.oninput(null);
    }

    container.append(label, input, set, display);

    document.querySelector('#options').appendChild(container);
}

function createSelectSetting(id: string, options: {title: string, onselect?: () => void, selected?: boolean}[], text: string, title: string): void {
    id = `options_${id}`;

    let container = document.createElement('container');
    let label = document.createElement('label');
    let select: HTMLSelectElement = document.createElement('select');
    let set = document.createElement('a');

    label.htmlFor = id;
    label.title = title;
    label.innerHTML = text;

    select.id = id;

    set.setAttribute('data-for', id);
    set.innerHTML = 'Set';

    for (let l_Option of options) {
        let option: HTMLOptionElement = document.createElement('option');

        option.innerHTML = l_Option.title;

        if (l_Option.selected != null) {
            option.selected = l_Option.selected;
        }

        select.appendChild(option);
    }

    set.onclick = (e?) => {
        if (options[select.selectedIndex]?.onselect) options[select.selectedIndex].onselect();
    };

    set.onclick(null);

    container.append(label, select, set);

    document.querySelector('#options').appendChild(container);
}

createSetting(
    'color',
    'color',
    Settings.getColor(),
    'Color:',
    'The base color',
    (val) => Settings.setColor(val)
);

createSetting(
    'symbols',
    'text',
    Settings.getSymbols(),
    'Symbols:',
    'The symbols that are used',
    (val: string) => Settings.setSymbols(val)
);

createSetting(
    'speed',
    'range',
    `${(Settings.getSpeed() / Matrix.MAX_SPEED) * 100.0}`,
    'Speed:',
    'The line speed',
    (val: number) => Settings.setSpeed(Math.ceil(val * (Matrix.MAX_SPEED / 100.0))),
    (val: number) => `${Math.max(1, Math.ceil(val * (Matrix.MAX_SPEED / 100.0)))}`
);

createSetting(
    'lineLength',
    'range',
    `${(Settings.getLineLength() / Matrix.MAX_LINE_LENGTH) * 100.0}`,
    'Line Length:',
    'The max count of symbols per line',
    (val: number) => Settings.setLineLength(Math.ceil(val * (Matrix.MAX_LINE_LENGTH / 100.0))),
    (val: number) => `${Math.max(1, Math.ceil(val * (Matrix.MAX_LINE_LENGTH / 100.0)))}`
);

createSetting(
    'rotation',
    'range',
    `${(Settings.getRotation() / 360.0) * 100.0}`,
    'Rotation:',
    'The canvas rotation',
    (val: number) => Settings.setRotation(Math.ceil(val * (360.0 / 100.0))),
    (val: number) => `${Math.ceil(val * (360.0 / 100.0))}`
);

createSetting(
    'ups',
    'range',
    `${(Settings.getUpdateRate() / 64.0) * 100.0}`,
    'Update rate:',
    'The update rate',
    (val: number) => Settings.setUpdateRateFX(Math.ceil(val * (64.0 / 100.0))),
    (val: number) => `${Math.max(1, Math.ceil(val * (64.0 / 100.0)))}`
);

createSetting(
    'usefx',
    'checkbox',
    `${Settings.getUseFX()}`,
    'Use FX:',
    'Use FX',
    (val: boolean) => {
        Settings.setUseFX(val);
    }
);

createSelectSetting(
    'fxlist',
    [
        {
            title: 'Basic Column FX',
            onselect: () => Settings.setFX(new MatrixFX.BasicColumnFX()),
            selected: true
        },
        {
            title: 'Basic Diagonal FX',
            onselect: () => Settings.setFX(new MatrixFX.BasicDiagonalFX())
        }
    ],
    'FX List:',
    'Included FXs'
);

// Matrix.debug_fx();

Matrix.start();
