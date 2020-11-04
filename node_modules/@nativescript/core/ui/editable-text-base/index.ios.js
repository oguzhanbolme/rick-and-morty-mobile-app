import { EditableTextBase as EditableTextBaseCommon, keyboardTypeProperty, returnKeyTypeProperty, autocapitalizationTypeProperty, autocorrectProperty } from './editable-text-base-common';
export * from './editable-text-base-common';
export class EditableTextBase extends EditableTextBaseCommon {
    dismissSoftInput() {
        this.nativeTextViewProtected.resignFirstResponder();
        this.notify({ eventName: EditableTextBase.blurEvent, object: this });
    }
    [keyboardTypeProperty.getDefault]() {
        let keyboardType = this.nativeTextViewProtected.keyboardType;
        switch (keyboardType) {
            case 2 /* NumbersAndPunctuation */:
                return 'number';
            case 5 /* PhonePad */:
                return 'phone';
            case 3 /* URL */:
                return 'url';
            case 7 /* EmailAddress */:
                return 'email';
            case 4 /* NumberPad */:
                return 'integer';
            default:
                return keyboardType.toString();
        }
    }
    [keyboardTypeProperty.setNative](value) {
        let newKeyboardType;
        switch (value) {
            case 'datetime':
                newKeyboardType = 2 /* NumbersAndPunctuation */;
                break;
            case 'phone':
                newKeyboardType = 5 /* PhonePad */;
                break;
            case 'number':
                newKeyboardType = 2 /* NumbersAndPunctuation */;
                break;
            case 'url':
                newKeyboardType = 3 /* URL */;
                break;
            case 'email':
                newKeyboardType = 7 /* EmailAddress */;
                break;
            case 'integer':
                newKeyboardType = 4 /* NumberPad */;
                break;
            default:
                let kt = +value;
                if (!isNaN(kt)) {
                    newKeyboardType = kt;
                }
                else {
                    newKeyboardType = 0 /* Default */;
                }
                break;
        }
        this.nativeTextViewProtected.keyboardType = newKeyboardType;
    }
    [returnKeyTypeProperty.getDefault]() {
        let returnKeyType = this.nativeTextViewProtected.returnKeyType;
        switch (returnKeyType) {
            case 9 /* Done */:
                return 'done';
            case 1 /* Go */:
                return 'go';
            case 4 /* Next */:
                return 'next';
            case 6 /* Search */:
                return 'search';
            case 7 /* Send */:
                return 'send';
            default:
                return returnKeyType.toString();
        }
    }
    [returnKeyTypeProperty.setNative](value) {
        let newValue;
        switch (value) {
            case 'done':
                newValue = 9 /* Done */;
                break;
            case 'go':
                newValue = 1 /* Go */;
                break;
            case 'next':
                newValue = 4 /* Next */;
                break;
            case 'search':
                newValue = 6 /* Search */;
                break;
            case 'send':
                newValue = 7 /* Send */;
                break;
            default:
                let rkt = +value;
                if (!isNaN(rkt)) {
                    newValue = rkt;
                }
                else {
                    newValue = 0 /* Default */;
                }
                break;
        }
        this.nativeTextViewProtected.returnKeyType = newValue;
    }
    [autocapitalizationTypeProperty.getDefault]() {
        let autocapitalizationType = this.nativeTextViewProtected.autocapitalizationType;
        switch (autocapitalizationType) {
            case 0 /* None */:
                return 'none';
            case 1 /* Words */:
                return 'words';
            case 2 /* Sentences */:
                return 'sentences';
            case 3 /* AllCharacters */:
                return 'allcharacters';
            default:
                throw new Error('Invalid autocapitalizationType value:' + autocapitalizationType);
        }
    }
    [autocapitalizationTypeProperty.setNative](value) {
        let newValue;
        switch (value) {
            case 'none':
                newValue = 0 /* None */;
                break;
            case 'words':
                newValue = 1 /* Words */;
                break;
            case 'sentences':
                newValue = 2 /* Sentences */;
                break;
            case 'allcharacters':
                newValue = 3 /* AllCharacters */;
                break;
            default:
                newValue = 2 /* Sentences */;
                break;
        }
        this.nativeTextViewProtected.autocapitalizationType = newValue;
    }
    [autocorrectProperty.getDefault]() {
        let autocorrectionType = this.nativeTextViewProtected.autocorrectionType;
        switch (autocorrectionType) {
            case 2 /* Yes */:
                return true;
            case 1 /* No */:
                return false;
            case 0 /* Default */:
                return autocorrectionType;
        }
    }
    [autocorrectProperty.setNative](value) {
        let newValue;
        if (typeof value === 'number') {
            newValue = 0 /* Default */;
        }
        else if (value) {
            newValue = 2 /* Yes */;
        }
        else {
            newValue = 1 /* No */;
        }
        this.nativeTextViewProtected.autocorrectionType = newValue;
    }
}
export function _updateCharactersInRangeReplacementString(formattedText, rangeLocation, rangeLength, replacementString) {
    let deletingText = !replacementString;
    let currentLocation = 0;
    for (let i = 0, length = formattedText.spans.length; i < length; i++) {
        let span = formattedText.spans.getItem(i);
        if (currentLocation <= rangeLocation && rangeLocation < currentLocation + span.text.length) {
            let newText = splice(span.text, rangeLocation - currentLocation, deletingText ? rangeLength : 0, replacementString);
            span._setTextInternal(newText);
            return;
        }
        currentLocation += span.text.length;
    }
}
/*
 * @param {String} value The string to splice.
 * @param {number} start Index at which to start changing the string.
 * @param {number} delCount An integer indicating the number of old chars to remove.
 * @param {string} newSubStr The String that is spliced in.
 * @return {string} A new string with the spliced substring.function splice(value: string, start: number, delCount: number, newSubStr: string) {
 */
function splice(value, start, delCount, newSubStr) {
    return value.slice(0, start) + newSubStr + value.slice(start + Math.abs(delCount));
}
//# sourceMappingURL=index.ios.js.map