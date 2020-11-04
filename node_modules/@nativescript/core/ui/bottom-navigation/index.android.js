import { TabStrip } from '../tab-navigation-base/tab-strip';
import { TabStripItem } from '../tab-navigation-base/tab-strip-item';
// Requires
import * as application from '../../application';
import { ImageSource } from '../../image-source';
import { ad, isFontIconURI, layout } from '../../utils';
import { CSSType } from '../core/view';
import { Color } from '../../color';
import { Frame } from '../frame';
import { getIconSpecSize, itemsProperty, selectedIndexProperty, TabNavigationBase, tabStripProperty } from '../tab-navigation-base/tab-navigation-base';
import { getTransformedText } from '../text-base';
// TODO: Impl trace
// import { Trace } from "../../../trace";
const PRIMARY_COLOR = 'colorPrimary';
const DEFAULT_ELEVATION = 8;
const TABID = '_tabId';
const INDEX = '_index';
const ownerSymbol = Symbol('_owner');
let TabFragment;
let BottomNavigationBar;
let AttachStateChangeListener;
let appResources;
class IconInfo {
}
function makeFragmentName(viewId, id) {
    return 'android:bottomnavigation:' + viewId + ':' + id;
}
function getTabById(id) {
    const ref = tabs.find((ref) => {
        const tab = ref.get();
        return tab && tab._domId === id;
    });
    return ref && ref.get();
}
function initializeNativeClasses() {
    if (BottomNavigationBar) {
        return;
    }
    var TabFragmentImplementation = /** @class */ (function (_super) {
    __extends(TabFragmentImplementation, _super);
    function TabFragmentImplementation() {
        var _this = _super.call(this) || this;
        _this.backgroundBitmap = null;
        return global.__native(_this);
    }
    TabFragmentImplementation.newInstance = function (tabId, index) {
        var args = new android.os.Bundle();
        args.putInt(TABID, tabId);
        args.putInt(INDEX, index);
        var fragment = new TabFragmentImplementation();
        fragment.setArguments(args);
        return fragment;
    };
    TabFragmentImplementation.prototype.onCreate = function (savedInstanceState) {
        _super.prototype.onCreate.call(this, savedInstanceState);
        var args = this.getArguments();
        this.owner = getTabById(args.getInt(TABID));
        this.index = args.getInt(INDEX);
        if (!this.owner) {
            throw new Error("Cannot find BottomNavigation");
        }
    };
    TabFragmentImplementation.prototype.onCreateView = function (inflater, container, savedInstanceState) {
        var tabItem = this.owner.items[this.index];
        return tabItem.nativeViewProtected;
    };
    TabFragmentImplementation.prototype.onDestroyView = function () {
        var hasRemovingParent = this.getRemovingParentFragment();
        // Get view as bitmap and set it as background. This is workaround for the disapearing nested fragments.
        // TODO: Consider removing it when update to androidx.fragment:1.2.0
        if (hasRemovingParent && this.owner.selectedIndex === this.index) {
            var bitmapDrawable = new android.graphics.drawable.BitmapDrawable(appResources, this.backgroundBitmap);
            this.owner._originalBackground = this.owner.backgroundColor || new Color('White');
            this.owner.nativeViewProtected.setBackgroundDrawable(bitmapDrawable);
            this.backgroundBitmap = null;
            var thisView = this.getView();
            if (thisView) {
                var thisViewParent = thisView.getParent();
                if (thisViewParent && thisViewParent instanceof android.view.ViewGroup) {
                    thisViewParent.removeView(thisView);
                }
            }
        }
        _super.prototype.onDestroyView.call(this);
    };
    TabFragmentImplementation.prototype.onPause = function () {
        var hasRemovingParent = this.getRemovingParentFragment();
        // Get view as bitmap and set it as background. This is workaround for the disapearing nested fragments.
        // TODO: Consider removing it when update to androidx.fragment:1.2.0
        if (hasRemovingParent && this.owner.selectedIndex === this.index) {
            this.backgroundBitmap = this.loadBitmapFromView(this.owner.nativeViewProtected);
        }
        _super.prototype.onPause.call(this);
    };
    TabFragmentImplementation.prototype.loadBitmapFromView = function (view) {
        // Another way to get view bitmap. Test performance vs setDrawingCacheEnabled
        // const width = view.getWidth();
        // const height = view.getHeight();
        // const bitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        // const canvas = new android.graphics.Canvas(bitmap);
        // view.layout(0, 0, width, height);
        // view.draw(canvas);
        view.setDrawingCacheEnabled(true);
        var bitmap = android.graphics.Bitmap.createBitmap(view.getDrawingCache());
        view.setDrawingCacheEnabled(false);
        return bitmap;
    };
    return TabFragmentImplementation;
}(org.nativescript.widgets.FragmentBase));
    var BottomNavigationBarImplementation = /** @class */ (function (_super) {
    __extends(BottomNavigationBarImplementation, _super);
    function BottomNavigationBarImplementation(context, owner) {
        var _this = _super.call(this, context) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    BottomNavigationBarImplementation.prototype.onSelectedPositionChange = function (position, prevPosition) {
        var owner = this.owner;
        if (!owner) {
            return;
        }
        owner.changeTab(position);
        var tabStripItems = owner.tabStrip && owner.tabStrip.items;
        if (position >= 0 && tabStripItems && tabStripItems[position]) {
            tabStripItems[position]._emit(TabStripItem.selectEvent);
        }
        if (prevPosition >= 0 && tabStripItems && tabStripItems[prevPosition]) {
            tabStripItems[prevPosition]._emit(TabStripItem.unselectEvent);
        }
        owner._setItemsColors(owner.tabStrip.items);
    };
    BottomNavigationBarImplementation.prototype.onTap = function (position) {
        var owner = this.owner;
        if (!owner) {
            return false;
        }
        var tabStrip = owner.tabStrip;
        var tabStripItems = tabStrip && tabStrip.items;
        if (position >= 0 && tabStripItems[position]) {
            tabStripItems[position]._emit(TabStripItem.tapEvent);
            tabStrip.notify({
                eventName: TabStrip.itemTapEvent,
                object: tabStrip,
                index: position,
            });
        }
        if (!owner.items[position]) {
            return false;
        }
        return true;
    };
    return BottomNavigationBarImplementation;
}(org.nativescript.widgets.BottomNavigationBar));
    var AttachListener = /** @class */ (function (_super) {
    __extends(AttachListener, _super);
    function AttachListener() {
        var _this = _super.call(this) || this;
        return global.__native(_this);
    }
    AttachListener.prototype.onViewAttachedToWindow = function (view) {
        var owner = view[ownerSymbol];
        if (owner) {
            owner._onAttachedToWindow();
        }
    };
    AttachListener.prototype.onViewDetachedFromWindow = function (view) {
        var owner = view[ownerSymbol];
        if (owner) {
            owner._onDetachedFromWindow();
        }
    };
    AttachListener = __decorate([
        Interfaces([android.view.View.OnAttachStateChangeListener])
    ], AttachListener);
    return AttachListener;
}(java.lang.Object));
    TabFragment = TabFragmentImplementation;
    BottomNavigationBar = BottomNavigationBarImplementation;
    AttachStateChangeListener = new AttachListener();
    appResources = application.android.context.getResources();
}
function setElevation(bottomNavigationBar) {
    const compat = androidx.core.view.ViewCompat;
    if (compat.setElevation) {
        const val = DEFAULT_ELEVATION * layout.getDisplayDensity();
        compat.setElevation(bottomNavigationBar, val);
    }
}
export const tabs = new Array();
function iterateIndexRange(index, eps, lastIndex, callback) {
    const rangeStart = Math.max(0, index - eps);
    const rangeEnd = Math.min(index + eps, lastIndex);
    for (let i = rangeStart; i <= rangeEnd; i++) {
        callback(i);
    }
}
let BottomNavigation = class BottomNavigation extends TabNavigationBase {
    constructor() {
        super();
        this._contentViewId = -1;
        this._attachedToWindow = false;
        this._textTransform = 'none';
        tabs.push(new WeakRef(this));
    }
    get _hasFragments() {
        return true;
    }
    onItemsChanged(oldItems, newItems) {
        super.onItemsChanged(oldItems, newItems);
        if (oldItems) {
            oldItems.forEach((item, i, arr) => {
                item.index = 0;
                item.tabItemSpec = null;
                item.setNativeView(null);
            });
        }
    }
    createNativeView() {
        initializeNativeClasses();
        // if (Trace.isEnabled()) {
        //     Trace.write("BottomNavigation._createUI(" + this + ");", traceCategory);
        // }
        const context = this._context;
        const nativeView = new org.nativescript.widgets.GridLayout(context);
        nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        // CONTENT VIEW
        const contentView = new org.nativescript.widgets.ContentLayout(this._context);
        const contentViewLayoutParams = new org.nativescript.widgets.CommonLayoutParams();
        contentViewLayoutParams.row = 0;
        contentView.setLayoutParams(contentViewLayoutParams);
        nativeView.addView(contentView);
        nativeView.contentView = contentView;
        // TABSTRIP
        const bottomNavigationBar = new BottomNavigationBar(context, this);
        const bottomNavigationBarLayoutParams = new org.nativescript.widgets.CommonLayoutParams();
        bottomNavigationBarLayoutParams.row = 1;
        bottomNavigationBar.setLayoutParams(bottomNavigationBarLayoutParams);
        nativeView.addView(bottomNavigationBar);
        nativeView.bottomNavigationBar = bottomNavigationBar;
        setElevation(bottomNavigationBar);
        const primaryColor = ad.resources.getPaletteColor(PRIMARY_COLOR, context);
        if (primaryColor) {
            bottomNavigationBar.setBackgroundColor(primaryColor);
        }
        return nativeView;
    }
    initNativeView() {
        super.initNativeView();
        if (this._contentViewId < 0) {
            this._contentViewId = android.view.View.generateViewId();
        }
        const nativeView = this.nativeViewProtected;
        nativeView.addOnAttachStateChangeListener(AttachStateChangeListener);
        nativeView[ownerSymbol] = this;
        this._contentView = nativeView.contentView;
        this._contentView.setId(this._contentViewId);
        this._bottomNavigationBar = nativeView.bottomNavigationBar;
        this._bottomNavigationBar.owner = this;
        if (this.tabStrip) {
            this.tabStrip.setNativeView(this._bottomNavigationBar);
        }
    }
    _loadUnloadTabItems(newIndex) {
        const items = this.items;
        const lastIndex = this.items.length - 1;
        const offsideItems = 0;
        let toUnload = [];
        let toLoad = [];
        iterateIndexRange(newIndex, offsideItems, lastIndex, (i) => toLoad.push(i));
        items.forEach((item, i) => {
            const indexOfI = toLoad.indexOf(i);
            if (indexOfI < 0) {
                toUnload.push(i);
            }
        });
        toUnload.forEach((index) => {
            const item = items[index];
            if (items[index]) {
                item.unloadView(item.content);
            }
        });
        const newItem = items[newIndex];
        const selectedView = newItem && newItem.content;
        if (selectedView instanceof Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        toLoad.forEach((index) => {
            const item = items[index];
            if (this.isLoaded && items[index]) {
                item.loadView(item.content);
            }
        });
    }
    onLoaded() {
        super.onLoaded();
        if (this._originalBackground) {
            this.backgroundColor = null;
            this.backgroundColor = this._originalBackground;
            this._originalBackground = null;
        }
        if (this.tabStrip) {
            this.setTabStripItems(this.tabStrip.items);
        }
        else {
            // manually set the visibility, so that the grid layout remeasures
            this._bottomNavigationBar.setVisibility(android.view.View.GONE);
        }
        this.changeTab(this.selectedIndex);
    }
    _onAttachedToWindow() {
        super._onAttachedToWindow();
        // _onAttachedToWindow called from OS again after it was detach
        // TODO: Consider testing and removing it when update to androidx.fragment:1.2.0
        if (this._manager && this._manager.isDestroyed()) {
            return;
        }
        this._attachedToWindow = true;
        this.changeTab(this.selectedIndex);
    }
    _onDetachedFromWindow() {
        super._onDetachedFromWindow();
        this._attachedToWindow = false;
    }
    onUnloaded() {
        super.onUnloaded();
        if (this.tabStrip) {
            this.setTabStripItems(null);
        }
        const fragmentToDetach = this._currentFragment;
        if (fragmentToDetach) {
            this.destroyItem(fragmentToDetach.index, fragmentToDetach);
            this.commitCurrentTransaction();
        }
    }
    disposeNativeView() {
        this._bottomNavigationBar.setItems(null);
        this._bottomNavigationBar = null;
        this.nativeViewProtected.removeOnAttachStateChangeListener(AttachStateChangeListener);
        this.nativeViewProtected[ownerSymbol] = null;
        super.disposeNativeView();
    }
    _onRootViewReset() {
        super._onRootViewReset();
        // call this AFTER the super call to ensure descendants apply their rootview-reset logic first
        // i.e. in a scenario with tab frames let the frames cleanup their fragments first, and then
        // cleanup the tab fragments to avoid
        // android.content.res.Resources$NotFoundException: Unable to find resource ID #0xfffffff6
        this.disposeTabFragments();
    }
    disposeTabFragments() {
        const fragmentManager = this._getFragmentManager();
        const transaction = fragmentManager.beginTransaction();
        const fragments = fragmentManager.getFragments().toArray();
        for (let i = 0; i < fragments.length; i++) {
            transaction.remove(fragments[i]);
        }
        transaction.commitNowAllowingStateLoss();
    }
    get currentTransaction() {
        if (!this._currentTransaction) {
            const fragmentManager = this._getFragmentManager();
            this._currentTransaction = fragmentManager.beginTransaction();
        }
        return this._currentTransaction;
    }
    commitCurrentTransaction() {
        if (this._currentTransaction) {
            this._currentTransaction.commitNowAllowingStateLoss();
            this._currentTransaction = null;
        }
    }
    // TODO: Should we extract adapter-like class?
    // TODO: Rename this?
    changeTab(index) {
        // index is -1 when there are no items
        // bot nav is not attached if you change the tab too early
        if (index === -1 || !this._attachedToWindow) {
            return;
        }
        const fragmentToDetach = this._currentFragment;
        if (fragmentToDetach) {
            this.destroyItem(fragmentToDetach.index, fragmentToDetach);
        }
        const fragment = this.instantiateItem(this._contentView, index);
        this.setPrimaryItem(index, fragment);
        this.commitCurrentTransaction();
    }
    instantiateItem(container, position) {
        const name = makeFragmentName(container.getId(), position);
        const fragmentManager = this._getFragmentManager();
        let fragment = fragmentManager.findFragmentByTag(name);
        if (fragment != null) {
            this.currentTransaction.attach(fragment);
        }
        else {
            fragment = TabFragment.newInstance(this._domId, position);
            this.currentTransaction.add(container.getId(), fragment, name);
        }
        if (fragment !== this._currentFragment) {
            fragment.setMenuVisibility(false);
            fragment.setUserVisibleHint(false);
        }
        return fragment;
    }
    setPrimaryItem(position, fragment) {
        if (fragment !== this._currentFragment) {
            if (this._currentFragment != null) {
                this._currentFragment.setMenuVisibility(false);
                this._currentFragment.setUserVisibleHint(false);
            }
            if (fragment != null) {
                fragment.setMenuVisibility(true);
                fragment.setUserVisibleHint(true);
            }
            this._currentFragment = fragment;
            this.selectedIndex = position;
            const tabItems = this.items;
            const tabItem = tabItems ? tabItems[position] : null;
            if (tabItem) {
                tabItem.canBeLoaded = true;
                this._loadUnloadTabItems(position);
            }
        }
    }
    destroyItem(position, fragment) {
        if (fragment) {
            this.currentTransaction.detach(fragment);
            if (this._currentFragment === fragment) {
                this._currentFragment = null;
            }
        }
        if (this.items && this.items[position]) {
            this.items[position].canBeLoaded = false;
        }
    }
    setTabStripItems(items) {
        if (!this.tabStrip || !items) {
            this._bottomNavigationBar.setItems(null);
            return;
        }
        const tabItems = new Array();
        items.forEach((tabStripItem, i, arr) => {
            tabStripItem._index = i;
            if (items[i]) {
                const tabItemSpec = this.createTabItemSpec(items[i]);
                tabItems.push(tabItemSpec);
            }
        });
        this._bottomNavigationBar.setItems(tabItems);
        items.forEach((item, i, arr) => {
            const textView = this._bottomNavigationBar.getTextViewForItemAt(i);
            item.setNativeView(textView);
            this._setItemColor(item);
        });
    }
    getItemLabelTextTransform(tabStripItem) {
        const nestedLabel = tabStripItem.label;
        let textTransform = null;
        if (nestedLabel && nestedLabel.style.textTransform !== 'initial') {
            textTransform = nestedLabel.style.textTransform;
        }
        else if (tabStripItem.style.textTransform !== 'initial') {
            textTransform = tabStripItem.style.textTransform;
        }
        return textTransform || this._textTransform;
    }
    createTabItemSpec(tabStripItem) {
        const tabItemSpec = new org.nativescript.widgets.TabItemSpec();
        if (tabStripItem.isLoaded) {
            const titleLabel = tabStripItem.label;
            let title = titleLabel.text;
            // TEXT-TRANSFORM
            const textTransform = this.getItemLabelTextTransform(tabStripItem);
            title = getTransformedText(title, textTransform);
            tabItemSpec.title = title;
            // BACKGROUND-COLOR
            const backgroundColor = tabStripItem.style.backgroundColor;
            tabItemSpec.backgroundColor = backgroundColor ? backgroundColor.android : this.getTabBarBackgroundArgbColor();
            // COLOR
            let itemColor = this.selectedIndex === tabStripItem._index ? this._selectedItemColor : this._unSelectedItemColor;
            const color = itemColor || titleLabel.style.color;
            tabItemSpec.color = color && color.android;
            // FONT
            const fontInternal = titleLabel.style.fontInternal;
            if (fontInternal) {
                tabItemSpec.fontSize = fontInternal.fontSize;
                tabItemSpec.typeFace = fontInternal.getAndroidTypeface();
            }
            // ICON
            const iconSource = tabStripItem.image && tabStripItem.image.src;
            if (iconSource) {
                const iconInfo = this.getIconInfo(tabStripItem, itemColor);
                if (iconInfo) {
                    // TODO: Make this native call that accepts string so that we don't load Bitmap in JS.
                    // tslint:disable-next-line:deprecation
                    tabItemSpec.iconDrawable = iconInfo.drawable;
                    tabItemSpec.imageHeight = iconInfo.height;
                }
                else {
                    // TODO:
                    // traceMissingIcon(iconSource);
                }
            }
        }
        return tabItemSpec;
    }
    getOriginalIcon(tabStripItem, color) {
        const iconSource = tabStripItem.image && tabStripItem.image.src;
        if (!iconSource) {
            return null;
        }
        let is;
        if (isFontIconURI(iconSource)) {
            const fontIconCode = iconSource.split('//')[1];
            const target = tabStripItem.image ? tabStripItem.image : tabStripItem;
            const font = target.style.fontInternal;
            if (!color) {
                color = target.style.color;
            }
            is = ImageSource.fromFontIconCodeSync(fontIconCode, font, color);
        }
        else {
            is = ImageSource.fromFileOrResourceSync(iconSource);
        }
        return is && is.android;
    }
    getDrawableInfo(image) {
        if (image) {
            if (this.tabStrip && this.tabStrip.isIconSizeFixed) {
                image = this.getFixedSizeIcon(image);
            }
            let imageDrawable = new android.graphics.drawable.BitmapDrawable(application.android.context.getResources(), image);
            return {
                drawable: imageDrawable,
                height: image.getHeight(),
            };
        }
        return new IconInfo();
    }
    getIconInfo(tabStripItem, color) {
        let originalIcon = this.getOriginalIcon(tabStripItem, color);
        return this.getDrawableInfo(originalIcon);
    }
    getFixedSizeIcon(image) {
        const inWidth = image.getWidth();
        const inHeight = image.getHeight();
        const iconSpecSize = getIconSpecSize({
            width: inWidth,
            height: inHeight,
        });
        const widthPixels = iconSpecSize.width * layout.getDisplayDensity();
        const heightPixels = iconSpecSize.height * layout.getDisplayDensity();
        const scaledImage = android.graphics.Bitmap.createScaledBitmap(image, widthPixels, heightPixels, true);
        return scaledImage;
    }
    updateAndroidItemAt(index, spec) {
        this._bottomNavigationBar.updateItemAt(index, spec);
    }
    getTabBarBackgroundColor() {
        return this._bottomNavigationBar.getBackground();
    }
    setTabBarBackgroundColor(value) {
        if (value instanceof Color) {
            this._bottomNavigationBar.setBackgroundColor(value.android);
        }
        else {
            this._bottomNavigationBar.setBackground(tryCloneDrawable(value, this.nativeViewProtected.getResources()));
        }
        this.updateTabStripItems();
    }
    updateTabStripItems() {
        this.tabStrip.items.forEach((tabStripItem) => {
            if (tabStripItem.nativeView) {
                const tabItemSpec = this.createTabItemSpec(tabStripItem);
                this.updateAndroidItemAt(tabStripItem._index, tabItemSpec);
            }
        });
    }
    _setItemsColors(items) {
        items.forEach((item) => {
            if (item.nativeView) {
                this._setItemColor(item);
            }
        });
    }
    getTabBarSelectedItemColor() {
        return this._selectedItemColor;
    }
    setTabBarSelectedItemColor(value) {
        this._selectedItemColor = value;
        this._setItemsColors(this.tabStrip.items);
    }
    getTabBarUnSelectedItemColor() {
        return this._unSelectedItemColor;
    }
    setTabBarUnSelectedItemColor(value) {
        this._unSelectedItemColor = value;
        this._setItemsColors(this.tabStrip.items);
    }
    updateItem(tabStripItem) {
        // TODO: Should figure out a way to do it directly with the the nativeView
        const tabStripItemIndex = this.tabStrip.items.indexOf(tabStripItem);
        const tabItemSpec = this.createTabItemSpec(tabStripItem);
        this.updateAndroidItemAt(tabStripItemIndex, tabItemSpec);
    }
    setTabBarItemTitle(tabStripItem, value) {
        this.updateItem(tabStripItem);
    }
    setTabBarItemBackgroundColor(tabStripItem, value) {
        this.updateItem(tabStripItem);
    }
    _setItemColor(tabStripItem) {
        const itemColor = tabStripItem._index === this.selectedIndex ? this._selectedItemColor : this._unSelectedItemColor;
        if (!itemColor) {
            return;
        }
        // set label color
        tabStripItem.nativeViewProtected.setTextColor(itemColor.android);
        // set icon color
        this.setIconColor(tabStripItem, itemColor);
    }
    setIconColor(tabStripItem, color) {
        const tabBarItem = this._bottomNavigationBar.getViewForItemAt(tabStripItem._index);
        const drawableInfo = this.getIconInfo(tabStripItem, color);
        const imgView = tabBarItem.getChildAt(0);
        imgView.setImageDrawable(drawableInfo.drawable);
        if (color) {
            imgView.setColorFilter(color.android);
        }
    }
    setTabBarItemColor(tabStripItem, value) {
        const itemColor = tabStripItem._index === this.selectedIndex ? this._selectedItemColor : this._unSelectedItemColor;
        if (itemColor) {
            // the itemColor is set through the selectedItemColor and unSelectedItemColor properties
            // so it does not respect the css color
            return;
        }
        const androidColor = value instanceof Color ? value.android : value;
        tabStripItem.nativeViewProtected.setTextColor(androidColor);
    }
    setTabBarIconColor(tabStripItem, value) {
        const itemColor = tabStripItem._index === this.selectedIndex ? this._selectedItemColor : this._unSelectedItemColor;
        if (itemColor) {
            // the itemColor is set through the selectedItemColor and unSelectedItemColor properties
            // so it does not respect the css color
            return;
        }
        this.setIconColor(tabStripItem);
    }
    setTabBarIconSource(tabStripItem, value) {
        this.updateItem(tabStripItem);
    }
    setTabBarItemFontInternal(tabStripItem, value) {
        if (value.fontSize) {
            tabStripItem.nativeViewProtected.setTextSize(value.fontSize);
        }
        tabStripItem.nativeViewProtected.setTypeface(value.getAndroidTypeface());
    }
    setTabBarItemTextTransform(tabStripItem, value) {
        const titleLabel = tabStripItem.label;
        const title = getTransformedText(titleLabel.text, value);
        tabStripItem.nativeViewProtected.setText(title);
    }
    getTabBarTextTransform() {
        return this._textTransform;
    }
    setTabBarTextTransform(value) {
        let items = this.tabStrip && this.tabStrip.items;
        if (items) {
            items.forEach((tabStripItem) => {
                if (tabStripItem.label && tabStripItem.nativeViewProtected) {
                    const nestedLabel = tabStripItem.label;
                    const title = getTransformedText(nestedLabel.text, value);
                    tabStripItem.nativeViewProtected.setText(title);
                }
            });
        }
        this._textTransform = value;
    }
    [selectedIndexProperty.setNative](value) {
        // const smoothScroll = false;
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView this._viewPager.setCurrentItem(" + value + ", " + smoothScroll + ");", traceCategory);
        // }
        if (this.tabStrip) {
            this._bottomNavigationBar.setSelectedPosition(value);
        }
        else {
            this.changeTab(value);
        }
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        if (value) {
            value.forEach((item, i) => {
                item.index = i;
            });
        }
        selectedIndexProperty.coerce(this);
    }
    [tabStripProperty.getDefault]() {
        return null;
    }
    [tabStripProperty.setNative](value) {
        const items = this.tabStrip ? this.tabStrip.items : null;
        this.setTabStripItems(items);
    }
};
BottomNavigation = __decorate([
    CSSType('BottomNavigation'),
    __metadata("design:paramtypes", [])
], BottomNavigation);
export { BottomNavigation };
function tryCloneDrawable(value, resources) {
    if (value) {
        const constantState = value.getConstantState();
        if (constantState) {
            return constantState.newDrawable(resources);
        }
    }
    return value;
}
//# sourceMappingURL=index.android.js.map