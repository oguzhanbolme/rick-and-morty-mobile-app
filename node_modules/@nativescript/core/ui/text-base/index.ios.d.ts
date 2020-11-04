import { TextTransform } from './text-base-common';
import { TextBaseCommon } from './text-base-common';
import { FormattedString } from './formatted-string';
import { Span } from './span';
import { VerticalAlignment } from '../styling/style-properties';
export * from './text-base-common';
export declare class TextBase extends TextBaseCommon {
    nativeViewProtected: UITextField | UITextView | UILabel | UIButton;
    nativeTextViewProtected: UITextField | UITextView | UILabel | UIButton;
    private _tappable;
    private _tapGestureRecognizer;
    _spanRanges: NSRange[];
    initNativeView(): void;
    _setTappableState(tappable: boolean): void;
    _setNativeText(reset?: boolean): void;
    _setColor(color: UIColor): void;
    setFormattedTextDecorationAndTransform(): void;
    setTextDecorationAndTransform(): void;
    createNSMutableAttributedString(formattedString: FormattedString): NSMutableAttributedString;
    getBaselineOffset(font: UIFont, align?: VerticalAlignment): number;
    createMutableStringForSpan(span: Span, text: string): NSMutableAttributedString;
}
export declare function getTransformedText(text: string, textTransform: TextTransform): string;
