import { Font as FontDefinition } from './font';
import { ParsedFont } from './font-interfaces';
export * from './font-interfaces';
export declare abstract class Font implements FontDefinition {
    readonly fontFamily: string;
    readonly fontSize: number;
    readonly fontStyle: FontStyle;
    readonly fontWeight: FontWeight;
    static default: any;
    get isItalic(): boolean;
    get isBold(): boolean;
    protected constructor(fontFamily: string, fontSize: number, fontStyle: FontStyle, fontWeight: FontWeight);
    abstract getAndroidTypeface(): any;
    abstract getUIFont(defaultFont: any): any;
    abstract withFontFamily(family: string): Font;
    abstract withFontStyle(style: string): Font;
    abstract withFontWeight(weight: string): Font;
    abstract withFontSize(size: number): Font;
    static equals(value1: Font, value2: Font): boolean;
}
export declare type FontStyle = 'normal' | 'italic';
export declare namespace FontStyle {
    const NORMAL: 'normal';
    const ITALIC: 'italic';
    const isValid: (value: any) => value is import("./font").FontStyle;
    const parse: (value: any) => import("./font").FontStyle;
}
export declare type FontWeight = '100' | '200' | '300' | 'normal' | '400' | '500' | '600' | 'bold' | '700' | '800' | '900';
export declare namespace FontWeight {
    const THIN: '100';
    const EXTRA_LIGHT: '200';
    const LIGHT: '300';
    const NORMAL: 'normal';
    const MEDIUM: '500';
    const SEMI_BOLD: '600';
    const BOLD: 'bold';
    const EXTRA_BOLD: '800';
    const BLACK: '900';
    const isValid: (value: any) => value is import("./font").FontWeight;
    const parse: (value: any) => import("./font").FontStyle;
}
export declare function parseFontFamily(value: string): Array<string>;
export declare module genericFontFamilies {
    const serif = "serif";
    const sansSerif = "sans-serif";
    const monospace = "monospace";
    const system = "system";
}
export declare function parseFont(fontValue: string): ParsedFont;
