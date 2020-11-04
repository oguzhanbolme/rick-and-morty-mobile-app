import { Button as ButtonDefinition } from '.';
import { TextBase } from '../text-base';
export declare abstract class ButtonBase extends TextBase implements ButtonDefinition {
    static tapEvent: string;
    get textWrap(): boolean;
    set textWrap(value: boolean);
}
