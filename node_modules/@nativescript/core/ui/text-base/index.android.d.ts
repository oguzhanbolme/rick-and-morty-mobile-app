import { TextTransform } from './text-base-common';
import { TextBaseCommon } from './text-base-common';
export * from './text-base-common';
export interface TextTransformation {
    new (owner: TextBase): any;
}
export declare class TextBase extends TextBaseCommon {
    nativeViewProtected: android.widget.TextView;
    nativeTextViewProtected: android.widget.TextView;
    private _defaultTransformationMethod;
    private _paintFlags;
    private _minHeight;
    private _maxHeight;
    private _minLines;
    private _maxLines;
    private _tappable;
    private _defaultMovementMethod;
    initNativeView(): void;
    resetNativeView(): void;
    _setNativeText(reset?: boolean): void;
    _setTappableState(tappable: boolean): void;
}
export declare function getTransformedText(text: string, textTransform: TextTransform): string;
