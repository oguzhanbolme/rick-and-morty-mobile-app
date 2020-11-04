import { Font as FontBase, FontStyle, FontWeight } from './font-common';
export * from './font-common';
export declare class Font extends FontBase {
    static default: Font;
    private _uiFont;
    constructor(family: string, size: number, style: FontStyle, weight: FontWeight);
    withFontFamily(family: string): Font;
    withFontStyle(style: FontStyle): Font;
    withFontWeight(weight: FontWeight): Font;
    withFontSize(size: number): Font;
    getUIFont(defaultFont: UIFont): UIFont;
    getAndroidTypeface(): android.graphics.Typeface;
}
export declare module ios {
    function registerFont(fontFile: string): void;
}
