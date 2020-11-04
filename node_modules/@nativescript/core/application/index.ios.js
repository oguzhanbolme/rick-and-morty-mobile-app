// Use requires to ensure order of imports is maintained
const { displayedEvent, exitEvent, getCssFileName, launchEvent, livesync, lowMemoryEvent, notify, on, orientationChanged, orientationChangedEvent, resumeEvent, setApplication, suspendEvent, systemAppearanceChanged, systemAppearanceChangedEvent } = require('./application-common');
// First reexport so that app module is initialized.
export * from './application-common';
// TODO: Remove this and get it from global to decouple builder for angular
import { Builder } from '../ui/builder';
import { CSSUtils } from '../css/system-classes';
import { IOSHelper } from '../ui/core/view/view-helper';
import { Device } from '../platform';
import { profile } from '../profiling';
import { iOSNativeHelper } from '../utils';
const IOS_PLATFORM = 'ios';
const getVisibleViewController = iOSNativeHelper.getVisibleViewController;
const majorVersion = iOSNativeHelper.MajorVersion;
// NOTE: UIResponder with implementation of window - related to https://github.com/NativeScript/ios-runtime/issues/430
// TODO: Refactor the UIResponder to use Typescript extends when this issue is resolved:
// https://github.com/NativeScript/ios-runtime/issues/1012
const Responder = UIResponder.extend({
    get window() {
        return iosApp ? iosApp.window : undefined;
    },
    set window(setWindow) {
        // NOOP
    },
}, {
    protocols: [UIApplicationDelegate],
});
var NotificationObserver = /** @class */ (function (_super) {
    __extends(NotificationObserver, _super);
    function NotificationObserver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotificationObserver.initWithCallback = function (onReceiveCallback) {
        var observer = _super.new.call(this);
        observer._onReceiveCallback = onReceiveCallback;
        return observer;
    };
    NotificationObserver.prototype.onReceive = function (notification) {
        this._onReceiveCallback(notification);
    };
    NotificationObserver.ObjCExposedMethods = {
        onReceive: { returns: interop.types.void, params: [NSNotification] },
    };
    return NotificationObserver;
}(NSObject));
let displayedOnce = false;
let displayedLinkTarget;
let displayedLink;
var CADisplayLinkTarget = /** @class */ (function (_super) {
    __extends(CADisplayLinkTarget, _super);
    function CADisplayLinkTarget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CADisplayLinkTarget.prototype.onDisplayed = function (link) {
        link.invalidate();
        var ios = UIApplication.sharedApplication;
        var object = iosApp;
        displayedOnce = true;
        notify({
            eventName: displayedEvent,
            object: object,
            ios: ios,
        });
        displayedLinkTarget = null;
        displayedLink = null;
    };
    CADisplayLinkTarget.ObjCExposedMethods = {
        onDisplayed: { returns: interop.types.void, params: [CADisplayLink] },
    };
    return CADisplayLinkTarget;
}(NSObject));
/* tslint:disable */
export class iOSApplication {
    constructor() {
        /* tslint:enable */
        this._backgroundColor = majorVersion <= 12 || !UIColor.systemBackgroundColor ? UIColor.whiteColor : UIColor.systemBackgroundColor;
        this._observers = new Array();
        this.addNotificationObserver(UIApplicationDidFinishLaunchingNotification, this.didFinishLaunchingWithOptions.bind(this));
        this.addNotificationObserver(UIApplicationDidBecomeActiveNotification, this.didBecomeActive.bind(this));
        this.addNotificationObserver(UIApplicationDidEnterBackgroundNotification, this.didEnterBackground.bind(this));
        this.addNotificationObserver(UIApplicationWillTerminateNotification, this.willTerminate.bind(this));
        this.addNotificationObserver(UIApplicationDidReceiveMemoryWarningNotification, this.didReceiveMemoryWarning.bind(this));
        this.addNotificationObserver(UIApplicationDidChangeStatusBarOrientationNotification, this.didChangeStatusBarOrientation.bind(this));
    }
    get orientation() {
        if (!this._orientation) {
            const statusBarOrientation = UIApplication.sharedApplication.statusBarOrientation;
            this._orientation = this.getOrientationValue(statusBarOrientation);
        }
        return this._orientation;
    }
    get rootController() {
        if (NativeScriptEmbedder.sharedInstance().delegate && !this._window) {
            this._window = UIApplication.sharedApplication.delegate.window;
        }
        return this._window.rootViewController;
    }
    get systemAppearance() {
        // userInterfaceStyle is available on UITraitCollection since iOS 12.
        if (majorVersion <= 11) {
            return null;
        }
        if (!this._systemAppearance) {
            const userInterfaceStyle = this.rootController.traitCollection.userInterfaceStyle;
            this._systemAppearance = getSystemAppearanceValue(userInterfaceStyle);
        }
        return this._systemAppearance;
    }
    get nativeApp() {
        return UIApplication.sharedApplication;
    }
    get window() {
        return this._window;
    }
    get delegate() {
        return this._delegate;
    }
    set delegate(value) {
        if (this._delegate !== value) {
            this._delegate = value;
        }
    }
    get rootView() {
        return this._rootView;
    }
    addNotificationObserver(notificationName, onReceiveCallback) {
        const observer = NotificationObserver.initWithCallback(onReceiveCallback);
        NSNotificationCenter.defaultCenter.addObserverSelectorNameObject(observer, 'onReceive', notificationName, null);
        this._observers.push(observer);
        return observer;
    }
    removeNotificationObserver(observer, notificationName) {
        const index = this._observers.indexOf(observer);
        if (index >= 0) {
            this._observers.splice(index, 1);
            NSNotificationCenter.defaultCenter.removeObserverNameObject(observer, notificationName, null);
        }
    }
    didFinishLaunchingWithOptions(notification) {
        if (!displayedOnce) {
            displayedLinkTarget = CADisplayLinkTarget.new();
            displayedLink = CADisplayLink.displayLinkWithTargetSelector(displayedLinkTarget, 'onDisplayed');
            displayedLink.addToRunLoopForMode(NSRunLoop.mainRunLoop, NSDefaultRunLoopMode);
            displayedLink.addToRunLoopForMode(NSRunLoop.mainRunLoop, UITrackingRunLoopMode);
        }
        this._window = UIWindow.alloc().initWithFrame(UIScreen.mainScreen.bounds);
        // TODO: Expose Window module so that it can we styled from XML & CSS
        this._window.backgroundColor = this._backgroundColor;
        this.notifyAppStarted(notification);
    }
    notifyAppStarted(notification) {
        const args = {
            eventName: launchEvent,
            object: this,
            ios: (notification && notification.userInfo && notification.userInfo.objectForKey('UIApplicationLaunchOptionsLocalNotificationKey')) || null,
        };
        notify(args);
        notify({
            eventName: 'loadAppCss',
            object: this,
            cssFile: getCssFileName(),
        });
        // this._window will be undefined when NS app is embedded in a native one
        if (this._window) {
            this.setWindowContent(args.root);
        }
        else {
            this._window = UIApplication.sharedApplication.delegate.window;
        }
    }
    didBecomeActive(notification) {
        const ios = UIApplication.sharedApplication;
        const object = this;
        notify({ eventName: resumeEvent, object, ios });
        const rootView = this._rootView;
        if (rootView && !rootView.isLoaded) {
            rootView.callLoaded();
        }
    }
    didEnterBackground(notification) {
        notify({
            eventName: suspendEvent,
            object: this,
            ios: UIApplication.sharedApplication,
        });
        const rootView = this._rootView;
        if (rootView && rootView.isLoaded) {
            rootView.callUnloaded();
        }
    }
    willTerminate(notification) {
        notify({
            eventName: exitEvent,
            object: this,
            ios: UIApplication.sharedApplication,
        });
        const rootView = this._rootView;
        if (rootView && rootView.isLoaded) {
            rootView.callUnloaded();
        }
    }
    didChangeStatusBarOrientation(notification) {
        const statusBarOrientation = UIApplication.sharedApplication.statusBarOrientation;
        const newOrientation = this.getOrientationValue(statusBarOrientation);
        if (this._orientation !== newOrientation) {
            this._orientation = newOrientation;
            orientationChanged(getRootView(), newOrientation);
            notify({
                eventName: orientationChangedEvent,
                ios: this,
                newValue: this._orientation,
                object: this,
            });
        }
    }
    didReceiveMemoryWarning(notification) {
        notify({
            eventName: lowMemoryEvent,
            object: this,
            ios: UIApplication.sharedApplication,
        });
    }
    getOrientationValue(orientation) {
        switch (orientation) {
            case 3 /* LandscapeRight */:
            case 4 /* LandscapeLeft */:
                return 'landscape';
            case 2 /* PortraitUpsideDown */:
            case 1 /* Portrait */:
                return 'portrait';
            case 0 /* Unknown */:
                return 'unknown';
        }
    }
    _onLivesync(context) {
        // Handle application root module
        const isAppRootModuleChanged = context && context.path && context.path.includes(getMainEntry().moduleName) && context.type !== 'style';
        // Set window content when:
        // + Application root module is changed
        // + View did not handle the change
        // Note:
        // The case when neither app root module is changed, nor livesync is handled on View,
        // then changes will not apply until navigate forward to the module.
        if (isAppRootModuleChanged || (this._rootView && !this._rootView._onLivesync(context))) {
            this.setWindowContent();
        }
    }
    setWindowContent(view) {
        if (this._rootView) {
            // if we already have a root view, we reset it.
            this._rootView._onRootViewReset();
        }
        const rootView = createRootView(view);
        const controller = getViewController(rootView);
        this._rootView = rootView;
        // setup view as styleScopeHost
        rootView._setupAsRootView({});
        setViewControllerView(rootView);
        const haveController = this._window.rootViewController !== null;
        this._window.rootViewController = controller;
        setRootViewsSystemAppearanceCssClass(rootView);
        if (!haveController) {
            this._window.makeKeyAndVisible();
        }
        rootView.on(IOSHelper.traitCollectionColorAppearanceChangedEvent, () => {
            const userInterfaceStyle = controller.traitCollection.userInterfaceStyle;
            const newSystemAppearance = getSystemAppearanceValue(userInterfaceStyle);
            if (this._systemAppearance !== newSystemAppearance) {
                this._systemAppearance = newSystemAppearance;
                systemAppearanceChanged(rootView, newSystemAppearance);
                notify({
                    eventName: systemAppearanceChangedEvent,
                    ios: this,
                    newValue: this._systemAppearance,
                    object: this,
                });
            }
        });
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NSNotification]),
    __metadata("design:returntype", void 0)
], iOSApplication.prototype, "didFinishLaunchingWithOptions", null);
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NSNotification]),
    __metadata("design:returntype", void 0)
], iOSApplication.prototype, "didBecomeActive", null);
/* tslint:disable */
const iosApp = new iOSApplication();
/* tslint:enable */
export { iosApp as ios };
setApplication(iosApp);
// attach on global, so it can be overwritten in NativeScript Angular
global.__onLiveSyncCore = function (context) {
    iosApp._onLivesync(context);
};
let mainEntry;
function createRootView(v) {
    let rootView = v;
    if (!rootView) {
        // try to navigate to the mainEntry (if specified)
        if (!mainEntry) {
            throw new Error('Main entry is missing. App cannot be started. Verify app bootstrap.');
        }
        else {
            // console.log('createRootView mainEntry:', mainEntry);
            rootView = Builder.createViewFromEntry(mainEntry);
        }
    }
    // console.log('createRootView rootView:', rootView);
    setRootViewsCssClasses(rootView);
    return rootView;
}
export function getMainEntry() {
    return mainEntry;
}
export function getRootView() {
    return iosApp.rootView;
}
let started = false;
export function run(entry) {
    mainEntry = typeof entry === 'string' ? { moduleName: entry } : entry;
    started = true;
    if (!iosApp.nativeApp) {
        // Normal NativeScript app will need UIApplicationMain.
        UIApplicationMain(0, null, null, iosApp && iosApp.delegate ? NSStringFromClass(iosApp.delegate) : NSStringFromClass(Responder));
    }
    else {
        // TODO: this rootView should be held alive until rootController dismissViewController is called.
        const rootView = createRootView();
        if (rootView) {
            // Attach to the existing iOS app
            const window = iosApp.nativeApp.keyWindow || (iosApp.nativeApp.windows.count > 0 && iosApp.nativeApp.windows[0]);
            if (window) {
                const rootController = window.rootViewController;
                if (rootController) {
                    const controller = getViewController(rootView);
                    rootView._setupAsRootView({});
                    let embedderDelegate = NativeScriptEmbedder.sharedInstance().delegate;
                    if (embedderDelegate) {
                        embedderDelegate.presentNativeScriptApp(controller);
                    }
                    else {
                        let visibleVC = getVisibleViewController(rootController);
                        visibleVC.presentViewControllerAnimatedCompletion(controller, true, null);
                    }
                    // Mind root view CSS classes in future work
                    // on embedding NativeScript applications
                    setRootViewsSystemAppearanceCssClass(rootView);
                    rootView.on(IOSHelper.traitCollectionColorAppearanceChangedEvent, () => {
                        const userInterfaceStyle = controller.traitCollection.userInterfaceStyle;
                        const newSystemAppearance = getSystemAppearanceValue(userInterfaceStyle);
                        if (this._systemAppearance !== newSystemAppearance) {
                            this._systemAppearance = newSystemAppearance;
                            notify({
                                eventName: systemAppearanceChangedEvent,
                                ios: this,
                                newValue: this._systemAppearance,
                                object: this,
                            });
                        }
                    });
                    iosApp.notifyAppStarted();
                }
            }
        }
    }
}
export function addCss(cssText, attributeScoped) {
    notify({
        eventName: 'cssChanged',
        object: iosApp,
        cssText: cssText,
    });
    if (!attributeScoped) {
        const rootView = getRootView();
        if (rootView) {
            rootView._onCssStateChange();
        }
    }
}
export function _resetRootView(entry) {
    mainEntry = typeof entry === 'string' ? { moduleName: entry } : entry;
    iosApp.setWindowContent();
}
export function getNativeApplication() {
    return iosApp.nativeApp;
}
function getSystemAppearanceValue(userInterfaceStyle) {
    switch (userInterfaceStyle) {
        case 2 /* Dark */:
            return 'dark';
        case 1 /* Light */:
        case 0 /* Unspecified */:
            return 'light';
    }
}
function getViewController(rootView) {
    let viewController = rootView.viewController || rootView.ios;
    if (!(viewController instanceof UIViewController)) {
        // We set UILayoutViewController dynamically to the root view if it doesn't have a view controller
        // At the moment the root view doesn't have its native view created. We set it in the setViewControllerView func
        viewController = IOSHelper.UILayoutViewController.initWithOwner(new WeakRef(rootView));
        rootView.viewController = viewController;
    }
    return viewController;
}
function setViewControllerView(view) {
    const viewController = view.viewController || view.ios;
    const nativeView = view.ios || view.nativeViewProtected;
    if (!nativeView || !viewController) {
        throw new Error('Root should be either UIViewController or UIView');
    }
    if (viewController instanceof IOSHelper.UILayoutViewController) {
        viewController.view.addSubview(nativeView);
    }
}
function setRootViewsCssClasses(rootView) {
    const deviceType = Device.deviceType.toLowerCase();
    CSSUtils.pushToSystemCssClasses(`${CSSUtils.CLASS_PREFIX}${IOS_PLATFORM}`);
    CSSUtils.pushToSystemCssClasses(`${CSSUtils.CLASS_PREFIX}${deviceType}`);
    CSSUtils.pushToSystemCssClasses(`${CSSUtils.CLASS_PREFIX}${iosApp.orientation}`);
    rootView.cssClasses.add(CSSUtils.ROOT_VIEW_CSS_CLASS);
    const rootViewCssClasses = CSSUtils.getSystemCssClasses();
    rootViewCssClasses.forEach((c) => rootView.cssClasses.add(c));
}
function setRootViewsSystemAppearanceCssClass(rootView) {
    if (majorVersion >= 13) {
        const systemAppearanceCssClass = `${CSSUtils.CLASS_PREFIX}${iosApp.systemAppearance}`;
        CSSUtils.pushToSystemCssClasses(systemAppearanceCssClass);
        rootView.cssClasses.add(systemAppearanceCssClass);
    }
}
export function orientation() {
    return iosApp.orientation;
}
export function systemAppearance() {
    return iosApp.systemAppearance;
}
global.__onLiveSync = function __onLiveSync(context) {
    if (!started) {
        return;
    }
    const rootView = getRootView();
    livesync(rootView, context);
};
// core exports this symbol so apps may import them in general
// technically they are only available for use when running that platform
// helps avoid a webpack nonexistent warning
export const AndroidApplication = undefined;
//# sourceMappingURL=index.ios.js.map