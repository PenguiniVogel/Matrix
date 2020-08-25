module Settings {

    export const DEFAULT_CANVAS_ID = '#matrix-canvas';
    export const DEFAULT_COLUMN_WIDTH = 12;
    export const DEFAULT_COLOR = Utility.RGBColor.fromHex('#44ff00');
    export const DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';
    export const DEFAULT_SPEED = 1;
    export const DEFAULT_COLORING_MODE = ColoringMode.PER_LETTER;
    export const DEFAULT_COLORING_MODE_INTERVAL = 20;
    export const DEFAULT_LINE_LENGTH = 16;
    export const DEFAULT_RESET_ON_FOCUS = false;
    export const DEFAULT_ROTATION = 0;

    export const TIMING_INTERVAL = 250;
    export const MAX_LINE_LENGTH = 32;

    export const enum ColoringMode {
        BASE,
        ALL,
        PER_COLUMN,
        PER_LETTER
    }

    export const enum SettingNames {
        CANVAS_ID = 'canvasId',
        COLUMN_WIDTH = 'columnWidth',
        COLOR = 'color',
        SYMBOLS = 'symbols',
        SPEED = 'speed',
        COLORING_MODE = 'coloringMode',
        COLORING_MODE_INTERVAL = 'coloringModeInterval',
        LINE_LENGTH = 'lineLength',
        RESET_ON_FOCUS = 'resetOnFocus',
        ROTATION = 'rotation'
    }

    export interface Settings {
        /**
         * The canvas to target for painting
         */
        canvasId             : string,

        /**
         * The width of a column (12 is recommended default)
         */
        columnWidth: number,

        /**
         * The base color
         */
        color                : Utility.BaseColor,

        /**
         * The symbols to use
         */
        symbols              : string,

        /**
         * The speed at which symbols "fall"
         */
        speed                : number,

        /**
         * The coloring mode to use
         */
        coloringMode         : ColoringMode,

        /**
         * How often the color mode is recalculated per second
         */
        coloringModeInterval : number,

        /**
         * The max count of symbols per line segment
         */
        lineLength           : number,

        /**
         * Reset on focus change (false is recommended default)
         */
        resetOnFocus         : boolean

        /**
         * The rotation of the canvas
         */
        rotation             : number,
    }

    let internal: Settings = {
        canvasId: DEFAULT_CANVAS_ID,
        columnWidth: DEFAULT_COLUMN_WIDTH,
        color: DEFAULT_COLOR,
        symbols: DEFAULT_SYMBOLS,
        speed: DEFAULT_SPEED,
        coloringMode: DEFAULT_COLORING_MODE,
        coloringModeInterval: DEFAULT_COLORING_MODE_INTERVAL,
        lineLength: DEFAULT_LINE_LENGTH,
        resetOnFocus: DEFAULT_RESET_ON_FOCUS,
        rotation: DEFAULT_ROTATION
    };

    export let load: () => void;

    export let onload: () => void;

    export function getSettings(): Settings {
        return Object.freeze(internal);
    }

    export function fromJSON(json: object) {
        if (!json) json = {};

        setCanvasId(json[SettingNames.CANVAS_ID]);
        setColumnWidth(json[SettingNames.COLUMN_WIDTH]);
        setColor(json[SettingNames.COLOR]);
        setSymbols(json[SettingNames.SYMBOLS]);
        setSpeed(json[SettingNames.SPEED]);
        setColoringMode(json[SettingNames.COLORING_MODE]);
        setColoringModeInterval(json[SettingNames.COLORING_MODE_INTERVAL]);
        setLineLength(json[SettingNames.LINE_LENGTH]);
        setResetOnFocus(json[SettingNames.RESET_ON_FOCUS]);
        setRotation(json[SettingNames.ROTATION]);
    }

    export let loaded = false;

    // Settings - Canvas

    export function setCanvasId(canvasId: string = DEFAULT_CANVAS_ID): void {
        let el = document.querySelector(canvasId);
        if (canvasId && el) {
            internal.canvasId = canvasId;
        }
    }

    export function getCanvas(): HTMLCanvasElement {
        return document.querySelector(internal.canvasId);
    }

    // Settings - Column Width

    export function setColumnWidth(columnWidth: number = DEFAULT_COLUMN_WIDTH): void {
        if (columnWidth && columnWidth > 0) {
            internal.columnWidth = columnWidth;
        }
    }

    export function getColumnWidth(): number {
        return internal.columnWidth;
    }

    // Settings - Color

    export let onColorChanged: (color: Utility.BaseColor) => void;
    export function setColor(color: Utility.BaseColor = DEFAULT_COLOR): void {
        if (color && MatrixSettingListener.onColorChange) {
            internal.color = color;

            MatrixSettingListener.onColorChange(color);

            if (loaded && onColorChanged) {
                onColorChanged(color);
            }
        }
    }

    export function getColor(): Utility.BaseColor {
        return internal.color;
    }

    // Settings - Symbols

    export let onSymbolsChanged: (symbols: string) => void;
    export function setSymbols(symbols: string = DEFAULT_SYMBOLS): void {
        if (symbols && symbols.length > 0 && MatrixSettingListener.onSymbolsChange) {
            internal.symbols = symbols;

            MatrixSettingListener.onSymbolsChange(symbols);

            if (onSymbolsChanged) {
                onSymbolsChanged(symbols);
            }
        }
    }

    export function getSymbols(): string {
        return internal.symbols;
    }

    // Settings - Speed

    export let onSpeedChanged: (speed: number) => void;
    export function setSpeed(speed: number = DEFAULT_SPEED): void {
        if (speed && speed >= 0 && MatrixSettingListener.onSpeedChange) {
            internal.speed = speed;

            MatrixSettingListener.onSpeedChange(speed);

            if (loaded && onSpeedChanged) {
                onSpeedChanged(speed);
            }
        }
    }

    export function getSpeed(): number {
        return internal.speed;
    }

    // Settings - ColoringMode

    export let onColoringModeChanged: (coloringMode: ColoringMode) => void;
    export function setColoringMode(coloringMode: ColoringMode = DEFAULT_COLORING_MODE): void {
        if (coloringMode && MatrixSettingListener.onColoringModeChange) {
            internal.coloringMode = coloringMode;

            MatrixSettingListener.onColoringModeChange(coloringMode);

            if (loaded && onColoringModeChanged) {
                onColoringModeChanged(coloringMode);
            }
        }
    }

    export function getColoringMode(): ColoringMode {
        return internal.coloringMode;
    }

    // Settings - ColoringMode Interval

    export let onColoringModeIntervalChanged: (interval: number) => void;
    export function setColoringModeInterval(interval: number = DEFAULT_COLORING_MODE_INTERVAL): void {
        if (interval && interval >= 0 && MatrixSettingListener.onColoringModeIntervalChange) {
            internal.coloringModeInterval = interval;

            MatrixSettingListener.onColoringModeIntervalChange(interval);

            if (loaded && onColoringModeIntervalChanged) {
                onColoringModeChanged(interval);
            }
        }
    }

    export function getColoringModeInterval(): number {
        return internal.coloringModeInterval;
    }

    // Settings - Line Length

    export let onLineLengthChanged: (lineLength: number) => void;
    export function setLineLength(lineLength: number = DEFAULT_LINE_LENGTH): void {
        if (lineLength && lineLength >= 1 && lineLength <= MAX_LINE_LENGTH && MatrixSettingListener.onLineLengthChange) {
            internal.lineLength = lineLength;

            MatrixSettingListener.onLineLengthChange(lineLength);

            if (loaded && onLineLengthChanged) {
                onLineLengthChanged(lineLength);
            }
        }
    }

    export function getLineLength(): number {
        return internal.lineLength;
    }

    export function generateLineLength(): number {
        let fra = internal.lineLength / 2.0;

        return Math.max(0, Math.min(MAX_LINE_LENGTH, Math.floor(fra + fra * Math.random())));
    }

    // Settings - Reset on Focus

    export let onResetOnFocusChanged: (resetOnFocus: boolean) => void;
    export function setResetOnFocus(resetOnFocus: boolean = DEFAULT_RESET_ON_FOCUS): void {
        if (resetOnFocus != null && MatrixSettingListener.onResetOnFocusChange) {
            internal.resetOnFocus = resetOnFocus;

            MatrixSettingListener.onResetOnFocusChange(resetOnFocus);

            if (loaded && onResetOnFocusChanged) {
                onResetOnFocusChanged(resetOnFocus);
            }
        }
    }

    export function resetOnFocus(): boolean {
        return internal.resetOnFocus;
    }

    // Settings - Rotation

    export let onRotationChanged: (rotation: number) => void;
    export function setRotation(rotation: number = DEFAULT_ROTATION): void {
        if (rotation && MatrixSettingListener.onRotationChange) {
            let r = fixRotation(rotation);

            internal.rotation = r;

            MatrixSettingListener.onRotationChange(r);

            if (loaded && onRotationChanged) {
                onRotationChanged(rotation);
            }
        }
    }

    export function getRotation(): number {
        return internal.rotation;
    }

    function fixRotation(rotation: number) {
        return rotation - (Math.floor(rotation / 360.0) * 360.0);
    }

}
