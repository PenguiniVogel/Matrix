/**
 Copyright (c) 2020 Felix Vogel
 https://github.com/FelixVogel/Matrix

 For the full copyright and license information, please view the LICENSE
 file that was distributed with this source code.
 */

Matrix.create('#matrix-container', {
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight}px`
});

if (window.location.href.indexOf('debug=1') != -1) {
    Utility.allowDebug(true);
}

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

    if (type == 'checkbox') {
        input.checked = value == 'true';
    }

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
    Settings.getColor() as string,
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

// createSetting(
//     'speed',
//     'range',
//     `${(Settings.getSpeed() / Matrix.MAX_SPEED) * 100.0}`,
//     'Speed:',
//     'The line speed',
//     (val: number) => Settings.setSpeed(Math.ceil(val * (Matrix.MAX_SPEED / 100.0))),
//     (val: number) => `${Math.max(1, Math.ceil(val * (Matrix.MAX_SPEED / 100.0)))}`
// );

createSetting(
    'lineLength',
    'range',
    `${(Settings.getLineLength() / Matrix.MAX_LINE_LENGTH) * 100.0}`,
    'Line Length:',
    'The max count of symbols per line',
    (val: number) => Settings.setLineLength(Math.ceil(val * (Matrix.MAX_LINE_LENGTH / 100.0))),
    (val: number) => `${Math.max(1, Math.ceil(val * (Matrix.MAX_LINE_LENGTH / 100.0)))}`
);

// createSetting(
//     'rotation',
//     'range',
//     `${(Settings.getRotation() / 360.0) * 100.0}`,
//     'Rotation:',
//     'The canvas rotation',
//     (val: number) => Settings.setRotation(Math.ceil(val * (360.0 / 100.0))),
//     (val: number) => `${Math.ceil(val * (360.0 / 100.0))}`
// );

createSetting(
    'ups',
    'range',
    `${Settings.getUpdateRate()}`,
    'Update rate:',
    'The update rate',
    (val: number) => Settings.setUpdateRate(Math.ceil(val)),
    (val: number) => `${Math.max(1, Math.ceil(val))}`
);

createSetting(
    'upsFX',
    'range',
    `${(Settings.getUpdateRateFX() / 64.0) * 100.0}`,
    'FX Update rate:',
    'The FX update rate',
    (val: number) => Settings.setUpdateRateFX(Math.ceil(val * (64.0 / 100.0))),
    (val: number) => `${Math.max(1, Math.ceil(val * (64.0 / 100.0)))}`
);

// createSetting(
//     'usefx',
//     'checkbox',
//     `${Settings.getUseFX()}`,
//     'Use FX:',
//     'Use FX',
//     (val: boolean) => {
//         Settings.setUseFX(val);
//     }
// );

createSelectSetting(
    'fxList',
    [
        {
            title: 'Basic Color FX',
            onselect: () => Settings.setFX(MatrixFX.BUILTIN_FX_COLOR),
            selected: true
        },
        {
            title: 'Basic Column FX',
            onselect: () => Settings.setFX(MatrixFX.BUILTIN_FX_COLUMNS)
        },
        {
            title: 'Basic Diagonal FX',
            onselect: () => Settings.setFX(MatrixFX.BUILTIN_FX_DIAGONAL)
        }
    ],
    'FX List:',
    'Included FXs'
);

createSetting(
    'compositeAlpha',
    'range',
    `${Settings.getCompositeAlpha() * 100}`,
    'Composite Alpha:',
    'Set the composite alpha',
    (val: number) => Settings.setCompositeAlpha(val / 100.0),
    (val: number) => `${val / 100.0}`
);

createSetting(
    'compositeMutation',
    'checkbox',
    `${Settings.getCompositeMutation()}`,
    'Composite Mutation:',
    'Whether composite alpha should be applied to the letter mutation',
    (val: boolean) => Settings.setCompositeMutation(val)
);

createSetting(
    'moveChance',
    'range',
    `${Settings.getMoveChance() * 100}`,
    'Move Chance:',
    'Set the move chance',
    (val: number) => Settings.setMoveChance(val / 100.0),
    (val: number) => `${val / 100.0}`
);

createSetting(
    'mutationChance',
    'range',
    `${Settings.getMutationChance() * 100}`,
    'Mutation Chance:',
    'Set the mutation chance',
    (val: number) => Settings.setMutationChance(val / 100.0),
    (val: number) => `${val / 100.0}`
);

createSelectSetting(
    'overlayModeList',
    [
        {
            title: 'Full',
            onselect: () => Settings.setOverlayMode(Utility.OverlayMode.FULL)
        },
        {
            title: 'Normal',
            onselect: () => Settings.setOverlayMode(Utility.OverlayMode.NORMAL),
            selected: true
        },
        {
            title: 'Fade',
            onselect: () => Settings.setOverlayMode(Utility.OverlayMode.FADE)
        },
        {
            title: 'None',
            onselect: () => Settings.setOverlayMode(Utility.OverlayMode.NONE)
        }
    ],
    'Overlay Mode:',
    'Set the overlay mode'
);

createSelectSetting(
    'mutationModeList',
    [
        {
            title: 'Normal',
            onselect: () => Settings.setLetterMutationMode(Utility.LetterMutationMode.NORMAL),
            selected: true
        },
        {
            title: 'Random',
            onselect: () => Settings.setLetterMutationMode(Utility.LetterMutationMode.RANDOM)
        },
        {
            title: 'Both',
            onselect: () => Settings.setLetterMutationMode(Utility.LetterMutationMode.BOTH)
        },
        {
            title: 'None',
            onselect: () => Settings.setLetterMutationMode(Utility.LetterMutationMode.NONE)
        }
    ],
    'Mutation Mode:',
    'Set the letter mutation mode'
);

createSetting(
    'scale',
    'range',
    `${Settings.getScale()[0] * 10}`,
    'Scale:',
    'Set the scale',
    (val: number) => Settings.setScale(val / 10.0),
    (val: number) => `${val / 10.0}`
);

// Matrix.debug_fx();

window.addEventListener('resize', () => Matrix.resizeContainer(`${window.innerWidth}px`, `${window.innerHeight}px`));

Matrix.start();
