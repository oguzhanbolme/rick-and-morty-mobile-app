import { DatePickerBase } from './date-picker-common';
export * from './date-picker-common';
export declare class DatePicker extends DatePickerBase {
    nativeViewProtected: android.widget.DatePicker;
    createNativeView(): globalAndroid.widget.DatePicker;
    initNativeView(): void;
    disposeNativeView(): void;
    private updateNativeDate;
}
