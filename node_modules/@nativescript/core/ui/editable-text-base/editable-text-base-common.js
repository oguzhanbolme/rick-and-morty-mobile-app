import { TextBase } from '../text-base';
import { Property, CssProperty, makeValidator, makeParser } from '../core/properties';
import { PseudoClassHandler } from '../core/view';
import { booleanConverter } from '../core/view-base';
import { Style } from '../styling/style';
import { Color } from '../../color';
export class EditableTextBase extends TextBase {
    constructor() {
        super(...arguments);
        this._focusHandler = () => this._goToVisualState('focus');
        this._blurHandler = () => this._goToVisualState('blur');
    }
    _updateTextBaseFocusStateHandler(subscribe) {
        const method = subscribe ? 'on' : 'off';
        this[method]('focus', this._focusHandler);
        this[method]('blur', this._blurHandler);
    }
}
EditableTextBase.blurEvent = 'blur';
EditableTextBase.focusEvent = 'focus';
EditableTextBase.textChangeEvent = 'textChange';
__decorate([
    PseudoClassHandler('focus', 'blur'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EditableTextBase.prototype, "_updateTextBaseFocusStateHandler", null);
// TODO: Why not name it - hintColor property??
// TODO: Or rename hintProperty to 'placeholder' and make it CSSProperty??
// https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-placeholder
export const placeholderColorProperty = new CssProperty({
    name: 'placeholderColor',
    cssName: 'placeholder-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
placeholderColorProperty.register(Style);
const keyboardTypeConverter = makeParser(makeValidator('datetime', 'phone', 'number', 'url', 'email', 'integer'));
export const keyboardTypeProperty = new Property({ name: 'keyboardType', valueConverter: keyboardTypeConverter });
keyboardTypeProperty.register(EditableTextBase);
const returnKeyTypeConverter = makeParser(makeValidator('done', 'next', 'go', 'search', 'send'));
export const returnKeyTypeProperty = new Property({ name: 'returnKeyType', valueConverter: returnKeyTypeConverter });
returnKeyTypeProperty.register(EditableTextBase);
export const editableProperty = new Property({
    name: 'editable',
    defaultValue: true,
    valueConverter: booleanConverter,
});
editableProperty.register(EditableTextBase);
export const updateTextTriggerProperty = new Property({ name: 'updateTextTrigger', defaultValue: 'textChanged' });
updateTextTriggerProperty.register(EditableTextBase);
const autocapitalizationTypeConverter = makeParser(makeValidator('none', 'words', 'sentences', 'allcharacters'));
export const autocapitalizationTypeProperty = new Property({
    name: 'autocapitalizationType',
    defaultValue: 'sentences',
    valueConverter: autocapitalizationTypeConverter,
});
autocapitalizationTypeProperty.register(EditableTextBase);
export const autocorrectProperty = new Property({
    name: 'autocorrect',
    valueConverter: booleanConverter,
});
autocorrectProperty.register(EditableTextBase);
export const hintProperty = new Property({
    name: 'hint',
    defaultValue: '',
});
hintProperty.register(EditableTextBase);
export const maxLengthProperty = new Property({
    name: 'maxLength',
    defaultValue: Number.POSITIVE_INFINITY,
    valueConverter: parseInt,
});
maxLengthProperty.register(EditableTextBase);
//# sourceMappingURL=editable-text-base-common.js.map