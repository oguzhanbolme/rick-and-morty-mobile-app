import { TextBase } from '../text-base';
import { CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
let ButtonBase = class ButtonBase extends TextBase {
    get textWrap() {
        return this.style.whiteSpace === 'normal';
    }
    set textWrap(value) {
        if (typeof value === 'string') {
            value = booleanConverter(value);
        }
        this.style.whiteSpace = value ? 'normal' : 'nowrap';
    }
};
ButtonBase.tapEvent = 'tap';
ButtonBase = __decorate([
    CSSType('Button')
], ButtonBase);
export { ButtonBase };
ButtonBase.prototype.recycleNativeView = 'auto';
//# sourceMappingURL=button-common.js.map