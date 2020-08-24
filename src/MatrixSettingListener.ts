module MatrixSettingListener {

    export let onColorChange: (color: Utility.BaseColor) => void;

    export let onSymbolsChange: (symbols: string) => void;

    export let onSpeedChange: (speed: number) => void;

    export let onColoringModeChange: (gradientType: Settings.ColoringMode) => void;

    export let onColoringModeIntervalChange: (interval: number) => void;

    export let onLineLengthChange: (lineLength: number) => void;

    export let onResetOnFocusChange: (resetOnFocus: boolean) => void;

    export let onRotationChange: (rotation: number) => void;

}