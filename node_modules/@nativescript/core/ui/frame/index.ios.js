import { FrameBase, NavigationType } from './frame-common';
import { View } from '../core/view';
// Requires
import { _createIOSAnimatedTransitioning } from './fragment.transitions';
import { IOSHelper } from '../core/view/view-helper';
import { profile } from '../../profiling';
import { iOSNativeHelper, layout } from '../../utils';
import { Trace } from '../../trace';
export * from './frame-common';
const majorVersion = iOSNativeHelper.MajorVersion;
const ENTRY = '_entry';
const DELEGATE = '_delegate';
const NAV_DEPTH = '_navDepth';
const TRANSITION = '_transition';
const NON_ANIMATED_TRANSITION = 'non-animated';
const HMR_REPLACE_TRANSITION = 'fade';
let navDepth = -1;
export class Frame extends FrameBase {
    constructor() {
        super();
        this._animatedDelegate = UINavigationControllerAnimatedDelegate.new();
        this._ios = new iOSFrame(this);
        this.viewController = this._ios.controller;
    }
    createNativeView() {
        return this.viewController.view;
    }
    disposeNativeView() {
        this._removeFromFrameStack();
        this.viewController = null;
        this._ios.controller = null;
        super.disposeNativeView();
    }
    // @ts-ignore
    get ios() {
        return this._ios;
    }
    setCurrent(entry, navigationType) {
        const current = this._currentEntry;
        const currentEntryChanged = current !== entry;
        if (currentEntryChanged) {
            this._updateBackstack(entry, navigationType);
            super.setCurrent(entry, navigationType);
        }
    }
    // !!! THIS PROFILE DECORATOR CREATES A CIRCULAR DEPENDENCY
    // !!! BECAUSE THE PARAMETER TYPE IS EVALUATED WITH TYPEOF
    _navigateCore(backstackEntry) {
        super._navigateCore(backstackEntry);
        let viewController = backstackEntry.resolvedPage.ios;
        if (!viewController) {
            throw new Error('Required page does not have a viewController created.');
        }
        let clearHistory = backstackEntry.entry.clearHistory;
        if (clearHistory) {
            navDepth = -1;
        }
        const isReplace = this._executingContext && this._executingContext.navigationType === NavigationType.replace;
        if (!isReplace) {
            navDepth++;
        }
        let navigationTransition;
        let animated = this.currentPage ? this._getIsAnimatedNavigation(backstackEntry.entry) : false;
        if (isReplace) {
            animated = true;
            navigationTransition = {
                name: HMR_REPLACE_TRANSITION,
                duration: 100,
            };
            viewController[TRANSITION] = navigationTransition;
        }
        else if (animated) {
            navigationTransition = this._getNavigationTransition(backstackEntry.entry);
            if (navigationTransition) {
                viewController[TRANSITION] = navigationTransition;
            }
        }
        else {
            //https://github.com/NativeScript/NativeScript/issues/1787
            viewController[TRANSITION] = { name: NON_ANIMATED_TRANSITION };
        }
        let nativeTransition = _getNativeTransition(navigationTransition, true);
        if (!nativeTransition && navigationTransition) {
            this._ios.controller.delegate = this._animatedDelegate;
            viewController[DELEGATE] = this._animatedDelegate;
        }
        else {
            viewController[DELEGATE] = null;
            this._ios.controller.delegate = null;
        }
        backstackEntry[NAV_DEPTH] = navDepth;
        viewController[ENTRY] = backstackEntry;
        if (!animated && majorVersion > 10) {
            // Reset back button title before pushing view controller to prevent
            // displaying default 'back' title (when NavigaitonButton custom title is set).
            let barButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction('', 0 /* Plain */, null, null);
            viewController.navigationItem.backBarButtonItem = barButtonItem;
        }
        // First navigation.
        if (!this._currentEntry) {
            // Update action-bar with disabled animations before the initial navigation.
            this._updateActionBar(backstackEntry.resolvedPage, true);
            this._ios.controller.pushViewControllerAnimated(viewController, animated);
            if (Trace.isEnabled()) {
                Trace.write(`${this}.pushViewControllerAnimated(${viewController}, ${animated}); depth = ${navDepth}`, Trace.categories.Navigation);
            }
            return;
        }
        // We should clear the entire history.
        if (clearHistory) {
            viewController.navigationItem.hidesBackButton = true;
            const newControllers = NSMutableArray.alloc().initWithCapacity(1);
            newControllers.addObject(viewController);
            // Mark all previous ViewControllers as cleared
            const oldControllers = this._ios.controller.viewControllers;
            for (let i = 0; i < oldControllers.count; i++) {
                oldControllers.objectAtIndex(i).isBackstackCleared = true;
            }
            this._ios.controller.setViewControllersAnimated(newControllers, animated);
            if (Trace.isEnabled()) {
                Trace.write(`${this}.setViewControllersAnimated([${viewController}], ${animated}); depth = ${navDepth}`, Trace.categories.Navigation);
            }
            return;
        }
        // We should hide the current entry from the back stack.
        // This is the case for HMR when NavigationType.replace.
        if (!Frame._isEntryBackstackVisible(this._currentEntry) || isReplace) {
            let newControllers = NSMutableArray.alloc().initWithArray(this._ios.controller.viewControllers);
            if (newControllers.count === 0) {
                throw new Error('Wrong controllers count.');
            }
            // the code below fixes a phantom animation that appears on the Back button in this case
            // TODO: investigate why the animation happens at first place before working around it
            viewController.navigationItem.hidesBackButton = this.backStack.length === 0;
            // swap the top entry with the new one
            const skippedNavController = newControllers.lastObject;
            skippedNavController.isBackstackSkipped = true;
            newControllers.removeLastObject();
            newControllers.addObject(viewController);
            // replace the controllers instead of pushing directly
            this._ios.controller.setViewControllersAnimated(newControllers, animated);
            if (Trace.isEnabled()) {
                Trace.write(`${this}.setViewControllersAnimated([originalControllers - lastController + ${viewController}], ${animated}); depth = ${navDepth}`, Trace.categories.Navigation);
            }
            return;
        }
        // General case.
        this._ios.controller.pushViewControllerAnimated(viewController, animated);
        if (Trace.isEnabled()) {
            Trace.write(`${this}.pushViewControllerAnimated(${viewController}, ${animated}); depth = ${navDepth}`, Trace.categories.Navigation);
        }
    }
    _goBackCore(backstackEntry) {
        super._goBackCore(backstackEntry);
        navDepth = backstackEntry[NAV_DEPTH];
        let controller = backstackEntry.resolvedPage.ios;
        let animated = this._currentEntry ? this._getIsAnimatedNavigation(this._currentEntry.entry) : false;
        this._updateActionBar(backstackEntry.resolvedPage);
        if (Trace.isEnabled()) {
            Trace.write(`${this}.popToViewControllerAnimated(${controller}, ${animated}); depth = ${navDepth}`, Trace.categories.Navigation);
        }
        this._ios.controller.popToViewControllerAnimated(controller, animated);
    }
    _updateActionBar(page, disableNavBarAnimation = false) {
        super._updateActionBar(page);
        if (page && this.currentPage && this.currentPage.modal === page) {
            return;
        }
        page = page || this.currentPage;
        let newValue = this._getNavBarVisible(page);
        let disableNavBarAnimationCache = this._ios._disableNavBarAnimation;
        if (disableNavBarAnimation) {
            this._ios._disableNavBarAnimation = true;
        }
        // when showing/hiding navigationbar, the page needs a relayout to avoid overlapping or hidden layouts
        const needsPageLayout = this._ios.showNavigationBar !== newValue;
        this._ios.showNavigationBar = newValue;
        if (disableNavBarAnimation) {
            this._ios._disableNavBarAnimation = disableNavBarAnimationCache;
        }
        if (this._ios.controller.navigationBar) {
            this._ios.controller.navigationBar.userInteractionEnabled = this.navigationQueueIsEmpty();
        }
        if (needsPageLayout && page) {
            page.requestLayout();
        }
    }
    _getNavBarVisible(page) {
        switch (this.actionBarVisibility) {
            case 'always':
                return true;
            case 'never':
                return false;
            case 'auto':
                switch (this._ios.navBarVisibility) {
                    case 'always':
                        return true;
                    case 'never':
                        return false;
                    case 'auto':
                        let newValue;
                        if (page && page.actionBarHidden !== undefined) {
                            newValue = !page.actionBarHidden;
                        }
                        else {
                            newValue = this.ios.controller.viewControllers.count > 1 || (page && page.actionBar && !page.actionBar._isEmpty());
                        }
                        newValue = !!newValue;
                        return newValue;
                }
        }
    }
    static get defaultAnimatedNavigation() {
        return FrameBase.defaultAnimatedNavigation;
    }
    static set defaultAnimatedNavigation(value) {
        FrameBase.defaultAnimatedNavigation = value;
    }
    static get defaultTransition() {
        return FrameBase.defaultTransition;
    }
    static set defaultTransition(value) {
        FrameBase.defaultTransition = value;
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
    layoutNativeView(left, top, right, bottom) {
        //
    }
    _setNativeViewFrame(nativeView, frame) {
        //
    }
    _onNavigatingTo(backstackEntry, isBack) {
        //
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Frame.prototype, "_navigateCore", null);
let transitionDelegates = new Array();
var TransitionDelegate = /** @class */ (function (_super) {
    __extends(TransitionDelegate, _super);
    function TransitionDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransitionDelegate.initWithOwnerId = function (id) {
        var delegate = TransitionDelegate.new();
        delegate._id = id;
        transitionDelegates.push(delegate);
        return delegate;
    };
    TransitionDelegate.prototype.animationWillStart = function (animationID, context) {
        if (Trace.isEnabled()) {
            Trace.write("START " + this._id, Trace.categories.Transition);
        }
    };
    TransitionDelegate.prototype.animationDidStop = function (animationID, finished, context) {
        if (finished) {
            if (Trace.isEnabled()) {
                Trace.write("END " + this._id, Trace.categories.Transition);
            }
        }
        else {
            if (Trace.isEnabled()) {
                Trace.write("CANCEL " + this._id, Trace.categories.Transition);
            }
        }
        var index = transitionDelegates.indexOf(this);
        if (index > -1) {
            transitionDelegates.splice(index, 1);
        }
    };
    TransitionDelegate.ObjCExposedMethods = {
        animationWillStart: {
            returns: interop.types.void,
            params: [NSString, NSObject],
        },
        animationDidStop: {
            returns: interop.types.void,
            params: [NSString, NSNumber, NSObject],
        },
    };
    return TransitionDelegate;
}(NSObject));
const _defaultTransitionDuration = 0.35;
var UINavigationControllerAnimatedDelegate = /** @class */ (function (_super) {
    __extends(UINavigationControllerAnimatedDelegate, _super);
    function UINavigationControllerAnimatedDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINavigationControllerAnimatedDelegate.prototype.navigationControllerAnimationControllerForOperationFromViewControllerToViewController = function (navigationController, operation, fromVC, toVC) {
        var viewController;
        switch (operation) {
            case UINavigationControllerOperation.Push:
                viewController = toVC;
                break;
            case UINavigationControllerOperation.Pop:
                viewController = fromVC;
                break;
        }
        if (!viewController) {
            return null;
        }
        var navigationTransition = viewController[TRANSITION];
        if (!navigationTransition) {
            return null;
        }
        if (Trace.isEnabled()) {
            Trace.write("UINavigationControllerImpl.navigationControllerAnimationControllerForOperationFromViewControllerToViewController(" + operation + ", " + fromVC + ", " + toVC + "), transition: " + JSON.stringify(navigationTransition), Trace.categories.NativeLifecycle);
        }
        var curve = _getNativeCurve(navigationTransition);
        var animationController = _createIOSAnimatedTransitioning(navigationTransition, curve, operation, fromVC, toVC);
        return animationController;
    };
    UINavigationControllerAnimatedDelegate.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerAnimatedDelegate;
}(NSObject));
var UINavigationControllerImpl = /** @class */ (function (_super) {
    __extends(UINavigationControllerImpl, _super);
    function UINavigationControllerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINavigationControllerImpl.initWithOwner = function (owner) {
        var controller = UINavigationControllerImpl.new();
        controller._owner = owner;
        return controller;
    };
    Object.defineProperty(UINavigationControllerImpl.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    UINavigationControllerImpl.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (owner && !owner.isLoaded && !owner.parent) {
            owner.callLoaded();
        }
    };
    UINavigationControllerImpl.prototype.viewDidDisappear = function (animated) {
        _super.prototype.viewDidDisappear.call(this, animated);
        var owner = this._owner.get();
        if (owner && owner.isLoaded && !owner.parent && !this.presentedViewController) {
            owner.callUnloaded();
            owner._tearDownUI(true);
        }
    };
    UINavigationControllerImpl.prototype.animateWithDuration = function (navigationTransition, nativeTransition, transitionType, baseCallback) {
        var _this = this;
        var duration = navigationTransition.duration ? navigationTransition.duration / 1000 : _defaultTransitionDuration;
        var curve = _getNativeCurve(navigationTransition);
        var transitionTraced = Trace.isCategorySet(Trace.categories.Transition);
        var transitionDelegate;
        if (transitionTraced) {
            var id = _getTransitionId(nativeTransition, transitionType);
            transitionDelegate = TransitionDelegate.initWithOwnerId(id);
        }
        UIView.animateWithDurationAnimations(duration, function () {
            if (transitionTraced) {
                UIView.setAnimationDelegate(transitionDelegate);
            }
            UIView.setAnimationWillStartSelector('animationWillStart');
            UIView.setAnimationDidStopSelector('animationDidStop');
            UIView.setAnimationCurve(curve);
            baseCallback();
            UIView.setAnimationTransitionForViewCache(nativeTransition, _this.view, true);
        });
    };
    UINavigationControllerImpl.prototype.pushViewControllerAnimated = function (viewController, animated) {
        var _this = this;
        var navigationTransition = viewController[TRANSITION];
        if (Trace.isEnabled()) {
            Trace.write("UINavigationControllerImpl.pushViewControllerAnimated(" + viewController + ", " + animated + "); transition: " + JSON.stringify(navigationTransition), Trace.categories.NativeLifecycle);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, true);
        if (!animated || !navigationTransition || !nativeTransition) {
            _super.prototype.pushViewControllerAnimated.call(this, viewController, animated);
            return;
        }
        this.animateWithDuration(navigationTransition, nativeTransition, 'push', function () {
            _super.prototype.pushViewControllerAnimated.call(_this, viewController, false);
        });
    };
    UINavigationControllerImpl.prototype.setViewControllersAnimated = function (viewControllers, animated) {
        var _this = this;
        var viewController = viewControllers.lastObject;
        var navigationTransition = viewController[TRANSITION];
        if (Trace.isEnabled()) {
            Trace.write("UINavigationControllerImpl.setViewControllersAnimated(" + viewControllers + ", " + animated + "); transition: " + JSON.stringify(navigationTransition), Trace.categories.NativeLifecycle);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, true);
        if (!animated || !navigationTransition || !nativeTransition) {
            _super.prototype.setViewControllersAnimated.call(this, viewControllers, animated);
            return;
        }
        this.animateWithDuration(navigationTransition, nativeTransition, 'set', function () {
            _super.prototype.setViewControllersAnimated.call(_this, viewControllers, false);
        });
    };
    UINavigationControllerImpl.prototype.popViewControllerAnimated = function (animated) {
        var _this = this;
        var lastViewController = this.viewControllers.lastObject;
        var navigationTransition = lastViewController[TRANSITION];
        if (Trace.isEnabled()) {
            Trace.write("UINavigationControllerImpl.popViewControllerAnimated(" + animated + "); transition: " + JSON.stringify(navigationTransition), Trace.categories.NativeLifecycle);
        }
        if (navigationTransition && navigationTransition.name === NON_ANIMATED_TRANSITION) {
            //https://github.com/NativeScript/NativeScript/issues/1787
            return _super.prototype.popViewControllerAnimated.call(this, false);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, false);
        if (!animated || !navigationTransition || !nativeTransition) {
            return _super.prototype.popViewControllerAnimated.call(this, animated);
        }
        this.animateWithDuration(navigationTransition, nativeTransition, 'pop', function () {
            _super.prototype.popViewControllerAnimated.call(_this, false);
        });
        return null;
    };
    UINavigationControllerImpl.prototype.popToViewControllerAnimated = function (viewController, animated) {
        var _this = this;
        var lastViewController = this.viewControllers.lastObject;
        var navigationTransition = lastViewController[TRANSITION];
        if (Trace.isEnabled()) {
            Trace.write("UINavigationControllerImpl.popToViewControllerAnimated(" + viewController + ", " + animated + "); transition: " + JSON.stringify(navigationTransition), Trace.categories.NativeLifecycle);
        }
        if (navigationTransition && navigationTransition.name === NON_ANIMATED_TRANSITION) {
            //https://github.com/NativeScript/NativeScript/issues/1787
            return _super.prototype.popToViewControllerAnimated.call(this, viewController, false);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, false);
        if (!animated || !navigationTransition || !nativeTransition) {
            return _super.prototype.popToViewControllerAnimated.call(this, viewController, animated);
        }
        this.animateWithDuration(navigationTransition, nativeTransition, 'popTo', function () {
            _super.prototype.popToViewControllerAnimated.call(_this, viewController, false);
        });
        return null;
    };
    // Mind implementation for other controllers
    UINavigationControllerImpl.prototype.traitCollectionDidChange = function (previousTraitCollection) {
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
    ], UINavigationControllerImpl.prototype, "viewWillAppear", null);
    __decorate([
        profile
    ], UINavigationControllerImpl.prototype, "viewDidDisappear", null);
    __decorate([
        profile
    ], UINavigationControllerImpl.prototype, "pushViewControllerAnimated", null);
    __decorate([
        profile
    ], UINavigationControllerImpl.prototype, "setViewControllersAnimated", null);
    return UINavigationControllerImpl;
}(UINavigationController));
function _getTransitionId(nativeTransition, transitionType) {
    let name;
    switch (nativeTransition) {
        case 4 /* CurlDown */:
            name = 'CurlDown';
            break;
        case 3 /* CurlUp */:
            name = 'CurlUp';
            break;
        case 1 /* FlipFromLeft */:
            name = 'FlipFromLeft';
            break;
        case 2 /* FlipFromRight */:
            name = 'FlipFromRight';
            break;
        case 0 /* None */:
            name = 'None';
            break;
    }
    return `${name} ${transitionType}`;
}
function _getNativeTransition(navigationTransition, push) {
    if (navigationTransition && navigationTransition.name) {
        switch (navigationTransition.name.toLowerCase()) {
            case 'flip':
            case 'flipright':
                return push ? 2 /* FlipFromRight */ : 1 /* FlipFromLeft */;
            case 'flipleft':
                return push ? 1 /* FlipFromLeft */ : 2 /* FlipFromRight */;
            case 'curl':
            case 'curlup':
                return push ? 3 /* CurlUp */ : 4 /* CurlDown */;
            case 'curldown':
                return push ? 4 /* CurlDown */ : 3 /* CurlUp */;
        }
    }
    return null;
}
export function _getNativeCurve(transition) {
    if (transition.curve) {
        switch (transition.curve) {
            case 'easeIn':
                if (Trace.isEnabled()) {
                    Trace.write('Transition curve resolved to UIViewAnimationCurve.EaseIn.', Trace.categories.Transition);
                }
                return 1 /* EaseIn */;
            case 'easeOut':
                if (Trace.isEnabled()) {
                    Trace.write('Transition curve resolved to UIViewAnimationCurve.EaseOut.', Trace.categories.Transition);
                }
                return 2 /* EaseOut */;
            case 'easeInOut':
                if (Trace.isEnabled()) {
                    Trace.write('Transition curve resolved to UIViewAnimationCurve.EaseInOut.', Trace.categories.Transition);
                }
                return 0 /* EaseInOut */;
            case 'linear':
                if (Trace.isEnabled()) {
                    Trace.write('Transition curve resolved to UIViewAnimationCurve.Linear.', Trace.categories.Transition);
                }
                return 3 /* Linear */;
            default:
                if (Trace.isEnabled()) {
                    Trace.write('Transition curve resolved to original: ' + transition.curve, Trace.categories.Transition);
                }
                return transition.curve;
        }
    }
    return 0 /* EaseInOut */;
}
/* tslint:disable */
class iOSFrame {
    constructor(frame) {
        this._navBarVisibility = 'auto';
        this._controller = UINavigationControllerImpl.initWithOwner(new WeakRef(frame));
    }
    get controller() {
        return this._controller;
    }
    set controller(value) {
        this._controller = value;
    }
    get showNavigationBar() {
        return this._showNavigationBar;
    }
    set showNavigationBar(value) {
        this._showNavigationBar = value;
        this._controller.setNavigationBarHiddenAnimated(!value, !this._disableNavBarAnimation);
    }
    get navBarVisibility() {
        return this._navBarVisibility;
    }
    set navBarVisibility(value) {
        this._navBarVisibility = value;
    }
}
export function setActivityCallbacks(activity) { }
//# sourceMappingURL=index.ios.js.map