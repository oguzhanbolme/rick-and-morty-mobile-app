import { Slider as SliderDefinition } from '.';
import { View } from '../core/view';
import { Property, CoercibleProperty } from '../core/properties';
export declare class SliderBase extends View implements SliderDefinition {
    value: number;
    minValue: number;
    maxValue: number;
}
/**
 * Represents the observable property backing the value property of each Slider instance.
 */
export declare const valueProperty: CoercibleProperty<SliderBase, number>;
/**
 * Represents the observable property backing the minValue property of each Slider instance.
 */
export declare const minValueProperty: Property<SliderBase, number>;
/**
 * Represents the observable property backing the maxValue property of each Slider instance.
 */
export declare const maxValueProperty: CoercibleProperty<SliderBase, number>;
