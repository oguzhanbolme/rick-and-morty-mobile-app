export var KeyboardType;
(function (KeyboardType) {
    KeyboardType.datetime = 'datetime';
    KeyboardType.phone = 'phone';
    KeyboardType.number = 'number';
    KeyboardType.url = 'url';
    KeyboardType.email = 'email';
    KeyboardType.integer = 'integer';
})(KeyboardType || (KeyboardType = {}));
export var ReturnKeyType;
(function (ReturnKeyType) {
    ReturnKeyType.done = 'done';
    ReturnKeyType.next = 'next';
    ReturnKeyType.go = 'go';
    ReturnKeyType.search = 'search';
    ReturnKeyType.send = 'send';
})(ReturnKeyType || (ReturnKeyType = {}));
export class TextAlignment {
}
TextAlignment.left = 'left';
TextAlignment.center = 'center';
TextAlignment.right = 'right';
export var TextDecoration;
(function (TextDecoration) {
    TextDecoration.none = 'none';
    TextDecoration.underline = 'underline';
    TextDecoration.lineThrough = 'line-through';
})(TextDecoration || (TextDecoration = {}));
export var TextTransform;
(function (TextTransform) {
    TextTransform.none = 'none';
    TextTransform.capitalize = 'capitalize';
    TextTransform.uppercase = 'uppercase';
    TextTransform.lowercase = 'lowercase';
})(TextTransform || (TextTransform = {}));
export var WhiteSpace;
(function (WhiteSpace) {
    WhiteSpace.normal = 'normal';
    WhiteSpace.nowrap = 'nowrap';
})(WhiteSpace || (WhiteSpace = {}));
export var Orientation;
(function (Orientation) {
    Orientation.horizontal = 'horizontal';
    Orientation.vertical = 'vertical';
})(Orientation || (Orientation = {}));
export var DeviceOrientation;
(function (DeviceOrientation) {
    DeviceOrientation.portrait = 'portrait';
    DeviceOrientation.landscape = 'landscape';
    DeviceOrientation.unknown = 'unknown';
})(DeviceOrientation || (DeviceOrientation = {}));
export var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment.left = 'left';
    HorizontalAlignment.center = 'center';
    HorizontalAlignment.right = 'right';
    HorizontalAlignment.stretch = 'stretch';
})(HorizontalAlignment || (HorizontalAlignment = {}));
export var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment.top = 'top';
    VerticalAlignment.middle = 'middle';
    VerticalAlignment.bottom = 'bottom';
    VerticalAlignment.stretch = 'stretch';
})(VerticalAlignment || (VerticalAlignment = {}));
export var Stretch;
(function (Stretch) {
    Stretch.none = 'none';
    Stretch.aspectFill = 'aspectFill';
    Stretch.aspectFit = 'aspectFit';
    Stretch.fill = 'fill';
})(Stretch || (Stretch = {}));
export var Visibility;
(function (Visibility) {
    Visibility.visible = 'visible';
    Visibility.collapse = 'collapse';
    Visibility.collapsed = 'collapsed';
    Visibility.hidden = 'hidden';
})(Visibility || (Visibility = {}));
export var FontAttributes;
(function (FontAttributes) {
    FontAttributes.Normal = 0;
    FontAttributes.Bold = 1;
    FontAttributes.Italic = 1 << 1;
})(FontAttributes || (FontAttributes = {}));
export var DeviceType;
(function (DeviceType) {
    DeviceType.Phone = 'Phone';
    DeviceType.Tablet = 'Tablet';
})(DeviceType || (DeviceType = {}));
export var UpdateTextTrigger;
(function (UpdateTextTrigger) {
    UpdateTextTrigger.focusLost = 'focusLost';
    UpdateTextTrigger.textChanged = 'textChanged';
})(UpdateTextTrigger || (UpdateTextTrigger = {}));
export var Accuracy;
(function (Accuracy) {
    Accuracy.any = 300;
    Accuracy.high = 3;
})(Accuracy || (Accuracy = {}));
export var Dock;
(function (Dock) {
    Dock.left = 'left';
    Dock.top = 'top';
    Dock.right = 'right';
    Dock.bottom = 'bottom';
})(Dock || (Dock = {}));
export var AutocapitalizationType;
(function (AutocapitalizationType) {
    AutocapitalizationType.none = 'none';
    AutocapitalizationType.words = 'words';
    AutocapitalizationType.sentences = 'sentences';
    AutocapitalizationType.allCharacters = 'allcharacters';
})(AutocapitalizationType || (AutocapitalizationType = {}));
export var NavigationBarVisibility;
(function (NavigationBarVisibility) {
    NavigationBarVisibility.auto = 'auto';
    NavigationBarVisibility.never = 'never';
    NavigationBarVisibility.always = 'always';
})(NavigationBarVisibility || (NavigationBarVisibility = {}));
export var AndroidActionBarIconVisibility;
(function (AndroidActionBarIconVisibility) {
    AndroidActionBarIconVisibility.auto = 'auto';
    AndroidActionBarIconVisibility.never = 'never';
    AndroidActionBarIconVisibility.always = 'always';
})(AndroidActionBarIconVisibility || (AndroidActionBarIconVisibility = {}));
export var AndroidActionItemPosition;
(function (AndroidActionItemPosition) {
    AndroidActionItemPosition.actionBar = 'actionBar';
    AndroidActionItemPosition.actionBarIfRoom = 'actionBarIfRoom';
    AndroidActionItemPosition.popup = 'popup';
})(AndroidActionItemPosition || (AndroidActionItemPosition = {}));
export var IOSActionItemPosition;
(function (IOSActionItemPosition) {
    IOSActionItemPosition.left = 'left';
    IOSActionItemPosition.right = 'right';
})(IOSActionItemPosition || (IOSActionItemPosition = {}));
export var ImageFormat;
(function (ImageFormat) {
    ImageFormat.png = 'png';
    ImageFormat.jpeg = 'jpeg';
    ImageFormat.jpg = 'jpg';
})(ImageFormat || (ImageFormat = {}));
export var FontStyle;
(function (FontStyle) {
    FontStyle.normal = 'normal';
    FontStyle.italic = 'italic';
})(FontStyle || (FontStyle = {}));
export var FontWeight;
(function (FontWeight) {
    FontWeight.thin = '100';
    FontWeight.extraLight = '200';
    FontWeight.light = '300';
    FontWeight.normal = 'normal'; // 400
    FontWeight.medium = '500';
    FontWeight.semiBold = '600';
    FontWeight.bold = 'bold'; // 700
    FontWeight.extraBold = '800';
    FontWeight.black = '900';
})(FontWeight || (FontWeight = {}));
export var BackgroundRepeat;
(function (BackgroundRepeat) {
    BackgroundRepeat.repeat = 'repeat';
    BackgroundRepeat.repeatX = 'repeat-x';
    BackgroundRepeat.repeatY = 'repeat-y';
    BackgroundRepeat.noRepeat = 'no-repeat';
})(BackgroundRepeat || (BackgroundRepeat = {}));
let animation;
export var AnimationCurve;
(function (AnimationCurve) {
    AnimationCurve.ease = 'ease';
    AnimationCurve.easeIn = 'easeIn';
    AnimationCurve.easeOut = 'easeOut';
    AnimationCurve.easeInOut = 'easeInOut';
    AnimationCurve.linear = 'linear';
    AnimationCurve.spring = 'spring';
    function cubicBezier(x1, y1, x2, y2) {
        animation = animation || require('../animation');
        return new animation.CubicBezierAnimationCurve(x1, y1, x2, y2);
    }
    AnimationCurve.cubicBezier = cubicBezier;
})(AnimationCurve || (AnimationCurve = {}));
export var StatusBarStyle;
(function (StatusBarStyle) {
    StatusBarStyle.light = 'light';
    StatusBarStyle.dark = 'dark';
})(StatusBarStyle || (StatusBarStyle = {}));
export var SystemAppearance;
(function (SystemAppearance) {
    SystemAppearance.light = 'light';
    SystemAppearance.dark = 'dark';
})(SystemAppearance || (SystemAppearance = {}));
export const Enums = {
    Accuracy,
    AndroidActionBarIconVisibility,
    AndroidActionItemPosition,
    AnimationCurve,
    AutocapitalizationType,
    BackgroundRepeat,
    DeviceOrientation,
    DeviceType,
    Dock,
    FontAttributes,
    FontStyle,
    FontWeight,
    HorizontalAlignment,
    IOSActionItemPosition,
    ImageFormat,
    KeyboardType,
    NavigationBarVisibility,
    Orientation,
    ReturnKeyType,
    StatusBarStyle,
    Stretch,
    SystemAppearance,
    TextAlignment,
    TextDecoration,
    TextTransform,
    UpdateTextTrigger,
    VerticalAlignment,
    Visibility,
    WhiteSpace,
};
//# sourceMappingURL=index.js.map