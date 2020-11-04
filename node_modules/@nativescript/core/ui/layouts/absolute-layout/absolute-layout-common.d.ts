import { AbsoluteLayout as AbsoluteLayoutDefinition } from '.';
import { LayoutBase } from '../layout-base';
import { View } from '../../core/view';
import { Property } from '../../core/properties';
import { Length } from '../../styling/style-properties';
export * from '../layout-base';
export declare class AbsoluteLayoutBase extends LayoutBase implements AbsoluteLayoutDefinition {
    static getLeft(element: View): Length;
    static setLeft(element: View, value: Length): void;
    static getTop(element: View): Length;
    static setTop(element: View, value: Length): void;
    onLeftChanged(view: View, oldValue: Length, newValue: Length): void;
    onTopChanged(view: View, oldValue: Length, newValue: Length): void;
}
export declare const leftProperty: Property<View, Length>;
export declare const topProperty: Property<View, Length>;
