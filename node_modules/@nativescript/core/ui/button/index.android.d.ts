import { ButtonBase } from './button-common';
export * from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: android.widget.Button;
    constructor();
    private _stateListAnimator;
    private _highlightedHandler;
    createNativeView(): globalAndroid.widget.Button;
    initNativeView(): void;
    disposeNativeView(): void;
    resetNativeView(): void;
    _updateButtonStateChangeHandler(subscribe: boolean): void;
    protected getDefaultElevation(): number;
    protected getDefaultDynamicElevationOffset(): number;
}
