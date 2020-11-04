import { Trace } from '../trace';
const radToDeg = Math.PI / 180;
function isOrientationLandscape(orientation) {
    return orientation === 3 /* LandscapeLeft */ /* 3 */ || orientation === 4 /* LandscapeRight */ /* 4 */;
}
function openFileAtRootModule(filePath) {
    try {
        const appPath = iOSNativeHelper.getCurrentAppPath();
        let path = iOSNativeHelper.isRealDevice() ? filePath.replace('~', appPath) : filePath;
        const controller = UIDocumentInteractionController.interactionControllerWithURL(NSURL.fileURLWithPath(path));
        controller.delegate = iOSNativeHelper.createUIDocumentInteractionControllerDelegate();
        return controller.presentPreviewAnimated(true);
    }
    catch (e) {
        Trace.write('Error in openFile', Trace.categories.Error, Trace.messageType.error);
    }
    return false;
}
export var iOSNativeHelper;
(function (iOSNativeHelper) {
    // TODO: remove for NativeScript 7.0
    function getter(_this, property) {
        console.log('utils.ios.getter() is deprecated; use the respective native property instead');
        if (typeof property === 'function') {
            return property.call(_this);
        }
        else {
            return property;
        }
    }
    iOSNativeHelper.getter = getter;
    let collections;
    (function (collections) {
        function jsArrayToNSArray(str) {
            return NSArray.arrayWithArray(str);
        }
        collections.jsArrayToNSArray = jsArrayToNSArray;
        function nsArrayToJSArray(a) {
            const arr = [];
            if (a !== undefined) {
                let count = a.count;
                for (let i = 0; i < count; i++) {
                    arr.push(a.objectAtIndex(i));
                }
            }
            return arr;
        }
        collections.nsArrayToJSArray = nsArrayToJSArray;
    })(collections = iOSNativeHelper.collections || (iOSNativeHelper.collections = {}));
    function isLandscape() {
        console.log('utils.ios.isLandscape() is deprecated; use application.orientation instead');
        const deviceOrientation = UIDevice.currentDevice.orientation;
        const statusBarOrientation = UIApplication.sharedApplication.statusBarOrientation;
        const isDeviceOrientationLandscape = isOrientationLandscape(deviceOrientation);
        const isStatusBarOrientationLandscape = isOrientationLandscape(statusBarOrientation);
        return isDeviceOrientationLandscape || isStatusBarOrientationLandscape;
    }
    iOSNativeHelper.isLandscape = isLandscape;
    iOSNativeHelper.MajorVersion = NSString.stringWithString(UIDevice.currentDevice.systemVersion).intValue;
    function openFile(filePath) {
        console.log('utils.ios.openFile() is deprecated; use utils.openFile() instead');
        return openFileAtRootModule(filePath);
    }
    iOSNativeHelper.openFile = openFile;
    function getCurrentAppPath() {
        const currentDir = __dirname;
        const tnsModulesIndex = currentDir.indexOf('/tns_modules');
        // Module not hosted in ~/tns_modules when bundled. Use current dir.
        let appPath = currentDir;
        if (tnsModulesIndex !== -1) {
            // Strip part after tns_modules to obtain app root
            appPath = currentDir.substring(0, tnsModulesIndex);
        }
        return appPath;
    }
    iOSNativeHelper.getCurrentAppPath = getCurrentAppPath;
    function joinPaths(...paths) {
        if (!paths || paths.length === 0) {
            return '';
        }
        return NSString.stringWithString(NSString.pathWithComponents(paths)).stringByStandardizingPath;
    }
    iOSNativeHelper.joinPaths = joinPaths;
    function getVisibleViewController(rootViewController) {
        if (rootViewController.presentedViewController) {
            return getVisibleViewController(rootViewController.presentedViewController);
        }
        if (rootViewController.isKindOfClass(UINavigationController.class())) {
            return getVisibleViewController(rootViewController.visibleViewController);
        }
        if (rootViewController.isKindOfClass(UITabBarController.class())) {
            return getVisibleViewController(rootViewController);
        }
        return rootViewController;
    }
    iOSNativeHelper.getVisibleViewController = getVisibleViewController;
    function applyRotateTransform(transform, x, y, z) {
        if (x) {
            transform = CATransform3DRotate(transform, x * radToDeg, 1, 0, 0);
        }
        if (y) {
            transform = CATransform3DRotate(transform, y * radToDeg, 0, 1, 0);
        }
        if (z) {
            transform = CATransform3DRotate(transform, z * radToDeg, 0, 0, 1);
        }
        return transform;
    }
    iOSNativeHelper.applyRotateTransform = applyRotateTransform;
    function createUIDocumentInteractionControllerDelegate() {
        var UIDocumentInteractionControllerDelegateImpl = /** @class */ (function (_super) {
    __extends(UIDocumentInteractionControllerDelegateImpl, _super);
    function UIDocumentInteractionControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIDocumentInteractionControllerDelegateImpl.prototype.getViewController = function () {
        var app = UIApplication.sharedApplication;
        return app.keyWindow.rootViewController;
    };
    UIDocumentInteractionControllerDelegateImpl.prototype.documentInteractionControllerViewControllerForPreview = function (controller) {
        return this.getViewController();
    };
    UIDocumentInteractionControllerDelegateImpl.prototype.documentInteractionControllerViewForPreview = function (controller) {
        return this.getViewController().view;
    };
    UIDocumentInteractionControllerDelegateImpl.prototype.documentInteractionControllerRectForPreview = function (controller) {
        return this.getViewController().view.frame;
    };
    UIDocumentInteractionControllerDelegateImpl.ObjCProtocols = [UIDocumentInteractionControllerDelegate];
    return UIDocumentInteractionControllerDelegateImpl;
}(NSObject));
        return new UIDocumentInteractionControllerDelegateImpl();
    }
    iOSNativeHelper.createUIDocumentInteractionControllerDelegate = createUIDocumentInteractionControllerDelegate;
    function isRealDevice() {
        try {
            // https://stackoverflow.com/a/5093092/4936697
            const sourceType = UIImagePickerControllerSourceType.UIImagePickerControllerSourceTypeCamera;
            const mediaTypes = UIImagePickerController.availableMediaTypesForSourceType(sourceType);
            return mediaTypes;
        }
        catch (e) {
            return true;
        }
    }
    iOSNativeHelper.isRealDevice = isRealDevice;
})(iOSNativeHelper || (iOSNativeHelper = {}));
//# sourceMappingURL=native-helper.ios.js.map