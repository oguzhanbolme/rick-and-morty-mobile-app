import { Font } from '../styling/font';
import { IOSHelper, View } from '../core/view';
import { TabViewBase, TabViewItemBase, itemsProperty, selectedIndexProperty, tabTextColorProperty, tabTextFontSizeProperty, tabBackgroundColorProperty, selectedTabTextColorProperty, iosIconRenderingModeProperty, traceMissingIcon } from './tab-view-common';
import { Color } from '../../color';
import { Trace } from '../../trace';
import { fontInternalProperty } from '../styling/style-properties';
import { textTransformProperty, getTransformedText } from '../text-base';
import { ImageSource } from '../../image-source';
import { profile } from '../../profiling';
import { Frame } from '../frame';
import { layout, iOSNativeHelper } from '../../utils';
import { Device } from '../../platform';
export * from './tab-view-common';
const majorVersion = iOSNativeHelper.MajorVersion;
const isPhone = Device.deviceType === 'Phone';
let UITabBarControllerImpl;
let UITabBarControllerDelegateImpl;
let UINavigationControllerDelegateImpl;
const setupControllers = function () {
    if (typeof UITabBarControllerImpl === 'undefined') {
        var UITabBarControllerClass = /** @class */ (function (_super) {
    __extends(UITabBarControllerClass, _super);
    function UITabBarControllerClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITabBarControllerClass.initWithOwner = function (owner) {
        var handler = UITabBarControllerImpl.new();
        handler._owner = owner;
        return handler;
    };
    UITabBarControllerClass.prototype.viewDidLoad = function () {
        _super.prototype.viewDidLoad.call(this);
        // Unify translucent and opaque bars layout
        // this.edgesForExtendedLayout = UIRectEdgeBottom;
        this.extendedLayoutIncludesOpaqueBars = true;
    };
    UITabBarControllerClass.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        IOSHelper.updateAutoAdjustScrollInsets(this, owner);
        if (!owner.parent) {
            owner.callLoaded();
        }
    };
    UITabBarControllerClass.prototype.viewDidDisappear = function (animated) {
        _super.prototype.viewDidDisappear.call(this, animated);
        var owner = this._owner.get();
        if (owner && !owner.parent && owner.isLoaded && !this.presentedViewController) {
            owner.callUnloaded();
        }
    };
    UITabBarControllerClass.prototype.viewWillTransitionToSizeWithTransitionCoordinator = function (size, coordinator) {
        var _this = this;
        _super.prototype.viewWillTransitionToSizeWithTransitionCoordinator.call(this, size, coordinator);
        coordinator.animateAlongsideTransitionCompletion(null, function () {
            var owner = _this._owner.get();
            if (owner && owner.items) {
                owner.items.forEach(function (tabItem) { return tabItem._updateTitleAndIconPositions(); });
            }
        });
    };
    // Mind implementation for other controllers
    UITabBarControllerClass.prototype.traitCollectionDidChange = function (previousTraitCollection) {
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
    __decorate([
        profile
    ], UITabBarControllerClass.prototype, "viewWillAppear", null);
    __decorate([
        profile
    ], UITabBarControllerClass.prototype, "viewDidDisappear", null);
    return UITabBarControllerClass;
}(UITabBarController));
        UITabBarControllerImpl = UITabBarControllerClass;
        var UITabBarControllerDelegateClass = /** @class */ (function (_super) {
    __extends(UITabBarControllerDelegateClass, _super);
    function UITabBarControllerDelegateClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITabBarControllerDelegateClass.initWithOwner = function (owner) {
        var delegate = UITabBarControllerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UITabBarControllerDelegateClass.prototype.tabBarControllerShouldSelectViewController = function (tabBarController, viewController) {
        if (Trace.isEnabled()) {
            Trace.write('TabView.delegate.SHOULD_select(' + tabBarController + ', ' + viewController + ');', Trace.categories.Debug);
        }
        var owner = this._owner.get();
        if (owner) {
            // "< More" cannot be visible after clicking on the main tab bar buttons.
            var backToMoreWillBeVisible = false;
            owner._handleTwoNavigationBars(backToMoreWillBeVisible);
        }
        if (tabBarController.selectedViewController === viewController) {
            return false;
        }
        tabBarController._willSelectViewController = viewController;
        return true;
    };
    UITabBarControllerDelegateClass.prototype.tabBarControllerDidSelectViewController = function (tabBarController, viewController) {
        if (Trace.isEnabled()) {
            Trace.write('TabView.delegate.DID_select(' + tabBarController + ', ' + viewController + ');', Trace.categories.Debug);
        }
        var owner = this._owner.get();
        if (owner) {
            owner._onViewControllerShown(viewController);
        }
        tabBarController._willSelectViewController = undefined;
    };
    UITabBarControllerDelegateClass.ObjCProtocols = [UITabBarControllerDelegate];
    return UITabBarControllerDelegateClass;
}(NSObject));
        UITabBarControllerDelegateImpl = UITabBarControllerDelegateClass;
        var UINavigationControllerDelegateClass = /** @class */ (function (_super) {
    __extends(UINavigationControllerDelegateClass, _super);
    function UINavigationControllerDelegateClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINavigationControllerDelegateClass.initWithOwner = function (owner) {
        var delegate = UINavigationControllerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UINavigationControllerDelegateClass.prototype.navigationControllerWillShowViewControllerAnimated = function (navigationController, viewController, animated) {
        if (Trace.isEnabled()) {
            Trace.write('TabView.moreNavigationController.WILL_show(' + navigationController + ', ' + viewController + ', ' + animated + ');', Trace.categories.Debug);
        }
        var owner = this._owner.get();
        if (owner) {
            // If viewController is one of our tab item controllers, then "< More" will be visible shortly.
            // Otherwise viewController is the UIMoreListController which shows the list of all tabs beyond the 4th tab.
            var backToMoreWillBeVisible = owner._ios.viewControllers.containsObject(viewController);
            owner._handleTwoNavigationBars(backToMoreWillBeVisible);
        }
    };
    UINavigationControllerDelegateClass.prototype.navigationControllerDidShowViewControllerAnimated = function (navigationController, viewController, animated) {
        if (Trace.isEnabled()) {
            Trace.write('TabView.moreNavigationController.DID_show(' + navigationController + ', ' + viewController + ', ' + animated + ');', Trace.categories.Debug);
        }
        // We don't need Edit button in More screen.
        navigationController.navigationBar.topItem.rightBarButtonItem = null;
        var owner = this._owner.get();
        if (owner) {
            owner._onViewControllerShown(viewController);
        }
    };
    UINavigationControllerDelegateClass.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerDelegateClass;
}(NSObject));
        UINavigationControllerDelegateImpl = UINavigationControllerDelegateClass;
    }
};
setupControllers();
function updateTitleAndIconPositions(tabItem, tabBarItem, controller) {
    if (!tabItem || !tabBarItem) {
        return;
    }
    // For iOS <11 icon is *always* above the text.
    // For iOS 11 icon is above the text *only* on phones in portrait mode.
    const orientation = controller.interfaceOrientation;
    const isPortrait = orientation !== 4 /* LandscapeLeft */ && orientation !== 3 /* LandscapeRight */;
    const isIconAboveTitle = majorVersion < 11 || (isPhone && isPortrait);
    if (!tabItem.iconSource) {
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
    if (!tabItem.title) {
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
export class TabViewItem extends TabViewItemBase {
    setViewController(controller, nativeView) {
        this.__controller = controller;
        this.setNativeView(nativeView);
    }
    disposeNativeView() {
        this.__controller = undefined;
        this.setNativeView(undefined);
    }
    loadView(view) {
        const tabView = this.parent;
        if (tabView && tabView.items) {
            const index = tabView.items.indexOf(this);
            if (index === tabView.selectedIndex) {
                super.loadView(view);
            }
        }
    }
    _update() {
        const parent = this.parent;
        const controller = this.__controller;
        if (parent && controller) {
            const icon = parent._getIcon(this.iconSource);
            const index = parent.items.indexOf(this);
            const title = getTransformedText(this.title, this.style.textTransform);
            const tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(title, icon, index);
            updateTitleAndIconPositions(this, tabBarItem, controller);
            // TODO: Repeating code. Make TabViewItemBase - ViewBase and move the colorProperty on tabViewItem.
            // Delete the repeating code.
            const states = getTitleAttributesForStates(parent);
            applyStatesToItem(tabBarItem, states);
            controller.tabBarItem = tabBarItem;
        }
    }
    _updateTitleAndIconPositions() {
        if (!this.__controller || !this.__controller.tabBarItem) {
            return;
        }
        updateTitleAndIconPositions(this, this.__controller.tabBarItem, this.__controller);
    }
    [textTransformProperty.setNative](value) {
        this._update();
    }
}
export class TabView extends TabViewBase {
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
    }
    disposeNativeView() {
        this._delegate = null;
        this._moreNavigationControllerDelegate = null;
        super.disposeNativeView();
    }
    onLoaded() {
        super.onLoaded();
        const selectedIndex = this.selectedIndex;
        const selectedView = this.items && this.items[selectedIndex] && this.items[selectedIndex].view;
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
            oldItem.unloadView(oldItem.view);
        }
        const newItem = items[newIndex];
        if (newItem && this.isLoaded) {
            const selectedView = items[newIndex].view;
            if (selectedView instanceof Frame) {
                selectedView._pushInFrameStackRecursive();
            }
            newItem.loadView(newItem.view);
        }
        super.onSelectedIndexChanged(oldIndex, newIndex);
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
        if (Trace.isEnabled()) {
            Trace.write('TabView._onViewControllerShown(' + viewController + ');', Trace.categories.Debug);
        }
        if (this._ios.viewControllers && this._ios.viewControllers.containsObject(viewController)) {
            this.selectedIndex = this._ios.viewControllers.indexOfObject(viewController);
        }
        else {
            if (Trace.isEnabled()) {
                Trace.write('TabView._onViewControllerShown: viewController is not one of our viewControllers', Trace.categories.Debug);
            }
        }
    }
    _handleTwoNavigationBars(backToMoreWillBeVisible) {
        if (Trace.isEnabled()) {
            Trace.write(`TabView._handleTwoNavigationBars(backToMoreWillBeVisible: ${backToMoreWillBeVisible})`, Trace.categories.Debug);
        }
        // The "< Back" and "< More" navigation bars should not be visible simultaneously.
        const page = this.page || this._selectedView.page || this._selectedView.currentPage;
        if (!page || !page.frame) {
            return;
        }
        let actionBarVisible = page.frame._getNavBarVisible(page);
        if (backToMoreWillBeVisible && actionBarVisible) {
            page.frame.ios._disableNavBarAnimation = true;
            page.actionBarHidden = true;
            page.frame.ios._disableNavBarAnimation = false;
            this._actionBarHiddenByTabView = true;
            if (Trace.isEnabled()) {
                Trace.write(`TabView hid action bar`, Trace.categories.Debug);
            }
            return;
        }
        if (!backToMoreWillBeVisible && this._actionBarHiddenByTabView) {
            page.frame.ios._disableNavBarAnimation = true;
            page.actionBarHidden = false;
            page.frame.ios._disableNavBarAnimation = false;
            this._actionBarHiddenByTabView = undefined;
            if (Trace.isEnabled()) {
                Trace.write(`TabView restored action bar`, Trace.categories.Debug);
            }
            return;
        }
    }
    getViewController(item) {
        let newController = item.view ? item.view.viewController : null;
        if (newController) {
            item.setViewController(newController, newController.view);
            return newController;
        }
        if (item.view.ios instanceof UIViewController) {
            newController = item.view.ios;
            item.setViewController(newController, newController.view);
        }
        else if (item.view.ios && item.view.ios.controller instanceof UIViewController) {
            newController = item.view.ios.controller;
            item.setViewController(newController, newController.view);
        }
        else {
            newController = IOSHelper.UILayoutViewController.initWithOwner(new WeakRef(item.view));
            newController.view.addSubview(item.view.nativeViewProtected);
            item.view.viewController = newController;
            item.setViewController(newController, item.view.nativeViewProtected);
        }
        return newController;
    }
    setViewControllers(items) {
        const length = items ? items.length : 0;
        if (length === 0) {
            this._ios.viewControllers = null;
            return;
        }
        const controllers = NSMutableArray.alloc().initWithCapacity(length);
        const states = getTitleAttributesForStates(this);
        items.forEach((item, i) => {
            const controller = this.getViewController(item);
            const icon = this._getIcon(item.iconSource);
            const tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(item.title || '', icon, i);
            updateTitleAndIconPositions(item, tabBarItem, controller);
            applyStatesToItem(tabBarItem, states);
            controller.tabBarItem = tabBarItem;
            controllers.addObject(controller);
            item.canBeLoaded = true;
        });
        this._ios.viewControllers = controllers;
        this._ios.customizableViewControllers = null;
        // When we set this._ios.viewControllers, someone is clearing the moreNavigationController.delegate, so we have to reassign it each time here.
        this._ios.moreNavigationController.delegate = this._moreNavigationControllerDelegate;
    }
    _getIconRenderingMode() {
        switch (this.iosIconRenderingMode) {
            case 'alwaysOriginal':
                return 1 /* AlwaysOriginal */;
            case 'alwaysTemplate':
                return 2 /* AlwaysTemplate */;
            case 'automatic':
            default:
                return 0 /* Automatic */;
        }
    }
    _getIcon(iconSource) {
        if (!iconSource) {
            return null;
        }
        let image = this._iconsCache[iconSource];
        if (!image) {
            const is = ImageSource.fromFileOrResourceSync(iconSource);
            if (is && is.ios) {
                const originalRenderedImage = is.ios.imageWithRenderingMode(this._getIconRenderingMode());
                this._iconsCache[iconSource] = originalRenderedImage;
                image = originalRenderedImage;
            }
            else {
                traceMissingIcon(iconSource);
            }
        }
        return image;
    }
    _updateIOSTabBarColorsAndFonts() {
        if (!this.items) {
            return;
        }
        const tabBar = this.ios.tabBar;
        const states = getTitleAttributesForStates(this);
        for (let i = 0; i < tabBar.items.count; i++) {
            applyStatesToItem(tabBar.items[i], states);
        }
    }
    [selectedIndexProperty.setNative](value) {
        if (Trace.isEnabled()) {
            Trace.write('TabView._onSelectedIndexPropertyChangedSetNativeValue(' + value + ')', Trace.categories.Debug);
        }
        if (value > -1) {
            this._ios._willSelectViewController = this._ios.viewControllers[value];
            this._ios.selectedIndex = value;
        }
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        this.setViewControllers(value);
        selectedIndexProperty.coerce(this);
    }
    [tabTextFontSizeProperty.getDefault]() {
        return null;
    }
    [tabTextFontSizeProperty.setNative](value) {
        this._updateIOSTabBarColorsAndFonts();
    }
    [tabTextColorProperty.getDefault]() {
        return null;
    }
    [tabTextColorProperty.setNative](value) {
        this._updateIOSTabBarColorsAndFonts();
    }
    [tabBackgroundColorProperty.getDefault]() {
        return this._ios.tabBar.barTintColor;
    }
    [tabBackgroundColorProperty.setNative](value) {
        this._ios.tabBar.barTintColor = value instanceof Color ? value.ios : value;
    }
    [selectedTabTextColorProperty.getDefault]() {
        return this._ios.tabBar.tintColor;
    }
    [selectedTabTextColorProperty.setNative](value) {
        this._ios.tabBar.tintColor = value instanceof Color ? value.ios : value;
        this._updateIOSTabBarColorsAndFonts();
    }
    // TODO: Move this to TabViewItem
    [fontInternalProperty.getDefault]() {
        return null;
    }
    [fontInternalProperty.setNative](value) {
        this._updateIOSTabBarColorsAndFonts();
    }
    // TODO: Move this to TabViewItem
    [iosIconRenderingModeProperty.getDefault]() {
        return 'automatic';
    }
    [iosIconRenderingModeProperty.setNative](value) {
        this._iconsCache = {};
        let items = this.items;
        if (items && items.length) {
            for (let i = 0, length = items.length; i < length; i++) {
                const item = items[i];
                if (item.iconSource) {
                    item._update();
                }
            }
        }
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TabView.prototype, "onLoaded", null);
function getTitleAttributesForStates(tabView) {
    const result = {};
    const defaultTabItemFontSize = 10;
    const tabItemFontSize = tabView.style.tabTextFontSize || defaultTabItemFontSize;
    const font = (tabView.style.fontInternal || Font.default).getUIFont(UIFont.systemFontOfSize(tabItemFontSize));
    const tabItemTextColor = tabView.style.tabTextColor;
    const textColor = tabItemTextColor instanceof Color ? tabItemTextColor.ios : null;
    result.normalState = { [NSFontAttributeName]: font };
    if (textColor) {
        result.normalState[UITextAttributeTextColor] = textColor;
    }
    const tabSelectedItemTextColor = tabView.style.selectedTabTextColor;
    const selectedTextColor = tabSelectedItemTextColor instanceof Color ? tabSelectedItemTextColor.ios : null;
    result.selectedState = { [NSFontAttributeName]: font };
    if (selectedTextColor) {
        result.selectedState[UITextAttributeTextColor] = selectedTextColor;
    }
    return result;
}
function applyStatesToItem(item, states) {
    item.setTitleTextAttributesForState(states.normalState, 0 /* Normal */);
    item.setTitleTextAttributesForState(states.selectedState, 4 /* Selected */);
}
//# sourceMappingURL=index.ios.js.map