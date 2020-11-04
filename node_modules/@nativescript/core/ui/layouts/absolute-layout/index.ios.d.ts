import { AbsoluteLayoutBase } from './absolute-layout-common';
import { View } from '../../core/view';
import { Length } from '../../styling/style-properties';
export * from './absolute-layout-common';
export declare class AbsoluteLayout extends AbsoluteLayoutBase {
    onLeftChanged(view: View, oldValue: Length, newValue: Length): void;
    onTopChanged(view: View, oldValue: Length, newValue: Length): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
}
