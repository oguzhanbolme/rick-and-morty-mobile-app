import { StackLayout as StackLayoutDefinition, Orientation } from '.';
import { LayoutBase } from '../layout-base';
import { Property } from '../../core/properties';
export declare class StackLayoutBase extends LayoutBase implements StackLayoutDefinition {
    orientation: Orientation;
}
export declare const orientationProperty: Property<StackLayoutBase, Orientation>;
