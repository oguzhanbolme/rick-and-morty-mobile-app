import { SliderBase, valueProperty, minValueProperty, maxValueProperty } from './slider-common';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty } from '../styling/style-properties';
import { Color } from '../../color';
export * from './slider-common';
var SliderChangeHandlerImpl = /** @class */ (function (_super) {
    __extends(SliderChangeHandlerImpl, _super);
    function SliderChangeHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SliderChangeHandlerImpl.initWithOwner = function (owner) {
        var handler = SliderChangeHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    SliderChangeHandlerImpl.prototype.sliderValueChanged = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            valueProperty.nativeValueChange(owner, sender.value);
        }
    };
    SliderChangeHandlerImpl.ObjCExposedMethods = {
        sliderValueChanged: { returns: interop.types.void, params: [UISlider] },
    };
    return SliderChangeHandlerImpl;
}(NSObject));
export class Slider extends SliderBase {
    createNativeView() {
        return UISlider.new();
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        // default values
        nativeView.minimumValue = 0;
        nativeView.maximumValue = this.maxValue;
        this._changeHandler = SliderChangeHandlerImpl.initWithOwner(new WeakRef(this));
        nativeView.addTargetActionForControlEvents(this._changeHandler, 'sliderValueChanged', 4096 /* ValueChanged */);
    }
    disposeNativeView() {
        this._changeHandler = null;
        super.disposeNativeView();
    }
    // @ts-ignore
    get ios() {
        return this.nativeViewProtected;
    }
    [valueProperty.getDefault]() {
        return 0;
    }
    [valueProperty.setNative](value) {
        this.ios.value = value;
    }
    [minValueProperty.getDefault]() {
        return 0;
    }
    [minValueProperty.setNative](value) {
        this.ios.minimumValue = value;
    }
    [maxValueProperty.getDefault]() {
        return 100;
    }
    [maxValueProperty.setNative](value) {
        this.ios.maximumValue = value;
    }
    [colorProperty.getDefault]() {
        return this.ios.thumbTintColor;
    }
    [colorProperty.setNative](value) {
        let color = value instanceof Color ? value.ios : value;
        this.ios.thumbTintColor = color;
    }
    [backgroundColorProperty.getDefault]() {
        return this.ios.minimumTrackTintColor;
    }
    [backgroundColorProperty.setNative](value) {
        let color = value instanceof Color ? value.ios : value;
        this.ios.minimumTrackTintColor = color;
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        //
    }
}
//# sourceMappingURL=index.ios.js.map