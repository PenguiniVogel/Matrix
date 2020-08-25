module MatrixFX {

    export abstract class FX {

        public abstract reset(): void;

        public abstract pre(interval: number): void;

        public abstract getAllColor(interval: number): Utility.BaseColor;

        public abstract getColumnColor(interval: number, column: {count: number, index: number}): Utility.BaseColor;

        public abstract getLetterColor(interval: number, column: {count: number, index: number}, letter: {count: number, index: number}): Utility.BaseColor;

    }

}
