import { WrapLayout as WrapLayoutDefinition, Orientation } from '.';
import { LayoutBase } from '../layout-base';
import { Property } from '../../core/properties';
import { Length } from '../../styling/style-properties';
export * from '../layout-base';
export declare class WrapLayoutBase extends LayoutBase implements WrapLayoutDefinition {
    orientation: Orientation;
    itemWidth: Length;
    itemHeight: Length;
    effectiveItemWidth: number;
    effectiveItemHeight: number;
}
export declare const itemWidthProperty: Property<WrapLayoutBase, Length>;
export declare const itemHeightProperty: Property<WrapLayoutBase, Length>;
export declare const orientationProperty: Property<WrapLayoutBase, import("../stack-layout").Orientation>;
