import { TabStrip } from '../tab-navigation-base/tab-strip';
import { TabStripItem } from '../tab-navigation-base/tab-strip-item';
// Requires
import * as application from '../../application';
import { ImageSource } from '../../image-source';
import { ad, isFontIconURI, layout } from '../../utils/utils';
import { Color } from '../../color';
import { Frame } from '../frame';
import { getIconSpecSize, itemsProperty, selectedIndexProperty, tabStripProperty } from '../tab-navigation-base/tab-navigation-base';
import { getTransformedText } from '../text-base';
import { offscreenTabLimitProperty, swipeEnabledProperty, animationEnabledProperty, TabsBase } from './tabs-common';
export * from './tabs-common';
const ACCENT_COLOR = 'colorAccent';
const PRIMARY_COLOR = 'colorPrimary';
const DEFAULT_ELEVATION = 4;
const TABID = '_tabId';
const INDEX = '_index';
let PagerAdapter;
let TabsBar;
let appResources;
function makeFragmentName(viewId, id) {
    return 'android:viewpager:' + viewId + ':' + id;
}
function getTabById(id) {
    const ref = tabs.find((ref) => {
        const tab = ref.get();
        return tab && tab._domId === id;
    });
    return ref && ref.get();
}
function initializeNativeClasses() {
    if (PagerAdapter) {
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
            throw new Error("Cannot find TabView");
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
    const POSITION_UNCHANGED = -1;
    const POSITION_NONE = -2;
    var FragmentPagerAdapter = /** @class */ (function (_super) {
    __extends(FragmentPagerAdapter, _super);
    function FragmentPagerAdapter(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    FragmentPagerAdapter.prototype.getCount = function () {
        var items = this.items;
        return items ? items.length : 0;
    };
    FragmentPagerAdapter.prototype.getPageTitle = function (index) {
        var items = this.items;
        if (index < 0 || index >= items.length) {
            return '';
        }
        return ''; // items[index].title;
    };
    FragmentPagerAdapter.prototype.startUpdate = function (container) {
        if (container.getId() === android.view.View.NO_ID) {
            throw new Error("ViewPager with adapter " + this + " requires a view containerId");
        }
    };
    FragmentPagerAdapter.prototype.instantiateItem = function (container, position) {
        var fragmentManager = this.owner._getFragmentManager();
        if (!this.mCurTransaction) {
            this.mCurTransaction = fragmentManager.beginTransaction();
        }
        var itemId = this.getItemId(position);
        var name = makeFragmentName(container.getId(), itemId);
        var fragment = fragmentManager.findFragmentByTag(name);
        if (fragment != null) {
            this.mCurTransaction.attach(fragment);
        }
        else {
            fragment = TabFragmentImplementation.newInstance(this.owner._domId, position);
            this.mCurTransaction.add(container.getId(), fragment, name);
        }
        if (fragment !== this.mCurrentPrimaryItem) {
            fragment.setMenuVisibility(false);
            fragment.setUserVisibleHint(false);
        }
        var tabItems = this.owner.items;
        var tabItem = tabItems ? tabItems[position] : null;
        if (tabItem) {
            tabItem.canBeLoaded = true;
        }
        return fragment;
    };
    FragmentPagerAdapter.prototype.getItemPosition = function (object) {
        return this.items ? POSITION_UNCHANGED : POSITION_NONE;
    };
    FragmentPagerAdapter.prototype.destroyItem = function (container, position, object) {
        if (!this.mCurTransaction) {
            var fragmentManager = this.owner._getFragmentManager();
            this.mCurTransaction = fragmentManager.beginTransaction();
        }
        var fragment = object;
        this.mCurTransaction.detach(fragment);
        if (this.mCurrentPrimaryItem === fragment) {
            this.mCurrentPrimaryItem = null;
        }
        var tabItems = this.owner.items;
        var tabItem = tabItems ? tabItems[position] : null;
        if (tabItem) {
            tabItem.canBeLoaded = false;
        }
    };
    FragmentPagerAdapter.prototype.setPrimaryItem = function (container, position, object) {
        var fragment = object;
        if (fragment !== this.mCurrentPrimaryItem) {
            if (this.mCurrentPrimaryItem != null) {
                this.mCurrentPrimaryItem.setMenuVisibility(false);
                this.mCurrentPrimaryItem.setUserVisibleHint(false);
            }
            if (fragment != null) {
                fragment.setMenuVisibility(true);
                fragment.setUserVisibleHint(true);
            }
            this.mCurrentPrimaryItem = fragment;
            this.owner.selectedIndex = position;
            var tab = this.owner;
            var tabItems = tab.items;
            var newTabItem = tabItems ? tabItems[position] : null;
            if (newTabItem) {
                tab._loadUnloadTabItems(tab.selectedIndex);
            }
        }
    };
    FragmentPagerAdapter.prototype.finishUpdate = function (container) {
        this._commitCurrentTransaction();
    };
    FragmentPagerAdapter.prototype.isViewFromObject = function (view, object) {
        return object.getView() === view;
    };
    FragmentPagerAdapter.prototype.saveState = function () {
        // Commit the current transaction on save to prevent "No view found for id 0xa" exception on restore.
        // Related to: https://github.com/NativeScript/NativeScript/issues/6466
        this._commitCurrentTransaction();
        return null;
    };
    FragmentPagerAdapter.prototype.restoreState = function (state, loader) {
        //
    };
    FragmentPagerAdapter.prototype.getItemId = function (position) {
        return position;
    };
    FragmentPagerAdapter.prototype._commitCurrentTransaction = function () {
        if (this.mCurTransaction != null) {
            this.mCurTransaction.commitNowAllowingStateLoss();
            this.mCurTransaction = null;
        }
    };
    return FragmentPagerAdapter;
}(androidx.viewpager.widget.PagerAdapter));
    var TabsBarImplementation = /** @class */ (function (_super) {
    __extends(TabsBarImplementation, _super);
    function TabsBarImplementation(context, owner) {
        var _this = _super.call(this, context) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    TabsBarImplementation.prototype.onSelectedPositionChange = function (position, prevPosition) {
        var owner = this.owner;
        if (!owner) {
            return;
        }
        var tabStripItems = owner.tabStrip && owner.tabStrip.items;
        if (position >= 0 && tabStripItems && tabStripItems[position]) {
            tabStripItems[position]._emit(TabStripItem.selectEvent);
            owner._setItemColor(tabStripItems[position]);
        }
        if (prevPosition >= 0 && tabStripItems && tabStripItems[prevPosition]) {
            tabStripItems[prevPosition]._emit(TabStripItem.unselectEvent);
            owner._setItemColor(tabStripItems[prevPosition]);
        }
    };
    TabsBarImplementation.prototype.onTap = function (position) {
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
    return TabsBarImplementation;
}(org.nativescript.widgets.TabsBar));
    PagerAdapter = FragmentPagerAdapter;
    TabsBar = TabsBarImplementation;
    appResources = application.android.context.getResources();
}
let defaultAccentColor = undefined;
function getDefaultAccentColor(context) {
    if (defaultAccentColor === undefined) {
        //Fallback color: https://developer.android.com/samples/SlidingTabsColors/src/com.example.android.common/view/SlidingTabStrip.html
        defaultAccentColor = ad.resources.getPaletteColor(ACCENT_COLOR, context) || 0xff33b5e5;
    }
    return defaultAccentColor;
}
function setElevation(grid, tabsBar, tabsPosition) {
    const compat = androidx.core.view.ViewCompat;
    if (compat.setElevation) {
        const val = DEFAULT_ELEVATION * layout.getDisplayDensity();
        if (tabsPosition === 'top') {
            compat.setElevation(grid, val);
        }
        compat.setElevation(tabsBar, val);
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
export class Tabs extends TabsBase {
    constructor() {
        super();
        this._androidViewId = -1;
        this._textTransform = 'uppercase';
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
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView._createUI(" + this + ");", traceCategory);
        // }
        const context = this._context;
        const nativeView = new org.nativescript.widgets.GridLayout(context);
        const viewPager = new org.nativescript.widgets.TabViewPager(context);
        const tabsBar = new TabsBar(context, this);
        const lp = new org.nativescript.widgets.CommonLayoutParams();
        const primaryColor = ad.resources.getPaletteColor(PRIMARY_COLOR, context);
        let accentColor = getDefaultAccentColor(context);
        lp.row = 1;
        if (this.tabsPosition === 'top') {
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
            viewPager.setLayoutParams(lp);
        }
        else {
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
            tabsBar.setLayoutParams(lp);
        }
        nativeView.addView(viewPager);
        nativeView.viewPager = viewPager;
        const adapter = new PagerAdapter(this);
        viewPager.setAdapter(adapter);
        viewPager.adapter = adapter;
        nativeView.addView(tabsBar);
        nativeView.tabsBar = tabsBar;
        setElevation(nativeView, tabsBar, this.tabsPosition);
        if (accentColor) {
            tabsBar.setSelectedIndicatorColors([accentColor]);
        }
        if (primaryColor) {
            tabsBar.setBackgroundColor(primaryColor);
        }
        return nativeView;
    }
    initNativeView() {
        super.initNativeView();
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        const nativeView = this.nativeViewProtected;
        this._tabsBar = nativeView.tabsBar;
        const viewPager = nativeView.viewPager;
        viewPager.setId(this._androidViewId);
        this._viewPager = viewPager;
        this._pagerAdapter = viewPager.adapter;
        this._pagerAdapter.owner = this;
    }
    _loadUnloadTabItems(newIndex) {
        const items = this.items;
        if (!items) {
            return;
        }
        const lastIndex = items.length - 1;
        const offsideItems = this.offscreenTabLimit;
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
        this.setItems(this.items);
        if (this.tabStrip) {
            this.setTabStripItems(this.tabStrip.items);
        }
        // this.setAdapterItems(this.items);
    }
    onUnloaded() {
        super.onUnloaded();
        this.setItems(null);
        this.setTabStripItems(null);
        // this.setAdapterItems(null);
    }
    disposeNativeView() {
        this._tabsBar.setItems(null, null);
        this._pagerAdapter.owner = null;
        this._pagerAdapter = null;
        this._tabsBar = null;
        this._viewPager = null;
        super.disposeNativeView();
    }
    _onRootViewReset() {
        super._onRootViewReset();
        // call this AFTER the super call to ensure descendants apply their rootview-reset logic first
        // i.e. in a scenario with tab frames let the frames cleanup their fragments first, and then
        // cleanup the tab fragments to avoid
        // android.content.res.Resources$NotFoundException: Unable to find resource ID #0xfffffff6
        this.disposeCurrentFragments();
    }
    disposeCurrentFragments() {
        const fragmentManager = this._getFragmentManager();
        const transaction = fragmentManager.beginTransaction();
        let fragments = fragmentManager.getFragments().toArray();
        for (let i = 0; i < fragments.length; i++) {
            transaction.remove(fragments[i]);
        }
        transaction.commitNowAllowingStateLoss();
    }
    shouldUpdateAdapter(items) {
        if (!this._pagerAdapter) {
            return false;
        }
        const currentPagerAdapterItems = this._pagerAdapter.items;
        // if both values are null, should not update
        if (!items && !currentPagerAdapterItems) {
            return false;
        }
        // if one value is null, should update
        if (!items || !currentPagerAdapterItems) {
            return true;
        }
        // if both are Arrays but length doesn't match, should update
        if (items.length !== currentPagerAdapterItems.length) {
            return true;
        }
        const matchingItems = currentPagerAdapterItems.filter((currentItem) => {
            return !!items.filter((item) => {
                return item._domId === currentItem._domId;
            })[0];
        });
        // if both are Arrays and length matches, but not all items are the same, should update
        if (matchingItems.length !== items.length) {
            return true;
        }
        // if both are Arrays and length matches and all items are the same, should not update
        return false;
    }
    setItems(items) {
        if (this.shouldUpdateAdapter(items)) {
            this._pagerAdapter.items = items;
            if (items && items.length) {
                items.forEach((item, i) => {
                    item.index = i;
                });
            }
            this._pagerAdapter.notifyDataSetChanged();
        }
    }
    setTabStripItems(items) {
        const length = items ? items.length : 0;
        if (length === 0) {
            this._tabsBar.setItems(null, null);
            return;
        }
        const tabItems = new Array();
        items.forEach((tabStripItem, i, arr) => {
            tabStripItem._index = i;
            const tabItemSpec = this.createTabItemSpec(tabStripItem);
            tabStripItem.tabItemSpec = tabItemSpec;
            tabItems.push(tabItemSpec);
        });
        const tabsBar = this._tabsBar;
        tabsBar.setItems(tabItems, this._viewPager);
        this.tabStrip.setNativeView(tabsBar);
        items.forEach((item, i, arr) => {
            const tv = tabsBar.getTextViewForItemAt(i);
            item.setNativeView(tv);
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
            const nestedLabel = tabStripItem.label;
            let title = nestedLabel.text;
            // TEXT-TRANSFORM
            const textTransform = this.getItemLabelTextTransform(tabStripItem);
            title = getTransformedText(title, textTransform);
            tabItemSpec.title = title;
            // BACKGROUND-COLOR
            const backgroundColor = tabStripItem.style.backgroundColor;
            tabItemSpec.backgroundColor = backgroundColor ? backgroundColor.android : this.getTabBarBackgroundArgbColor();
            // COLOR
            let itemColor = this.selectedIndex === tabStripItem._index ? this._selectedItemColor : this._unSelectedItemColor;
            const color = itemColor || nestedLabel.style.color;
            tabItemSpec.color = color && color.android;
            // FONT
            const fontInternal = nestedLabel.style.fontInternal;
            if (fontInternal) {
                tabItemSpec.fontSize = fontInternal.fontSize;
                tabItemSpec.typeFace = fontInternal.getAndroidTypeface();
            }
            // ICON
            const iconSource = tabStripItem.image && tabStripItem.image.src;
            if (iconSource) {
                const icon = this.getIcon(tabStripItem, itemColor);
                if (icon) {
                    // TODO: Make this native call that accepts string so that we don't load Bitmap in JS.
                    // tslint:disable-next-line:deprecation
                    tabItemSpec.iconDrawable = icon;
                }
                else {
                    // TODO:
                    // traceMissingIcon(iconSource);
                }
            }
        }
        return tabItemSpec;
    }
    getIcon(tabStripItem, color) {
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
        let imageDrawable;
        if (is && is.android) {
            let image = is.android;
            if (this.tabStrip && this.tabStrip.isIconSizeFixed) {
                image = this.getFixedSizeIcon(image);
            }
            imageDrawable = new android.graphics.drawable.BitmapDrawable(appResources, image);
        }
        else {
            // TODO
            // traceMissingIcon(iconSource);
        }
        return imageDrawable;
    }
    getFixedSizeIcon(image) {
        const inWidth = image.getWidth();
        const inHeight = image.getHeight();
        const iconSpecSize = getIconSpecSize({ width: inWidth, height: inHeight });
        const widthPixels = iconSpecSize.width * layout.getDisplayDensity();
        const heightPixels = iconSpecSize.height * layout.getDisplayDensity();
        const scaledImage = android.graphics.Bitmap.createScaledBitmap(image, widthPixels, heightPixels, true);
        return scaledImage;
    }
    // private setAdapterItems(items: Array<TabStripItem>) {
    //     if (this.shouldUpdateAdapter(items)) {
    //         (<any>this._pagerAdapter).items = items;
    //         const length = items ? items.length : 0;
    //         if (length === 0) {
    //             this._tabLayout.setItems(null, null);
    //             this._pagerAdapter.notifyDataSetChanged();
    //             return;
    //         }
    //         const tabItems = new Array<org.nativescript.widgets.TabItemSpec>();
    //         items.forEach((item: TabStripItem, i, arr) => {
    //             const tabItemSpec = createTabItemSpec(item);
    //             (<any>item).index = i;
    //             (<any>item).tabItemSpec = tabItemSpec;
    //             tabItems.push(tabItemSpec);
    //         });
    //         const tabLayout = this._tabLayout;
    //         tabLayout.setItems(tabItems, this._viewPager);
    //         items.forEach((item, i, arr) => {
    //             const tv = tabLayout.getTextViewForItemAt(i);
    //             item.setNativeView(tv);
    //         });
    //         this._pagerAdapter.notifyDataSetChanged();
    //     }
    // }
    updateAndroidItemAt(index, spec) {
        this._tabsBar.updateItemAt(index, spec);
    }
    getTabBarBackgroundColor() {
        return this._tabsBar.getBackground();
    }
    setTabBarBackgroundColor(value) {
        if (value instanceof Color) {
            this._tabsBar.setBackgroundColor(value.android);
        }
        else {
            this._tabsBar.setBackground(tryCloneDrawable(value, this.nativeViewProtected.getResources()));
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
    getTabBarHighlightColor() {
        return getDefaultAccentColor(this._context);
    }
    setTabBarHighlightColor(value) {
        const color = value instanceof Color ? value.android : value;
        this._tabsBar.setSelectedIndicatorColors([color]);
    }
    setItemsColors(items) {
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
        this.setItemsColors(this.tabStrip.items);
    }
    getTabBarUnSelectedItemColor() {
        return this._unSelectedItemColor;
    }
    setTabBarUnSelectedItemColor(value) {
        this._unSelectedItemColor = value;
        this.setItemsColors(this.tabStrip.items);
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
        const tabBarItem = this._tabsBar.getViewForItemAt(tabStripItem._index);
        const drawable = this.getIcon(tabStripItem, color);
        const imgView = tabBarItem.getChildAt(0);
        imgView.setImageDrawable(drawable);
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
    getTabBarItemTextTransform(tabStripItem) {
        return this.getItemLabelTextTransform(tabStripItem);
    }
    setTabBarItemTextTransform(tabStripItem, value) {
        const nestedLabel = tabStripItem.label;
        const title = getTransformedText(nestedLabel.text, value);
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
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView this._viewPager.setCurrentItem(" + value + ", " + smoothScroll + ");", traceCategory);
        // }
        this._viewPager.setCurrentItem(value, this.animationEnabled);
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        this.setItems(value);
        selectedIndexProperty.coerce(this);
    }
    [tabStripProperty.getDefault]() {
        return null;
    }
    [tabStripProperty.setNative](value) {
        this.setTabStripItems(value.items);
    }
    [swipeEnabledProperty.getDefault]() {
        // TODO: create native method and get native?
        return true;
    }
    [swipeEnabledProperty.setNative](value) {
        this._viewPager.setSwipePageEnabled(value);
    }
    [offscreenTabLimitProperty.getDefault]() {
        return this._viewPager.getOffscreenPageLimit();
    }
    [offscreenTabLimitProperty.setNative](value) {
        this._viewPager.setOffscreenPageLimit(value);
    }
    [animationEnabledProperty.setNative](value) {
        this._viewPager.setAnimationEnabled(value);
    }
}
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