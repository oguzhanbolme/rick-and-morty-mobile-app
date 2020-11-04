import { ColorStop } from './gradient';
import { LinearGradient as CSSLinearGradient } from '../../css/parser';
export declare class LinearGradient {
    angle: number;
    colorStops: ColorStop[];
    static parse(value: CSSLinearGradient): LinearGradient;
    static equals(first: LinearGradient, second: LinearGradient): boolean;
}
