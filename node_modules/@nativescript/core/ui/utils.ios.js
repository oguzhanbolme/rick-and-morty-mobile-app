import * as utils from '../utils';
export var ios;
(function (ios) {
    function getActualHeight(view) {
        if (view.window && !view.hidden) {
            return utils.layout.toDevicePixels(view.frame.size.height);
        }
        return 0;
    }
    ios.getActualHeight = getActualHeight;
    function getStatusBarHeight(viewController) {
        const app = UIApplication.sharedApplication;
        if (!app || app.statusBarHidden) {
            return 0;
        }
        if (viewController && viewController.prefersStatusBarHidden) {
            return 0;
        }
        const statusFrame = app.statusBarFrame;
        const min = Math.min(statusFrame.size.width, statusFrame.size.height);
        return utils.layout.toDevicePixels(min);
    }
    ios.getStatusBarHeight = getStatusBarHeight;
})(ios || (ios = {}));
//# sourceMappingURL=utils.ios.js.map