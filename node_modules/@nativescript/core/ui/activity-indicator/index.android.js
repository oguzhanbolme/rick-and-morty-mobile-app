import { ActivityIndicatorBase, busyProperty } from './activity-indicator-common';
import { colorProperty, visibilityProperty, Visibility } from '../styling/style-properties';
import { Color } from '../../color';
export * from './activity-indicator-common';
export class ActivityIndicator extends ActivityIndicatorBase {
    createNativeView() {
        const progressBar = new android.widget.ProgressBar(this._context);
        progressBar.setVisibility(android.view.View.INVISIBLE);
        progressBar.setIndeterminate(true);
        return progressBar;
    }
    [busyProperty.getDefault]() {
        return false;
    }
    [busyProperty.setNative](value) {
        if (this.visibility === Visibility.VISIBLE) {
            this.nativeViewProtected.setVisibility(value ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    }
    [visibilityProperty.getDefault]() {
        return Visibility.HIDDEN;
    }
    [visibilityProperty.setNative](value) {
        switch (value) {
            case Visibility.VISIBLE:
                this.nativeViewProtected.setVisibility(this.busy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
                break;
            case Visibility.HIDDEN:
                this.nativeViewProtected.setVisibility(android.view.View.INVISIBLE);
                break;
            case Visibility.COLLAPSE:
                this.nativeViewProtected.setVisibility(android.view.View.GONE);
                break;
            default:
                throw new Error(`Invalid visibility value: ${value}. Valid values are: "${Visibility.VISIBLE}", "${Visibility.HIDDEN}", "${Visibility.COLLAPSE}".`);
        }
    }
    [colorProperty.getDefault]() {
        return -1;
    }
    [colorProperty.setNative](value) {
        if (value instanceof Color) {
            this.nativeViewProtected.getIndeterminateDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeViewProtected.getIndeterminateDrawable().clearColorFilter();
        }
    }
}
//# sourceMappingURL=index.android.js.map