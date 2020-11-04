import { Font as FontBase, FontWeight } from './font-common';
export * from './font-common';
export declare class Font extends FontBase {
    static default: Font;
    private _typeface;
    constructor(family: string, size: number, style: 'normal' | 'italic', weight: FontWeight);
    withFontFamily(family: string): Font;
    withFontStyle(style: 'normal' | 'italic'): Font;
    withFontWeight(weight: FontWeight): Font;
    withFontSize(size: number): Font;
    getAndroidTypeface(): android.graphics.Typeface;
    getUIFont(defaultFont: UIFont): UIFont;
}
