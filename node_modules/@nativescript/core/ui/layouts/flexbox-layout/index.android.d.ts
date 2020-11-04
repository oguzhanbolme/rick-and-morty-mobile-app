import { FlexboxLayoutBase } from './flexbox-layout-common';
import { View } from '../../core/view';
import { Length } from '../../styling/style-properties';
export * from './flexbox-layout-common';
export declare class FlexboxLayout extends FlexboxLayoutBase {
    nativeViewProtected: org.nativescript.widgets.FlexboxLayout;
    constructor();
    createNativeView(): org.nativescript.widgets.FlexboxLayout;
    resetNativeView(): void;
    _updateNativeLayoutParams(child: View): void;
    _setChildMinWidthNative(child: View, value: Length): void;
    _setChildMinHeightNative(child: View, value: Length): void;
}
