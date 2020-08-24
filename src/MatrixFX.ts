module MatrixFX {

    export let reset: () => void;

    export let getAllColor: (interval: number) => Utility.BaseColor;

    export let getColumnColor: (interval: number, column: {count: number, index: number}) => Utility.BaseColor;

    export let getLetterColor: (interval: number, column: {count: number, index: number}, letter: {count: number, index: number}) => Utility.BaseColor;

}
