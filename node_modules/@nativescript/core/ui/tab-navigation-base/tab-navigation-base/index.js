import { View } from '../../core/view';
import { Property, CoercibleProperty } from '../../core/properties';
import { TabContentItem } from '../tab-content-item';
import { TabStrip } from '../tab-strip';
export class TabNavigationBase extends View {
    _addArrayFromBuilder(name, value) {
        if (name === 'items') {
            this.items = value;
        }
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof TabContentItem) {
            if (!this.items) {
                this.items = new Array();
            }
            this.items.push(value);
            this._addView(value);
            // selectedIndexProperty.coerce(this);
        }
        else if (value instanceof TabStrip) {
            // Setting tabStrip will trigger onTabStripChanged
            this.tabStrip = value;
        }
    }
    get _selectedView() {
        const selectedIndex = this.selectedIndex;
        return selectedIndex > -1 ? this.items[selectedIndex].content : null;
    }
    get _childrenCount() {
        const items = this.items;
        return items ? items.length : 0;
    }
    eachChild(callback) {
        const items = this.items;
        if (items) {
            items.forEach((item, i) => {
                callback(item);
            });
        }
        const tabStrip = this.tabStrip;
        if (tabStrip) {
            callback(tabStrip);
        }
    }
    eachChildView(callback) {
        const items = this.items;
        if (items) {
            items.forEach((item, i) => {
                callback(item.content);
            });
        }
    }
    onItemsChanged(oldItems, newItems) {
        if (oldItems) {
            oldItems.forEach((item) => this._removeView(item));
        }
        if (newItems) {
            newItems.forEach((item) => {
                if (!item.content) {
                    throw new Error(`TabContentItem must have a content (view).`);
                }
                this._addView(item);
            });
        }
    }
    onTabStripChanged(oldTabStrip, newTabStrip) {
        if (oldTabStrip && oldTabStrip.parent) {
            this._removeView(oldTabStrip);
        }
        if (newTabStrip) {
            this._addView(newTabStrip);
        }
    }
    onSelectedIndexChanged(oldIndex, newIndex) {
        // to be overridden in platform specific files
        this.notify({
            eventName: TabNavigationBase.selectedIndexChangedEvent,
            object: this,
            oldIndex,
            newIndex,
        });
    }
    getTabBarBackgroundColor() {
        // overridden by inheritors
        return null;
    }
    getTabBarBackgroundArgbColor() {
        // This method is implemented only for Android
        const colorDrawable = this.getTabBarBackgroundColor();
        return colorDrawable && colorDrawable.getColor && colorDrawable.getColor();
    }
    setTabBarBackgroundColor(value) {
        // overridden by inheritors
    }
    getTabBarFontInternal() {
        // overridden by inheritors
        return null;
    }
    setTabBarFontInternal(value) {
        // overridden by inheritors
    }
    getTabBarTextTransform() {
        // overridden by inheritors
        return null;
    }
    setTabBarTextTransform(value) {
        // overridden by inheritors
    }
    getTabBarHighlightColor() {
        // overridden by inheritors
    }
    setTabBarHighlightColor(value) {
        // overridden by inheritors
    }
    getTabBarSelectedItemColor() {
        // overridden by inheritors
        return null;
    }
    setTabBarSelectedItemColor(value) {
        // overridden by inheritors
    }
    getTabBarUnSelectedItemColor() {
        // overridden by inheritors
        return null;
    }
    setTabBarUnSelectedItemColor(value) {
        // overridden by inheritors
    }
    getTabBarColor() {
        // overridden by inheritors
        return null;
    }
    setTabBarColor(value) {
        // overridden by inheritors
    }
    setTabBarItemTitle(tabStripItem, value) {
        // overridden by inheritors
    }
    getTabBarItemBackgroundColor(tabStripItem) {
        // overridden by inheritors
        return null;
    }
    setTabBarItemBackgroundColor(tabStripItem, value) {
        // overridden by inheritors
    }
    getTabBarItemColor(tabStripItem) {
        // overridden by inheritors
        return null;
    }
    setTabBarItemColor(tabStripItem, value) {
        // overridden by inheritors
    }
    setTabBarIconColor(tabStripItem, value) {
        // overridden by inheritors
    }
    setTabBarIconSource(tabStripItem, value) {
        // overridden by inheritors
    }
    getTabBarItemFontSize(tabStripItem) {
        // overridden by inheritors
        return null;
    }
    setTabBarItemFontSize(tabStripItem, value) {
        // overridden by inheritors
    }
    getTabBarItemFontInternal(tabStripItem) {
        // overridden by inheritors
        return null;
    }
    setTabBarItemFontInternal(tabStripItem, value) {
        // overridden by inheritors
    }
    getTabBarItemTextTransform(tabStripItem) {
        // overridden by inheritors
        return null;
    }
    setTabBarItemTextTransform(tabStripItem, value) {
        // overridden by inheritors
    }
}
TabNavigationBase.selectedIndexChangedEvent = 'selectedIndexChanged';
const MIN_ICON_SIZE = 24;
const MAX_ICON_WIDTH = 31;
const MAX_ICON_HEIGHT = 28;
export function getIconSpecSize(size) {
    const inWidth = size.width;
    const inHeight = size.height;
    let outWidth = 0;
    let outHeight = 0;
    if (inWidth < inHeight) {
        outWidth = MIN_ICON_SIZE;
        outHeight = (inHeight * MIN_ICON_SIZE) / inWidth;
        if (outHeight > MAX_ICON_HEIGHT) {
            outHeight = MAX_ICON_HEIGHT;
            outWidth = (inWidth * MAX_ICON_HEIGHT) / inHeight;
        }
    }
    else {
        outHeight = MIN_ICON_SIZE;
        outWidth = (inWidth * MIN_ICON_SIZE) / inHeight;
        if (outWidth > MAX_ICON_WIDTH) {
            outWidth = MAX_ICON_WIDTH;
            outHeight = (inHeight * MAX_ICON_WIDTH) / inWidth;
        }
    }
    return { width: outWidth, height: outHeight };
}
export const selectedIndexProperty = new CoercibleProperty({
    name: 'selectedIndex',
    defaultValue: -1,
    affectsLayout: global.isIOS,
    valueChanged: (target, oldValue, newValue) => {
        target.onSelectedIndexChanged(oldValue, newValue);
    },
    coerceValue: (target, value) => {
        const items = target.items;
        if (items) {
            const max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        return value;
    },
    valueConverter: (v) => parseInt(v),
});
selectedIndexProperty.register(TabNavigationBase);
export const _tabs = new Array();
export const itemsProperty = new Property({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        target.onItemsChanged(oldValue, newValue);
    },
});
itemsProperty.register(TabNavigationBase);
export const tabStripProperty = new Property({
    name: 'tabStrip',
    valueChanged: (target, oldValue, newValue) => {
        target.onTabStripChanged(oldValue, newValue);
    },
});
tabStripProperty.register(TabNavigationBase);
//# sourceMappingURL=index.js.map