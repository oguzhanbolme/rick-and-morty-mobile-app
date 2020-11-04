import { LinearGradient } from './linear-gradient';
import { isDataURI, isFileOrResourcePath, layout, RESOURCE_PREFIX, FILE_PREFIX } from '../../utils';
import { parse } from '../../css-value';
import { path, knownFolders } from '../../file-system';
import * as application from '../../application';
export * from './background-common';
// TODO: Change this implementation to use
// We are using "ad" here to avoid namespace collision with the global android object
export var ad;
(function (ad) {
    let SDK;
    function getSDK() {
        if (!SDK) {
            SDK = android.os.Build.VERSION.SDK_INT;
        }
        return SDK;
    }
    function isSetColorFilterOnlyWidget(nativeView) {
        return (nativeView instanceof android.widget.Button || (nativeView instanceof androidx.appcompat.widget.Toolbar && getSDK() >= 21) // There is an issue with the DrawableContainer which was fixed for API version 21 and above: https://code.google.com/p/android/issues/detail?id=60183
        );
    }
    function onBackgroundOrBorderPropertyChanged(view) {
        const nativeView = view.nativeViewProtected;
        if (!nativeView) {
            return;
        }
        const background = view.style.backgroundInternal;
        let drawable = nativeView.getBackground();
        const androidView = view;
        // use undefined as not set. getBackground will never return undefined only Drawable or null;
        if (androidView._cachedDrawable === undefined && drawable) {
            const constantState = drawable.getConstantState();
            androidView._cachedDrawable = constantState || drawable;
        }
        if (isSetColorFilterOnlyWidget(nativeView) && drawable && !background.hasBorderWidth() && !background.hasBorderRadius() && !background.clipPath && !background.image && background.color) {
            if (drawable instanceof org.nativescript.widgets.BorderDrawable && androidView._cachedDrawable) {
                if (!(androidView._cachedDrawable instanceof android.graphics.drawable.Drawable.ConstantState)) {
                    return;
                }
                drawable = androidView._cachedDrawable.newDrawable(nativeView.getResources());
                nativeView.setBackground(drawable);
            }
            const backgroundColor = (drawable.backgroundColor = background.color.android);
            drawable.mutate();
            drawable.setColorFilter(backgroundColor, android.graphics.PorterDuff.Mode.SRC_IN);
            drawable.invalidateSelf(); // Make sure the drawable is invalidated. Android forgets to invalidate it in some cases: toolbar
            drawable.backgroundColor = backgroundColor;
        }
        else if (!background.isEmpty()) {
            let backgroundDrawable = drawable;
            if (!(drawable instanceof org.nativescript.widgets.BorderDrawable)) {
                backgroundDrawable = new org.nativescript.widgets.BorderDrawable(layout.getDisplayDensity(), view.toString());
                refreshBorderDrawable(view, backgroundDrawable);
                nativeView.setBackground(backgroundDrawable);
            }
            else {
                refreshBorderDrawable(view, backgroundDrawable);
            }
        }
        else {
            const cachedDrawable = androidView._cachedDrawable;
            let defaultDrawable = null;
            if (cachedDrawable) {
                if (cachedDrawable instanceof android.graphics.drawable.Drawable.ConstantState) {
                    defaultDrawable = cachedDrawable.newDrawable(nativeView.getResources());
                }
                else if (cachedDrawable instanceof android.graphics.drawable.Drawable) {
                    defaultDrawable = cachedDrawable;
                }
            }
            nativeView.setBackground(defaultDrawable);
        }
        // TODO: Can we move BorderWidths as separate native setter?
        // This way we could skip setPadding if borderWidth is not changed.
        const leftPadding = Math.ceil(view.effectiveBorderLeftWidth + view.effectivePaddingLeft);
        const topPadding = Math.ceil(view.effectiveBorderTopWidth + view.effectivePaddingTop);
        const rightPadding = Math.ceil(view.effectiveBorderRightWidth + view.effectivePaddingRight);
        const bottomPadding = Math.ceil(view.effectiveBorderBottomWidth + view.effectivePaddingBottom);
        nativeView.setPadding(leftPadding, topPadding, rightPadding, bottomPadding);
    }
    ad.onBackgroundOrBorderPropertyChanged = onBackgroundOrBorderPropertyChanged;
})(ad || (ad = {}));
function fromBase64(source) {
    const bytes = android.util.Base64.decode(source, android.util.Base64.DEFAULT);
    return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
}
function fromGradient(gradient) {
    const colors = Array.create('int', gradient.colorStops.length);
    const stops = Array.create('float', gradient.colorStops.length);
    let hasStops = false;
    gradient.colorStops.forEach((stop, index) => {
        colors[index] = stop.color.android;
        if (stop.offset) {
            stops[index] = stop.offset.value;
            hasStops = true;
        }
    });
    const alpha = gradient.angle / (Math.PI * 2);
    const startX = Math.pow(Math.sin(Math.PI * (alpha + 0.75)), 2);
    const startY = Math.pow(Math.sin(Math.PI * (alpha + 0.5)), 2);
    const endX = Math.pow(Math.sin(Math.PI * (alpha + 0.25)), 2);
    const endY = Math.pow(Math.sin(Math.PI * alpha), 2);
    return new org.nativescript.widgets.LinearGradientDefinition(startX, startY, endX, endY, colors, hasStops ? stops : null);
}
const pattern = /url\(('|")(.*?)\1\)/;
function refreshBorderDrawable(view, borderDrawable) {
    const nativeView = view.nativeViewProtected;
    const context = nativeView.getContext();
    const background = view.style.backgroundInternal;
    if (background) {
        const backgroundPositionParsedCSSValues = createNativeCSSValueArray(background.position);
        const backgroundSizeParsedCSSValues = createNativeCSSValueArray(background.size);
        const blackColor = -16777216; //android.graphics.Color.BLACK;
        let imageUri;
        if (background.image && typeof background.image === 'string') {
            imageUri = background.image;
            const match = imageUri.match(pattern);
            if (match && match[2]) {
                imageUri = match[2];
            }
        }
        let bitmap = null;
        if (isDataURI(imageUri)) {
            const base64Data = imageUri.split(',')[1];
            if (base64Data !== undefined) {
                bitmap = fromBase64(base64Data);
                imageUri = null;
            }
        }
        else if (isFileOrResourcePath(imageUri)) {
            if (imageUri.indexOf(RESOURCE_PREFIX) !== 0) {
                let fileName = imageUri;
                if (fileName.indexOf('~/') === 0) {
                    fileName = path.join(knownFolders.currentApp().path, fileName.replace('~/', ''));
                }
                imageUri = FILE_PREFIX + fileName;
            }
        }
        let gradient = null;
        if (background.image && background.image instanceof LinearGradient) {
            gradient = fromGradient(background.image);
        }
        borderDrawable.refresh(background.borderTopColor ? background.borderTopColor.android : blackColor, background.borderRightColor ? background.borderRightColor.android : blackColor, background.borderBottomColor ? background.borderBottomColor.android : blackColor, background.borderLeftColor ? background.borderLeftColor.android : blackColor, background.borderTopWidth, background.borderRightWidth, background.borderBottomWidth, background.borderLeftWidth, background.borderTopLeftRadius, background.borderTopRightRadius, background.borderBottomRightRadius, background.borderBottomLeftRadius, background.clipPath, background.color ? background.color.android : 0, imageUri, bitmap, gradient, context, background.repeat, background.position, backgroundPositionParsedCSSValues, background.size, backgroundSizeParsedCSSValues);
        //console.log(`>>> ${borderDrawable.toDebugString()}`);
    }
}
function createNativeCSSValueArray(css) {
    if (!css) {
        return null;
    }
    const cssValues = parse(css);
    const nativeArray = Array.create(org.nativescript.widgets.CSSValue, cssValues.length);
    for (let i = 0, length = cssValues.length; i < length; i++) {
        nativeArray[i] = new org.nativescript.widgets.CSSValue(cssValues[i].type, cssValues[i].string, cssValues[i].unit, cssValues[i].value);
    }
    return nativeArray;
}
export var CacheMode;
(function (CacheMode) {
    CacheMode[CacheMode["none"] = 0] = "none";
    CacheMode[CacheMode["memory"] = 1] = "memory";
    CacheMode[CacheMode["diskAndMemory"] = 2] = "diskAndMemory";
})(CacheMode || (CacheMode = {}));
let currentCacheMode;
let imageFetcher;
export function initImageCache(context, mode = CacheMode.diskAndMemory, memoryCacheSize = 0.25, diskCacheSize = 10 * 1024 * 1024) {
    if (currentCacheMode === mode) {
        return;
    }
    currentCacheMode = mode;
    if (!imageFetcher) {
        imageFetcher = org.nativescript.widgets.image.Fetcher.getInstance(context);
    }
    else {
        imageFetcher.clearCache();
    }
    const params = new org.nativescript.widgets.image.Cache.CacheParams();
    params.memoryCacheEnabled = mode !== CacheMode.none;
    params.setMemCacheSizePercent(memoryCacheSize); // Set memory cache to % of app memory
    params.diskCacheEnabled = mode === CacheMode.diskAndMemory;
    params.diskCacheSize = diskCacheSize;
    const imageCache = org.nativescript.widgets.image.Cache.getInstance(params);
    imageFetcher.addImageCache(imageCache);
    imageFetcher.initCache();
}
function onLivesync(args) {
    if (imageFetcher) {
        imageFetcher.clearCache();
    }
}
global.NativeScriptGlobals.events.on('livesync', onLivesync);
global.NativeScriptGlobals.addEventWiring(() => {
    application.android.on('activityStarted', (args) => {
        if (!imageFetcher) {
            initImageCache(args.activity);
        }
        else {
            imageFetcher.initCache();
        }
    });
});
global.NativeScriptGlobals.addEventWiring(() => {
    application.android.on('activityStopped', (args) => {
        if (imageFetcher) {
            imageFetcher.closeCache();
        }
    });
});
//# sourceMappingURL=background.android.js.map