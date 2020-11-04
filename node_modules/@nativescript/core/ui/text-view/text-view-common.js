import { EditableTextBase } from '../editable-text-base';
import { Property } from '../core/properties';
export class TextViewBase extends EditableTextBase {
}
export const maxLinesProperty = new Property({
    name: 'maxLines',
    valueConverter: parseInt,
});
maxLinesProperty.register(EditableTextBase);
//# sourceMappingURL=text-view-common.js.map