module MatrixBasicFX {

    let hueOffset = 0;

    MatrixFX.reset = (): void => {
        hueOffset = 0;
    };

    MatrixFX.getAllColor = (interval): Utility.BaseColor => {
        hueOffset = Utility.HSLColor.fixHue(hueOffset + 360.0 * interval);

        return new Utility.HSLColor(hueOffset);
    };

    MatrixFX.getColumnColor = (interval, column) => {
        hueOffset = Utility.HSLColor.fixHue(
            hueOffset +
            (360.0 * interval) +
            ((360.0 / column.count) * column.index)
        );

        return new Utility.HSLColor(hueOffset);
    };

    MatrixFX.getLetterColor = (interval, column, letter) => {
        hueOffset = Utility.HSLColor.fixHue(
            hueOffset +
            (360.0 * interval) +
            // ((360.0 / column.count) * column.index) +
            ((360.0 / letter.count) * letter.index)
        );

        return new Utility.HSLColor(hueOffset);
    };

}
