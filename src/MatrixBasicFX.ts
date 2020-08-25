module MatrixBasicFX {

    export class BasicFX extends MatrixFX.FX {

        private hueOffset = 0;

        public reset(): void {
            this.hueOffset = 0;
        }

        public pre(interval: number) {
            this.hueOffset = Utility.HSLColor.fixHue(this.hueOffset + 360.0 * interval);
        }

        public getAllColor(interval: number): Utility.BaseColor {
            return new Utility.HSLColor(this.hueOffset);
        }

        public getColumnColor(interval: number, column: { count: number; index: number }): Utility.BaseColor {
            return new Utility.HSLColor(Utility.HSLColor.fixHue(
                this.hueOffset +
                ((360.0 / column.count) * column.index)
            ));
        }

        public getLetterColor(interval: number, column: { count: number; index: number }, letter: { count: number; index: number }): Utility.BaseColor {
            return new Utility.HSLColor(Utility.HSLColor.fixHue(
                this.hueOffset +
                ((360.0 / column.count) * column.index) +
                ((360.0 / letter.count) * letter.index)
            ));
        }

    }

}
