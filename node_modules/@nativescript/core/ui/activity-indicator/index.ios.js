import { ActivityIndicatorBase, busyProperty } from './activity-indicator-common';
import { colorProperty } from '../styling/style-properties';
import { Color } from '../../color';
import { iOSNativeHelper } from '../../utils';
export * from './activity-indicator-common';
const majorVersion = iOSNativeHelper.MajorVersion;
export class ActivityIndicator extends ActivityIndicatorBase {
    constructor() {
        super(...arguments);
        this._activityIndicatorViewStyle = majorVersion <= 12 || !100 /* Medium */ ? 2 /* Gray */ : 100 /* Medium */;
    }
    createNativeView() {
        const viewStyle = this._activityIndicatorViewStyle;
        const view = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(viewStyle);
        view.hidesWhenStopped = true;
        return view;
    }
    // @ts-ignore
    get ios() {
        return this.nativeViewProtected;
    }
    [busyProperty.getDefault]() {
        if (this.nativeViewProtected.isAnimating) {
            return this.nativeViewProtected.isAnimating();
        }
        else {
            return this.nativeViewProtected.animating;
        }
    }
    [busyProperty.setNative](value) {
        let nativeView = this.nativeViewProtected;
        if (value) {
            nativeView.startAnimating();
        }
        else {
            nativeView.stopAnimating();
        }
        if (nativeView.hidesWhenStopped) {
            this.requestLayout();
        }
    }
    [colorProperty.getDefault]() {
        return this.nativeViewProtected.color;
    }
    [colorProperty.setNative](value) {
        this.nativeViewProtected.color = value instanceof Color ? value.ios : value;
    }
}
//# sourceMappingURL=index.ios.js.map