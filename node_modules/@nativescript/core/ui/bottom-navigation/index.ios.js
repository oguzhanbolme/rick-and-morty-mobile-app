import { TabStrip } from '../tab-navigation-base/tab-strip';
import { TabStripItem } from '../tab-navigation-base/tab-strip-item';
import { getTransformedText } from '../text-base';
// Requires
import { Color } from '../../color';
import { ImageSource } from '../../image-source';
import { Device } from '../../platform';
import { iOSNativeHelper, isFontIconURI, layout } from '../../utils';
import { CSSType, IOSHelper, View } from '../core/view';
import { Frame } from '../frame';
import { Font } from '../styling/font';
import { getIconSpecSize, itemsProperty, selectedIndexProperty, TabNavigationBase, tabStripProperty } from '../tab-navigation-base/tab-navigation-base';
// TODO:
// import { profile } from "../../profiling";
const maxTabsCount = 5;
const majorVersion = iOSNativeHelper.MajorVersion;
const isPhone = Device.deviceType === 'Phone';
var UITabBarControllerImpl = /** @class */ (function (_super) {
    __extends(UITabBarControllerImpl, _super);
    function UITabBarControllerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITabBarControllerImpl.initWithOwner = function (owner) {
        var handler = UITabBarControllerImpl.new();
        handler._owner = owner;
        return handler;
    };
    // TODO
    // @profile
    UITabBarControllerImpl.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        // Unify translucent and opaque bars layout
        this.extendedLayoutIncludesOpaqueBars = true;
        IOSHelper.updateAutoAdjustScrollInsets(this, owner);
        if (!owner.parent) {
            owner.callLoaded();
        }
    };
    // TODO
    // @profile
    UITabBarControllerImpl.prototype.viewDidDisappear = function (animated) {
        _super.prototype.viewDidDisappear.call(this, animated);
        var owner = this._owner.get();
        if (owner && !owner.parent && owner.isLoaded && !this.presentedViewController) {
            owner.callUnloaded();
        }
    };
    UITabBarControllerImpl.prototype.viewWillTransitionToSizeWithTransitionCoordinator = function (size, coordinator) {
        var _this = this;
        _super.prototype.viewWillTransitionToSizeWithTransitionCoordinator.call(this, size, coordinator);
        coordinator.animateAlongsideTransitionCompletion(function () {
            var owner = _this._owner.get();
            if (owner && owner.tabStrip && owner.tabStrip.items) {
                var tabStrip_1 = owner.tabStrip;
                tabStrip_1.items.forEach(function (tabStripItem) {
                    updateBackgroundPositions(tabStrip_1, tabStripItem);
                    var index = tabStripItem._index;
                    var tabBarItemController = _this.viewControllers[index];
                    updateTitleAndIconPositions(tabStripItem, tabBarItemController.tabBarItem, tabBarItemController);
                });
            }
        }, null);
    };
    // Mind implementation for other controllers
    UITabBarControllerImpl.prototype.traitCollectionDidChange = function (previousTraitCollection) {
        _super.prototype.traitCollectionDidChange.call(this, previousTraitCollection);
        if (majorVersion >= 13) {
            var owner = this._owner.get();
            if (owner && this.traitCollection.hasDifferentColorAppearanceComparedToTraitCollection && this.traitCollection.hasDifferentColorAppearanceComparedToTraitCollection(previousTraitCollection)) {
                owner.notify({
                    eventName: IOSHelper.traitCollectionColorAppearanceChangedEvent,
                    object: owner,
                });
            }
        }
    };
    return UITabBarControllerImpl;
}(UITabBarController));
var UITabBarControllerDelegateImpl = /** @class */ (function (_super) {
    __extends(UITabBarControllerDelegateImpl, _super);
    function UITabBarControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITabBarControllerDelegateImpl.initWithOwner = function (owner) {
        var delegate = UITabBarControllerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UITabBarControllerDelegateImpl.prototype.tabBarControllerShouldSelectViewController = function (tabBarController, viewController) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.delegate.SHOULD_select(" + tabBarController + ", " + viewController + ");", Trace.categories.Debug);
        // }
        var owner = this._owner.get();
        if (owner) {
            // "< More" cannot be visible after clicking on the main tab bar buttons.
            var backToMoreWillBeVisible = false;
            owner._handleTwoNavigationBars(backToMoreWillBeVisible);
            if (tabBarController.viewControllers) {
                var position = tabBarController.viewControllers.indexOfObject(viewController);
                if (position !== NSNotFound) {
                    var tabStrip = owner.tabStrip;
                    var tabStripItems = tabStrip && tabStrip.items;
                    if (tabStripItems && tabStripItems[position]) {
                        tabStripItems[position]._emit(TabStripItem.tapEvent);
                        tabStrip.notify({
                            eventName: TabStrip.itemTapEvent,
                            object: tabStrip,
                            index: position,
                        });
                    }
                }
            }
        }
        if (tabBarController.selectedViewController === viewController) {
            return false;
        }
        tabBarController._willSelectViewController = viewController;
        return true;
    };
    UITabBarControllerDelegateImpl.prototype.tabBarControllerDidSelectViewController = function (tabBarController, viewController) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.delegate.DID_select(" + tabBarController + ", " + viewController + ");", Trace.categories.Debug);
        // }
        var owner = this._owner.get();
        if (owner) {
            owner._onViewControllerShown(viewController);
        }
        tabBarController._willSelectViewController = undefined;
    };
    UITabBarControllerDelegateImpl.ObjCProtocols = [UITabBarControllerDelegate];
    return UITabBarControllerDelegateImpl;
}(NSObject));
var UINavigationControllerDelegateImpl = /** @class */ (function (_super) {
    __extends(UINavigationControllerDelegateImpl, _super);
    function UINavigationControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINavigationControllerDelegateImpl.initWithOwner = function (owner) {
        var delegate = UINavigationControllerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UINavigationControllerDelegateImpl.prototype.navigationControllerWillShowViewControllerAnimated = function (navigationController, viewController, animated) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.moreNavigationController.WILL_show(" + navigationController + ", " + viewController + ", " + animated + ");", Trace.categories.Debug);
        // }
        var owner = this._owner.get();
        if (owner) {
            // If viewController is one of our tab item controllers, then "< More" will be visible shortly.
            // Otherwise viewController is the UIMoreListController which shows the list of all tabs beyond the 4th tab.
            var backToMoreWillBeVisible = owner._ios.viewControllers.containsObject(viewController);
            owner._handleTwoNavigationBars(backToMoreWillBeVisible);
        }
    };
    UINavigationControllerDelegateImpl.prototype.navigationControllerDidShowViewControllerAnimated = function (navigationController, viewController, animated) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.moreNavigationController.DID_show(" + navigationController + ", " + viewController + ", " + animated + ");", Trace.categories.Debug);
        // }
        // We don't need Edit button in More screen.
        navigationController.navigationBar.topItem.rightBarButtonItem = null;
        var owner = this._owner.get();
        if (owner) {
            owner._onViewControllerShown(viewController);
        }
    };
    UINavigationControllerDelegateImpl.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerDelegateImpl;
}(NSObject));
function updateBackgroundPositions(tabStrip, tabStripItem) {
    let bgView = tabStripItem.bgView;
    const index = tabStripItem._index;
    const width = tabStrip.nativeView.frame.size.width / tabStrip.items.length;
    const frame = CGRectMake(width * index, 0, width, tabStrip.nativeView.frame.size.width);
    if (!bgView) {
        bgView = UIView.alloc().initWithFrame(frame);
        tabStrip.nativeView.insertSubviewAtIndex(bgView, 0);
        tabStripItem.bgView = bgView;
    }
    else {
        bgView.frame = frame;
    }
    const backgroundColor = tabStripItem.style.backgroundColor;
    bgView.backgroundColor = backgroundColor instanceof Color ? backgroundColor.ios : backgroundColor;
}
function updateTitleAndIconPositions(tabStripItem, tabBarItem, controller) {
    if (!tabStripItem || !tabBarItem) {
        return;
    }
    // For iOS <11 icon is *always* above the text.
    // For iOS 11 icon is above the text *only* on phones in portrait mode.
    const orientation = controller.interfaceOrientation;
    const isPortrait = orientation !== 4 /* LandscapeLeft */ && orientation !== 3 /* LandscapeRight */;
    const isIconAboveTitle = majorVersion < 11 || (isPhone && isPortrait);
    if (!tabStripItem.iconSource) {
        if (isIconAboveTitle) {
            tabBarItem.titlePositionAdjustment = {
                horizontal: 0,
                vertical: -20,
            };
        }
        else {
            tabBarItem.titlePositionAdjustment = { horizontal: 0, vertical: 0 };
        }
    }
    if (!tabStripItem.title) {
        if (isIconAboveTitle) {
            tabBarItem.imageInsets = new UIEdgeInsets({
                top: 6,
                left: 0,
                bottom: -6,
                right: 0,
            });
        }
        else {
            tabBarItem.imageInsets = new UIEdgeInsets({
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            });
        }
    }
}
let BottomNavigation = class BottomNavigation extends TabNavigationBase {
    constructor() {
        super();
        this._iconsCache = {};
        this.viewController = this._ios = UITabBarControllerImpl.initWithOwner(new WeakRef(this));
        this.nativeViewProtected = this._ios.view;
    }
    initNativeView() {
        super.initNativeView();
        this._delegate = UITabBarControllerDelegateImpl.initWithOwner(new WeakRef(this));
        this._moreNavigationControllerDelegate = UINavigationControllerDelegateImpl.initWithOwner(new WeakRef(this));
        if (!this.tabStrip) {
            this.viewController.tabBar.hidden = true;
        }
    }
    disposeNativeView() {
        this._delegate = null;
        this._moreNavigationControllerDelegate = null;
        super.disposeNativeView();
    }
    // TODO
    // @profile
    onLoaded() {
        super.onLoaded();
        this.setViewControllers(this.items);
        const selectedIndex = this.selectedIndex;
        const selectedView = this.items && this.items[selectedIndex] && this.items[selectedIndex].content;
        if (selectedView instanceof Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        this._ios.delegate = this._delegate;
    }
    onUnloaded() {
        this._ios.delegate = null;
        this._ios.moreNavigationController.delegate = null;
        super.onUnloaded();
    }
    // @ts-ignore
    get ios() {
        return this._ios;
    }
    layoutNativeView(left, top, right, bottom) {
        //
    }
    _setNativeViewFrame(nativeView, frame) {
        //
    }
    onSelectedIndexChanged(oldIndex, newIndex) {
        const items = this.items;
        if (!items) {
            return;
        }
        const oldItem = items[oldIndex];
        if (oldItem) {
            oldItem.canBeLoaded = false;
            oldItem.unloadView(oldItem.content);
        }
        const newItem = items[newIndex];
        if (newItem && this.isLoaded) {
            const selectedView = items[newIndex].content;
            if (selectedView instanceof Frame) {
                selectedView._pushInFrameStackRecursive();
            }
            newItem.canBeLoaded = true;
            newItem.loadView(newItem.content);
        }
        const tabStripItems = this.tabStrip && this.tabStrip.items;
        if (tabStripItems) {
            if (tabStripItems[newIndex]) {
                tabStripItems[newIndex]._emit(TabStripItem.selectEvent);
            }
            if (tabStripItems[oldIndex]) {
                tabStripItems[oldIndex]._emit(TabStripItem.unselectEvent);
            }
        }
        super.onSelectedIndexChanged(oldIndex, newIndex);
    }
    getTabBarBackgroundColor() {
        return this._ios.tabBar.barTintColor;
    }
    setTabBarBackgroundColor(value) {
        this._ios.tabBar.barTintColor = value instanceof Color ? value.ios : value;
        this.updateAllItemsColors();
    }
    setTabBarItemTitle(tabStripItem, value) {
        tabStripItem.nativeView.title = value;
    }
    setTabBarItemBackgroundColor(tabStripItem, value) {
        if (!this.tabStrip || !tabStripItem) {
            return;
        }
        updateBackgroundPositions(this.tabStrip, tabStripItem);
    }
    setTabBarItemColor(tabStripItem, value) {
        this.setViewAttributes(tabStripItem.nativeView, tabStripItem.label);
    }
    setItemColors() {
        if (this._selectedItemColor) {
            this.viewController.tabBar.selectedImageTintColor = this._selectedItemColor.ios;
        }
        if (this._unSelectedItemColor) {
            this.viewController.tabBar.unselectedItemTintColor = this._unSelectedItemColor.ios;
        }
    }
    setIconColor(tabStripItem, forceReload = false) {
        if (forceReload || (!this._unSelectedItemColor && !this._selectedItemColor)) {
            // if selectedItemColor or unSelectedItemColor is set we don't respect the color from the style
            const tabStripColor = this.selectedIndex === tabStripItem._index ? this._selectedItemColor : this._unSelectedItemColor;
            const image = this.getIcon(tabStripItem, tabStripColor);
            tabStripItem.nativeView.image = image;
            tabStripItem.nativeView.selectedImage = image;
        }
    }
    setTabBarIconColor(tabStripItem, value) {
        this.setIconColor(tabStripItem);
    }
    setTabBarIconSource(tabStripItem, value) {
        this.updateItemColors(tabStripItem);
    }
    setTabBarItemFontInternal(tabStripItem, value) {
        this.setViewAttributes(tabStripItem.nativeView, tabStripItem.label);
    }
    setTabBarItemTextTransform(tabStripItem, value) {
        tabStripItem.nativeView.title = getTransformedText(tabStripItem.label.text, value);
    }
    getTabBarHighlightColor() {
        return this._ios.tabBar.tintColor;
    }
    setTabBarHighlightColor(value) {
        this._ios.tabBar.tintColor = value instanceof Color ? value.ios : value;
    }
    getTabBarSelectedItemColor() {
        return this._selectedItemColor;
    }
    setTabBarSelectedItemColor(value) {
        this._selectedItemColor = value;
        this.updateAllItemsColors();
    }
    getTabBarUnSelectedItemColor() {
        return this._unSelectedItemColor;
    }
    setTabBarUnSelectedItemColor(value) {
        this._unSelectedItemColor = value;
        this.updateAllItemsColors();
    }
    onMeasure(widthMeasureSpec, heightMeasureSpec) {
        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);
        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
        const widthAndState = View.resolveSizeAndState(width, width, widthMode, 0);
        const heightAndState = View.resolveSizeAndState(height, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    }
    _onViewControllerShown(viewController) {
        // This method could be called with the moreNavigationController or its list controller, so we have to check.
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView._onViewControllerShown(" + viewController + ");", Trace.categories.Debug);
        // }
        if (this._ios.viewControllers && this._ios.viewControllers.containsObject(viewController)) {
            this.selectedIndex = this._ios.viewControllers.indexOfObject(viewController);
        }
        else {
            // TODO
            // if (Trace.isEnabled()) {
            //     Trace.write("TabView._onViewControllerShown: viewController is not one of our viewControllers", Trace.categories.Debug);
            // }
        }
    }
    _handleTwoNavigationBars(backToMoreWillBeVisible) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write(`TabView._handleTwoNavigationBars(backToMoreWillBeVisible: ${backToMoreWillBeVisible})`, Trace.categories.Debug);
        // }
        // The "< Back" and "< More" navigation bars should not be visible simultaneously.
        const page = this.page || this._selectedView.page || this._selectedView.currentPage;
        if (!page || !page.frame) {
            return;
        }
        const actionBarVisible = page.frame._getNavBarVisible(page);
        if (backToMoreWillBeVisible && actionBarVisible) {
            page.frame.ios._disableNavBarAnimation = true;
            page.actionBarHidden = true;
            page.frame.ios._disableNavBarAnimation = false;
            this._actionBarHiddenByTabView = true;
            // TODO
            // if (Trace.isEnabled()) {
            //     Trace.write(`TabView hid action bar`, Trace.categories.Debug);
            // }
            return;
        }
        if (!backToMoreWillBeVisible && this._actionBarHiddenByTabView) {
            page.frame.ios._disableNavBarAnimation = true;
            page.actionBarHidden = false;
            page.frame.ios._disableNavBarAnimation = false;
            this._actionBarHiddenByTabView = undefined;
            // TODO
            // if (Trace.isEnabled()) {
            //     Trace.write(`TabView restored action bar`, Trace.categories.Debug);
            // }
            return;
        }
    }
    getViewController(item) {
        let newController = item.content ? item.content.viewController : null;
        if (newController) {
            item.setViewController(newController, newController.view);
            return newController;
        }
        if (item.content.ios instanceof UIViewController) {
            newController = item.content.ios;
            item.setViewController(newController, newController.view);
        }
        else if (item.content.ios && item.content.ios.controller instanceof UIViewController) {
            newController = item.content.ios.controller;
            item.setViewController(newController, newController.view);
        }
        else {
            newController = IOSHelper.UILayoutViewController.initWithOwner(new WeakRef(item.content));
            newController.view.addSubview(item.content.nativeViewProtected);
            item.content.viewController = newController;
            item.setViewController(newController, item.content.nativeViewProtected);
        }
        return newController;
    }
    setViewControllers(items) {
        const length = items ? items.length : 0;
        if (length === 0) {
            this._ios.viewControllers = null;
            return;
        }
        // Limit both tabContentItems and tabStripItems to 5 in order to prevent iOS 'more' button
        items = items.slice(0, maxTabsCount);
        const controllers = NSMutableArray.alloc().initWithCapacity(length);
        if (this.tabStrip) {
            this.tabStrip.setNativeView(this._ios.tabBar);
        }
        items.forEach((item, i) => {
            const controller = this.getViewController(item);
            if (this.tabStrip && this.tabStrip.items && this.tabStrip.items[i]) {
                const tabStripItem = this.tabStrip.items[i];
                const tabBarItem = this.createTabBarItem(tabStripItem, i);
                updateTitleAndIconPositions(tabStripItem, tabBarItem, controller);
                this.setViewAttributes(tabBarItem, tabStripItem.label);
                controller.tabBarItem = tabBarItem;
                tabStripItem._index = i;
                tabStripItem.setNativeView(tabBarItem);
            }
            controllers.addObject(controller);
        });
        this.setItemImages();
        this._ios.viewControllers = controllers;
        this._ios.customizableViewControllers = null;
        // When we set this._ios.viewControllers, someone is clearing the moreNavigationController.delegate, so we have to reassign it each time here.
        this._ios.moreNavigationController.delegate = this._moreNavigationControllerDelegate;
    }
    setItemImages() {
        if (this._selectedItemColor || this._unSelectedItemColor) {
            if (this.tabStrip && this.tabStrip.items) {
                this.tabStrip.items.forEach((item) => {
                    if (this._unSelectedItemColor && item.nativeView) {
                        item.nativeView.image = this.getIcon(item, this._unSelectedItemColor);
                        item.nativeView.tintColor = this._unSelectedItemColor;
                    }
                    if (this._selectedItemColor && item.nativeView) {
                        item.nativeView.selectedImage = this.getIcon(item, this._selectedItemColor);
                        item.nativeView.tintColor = this._selectedItemColor;
                    }
                });
            }
        }
    }
    updateAllItemsColors() {
        this.setItemColors();
        if (this.tabStrip && this.tabStrip.items) {
            this.tabStrip.items.forEach((tabStripItem) => {
                this.updateItemColors(tabStripItem);
            });
        }
    }
    updateItemColors(tabStripItem) {
        updateBackgroundPositions(this.tabStrip, tabStripItem);
        this.setIconColor(tabStripItem, true);
    }
    createTabBarItem(item, index) {
        let image;
        let title;
        if (item.isLoaded) {
            image = this.getIcon(item);
            title = item.label.text;
            const textTransform = item.label.style.textTransform;
            if (textTransform) {
                title = getTransformedText(title, textTransform);
            }
        }
        return UITabBarItem.alloc().initWithTitleImageTag(title, image, index);
    }
    getIconRenderingMode() {
        switch (this.tabStrip && this.tabStrip.iosIconRenderingMode) {
            case 'alwaysOriginal':
                return 1 /* AlwaysOriginal */;
            case 'alwaysTemplate':
                return 2 /* AlwaysTemplate */;
            case 'automatic':
            default:
                return 0 /* Automatic */;
        }
    }
    getIcon(tabStripItem, color) {
        // Image and Label children of TabStripItem
        // take priority over its `iconSource` and `title` properties
        const iconSource = tabStripItem.image && tabStripItem.image.src;
        if (!iconSource) {
            return null;
        }
        const target = tabStripItem.image;
        const font = target.style.fontInternal || Font.default;
        if (!color) {
            color = target.style.color;
        }
        const iconTag = [iconSource, font.fontStyle, font.fontWeight, font.fontSize, font.fontFamily, color].join(';');
        let isFontIcon = false;
        let image = this._iconsCache[iconTag];
        if (!image) {
            let is;
            if (isFontIconURI(iconSource)) {
                isFontIcon = true;
                const fontIconCode = iconSource.split('//')[1];
                is = ImageSource.fromFontIconCodeSync(fontIconCode, font, color);
            }
            else {
                is = ImageSource.fromFileOrResourceSync(iconSource);
            }
            if (is && is.ios) {
                image = is.ios;
                if (this.tabStrip && this.tabStrip.isIconSizeFixed) {
                    image = this.getFixedSizeIcon(image);
                }
                let renderingMode = 1 /* AlwaysOriginal */;
                if (!isFontIcon) {
                    renderingMode = this.getIconRenderingMode();
                }
                const originalRenderedImage = image.imageWithRenderingMode(renderingMode);
                this._iconsCache[iconTag] = originalRenderedImage;
                image = originalRenderedImage;
            }
            else {
                // TODO
                // traceMissingIcon(iconSource);
            }
        }
        return image;
    }
    getFixedSizeIcon(image) {
        const inWidth = image.size.width;
        const inHeight = image.size.height;
        const iconSpecSize = getIconSpecSize({
            width: inWidth,
            height: inHeight,
        });
        const widthPts = iconSpecSize.width;
        const heightPts = iconSpecSize.height;
        UIGraphicsBeginImageContextWithOptions({ width: widthPts, height: heightPts }, false, layout.getDisplayDensity());
        image.drawInRect(CGRectMake(0, 0, widthPts, heightPts));
        const resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return resultImage;
    }
    // private _updateIOSTabBarColorsAndFonts(): void {
    //     if (!this.tabStrip || !this.tabStrip.items || !this.tabStrip.items.length) {
    //         return;
    //     }
    //     const tabBar = <UITabBar>this.ios.tabBar;
    //     const states = getTitleAttributesForStates(this);
    //     for (let i = 0; i < tabBar.items.count; i++) {
    //         applyStatesToItem(tabBar.items[i], states);
    //     }
    // }
    // TODO: Move this to TabStripItem
    // [fontInternalProperty.getDefault](): Font {
    //     return null;
    // }
    // [fontInternalProperty.setNative](value: Font) {
    //     this._updateIOSTabBarColorsAndFonts();
    // }
    [selectedIndexProperty.setNative](value) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView._onSelectedIndexPropertyChangedSetNativeValue(" + value + ")", Trace.categories.Debug);
        // }
        if (value > -1) {
            this._ios._willSelectViewController = this._ios.viewControllers[value];
            this._ios.selectedIndex = value;
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
        this.setViewControllers(value);
        selectedIndexProperty.coerce(this);
    }
    [tabStripProperty.getDefault]() {
        return null;
    }
    [tabStripProperty.setNative](value) {
        this.setViewControllers(this.items);
        selectedIndexProperty.coerce(this);
    }
    setViewAttributes(item, view) {
        if (!view) {
            return null;
        }
        const defaultTabItemFontSize = 10;
        const tabItemFontSize = view.style.fontSize || defaultTabItemFontSize;
        const font = (view.style.fontInternal || Font.default).getUIFont(UIFont.systemFontOfSize(tabItemFontSize));
        const tabItemTextColor = view.style.color;
        const textColor = tabItemTextColor instanceof Color ? tabItemTextColor.ios : null;
        const attributes = { [NSFontAttributeName]: font };
        // if selectedItemColor or unSelectedItemColor is set we don't respect the color from the style
        if (!this._selectedItemColor && !this._unSelectedItemColor) {
            if (textColor) {
                attributes[UITextAttributeTextColor] = textColor;
                attributes[NSForegroundColorAttributeName] = textColor;
            }
        }
        else {
            this.viewController.tabBar.unselectedItemTintColor = this._unSelectedItemColor && this._unSelectedItemColor.ios;
            this.viewController.tabBar.selectedImageTintColor = this._selectedItemColor && this._selectedItemColor.ios;
        }
        item.setTitleTextAttributesForState(attributes, 4 /* Selected */);
        item.setTitleTextAttributesForState(attributes, 0 /* Normal */);
        // there's a bug when setting the item color on ios 13 if there's no background set to the tabstrip
        // https://books.google.bg/books?id=99_BDwAAQBAJ&q=tabBar.unselectedItemTintColor
        // to fix the above issue we are applying the selected fix only for the case, when there is no background set
        // in that case we have the following known issue:
        // // we will set the color to all unselected items, so you won't be able to set different colors for the different not selected items
        if (!this.viewController.tabBar.barTintColor && attributes[UITextAttributeTextColor] && majorVersion > 9) {
            this.viewController.tabBar.unselectedItemTintColor = attributes[UITextAttributeTextColor];
        }
    }
};
BottomNavigation = __decorate([
    CSSType('BottomNavigation'),
    __metadata("design:paramtypes", [])
], BottomNavigation);
export { BottomNavigation };
//# sourceMappingURL=index.ios.js.map