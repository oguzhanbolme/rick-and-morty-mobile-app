// Types
import { Color } from '../../../color';
// Requires
import { CSSType, View } from '../../core/view';
import { booleanConverter } from '../../core/view-base';
import { Property } from '../../core/properties';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty, fontInternalProperty } from '../../styling/style-properties';
import { TabStripItem } from '../tab-strip-item';
import { textTransformProperty } from '../../text-base';
export const traceCategory = 'TabView';
// Place this on top because the webpack ts-loader doesn't work when export
// is after reference
export const highlightColorProperty = new Property({
    name: 'highlightColor',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
export const selectedItemColorProperty = new Property({
    name: 'selectedItemColor',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
export const unSelectedItemColorProperty = new Property({
    name: 'unSelectedItemColor',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
let TabStrip = class TabStrip extends View {
    eachChild(callback) {
        const items = this.items;
        if (items) {
            items.forEach((item, i) => {
                callback(item);
            });
        }
    }
    _addArrayFromBuilder(name, value) {
        if (name === 'items') {
            this.items = value;
        }
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof TabStripItem) {
            if (!this.items) {
                this.items = new Array();
            }
            this.items.push(value);
            this._addView(value);
            // selectedIndexProperty.coerce(this);
        }
    }
    onItemsChanged(oldItems, newItems) {
        if (oldItems) {
            oldItems.forEach((item) => this._removeView(item));
        }
        if (newItems) {
            newItems.forEach((item) => {
                this._addView(item);
            });
        }
    }
    [backgroundColorProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarBackgroundColor();
    }
    [backgroundColorProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarBackgroundColor(value);
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        // disable the background CSS properties
    }
    [colorProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarColor();
    }
    [colorProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarColor(value);
    }
    [fontInternalProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarFontInternal();
    }
    [fontInternalProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarFontInternal(value);
    }
    [textTransformProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarTextTransform();
    }
    [textTransformProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarTextTransform(value);
    }
    [highlightColorProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarHighlightColor();
    }
    [highlightColorProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarHighlightColor(value);
    }
    [selectedItemColorProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarSelectedItemColor();
    }
    [selectedItemColorProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarSelectedItemColor(value);
    }
    [unSelectedItemColorProperty.getDefault]() {
        const parent = this.parent;
        return parent && parent.getTabBarUnSelectedItemColor();
    }
    [unSelectedItemColorProperty.setNative](value) {
        const parent = this.parent;
        return parent && parent.setTabBarUnSelectedItemColor(value);
    }
};
TabStrip.itemTapEvent = 'itemTap';
TabStrip = __decorate([
    CSSType('TabStrip')
], TabStrip);
export { TabStrip };
const itemsProperty = new Property({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        target.onItemsChanged(oldValue, newValue);
    },
});
itemsProperty.register(TabStrip);
export const iosIconRenderingModeProperty = new Property({ name: 'iosIconRenderingMode', defaultValue: 'automatic' });
iosIconRenderingModeProperty.register(TabStrip);
export const isIconSizeFixedProperty = new Property({
    name: 'isIconSizeFixed',
    defaultValue: true,
    valueConverter: booleanConverter,
});
isIconSizeFixedProperty.register(TabStrip);
highlightColorProperty.register(TabStrip);
selectedItemColorProperty.register(TabStrip);
unSelectedItemColorProperty.register(TabStrip);
//# sourceMappingURL=index.js.map