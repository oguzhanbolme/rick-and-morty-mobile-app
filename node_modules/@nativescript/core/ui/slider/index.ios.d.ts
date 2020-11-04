import { SliderBase } from './slider-common';
export * from './slider-common';
export declare class Slider extends SliderBase {
    nativeViewProtected: UISlider;
    private _changeHandler;
    createNativeView(): UISlider;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UISlider;
}
