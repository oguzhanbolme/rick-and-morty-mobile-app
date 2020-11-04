import { TabStrip } from '../tab-navigation-base/tab-strip';
import { TabStripItem } from '../tab-navigation-base/tab-strip-item';
// Requires
import { Color } from '../../color';
import { ImageSource } from '../../image-source';
import { Device } from '../../platform';
import { iOSNativeHelper, isFontIconURI, layout } from '../../utils';
import { IOSHelper, View } from '../core/view';
import { Frame } from '../frame';
import { Font } from '../styling/font';
import { getIconSpecSize, itemsProperty, selectedIndexProperty, tabStripProperty } from '../tab-navigation-base/tab-navigation-base';
import { swipeEnabledProperty, TabsBase, iOSTabBarItemsAlignmentProperty } from './tabs-common';
// TODO
// import { profile } from "../../profiling";
export * from './tabs-common';
const majorVersion = iOSNativeHelper.MajorVersion;
const isPhone = Device.deviceType === 'Phone';
// Equivalent to dispatch_async(dispatch_get_main_queue(...)) call
const invokeOnRunLoop = (function () {
    const runloop = CFRunLoopGetMain();
    return (action) => {
        CFRunLoopPerformBlock(runloop, kCFRunLoopDefaultMode, action);
        CFRunLoopWakeUp(runloop);
    };
})();
var MDCTabBarDelegateImpl = /** @class */ (function (_super) {
    __extends(MDCTabBarDelegateImpl, _super);
    function MDCTabBarDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTabBarDelegateImpl.initWithOwner = function (owner) {
        var delegate = MDCTabBarDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    MDCTabBarDelegateImpl.prototype.tabBarShouldSelectItem = function (tabBar, item) {
        var owner = this._owner.get();
        var shouldSelectItem = owner._canSelectItem;
        var selectedIndex = owner.tabBarItems.indexOf(item);
        if (owner.selectedIndex !== selectedIndex) {
            owner._canSelectItem = false;
        }
        var tabStrip = owner.tabStrip;
        var tabStripItems = tabStrip && tabStrip.items;
        if (tabStripItems && tabStripItems[selectedIndex]) {
            tabStripItems[selectedIndex]._emit(TabStripItem.tapEvent);
            tabStrip.notify({
                eventName: TabStrip.itemTapEvent,
                object: tabStrip,
                index: selectedIndex,
            });
        }
        return shouldSelectItem;
    };
    MDCTabBarDelegateImpl.prototype.tabBarDidSelectItem = function (tabBar, selectedItem) {
        var owner = this._owner.get();
        var tabBarItems = owner.tabBarItems;
        var selectedIndex = tabBarItems.indexOf(selectedItem);
        owner.selectedIndex = selectedIndex;
    };
    MDCTabBarDelegateImpl.ObjCProtocols = [MDCTabBarDelegate];
    return MDCTabBarDelegateImpl;
}(NSObject));
var BackgroundIndicatorTemplate = /** @class */ (function (_super) {
    __extends(BackgroundIndicatorTemplate, _super);
    function BackgroundIndicatorTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackgroundIndicatorTemplate.prototype.indicatorAttributesForContext = function (context) {
        var attributes = new MDCTabBarIndicatorAttributes();
        attributes.path = UIBezierPath.bezierPathWithRect(context.bounds);
        return attributes;
    };
    BackgroundIndicatorTemplate.ObjCProtocols = [MDCTabBarIndicatorTemplate];
    return BackgroundIndicatorTemplate;
}(NSObject));
var UIPageViewControllerImpl = /** @class */ (function (_super) {
    __extends(UIPageViewControllerImpl, _super);
    function UIPageViewControllerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIPageViewControllerImpl.initWithOwner = function (owner) {
        var handler = UIPageViewControllerImpl.alloc().initWithTransitionStyleNavigationOrientationOptions(UIPageViewControllerTransitionStyle.Scroll, UIPageViewControllerNavigationOrientation.Horizontal, null);
        handler._owner = owner;
        return handler;
    };
    UIPageViewControllerImpl.prototype.viewDidLoad = function () {
        var owner = this._owner.get();
        var tabBarItems = owner.tabBarItems;
        var tabBar = MDCTabBar.alloc().initWithFrame(this.view.bounds);
        if (tabBarItems && tabBarItems.length) {
            tabBar.items = NSArray.arrayWithArray(tabBarItems);
        }
        tabBar.delegate = this.tabBarDelegate = MDCTabBarDelegateImpl.initWithOwner(new WeakRef(owner));
        if (majorVersion <= 12 || !UIColor.labelColor) {
            tabBar.tintColor = UIColor.blueColor;
            tabBar.barTintColor = UIColor.whiteColor;
            tabBar.setTitleColorForState(UIColor.blackColor, MDCTabBarItemState.Normal);
            tabBar.setTitleColorForState(UIColor.blackColor, MDCTabBarItemState.Selected);
        }
        else {
            tabBar.tintColor = UIColor.systemBlueColor;
            tabBar.barTintColor = UIColor.systemBackgroundColor;
            tabBar.setTitleColorForState(UIColor.labelColor, MDCTabBarItemState.Normal);
            tabBar.setTitleColorForState(UIColor.labelColor, MDCTabBarItemState.Selected);
            tabBar.inkColor = UIColor.clearColor;
        }
        tabBar.autoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleBottomMargin;
        tabBar.alignment = MDCTabBarAlignment.Justified;
        tabBar.sizeToFit();
        this.tabBar = tabBar;
        this.view.addSubview(tabBar);
    };
    UIPageViewControllerImpl.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        IOSHelper.updateAutoAdjustScrollInsets(this, owner);
        // Tabs can be reset as a root view. Call loaded here in this scenario.
        if (!owner.isLoaded) {
            owner.callLoaded();
        }
    };
    UIPageViewControllerImpl.prototype.viewDidLayoutSubviews = function () {
        _super.prototype.viewDidLayoutSubviews.call(this);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        var safeAreaInsetsBottom = 0;
        var safeAreaInsetsTop = 0;
        if (majorVersion > 10) {
            safeAreaInsetsBottom = this.view.safeAreaInsets.bottom;
            safeAreaInsetsTop = this.view.safeAreaInsets.top;
        }
        else {
            safeAreaInsetsTop = this.topLayoutGuide.length;
        }
        var scrollViewTop = 0;
        var scrollViewHeight = this.view.bounds.size.height + safeAreaInsetsBottom;
        if (owner.tabStrip) {
            scrollViewTop = this.tabBar.frame.size.height;
            scrollViewHeight = this.view.bounds.size.height - this.tabBar.frame.size.height + safeAreaInsetsBottom;
            var tabBarTop = safeAreaInsetsTop;
            var tabBarHeight = this.tabBar.frame.size.height;
            var tabsPosition = owner.tabsPosition;
            if (tabsPosition === 'bottom') {
                tabBarTop = this.view.frame.size.height - this.tabBar.frame.size.height - safeAreaInsetsBottom;
                scrollViewTop = this.view.frame.origin.y;
                scrollViewHeight = this.view.frame.size.height - safeAreaInsetsBottom;
            }
            var parent = owner.parent;
            // Handle Angular scenario where Tabs is in a ProxyViewContainer
            // It is possible to wrap components in ProxyViewContainers indefinitely
            while (parent && !parent.nativeViewProtected) {
                parent = parent.parent;
            }
            if (parent && majorVersion > 10) {
                // TODO: Figure out a better way to handle ViewController nesting/Safe Area nesting
                tabBarTop = Math.max(tabBarTop, parent.nativeView.safeAreaInsets.top);
            }
            this.tabBar.frame = CGRectMake(0, tabBarTop, this.tabBar.frame.size.width, tabBarHeight);
        }
        else {
            this.tabBar.hidden = true;
        }
        var subViews = this.view.subviews;
        var scrollView = null;
        for (var i = 0; i < subViews.count; i++) {
            var view = subViews[i];
            if (view instanceof UIScrollView) {
                scrollView = view;
            }
        }
        if (scrollView) {
            // The part of the UIPageViewController that is changing the pages is a UIScrollView
            // We want to expand it to the size of the UIPageViewController as it is not so by default
            this.scrollView = scrollView;
            if (!owner.swipeEnabled) {
                scrollView.scrollEnabled = false;
            }
            scrollView.frame = CGRectMake(0, scrollViewTop, this.view.bounds.size.width, scrollViewHeight); //this.view.bounds;
        }
    };
    // Mind implementation for other controllers
    UIPageViewControllerImpl.prototype.traitCollectionDidChange = function (previousTraitCollection) {
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
    UIPageViewControllerImpl.prototype.viewWillTransitionToSizeWithTransitionCoordinator = function (size, coordinator) {
        var _this = this;
        _super.prototype.viewWillTransitionToSizeWithTransitionCoordinator.call(this, size, coordinator);
        coordinator.animateAlongsideTransitionCompletion(function () {
            var owner = _this._owner.get();
            if (owner && owner.tabStrip && owner.tabStrip.items) {
                var tabStrip_1 = owner.tabStrip;
                tabStrip_1.items.forEach(function (tabStripItem) {
                    updateBackgroundPositions(tabStrip_1, tabStripItem, _this.tabBar.alignment !== MDCTabBarAlignment.Justified || owner.selectedIndex !== tabStripItem._index ? owner._defaultItemBackgroundColor : null);
                    var index = tabStripItem._index;
                    var tabBarItemController = owner.viewControllers[index];
                    updateTitleAndIconPositions(tabStripItem, tabBarItemController.tabBarItem, tabBarItemController);
                });
            }
        }, null);
    };
    return UIPageViewControllerImpl;
}(UIPageViewController));
var UIPageViewControllerDataSourceImpl = /** @class */ (function (_super) {
    __extends(UIPageViewControllerDataSourceImpl, _super);
    function UIPageViewControllerDataSourceImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIPageViewControllerDataSourceImpl.initWithOwner = function (owner) {
        var dataSource = UIPageViewControllerDataSourceImpl.new();
        dataSource._owner = owner;
        return dataSource;
    };
    UIPageViewControllerDataSourceImpl.prototype.pageViewControllerViewControllerBeforeViewController = function (pageViewController, viewController) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.delegate.SHOULD_select(" + tabBarController + ", " + viewController + ");", Trace.categories.Debug);
        // }
        var owner = this._owner.get();
        var selectedIndex = owner.selectedIndex;
        if (selectedIndex === 0) {
            return null;
        }
        selectedIndex--;
        var prevItem = owner.items[selectedIndex];
        var prevViewController = prevItem.__controller;
        // if (!prevViewController) {
        //     prevViewController = owner.getViewController(prevItem);
        // }
        owner._setCanBeLoaded(selectedIndex);
        owner._loadUnloadTabItems(selectedIndex);
        return prevViewController;
    };
    UIPageViewControllerDataSourceImpl.prototype.pageViewControllerViewControllerAfterViewController = function (pageViewController, viewController) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.delegate.SHOULD_select(" + tabBarController + ", " + viewController + ");", Trace.categories.Debug);
        // }
        var owner = this._owner.get();
        var selectedIndex = owner.selectedIndex;
        if (selectedIndex === owner.items.length - 1) {
            return null;
        }
        selectedIndex++;
        var nextItem = owner.items[selectedIndex];
        var nextViewController = nextItem.__controller;
        // if (!nextViewController) {
        //     nextViewController = owner.getViewController(nextItem);
        // }
        owner._setCanBeLoaded(selectedIndex);
        owner._loadUnloadTabItems(selectedIndex);
        // nextItem.loadView(nextItem.view);
        return nextViewController;
    };
    UIPageViewControllerDataSourceImpl.prototype.presentationCountForPageViewController = function (pageViewController) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.delegate.SHOULD_select(" + tabBarController + ", " + viewController + ");", Trace.categories.Debug);
        // }
        return 0;
    };
    UIPageViewControllerDataSourceImpl.prototype.presentationIndexForPageViewController = function (pageViewController) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView.delegate.SHOULD_select(" + tabBarController + ", " + viewController + ");", Trace.categories.Debug);
        // }
        return 0;
    };
    UIPageViewControllerDataSourceImpl.ObjCProtocols = [UIPageViewControllerDataSource];
    return UIPageViewControllerDataSourceImpl;
}(NSObject));
var UIPageViewControllerDelegateImpl = /** @class */ (function (_super) {
    __extends(UIPageViewControllerDelegateImpl, _super);
    function UIPageViewControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIPageViewControllerDelegateImpl.initWithOwner = function (owner) {
        var delegate = UIPageViewControllerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UIPageViewControllerDelegateImpl.prototype.pageViewControllerWillTransitionToViewControllers = function (pageViewController, viewControllers) {
        // const owner = this._owner.get();
        // const ownerViewControllers = owner.viewControllers;
        // const selectedIndex = owner.selectedIndex;
        // const nextViewController = viewControllers[0];
        // const nextViewControllerIndex = ownerViewControllers.indexOf(nextViewController);
        // if (selectedIndex > nextViewControllerIndex) {
        //     owner.selectedIndex--;
        // } else {
        //     owner.selectedIndex++;
        // }
    };
    UIPageViewControllerDelegateImpl.prototype.pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted = function (pageViewController, didFinishAnimating, previousViewControllers, transitionCompleted) {
        if (!transitionCompleted) {
            return;
        }
        var owner = this._owner.get();
        var ownerViewControllers = owner.viewControllers;
        var selectedIndex = owner.selectedIndex;
        var nextViewController = pageViewController.viewControllers[0];
        var nextViewControllerIndex = ownerViewControllers.indexOf(nextViewController);
        if (selectedIndex !== nextViewControllerIndex) {
            owner.selectedIndex = nextViewControllerIndex;
            owner._canSelectItem = true;
        }
    };
    UIPageViewControllerDelegateImpl.ObjCProtocols = [UIPageViewControllerDelegate];
    return UIPageViewControllerDelegateImpl;
}(NSObject));
function iterateIndexRange(index, eps, lastIndex, callback) {
    const rangeStart = Math.max(0, index - eps);
    const rangeEnd = Math.min(index + eps, lastIndex);
    for (let i = rangeStart; i <= rangeEnd; i++) {
        callback(i);
    }
}
function updateBackgroundPositions(tabStrip, tabStripItem, color = null) {
    let bgView = tabStripItem.bgView;
    const index = tabStripItem._index;
    let width = tabStrip.nativeView.frame.size.width / tabStrip.items.length;
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
    bgView.backgroundColor = color || (backgroundColor instanceof Color ? backgroundColor.ios : backgroundColor);
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
export class Tabs extends TabsBase {
    constructor() {
        super();
        // private _moreNavigationControllerDelegate: UINavigationControllerDelegateImpl;
        this._iconsCache = {};
        this.viewController = this._ios = UIPageViewControllerImpl.initWithOwner(new WeakRef(this)); //alloc().initWithTransitionStyleNavigationOrientationOptions(UIPageViewControllerTransitionStyle.Scroll, UIPageViewControllerNavigationOrientation.Horizontal, null);;
    }
    createNativeView() {
        return this._ios.view;
    }
    initNativeView() {
        super.initNativeView();
        this._dataSource = UIPageViewControllerDataSourceImpl.initWithOwner(new WeakRef(this));
        this._delegate = UIPageViewControllerDelegateImpl.initWithOwner(new WeakRef(this));
    }
    disposeNativeView() {
        this._dataSource = null;
        this._delegate = null;
        this._ios.tabBarDelegate = null;
        this._ios.tabBar = null;
        super.disposeNativeView();
    }
    // TODO
    // @profile()
    onLoaded() {
        super.onLoaded();
        this.setViewControllers(this.items);
        const selectedIndex = this.selectedIndex;
        const selectedView = this.items && this.items[selectedIndex] && this.items[selectedIndex].content;
        if (selectedView instanceof Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        this._ios.dataSource = this._dataSource;
        this._ios.delegate = this._delegate;
    }
    onUnloaded() {
        this._ios.dataSource = null;
        this._ios.delegate = null;
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
                this.updateItemColors(tabStripItems[newIndex]);
            }
            if (tabStripItems[oldIndex]) {
                tabStripItems[oldIndex]._emit(TabStripItem.unselectEvent);
                this.updateItemColors(tabStripItems[oldIndex]);
            }
        }
        this._loadUnloadTabItems(newIndex);
        super.onSelectedIndexChanged(oldIndex, newIndex);
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
    _setCanBeLoaded(index) {
        const items = this.items;
        if (!this.items) {
            return;
        }
        const lastIndex = items.length - 1;
        const offsideItems = this.offscreenTabLimit;
        iterateIndexRange(index, offsideItems, lastIndex, (i) => {
            if (items[i]) {
                items[i].canBeLoaded = true;
            }
        });
    }
    setViewControllers(items) {
        const length = items ? items.length : 0;
        if (length === 0) {
            this.viewControllers = null;
            return;
        }
        const viewControllers = [];
        const tabBarItems = [];
        if (this.tabStrip) {
            this.tabStrip.setNativeView(this._ios.tabBar);
        }
        const tabStripItems = this.tabStrip && this.tabStrip.items;
        if (tabStripItems) {
            if (tabStripItems[this.selectedIndex]) {
                tabStripItems[this.selectedIndex]._emit(TabStripItem.selectEvent);
            }
        }
        items.forEach((item, i) => {
            const controller = this.getViewController(item);
            if (this.tabStrip && this.tabStrip.items && this.tabStrip.items[i]) {
                const tabStripItem = this.tabStrip.items[i];
                const tabBarItem = this.createTabBarItem(tabStripItem, i);
                updateTitleAndIconPositions(tabStripItem, tabBarItem, controller);
                this.setViewTextAttributes(tabStripItem.label, i === this.selectedIndex);
                controller.tabBarItem = tabBarItem;
                tabStripItem._index = i;
                tabBarItems.push(tabBarItem);
                tabStripItem.setNativeView(tabBarItem);
            }
            item.canBeLoaded = true;
            viewControllers.push(controller);
        });
        this.setItemImages();
        this.viewControllers = viewControllers;
        this.tabBarItems = tabBarItems;
        if (this.viewController && this.viewController.tabBar) {
            this.viewController.tabBar.itemAppearance = this.getTabBarItemAppearance();
            this.viewController.tabBar.items = NSArray.arrayWithArray(this.tabBarItems);
            // TODO: investigate why this call is necessary to actually toggle item appearance
            this.viewController.tabBar.sizeToFit();
            if (this.selectedIndex) {
                this.viewController.tabBar.setSelectedItemAnimated(this.tabBarItems[this.selectedIndex], false);
            }
        }
    }
    setItemImages() {
        if (this._selectedItemColor || this._unSelectedItemColor) {
            if (this.tabStrip && this.tabStrip.items) {
                this.tabStrip.items.forEach((item) => {
                    if (this._unSelectedItemColor && item.nativeView) {
                        item.nativeView.image = this.getIcon(item, this._unSelectedItemColor);
                    }
                    if (this._selectedItemColor && item.nativeView) {
                        if (this.selectedIndex === item._index) {
                            item.nativeView.image = this.getIcon(item, this._selectedItemColor);
                        }
                    }
                });
            }
        }
    }
    updateAllItemsColors() {
        this._defaultItemBackgroundColor = null;
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
            if (!this.tabStrip._hasImage) {
                this.tabStrip._hasImage = !!image;
            }
            if (!this.tabStrip._hasTitle) {
                this.tabStrip._hasTitle = !!title;
            }
        }
        const tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(title, image, index);
        return tabBarItem;
    }
    getTabBarItemAppearance() {
        let itemAppearance;
        if (this.tabStrip && this.tabStrip._hasImage && this.tabStrip._hasTitle) {
            itemAppearance = 2 /* TitledImages */;
        }
        else if (this.tabStrip && this.tabStrip._hasImage) {
            itemAppearance = 1 /* Images */;
        }
        else {
            itemAppearance = 0 /* Titles */;
        }
        return itemAppearance;
    }
    getIconRenderingMode() {
        switch (this.tabStrip && this.tabStrip.iosIconRenderingMode) {
            case 'alwaysOriginal':
                return 1 /* AlwaysOriginal */;
            case 'alwaysTemplate':
                return 2 /* AlwaysTemplate */;
            case 'automatic':
            default:
                const hasItemColor = this._selectedItemColor || this._unSelectedItemColor;
                return hasItemColor ? 2 /* AlwaysTemplate */ : 1 /* AlwaysOriginal */;
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
            let is = new ImageSource();
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
                let renderingMode = 0 /* Automatic */;
                if (!isFontIcon) {
                    renderingMode = this.getIconRenderingMode();
                }
                const originalRenderedImage = image.imageWithRenderingMode(renderingMode);
                this._iconsCache[iconTag] = originalRenderedImage;
                image = originalRenderedImage;
            }
        }
        return image;
    }
    getFixedSizeIcon(image) {
        const inWidth = image.size.width;
        const inHeight = image.size.height;
        const iconSpecSize = getIconSpecSize({ width: inWidth, height: inHeight });
        const widthPts = iconSpecSize.width;
        const heightPts = iconSpecSize.height;
        UIGraphicsBeginImageContextWithOptions({ width: widthPts, height: heightPts }, false, layout.getDisplayDensity());
        image.drawInRect(CGRectMake(0, 0, widthPts, heightPts));
        let resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return resultImage;
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
    equalUIColor(first, second) {
        if (!first && !second) {
            return true;
        }
        if (!first || !second) {
            return false;
        }
        const firstComponents = CGColorGetComponents(first.CGColor);
        const secondComponents = CGColorGetComponents(second.CGColor);
        return firstComponents[0] === secondComponents[0] && firstComponents[1] === secondComponents[1] && firstComponents[2] === secondComponents[2] && firstComponents[3] === secondComponents[3];
    }
    isSelectedAndHightlightedItem(tabStripItem) {
        // to find out whether the current tab strip item is active (has style with :active selector applied)
        // we need to check whether its _visualState is equal to "highlighted" as when changing tabs
        // we first go through setTabBarItemBackgroundColor thice, once before setting the "highlighted" state
        // and once after that, but if the "highlighted" state is not set we cannot get the backgroundColor
        // set using :active selector
        return tabStripItem._index === this.selectedIndex && tabStripItem['_visualState'] === 'highlighted';
    }
    setTabBarItemBackgroundColor(tabStripItem, value) {
        if (!this.tabStrip || !tabStripItem) {
            return;
        }
        let newColor = value instanceof Color ? value.ios : value;
        const itemSelectedAndHighlighted = this.isSelectedAndHightlightedItem(tabStripItem);
        // As we cannot implement selected item background color in Tabs we are using the Indicator for this
        // To be able to detect that there are two different background colors (one for selected and one for not selected item)
        // we are checking whether the current item is not selected and higlighted and we store the value of its
        // background color to _defaultItemBackgroundColor and later if we need to process a selected and highlighted item
        // we are comparing it's backgroun color to the default one and if there's a difference
        // we are changing the selectionIndicatorTemplate from underline to the whole item
        // in that mode we are not able to show the indicator as it is used for the background of the selected item
        if (!this._defaultItemBackgroundColor && !itemSelectedAndHighlighted) {
            this._defaultItemBackgroundColor = newColor;
        }
        if (this.viewController.tabBar.alignment !== 1 /* Justified */ && itemSelectedAndHighlighted && !this.equalUIColor(this._defaultItemBackgroundColor, newColor)) {
            if (!this._backgroundIndicatorColor) {
                this._backgroundIndicatorColor = newColor;
                this._ios.tabBar.selectionIndicatorTemplate = new BackgroundIndicatorTemplate();
                this._ios.tabBar.tintColor = newColor;
            }
        }
        else {
            updateBackgroundPositions(this.tabStrip, tabStripItem, newColor);
        }
    }
    setTabBarItemColor(tabStripItem, value) {
        this.setViewTextAttributes(tabStripItem.label);
    }
    setItemColors() {
        if (this._selectedItemColor) {
            this.viewController.tabBar.selectedItemTintColor = this._selectedItemColor.ios;
        }
        if (this._unSelectedItemColor) {
            this.viewController.tabBar.unselectedItemTintColor = this._unSelectedItemColor.ios;
        }
    }
    setIconColor(tabStripItem, forceReload = false) {
        // if there is no change in the css color and there is no item color set
        // we don't need to reload the icon
        if (!forceReload && !this._selectedItemColor && !this._unSelectedItemColor) {
            return;
        }
        let image;
        // if selectedItemColor or unSelectedItemColor is set we don't respect the color from the style
        const tabStripColor = this.selectedIndex === tabStripItem._index ? this._selectedItemColor : this._unSelectedItemColor;
        image = this.getIcon(tabStripItem, tabStripColor);
        tabStripItem.nativeView.image = image;
    }
    setTabBarIconColor(tabStripItem, value) {
        this.setIconColor(tabStripItem, true);
    }
    setTabBarIconSource(tabStripItem, value) {
        this.updateItemColors(tabStripItem);
    }
    setTabBarItemFontInternal(tabStripItem, value) {
        this.setViewTextAttributes(tabStripItem.label);
    }
    getTabBarFontInternal() {
        return this._ios.tabBar.unselectedItemTitleFont;
    }
    setTabBarFontInternal(value) {
        const defaultTabItemFontSize = 10;
        const tabItemFontSize = this.tabStrip.style.fontSize || defaultTabItemFontSize;
        const font = (this.tabStrip.style.fontInternal || Font.default).getUIFont(UIFont.systemFontOfSize(tabItemFontSize));
        this._ios.tabBar.unselectedItemTitleFont = font;
        this._ios.tabBar.selectedItemTitleFont = font;
    }
    getTabBarTextTransform() {
        switch (this._ios.tabBar.titleTextTransform) {
            case 1 /* None */:
                return 'none';
            case 0 /* Automatic */:
                return 'initial';
            case 2 /* Uppercase */:
            default:
                return 'uppercase';
        }
    }
    setTabBarTextTransform(value) {
        if (value === 'none') {
            this._ios.tabBar.titleTextTransform = 1 /* None */;
        }
        else if (value === 'uppercase') {
            this._ios.tabBar.titleTextTransform = 2 /* Uppercase */;
        }
        else if (value === 'initial') {
            this._ios.tabBar.titleTextTransform = 0 /* Automatic */;
        }
    }
    getTabBarColor() {
        return this._ios.tabBar.titleColorForState(0 /* Normal */);
    }
    setTabBarColor(value) {
        const nativeColor = value instanceof Color ? value.ios : value;
        this._ios.tabBar.setTitleColorForState(nativeColor, 0 /* Normal */);
        this._ios.tabBar.setTitleColorForState(nativeColor, 1 /* Selected */);
    }
    getTabBarHighlightColor() {
        return this._ios.tabBar.tintColor;
    }
    setTabBarHighlightColor(value) {
        const nativeColor = value instanceof Color ? value.ios : value;
        this._ios.tabBar.tintColor = nativeColor;
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
    visitFrames(view, operation) {
        if (view instanceof Frame) {
            operation(view);
        }
        view.eachChild((child) => {
            this.visitFrames(child, operation);
            return true;
        });
    }
    [selectedIndexProperty.setNative](value) {
        // TODO
        // if (Trace.isEnabled()) {
        //     Trace.write("TabView._onSelectedIndexPropertyChangedSetNativeValue(" + value + ")", Trace.categories.Debug);
        // }
        if (value > -1) {
            const item = this.items[value];
            const controllers = NSMutableArray.alloc().initWithCapacity(1);
            let itemController = item.__controller;
            // if (!itemController) {
            //     itemController = this.getViewController(item);
            // }
            controllers.addObject(itemController);
            let navigationDirection = 0 /* Forward */;
            if (this._currentNativeSelectedIndex && this._currentNativeSelectedIndex > value) {
                navigationDirection = 1 /* Reverse */;
            }
            this._currentNativeSelectedIndex = value;
            // do not make layout changes while the animation is in progress https://stackoverflow.com/a/47031524/613113
            this.visitFrames(item, (frame) => (frame._animationInProgress = true));
            invokeOnRunLoop(() => this.viewController.setViewControllersDirectionAnimatedCompletion(controllers, navigationDirection, this.animationEnabled, (finished) => {
                this.visitFrames(item, (frame) => (frame._animationInProgress = false));
                if (finished) {
                    // HACK: UIPageViewController fix; see https://stackoverflow.com/a/17330606
                    invokeOnRunLoop(() => this.viewController.setViewControllersDirectionAnimatedCompletion(controllers, navigationDirection, false, null));
                    this._canSelectItem = true;
                    this._setCanBeLoaded(value);
                    this._loadUnloadTabItems(value);
                }
            }));
            if (this.tabBarItems && this.tabBarItems.length && this.viewController && this.viewController.tabBar) {
                this.viewController.tabBar.setSelectedItemAnimated(this.tabBarItems[value], this.animationEnabled);
            }
            // TODO:
            // (<any>this._ios)._willSelectViewController = this._ios.viewControllers[value];
            // this._ios.selectedIndex = value;
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
    [swipeEnabledProperty.getDefault]() {
        return true;
    }
    [swipeEnabledProperty.setNative](value) {
        if (this.viewController && this.viewController.scrollView) {
            this.viewController.scrollView.scrollEnabled = value;
        }
    }
    [iOSTabBarItemsAlignmentProperty.getDefault]() {
        if (!this.viewController || !this.viewController.tabBar) {
            return 'justified';
        }
        let alignment = this.viewController.tabBar.alignment.toString();
        return (alignment.charAt(0).toLowerCase() + alignment.substring(1));
    }
    [iOSTabBarItemsAlignmentProperty.setNative](value) {
        if (!this.viewController || !this.viewController.tabBar) {
            return;
        }
        let alignment = 1 /* Justified */;
        switch (value) {
            case 'leading':
                alignment = 0 /* Leading */;
                break;
            case 'center':
                alignment = 2 /* Center */;
                break;
            case 'centerSelected':
                alignment = 3 /* CenterSelected */;
                break;
        }
        this.viewController.tabBar.alignment = alignment;
    }
    setViewTextAttributes(view, setSelected = false) {
        if (!view) {
            return null;
        }
        const defaultTabItemFontSize = 10;
        const tabItemFontSize = view.style.fontSize || defaultTabItemFontSize;
        const font = (view.style.fontInternal || Font.default).getUIFont(UIFont.systemFontOfSize(tabItemFontSize));
        this.viewController.tabBar.unselectedItemTitleFont = font;
        this.viewController.tabBar.selectedItemTitleFont = font;
        const tabItemTextColor = view.style.color;
        const textColor = tabItemTextColor instanceof Color ? tabItemTextColor.ios : null;
        if (textColor) {
            this.viewController.tabBar.setTitleColorForState(textColor, 0 /* Normal */);
            this.viewController.tabBar.setImageTintColorForState(textColor, 0 /* Normal */);
            if (setSelected) {
                this.viewController.tabBar.setTitleColorForState(textColor, 1 /* Selected */);
                this.viewController.tabBar.setImageTintColorForState(textColor, 1 /* Selected */);
            }
        }
        if (this._selectedItemColor) {
            this.viewController.tabBar.selectedItemTintColor = this._selectedItemColor.ios;
        }
        if (this._unSelectedItemColor) {
            this.viewController.tabBar.unselectedItemTintColor = this._unSelectedItemColor.ios;
        }
    }
}
//# sourceMappingURL=index.ios.js.map