import { Point, CustomLayoutView as CustomLayoutViewDefinition } from '.';
import { GestureTypes, GestureEventData } from '../../gestures';
import { ViewCommon } from './view-common';
import { ShowModalOptions } from '../view-base';
import { EventData } from '../../../data/observable';
import { Length } from '../../styling/style-properties';
import { Background } from '../../styling/background';
export * from './view-common';
export * from './view-helper';
export * from '../properties';
export declare class View extends ViewCommon {
    static androidBackPressedEvent: string;
    _dialogFragment: androidx.fragment.app.DialogFragment;
    _manager: androidx.fragment.app.FragmentManager;
    private _isClickable;
    private touchListenerIsSet;
    private touchListener;
    private layoutChangeListenerIsSet;
    private layoutChangeListener;
    private _rootManager;
    nativeViewProtected: android.view.View;
    _observe(type: GestureTypes, callback: (args: GestureEventData) => void, thisArg?: any): void;
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): void;
    off(eventNames: string, callback?: any, thisArg?: any): void;
    _getChildFragmentManager(): androidx.fragment.app.FragmentManager;
    _getRootFragmentManager(): androidx.fragment.app.FragmentManager;
    _getFragmentManager(): androidx.fragment.app.FragmentManager;
    onLoaded(): void;
    onUnloaded(): void;
    onBackPressed(): boolean;
    handleGestureTouch(event: android.view.MotionEvent): any;
    hasGestureObservers(): boolean;
    initNativeView(): void;
    disposeNativeView(): void;
    setOnTouchListener(): void;
    private setOnLayoutChangeListener;
    get isLayoutRequired(): boolean;
    get isLayoutValid(): boolean;
    get _hasFragments(): boolean;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    requestLayout(): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    layout(left: number, top: number, right: number, bottom: number): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    _getCurrentLayoutBounds(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    getMeasuredWidth(): number;
    getMeasuredHeight(): number;
    focus(): boolean;
    getLocationInWindow(): Point;
    getLocationOnScreen(): Point;
    getLocationRelativeTo(otherView: ViewCommon): Point;
    static resolveSizeAndState(size: number, specSize: number, specMode: number, childMeasuredState: number): number;
    protected _showNativeModalView(parent: View, options: ShowModalOptions): void;
    protected _hideNativeModalView(parent: View, whenClosedCallback: () => void): void;
    protected getDefaultElevation(): number;
    protected getDefaultDynamicElevationOffset(): number;
    private refreshStateListAnimator;
    _redrawNativeBackground(value: android.graphics.drawable.Drawable | Background): void;
}
export declare class ContainerView extends View {
    iosOverflowSafeArea: boolean;
}
export declare class CustomLayoutView extends ContainerView implements CustomLayoutViewDefinition {
    nativeViewProtected: android.view.ViewGroup;
    createNativeView(): org.nativescript.widgets.ContentLayout;
    _addViewToNativeVisualTree(child: ViewCommon, atIndex?: number): boolean;
    _updateNativeLayoutParams(child: View): void;
    _setChildMinWidthNative(child: View, value: Length): void;
    _setChildMinHeightNative(child: View, value: Length): void;
    _removeViewFromNativeVisualTree(child: ViewCommon): void;
}
