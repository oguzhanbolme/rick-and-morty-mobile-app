var TabStripItem_1;
import { PseudoClassHandler } from '../../core/view';
// Requires
import { View, CSSType } from '../../core/view';
import { backgroundColorProperty, backgroundInternalProperty } from '../../styling/style-properties';
import { Image } from '../../image';
import { Label } from '../../label';
import { textTransformProperty } from '../../text-base';
let TabStripItem = TabStripItem_1 = class TabStripItem extends View {
    get title() {
        if (this.isLoaded) {
            return this.label.text;
        }
        return this._title;
    }
    set title(value) {
        this._title = value;
        if (this.isLoaded) {
            this.label.text = value;
        }
    }
    get iconClass() {
        if (this.isLoaded) {
            return this.image.className;
        }
        return this._iconClass;
    }
    set iconClass(value) {
        this._iconClass = value;
        if (this.isLoaded) {
            this.image.className = value;
        }
    }
    get iconSource() {
        if (this.isLoaded) {
            return this.image.src;
        }
        return this._iconSource;
    }
    set iconSource(value) {
        this._iconSource = value;
        if (this.isLoaded) {
            this.image.src = value;
        }
    }
    onLoaded() {
        if (!this.image) {
            const image = new Image();
            image.src = this.iconSource;
            image.className = this.iconClass;
            this.image = image;
            this._addView(this.image);
        }
        if (!this.label) {
            const label = new Label();
            label.text = this.title;
            this.label = label;
            this._addView(this.label);
        }
        super.onLoaded();
        this._labelColorHandler =
            this._labelColorHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarItemColor(this, args.value);
                });
        this.label.style.on('colorChange', this._labelColorHandler);
        this._labelFontHandler =
            this._labelFontHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarItemFontInternal(this, args.value);
                });
        this.label.style.on('fontInternalChange', this._labelFontHandler);
        this._labelTextTransformHandler =
            this._labelTextTransformHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarItemTextTransform(this, args.value);
                });
        this.label.style.on('textTransformChange', this._labelTextTransformHandler);
        this._labelTextHandler =
            this._labelTextHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarItemTitle(this, args.value);
                });
        this.label.on('textChange', this._labelTextHandler);
        this._imageColorHandler =
            this._imageColorHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarIconColor(this, args.value);
                });
        this.image.style.on('colorChange', this._imageColorHandler);
        this._imageFontHandler =
            this._imageFontHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarIconColor(this, args.value);
                });
        this.image.style.on('fontInternalChange', this._imageFontHandler);
        this._imageSrcHandler =
            this._imageSrcHandler ||
                ((args) => {
                    const parent = this.parent;
                    const tabStripParent = parent && parent.parent;
                    return tabStripParent && tabStripParent.setTabBarIconSource(this, args.value);
                });
        this.image.on('srcChange', this._imageSrcHandler);
    }
    onUnloaded() {
        super.onUnloaded();
        this.label.style.off('colorChange', this._labelColorHandler);
        this.label.style.off('fontInternalChange', this._labelFontHandler);
        this.label.style.off('textTransformChange', this._labelTextTransformHandler);
        this.label.style.off('textChange', this._labelTextHandler);
        this.image.style.off('colorChange', this._imageColorHandler);
        this.image.style.off('fontInternalChange', this._imageFontHandler);
        this.image.style.off('srcChange', this._imageSrcHandler);
    }
    eachChild(callback) {
        if (this.label) {
            callback(this.label);
        }
        if (this.image) {
            callback(this.image);
        }
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof Image) {
            this.image = value;
            this.iconSource = value.src;
            this.iconClass = value.className;
            this._addView(value);
            // selectedIndexProperty.coerce(this);
        }
        if (value instanceof Label) {
            this.label = value;
            this.title = value.text;
            this._addView(value);
            // selectedIndexProperty.coerce(this);
        }
    }
    requestLayout() {
        // Default implementation for non View instances (like TabViewItem).
        const parent = this.parent;
        if (parent) {
            parent.requestLayout();
        }
    }
    _updateTabStateChangeHandler(subscribe) {
        if (subscribe) {
            this._highlightedHandler =
                this._highlightedHandler ||
                    (() => {
                        this._goToVisualState('highlighted');
                    });
            this._normalHandler =
                this._normalHandler ||
                    (() => {
                        this._goToVisualState('normal');
                    });
            this.on(TabStripItem_1.selectEvent, this._highlightedHandler);
            this.on(TabStripItem_1.unselectEvent, this._normalHandler);
            const parent = this.parent;
            const tabStripParent = parent && parent.parent;
            if (this._index === tabStripParent.selectedIndex && !(global.isIOS && tabStripParent.cssType.toLowerCase() === 'tabs')) {
                // HACK: tabStripParent instanceof Tabs creates a circular dependency
                // HACK: tabStripParent.cssType === "Tabs" is a hacky workaround
                this._goToVisualState('highlighted');
            }
        }
        else {
            this.off(TabStripItem_1.selectEvent, this._highlightedHandler);
            this.off(TabStripItem_1.unselectEvent, this._normalHandler);
        }
    }
    [backgroundColorProperty.getDefault]() {
        const parent = this.parent;
        const tabStripParent = parent && parent.parent;
        return tabStripParent && tabStripParent.getTabBarBackgroundColor();
    }
    [backgroundColorProperty.setNative](value) {
        const parent = this.parent;
        const tabStripParent = parent && parent.parent;
        return tabStripParent && tabStripParent.setTabBarItemBackgroundColor(this, value);
    }
    [textTransformProperty.getDefault]() {
        const parent = this.parent;
        const tabStripParent = parent && parent.parent;
        return tabStripParent && tabStripParent.getTabBarItemTextTransform(this);
    }
    [textTransformProperty.setNative](value) {
        const parent = this.parent;
        const tabStripParent = parent && parent.parent;
        return tabStripParent && tabStripParent.setTabBarItemTextTransform(this, value);
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        // disable the background CSS properties
    }
};
TabStripItem.tapEvent = 'tap';
TabStripItem.selectEvent = 'select';
TabStripItem.unselectEvent = 'unselect';
__decorate([
    PseudoClassHandler('normal', 'highlighted', 'pressed', 'active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], TabStripItem.prototype, "_updateTabStateChangeHandler", null);
TabStripItem = TabStripItem_1 = __decorate([
    CSSType('TabStripItem')
], TabStripItem);
export { TabStripItem };
//# sourceMappingURL=index.js.map