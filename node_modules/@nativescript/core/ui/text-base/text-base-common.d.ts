import { PropertyChangeData } from '../../data/observable';
import { ViewBase } from '../core/view-base';
import { FontStyle, FontWeight } from '../styling/font-interfaces';
import { FormattedString } from './formatted-string';
import { Span } from './span';
import { View } from '../core/view';
import { Property, CssProperty, InheritedCssProperty } from '../core/properties';
import { Style } from '../styling/style';
import { Length } from '../styling/style-properties';
import { TextAlignment, TextDecoration, TextTransform, WhiteSpace } from './text-base-interfaces';
import { TextBase as TextBaseDefinition } from '.';
export * from './text-base-interfaces';
export declare abstract class TextBaseCommon extends View implements TextBaseDefinition {
    _isSingleLine: boolean;
    text: string;
    formattedText: FormattedString;
    /***
     * In the NativeScript Core; by default the nativeTextViewProtected points to the same value as nativeViewProtected.
     * At this point no internal NS components need this indirection functionality.
     * This indirection is used to allow support usage by third party components so they don't have to duplicate functionality.
     *
     * A third party component can just override the `nativeTextViewProtected` getter and return a different internal view and that view would be
     * what all TextView/TextInput class features would be applied to.
     *
     * A example is the Android MaterialDesign TextInput class, it has a wrapper view of a TextInputLayout
     *    https://developer.android.com/reference/com/google/android/material/textfield/TextInputLayout
     * which wraps the actual TextInput.  This wrapper layout (TextInputLayout) must be assigned to the nativeViewProtected as the entire
     * NS Core uses nativeViewProtected for everything related to layout, so that it can be measured, added to the parent view as a child, ect.
     *
     * However, its internal view would be the actual TextView/TextInput and to allow that sub-view to have the normal TextView/TextInput
     * class features, which we expose and to allow them to work on it, the internal TextView/TextInput is what the needs to have the class values applied to it.
     *
     * So all code that works on what is expected to be a TextView/TextInput should use `nativeTextViewProtected` so that any third party
     * components that need to have two separate components can work properly without them having to duplicate all the TextBase (and decendants) functionality
     * by just overriding the nativeTextViewProtected getter.
     **/
    get nativeTextViewProtected(): any;
    get fontFamily(): string;
    set fontFamily(value: string);
    get fontSize(): number;
    set fontSize(value: number);
    get fontStyle(): FontStyle;
    set fontStyle(value: FontStyle);
    get fontWeight(): FontWeight;
    set fontWeight(value: FontWeight);
    get letterSpacing(): number;
    set letterSpacing(value: number);
    get lineHeight(): number;
    set lineHeight(value: number);
    get textAlignment(): TextAlignment;
    set textAlignment(value: TextAlignment);
    get textDecoration(): TextDecoration;
    set textDecoration(value: TextDecoration);
    get textTransform(): TextTransform;
    set textTransform(value: TextTransform);
    get whiteSpace(): WhiteSpace;
    set whiteSpace(value: WhiteSpace);
    get padding(): string | Length;
    set padding(value: string | Length);
    get paddingTop(): Length;
    set paddingTop(value: Length);
    get paddingRight(): Length;
    set paddingRight(value: Length);
    get paddingBottom(): Length;
    set paddingBottom(value: Length);
    get paddingLeft(): Length;
    set paddingLeft(value: Length);
    _onFormattedTextContentsChanged(data: PropertyChangeData): void;
    _addChildFromBuilder(name: string, value: any): void;
    _requestLayoutOnTextChanged(): void;
    eachChild(callback: (child: ViewBase) => boolean): void;
    _setNativeText(reset?: boolean): void;
}
export declare function isBold(fontWeight: FontWeight): boolean;
export declare const textProperty: Property<TextBaseCommon, string>;
export declare const formattedTextProperty: Property<TextBaseCommon, FormattedString>;
export declare function getClosestPropertyValue<T>(property: CssProperty<any, T>, span: Span): T;
export declare const textAlignmentProperty: InheritedCssProperty<Style, import(".").TextAlignment>;
export declare const textTransformProperty: CssProperty<Style, import(".").TextTransform>;
export declare const whiteSpaceProperty: CssProperty<Style, import(".").WhiteSpace>;
export declare const textDecorationProperty: CssProperty<Style, import(".").TextDecoration>;
export declare const letterSpacingProperty: InheritedCssProperty<Style, number>;
export declare const lineHeightProperty: InheritedCssProperty<Style, number>;
export declare const resetSymbol: unique symbol;
