import * as definition from '.';
export declare class Color implements definition.Color {
    private _argb;
    private _name;
    constructor(color: number);
    constructor(color: string);
    constructor(a: number, r: number, g: number, b: number);
    get a(): number;
    get r(): number;
    get g(): number;
    get b(): number;
    get argb(): number;
    get hex(): string;
    get name(): string;
    get ios(): UIColor;
    get android(): number;
    _argbFromString(hex: string): number;
    equals(value: definition.Color): boolean;
    static equals(value1: definition.Color, value2: definition.Color): boolean;
    static isValid(value: any): boolean;
    private _componentToHex;
    private _normalizeHex;
    toString(): string;
    static fromIosColor(value: UIColor): Color;
}
