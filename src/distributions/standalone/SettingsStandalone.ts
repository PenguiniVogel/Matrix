module SettingsStandalone {

    const enum CookieKey {
        NAME = 'matrix'
    }

    Settings.load = () => {
        let settingsJson = Utility.Cookie.get(CookieKey.NAME)?.getValue();

        if (settingsJson) {
            let parsed = null;
            try {
                parsed = JSON.parse(settingsJson);
            } catch (e) {}

            if (parsed) {
                Settings.fromJSON(parsed);
            }
        }

        save();
    };

    Settings.onload = () => {
        window.addEventListener('resize', () => Matrix.refresh());
        Matrix.refresh();
    };

    function save(): void {
        Utility.Cookie.replace(
            CookieKey.NAME,
            JSON.stringify(Settings.getSettings())
        );
    }

    Settings.onColorChanged = (color) => save();
    Settings.onSymbolsChanged = (symbols) => save();
    Settings.onSpeedChanged = (speed) => save();
    Settings.onColoringModeChanged = (gradientType) => save();
    Settings.onColoringModeIntervalChanged = (interval) => save();
    Settings.onLineLengthChanged = (lineLength) => save();
    Settings.onResetOnFocusChanged = (resetOnFocus) => save();
    Settings.onRotationChanged = (rotation) => save();

}
