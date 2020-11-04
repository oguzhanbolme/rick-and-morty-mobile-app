import { DatePickerBase, yearProperty, monthProperty, dayProperty, dateProperty, maxDateProperty, minDateProperty } from './date-picker-common';
export * from './date-picker-common';
let DateChangedListener;
function initializeDateChangedListener() {
    if (DateChangedListener) {
        return;
    }
    var DateChangedListenerImpl = /** @class */ (function (_super) {
    __extends(DateChangedListenerImpl, _super);
    function DateChangedListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    DateChangedListenerImpl.prototype.onDateChanged = function (picker, year, month, day) {
        var owner = this.owner;
        var dateChanged = false;
        if (year !== owner.year) {
            yearProperty.nativeValueChange(owner, year);
            dateChanged = true;
        }
        if (month !== owner.month - 1) {
            monthProperty.nativeValueChange(owner, month + 1);
            dateChanged = true;
        }
        if (day !== owner.day) {
            dayProperty.nativeValueChange(owner, day);
            dateChanged = true;
        }
        if (dateChanged) {
            dateProperty.nativeValueChange(owner, new Date(year, month, day));
        }
    };
    DateChangedListenerImpl = __decorate([
        Interfaces([android.widget.DatePicker.OnDateChangedListener])
    ], DateChangedListenerImpl);
    return DateChangedListenerImpl;
}(java.lang.Object));
    DateChangedListener = DateChangedListenerImpl;
}
export class DatePicker extends DatePickerBase {
    createNativeView() {
        const picker = new android.widget.DatePicker(this._context);
        picker.setCalendarViewShown(false);
        return picker;
    }
    initNativeView() {
        super.initNativeView();
        initializeDateChangedListener();
        const nativeView = this.nativeViewProtected;
        const listener = new DateChangedListener(this);
        nativeView.init(this.year, this.month - 1, this.day, listener);
        nativeView.listener = listener;
    }
    disposeNativeView() {
        this.nativeViewProtected.listener.owner = null;
        super.disposeNativeView();
    }
    updateNativeDate() {
        const nativeView = this.nativeViewProtected;
        const year = typeof this.year === 'number' ? this.year : nativeView.getYear();
        const month = typeof this.month === 'number' ? this.month - 1 : nativeView.getMonth();
        const day = typeof this.day === 'number' ? this.day : nativeView.getDayOfMonth();
        this.date = new Date(year, month, day);
    }
    [yearProperty.setNative](value) {
        if (this.nativeViewProtected.getYear() !== value) {
            this.updateNativeDate();
        }
    }
    [monthProperty.setNative](value) {
        if (this.nativeViewProtected.getMonth() !== value - 1) {
            this.updateNativeDate();
        }
    }
    [dayProperty.setNative](value) {
        if (this.nativeViewProtected.getDayOfMonth() !== value) {
            this.updateNativeDate();
        }
    }
    [dateProperty.setNative](value) {
        const nativeView = this.nativeViewProtected;
        if (nativeView.getDayOfMonth() !== value.getDate() || nativeView.getMonth() !== value.getMonth() || nativeView.getYear() !== value.getFullYear()) {
            nativeView.updateDate(value.getFullYear(), value.getMonth(), value.getDate());
        }
    }
    [maxDateProperty.getDefault]() {
        return this.nativeViewProtected.getMaxDate();
    }
    [maxDateProperty.setNative](value) {
        const newValue = value instanceof Date ? value.getTime() : value;
        this.nativeViewProtected.setMaxDate(newValue);
    }
    [minDateProperty.getDefault]() {
        return this.nativeViewProtected.getMinDate();
    }
    [minDateProperty.setNative](value) {
        const newValue = value instanceof Date ? value.getTime() : value;
        this.nativeViewProtected.setMinDate(newValue);
    }
}
//# sourceMappingURL=index.android.js.map